import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Contraseña de administrador
    if (password === "32840802") {
      // Configuramos una cookie segura que expira en 1 día
      const cookieStore = await cookies();
      cookieStore.set({
        name: "libano_admin_token",
        value: "authenticated_token_secure_xyz",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 día
        sameSite: "strict",
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
