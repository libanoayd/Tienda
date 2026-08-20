import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Solo aplicamos a las rutas que empiezan con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Permitir el acceso a la página de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Comprobar si existe la cookie de sesión
    const token = request.cookies.get('libano_admin_token');

    if (!token) {
      // Redirigir al login si no hay token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
