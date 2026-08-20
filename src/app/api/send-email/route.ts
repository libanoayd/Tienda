import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
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

    // Configurar Nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // La contraseña de aplicación de 16 caracteres
      },
    });

    // Enviar el correo
    const mailOptions = {
      from: `"Líbano Aromas y Decoración" <${process.env.GMAIL_USER}>`,
      to: order.user_email,
      bcc: process.env.GMAIL_USER, // Copia oculta para el dueño de la tienda
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
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Fallo al enviar correo" }, { status: 500 });
  }
}
