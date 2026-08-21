import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabase } from "@/lib/supabase";

// Inicializamos Mercado Pago con el token de acceso (lo sacamos de .env.local)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "TEST-TOKEN" 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, discountAmount, userInfo, deliveryInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const token = process.env.MP_ACCESS_TOKEN;

    // Si no hay token real de Mercado Pago cargado aún
    if (!token || token.startsWith("TEST-0000")) {
      return NextResponse.json({ 
        error: "Por favor, agrega tu MP_ACCESS_TOKEN de Mercado Pago en .env.local y Vercel.",
        init_point: null 
      }, { status: 200 });
    }

    // 1. Guardar la orden en Supabase como pendiente
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_name: userInfo?.name || "Anónimo",
        user_email: userInfo?.email || "",
        user_phone: userInfo?.phone || "",
        total: total,
        status: "pending",
        delivery_method: deliveryInfo?.method || 'retiro',
        shipping_address: deliveryInfo?.address || null,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Error guardando orden:", orderError);
      return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 500 });
    }

    // 2. Guardar los items de la orden
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error guardando items:", itemsError);
    }

    // Mapeamos los items del carrito al formato que pide Mercado Pago
    const preferenceItems: any[] = items.map((item: any) => ({
      id: item.id.toString(),
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    }));

    if (deliveryInfo?.cost && deliveryInfo.cost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: `Envío a domicilio (${deliveryInfo.carrier} - ${deliveryInfo.service})`,
        quantity: 1,
        unit_price: deliveryInfo.cost,
        currency_id: "ARS",
      });
    }

    if (discountAmount && discountAmount > 0) {
      preferenceItems.push({
        id: "discount",
        title: "Descuento por Cupón",
        quantity: 1,
        unit_price: -discountAmount, // Descuento negativo
        currency_id: "ARS",
      });
    }

    let origin = request.headers.get("origin");
    if (!origin || origin === "null") {
      origin = "http://localhost:3000"; // fallback for local dev if origin header is missing
    }

    // Creamos la preferencia de pago
    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: preferenceItems,
        external_reference: orderData.id.toString(), // Enviamos el ID de orden a MP
        notification_url: `${origin}/api/webhooks/mercadopago`, // Webhook automático
        back_urls: {
          success: `${origin}/pago-exitoso`,
          failure: `${origin}/pago-fallido`,
          pending: `${origin}/pago-pendiente`,
        },
        auto_return: "approved",
      }
    });

    // Guardamos el payment_id temporalmente si MP lo provee en la pref (generalmente en webhook, pero guardamos ref)
    await supabase.from("orders").update({ payment_id: response.id }).eq("id", orderData.id);

    // Devolvemos el link de pago (init_point) al frontend
    return NextResponse.json({ init_point: response.init_point });
    
  } catch (error: any) {
    console.error("Error al crear preferencia de Mercado Pago:", error);
    
    // Si el error tiene un response de la API de Mercado Pago, lo enviamos
    const mpError = error.response ? error.response : error.message;
    
    return NextResponse.json({ 
      error: "Error interno del servidor", 
      details: mpError 
    }, { status: 500 });
  }
}
