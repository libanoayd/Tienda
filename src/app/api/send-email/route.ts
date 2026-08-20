import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
    }

    // Buscar los detalles de la orden en Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Configurar correo a enviar
    const emailData = await resend.emails.send({
      from: "Líbano Aromas <ventas@resend.dev>", // Usaremos resend.dev para pruebas hasta que verifiquen dominio
      to: order.user_email,
      subject: `¡Confirmación de tu pedido #${order.id} en Líbano!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #133C37;">
          <h1 style="color: #207473; border-bottom: 2px solid #E2B370; padding-bottom: 10px;">¡Gracias por tu compra, ${order.user_name}!</h1>
          <p>Tu pedido <strong>#${order.id}</strong> ha sido confirmado y procesado con éxito.</p>
          
          <h3 style="margin-top: 30px;">Detalles del pedido:</h3>
          <ul>
            ${order.order_items.map((item: any) => `
              <li><strong>${item.quantity}x</strong> ${item.product_name} - $${item.price}</li>
            `).join('')}
          </ul>
          <p style="font-size: 18px; font-weight: bold; margin-top: 20px;">Total: $${order.total}</p>

          <h3 style="margin-top: 30px;">Método de Entrega:</h3>
          <p>${order.delivery_method === 'envio' ? 'Envío a Domicilio: ' + order.shipping_address : 'Retiro en el local'}</p>

          <p style="margin-top: 40px; font-size: 12px; color: #666;">Si tienes alguna duda, responde a este correo o comunícate con nosotros por WhatsApp.</p>
          <p style="font-size: 12px; color: #666;">Líbano Aromas y Decoración</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, emailData });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Fallo al enviar correo" }, { status: 500 });
  }
}
