import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Inicializamos Mercado Pago con el token de acceso (lo sacamos de .env.local)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "TEST-TOKEN" 
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // Mapeamos los items del carrito al formato que pide Mercado Pago
    const preferenceItems = items.map((item: any) => ({
      id: item.id.toString(),
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    }));

    // Creamos la preferencia de pago
    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: preferenceItems,
        back_urls: {
          success: "http://localhost:3000/pago-exitoso",
          failure: "http://localhost:3000/pago-fallido",
          pending: "http://localhost:3000/pago-pendiente",
        },
        auto_return: "approved",
      }
    });

    // Devolvemos el link de pago (init_point) al frontend
    return NextResponse.json({ init_point: response.init_point });
    
  } catch (error) {
    console.error("Error al crear preferencia de Mercado Pago:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
