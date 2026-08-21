import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Mercado Pago envía 'action', 'data.id' y 'type' en los query params y el body
    const url = new URL(request.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    // Si no es un evento de pago, devolvemos 200 OK y lo ignoramos
    if (type !== "payment" || !id) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      console.error("No MP_ACCESS_TOKEN found for webhook processing.");
      return NextResponse.json({ error: "Missing config" }, { status: 500 });
    }

    // 1. Consultar a la API de Mercado Pago el estado real del pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!mpRes.ok) {
      console.error("Error fetching payment from MP:", await mpRes.text());
      return NextResponse.json({ error: "Error contacting MP" }, { status: 500 });
    }

    const paymentData = await mpRes.json();

    // 2. Extraer el external_reference (que es nuestro order_id de Supabase)
    const orderId = paymentData.external_reference;
    if (!orderId) {
      console.log("No external_reference found for payment:", id);
      return NextResponse.json({ success: true, ignored: true });
    }

    // 3. Verificar si el pago fue aprobado
    if (paymentData.status === "approved") {
      // 3a. Marcar la orden como pagada
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)
        .eq("status", "pending") // Solo actualizar si estaba pendiente (evita doble proceso)
        .select(`id, user_email, user_name, order_items(product_id, quantity)`)
        .single();

      if (orderError || !order) {
        console.log(`Order ${orderId} already paid or not found.`);
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      // 3b. Descontar el stock de los productos
      if (order.order_items && order.order_items.length > 0) {
        for (const item of order.order_items) {
          // Obtener el stock actual
          const { data: product } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await supabase
              .from("products")
              .update({ stock: newStock })
              .eq("id", item.product_id);
          }
        }
      }

      // 3c. Opcional: Enviar el email de confirmación automáticamente (si usamos la ruta existente)
      // Como estamos en un entorno Edge/Server, podemos hacerle fetch a nuestra propia API
      try {
        const origin = url.origin; // e.g. https://tienda-libano.vercel.app
        await fetch(`${origin}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
      } catch (emailErr) {
        console.error("Webhook: Failed to send email", emailErr);
        // No fallamos el webhook si falla el correo
      }

      console.log(`Order ${orderId} successfully marked as paid and stock updated.`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
