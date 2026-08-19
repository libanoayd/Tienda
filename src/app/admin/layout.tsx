"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Tag, Settings, LogOut, FolderPlus, ShoppingCart } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Si estamos en la pantalla de login, no verificamos autenticación
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    const auth = localStorage.getItem("libano_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("libano_admin_auth");
    router.push("/admin/login");
  };

  // Si estamos en la página de login, mostramos solo el contenido de login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Mientras verifica autenticación, mostramos pantalla limpia
  if (isAuthenticated === null || !isAuthenticated) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500">Verificando acceso...</div>;
  }

  return (
    <div className="flex h-screen bg-stone-100">
      {/* Sidebar de Administración */}
      <aside className="w-64 bg-[var(--color-brand-dark)] text-white flex flex-col">
        <div className="p-6 border-b border-stone-700">
          <h2 className="text-2xl font-serif tracking-widest">LÍBANO</h2>
          <p className="text-stone-400 text-sm mt-1">Panel de Control</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            href="/admin" 
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin' ? 'bg-[var(--color-brand-green)] text-white' : 'text-stone-300 hover:bg-stone-800'}`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/pedidos" 
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/pedidos' ? 'bg-[var(--color-brand-green)] text-white' : 'text-stone-300 hover:bg-stone-800'}`}
          >
            <ShoppingCart className="mr-3 h-5 w-5" />
            Pedidos
          </Link>
          <Link 
            href="/admin/productos" 
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/productos' ? 'bg-[var(--color-brand-green)] text-white' : 'text-stone-300 hover:bg-stone-800'}`}
          >
            <Package className="mr-3 h-5 w-5" />
            Productos
          </Link>
          <Link 
            href="/admin/categorias" 
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/categorias' ? 'bg-[var(--color-brand-green)] text-white' : 'text-stone-300 hover:bg-stone-800'}`}
          >
            <FolderPlus className="mr-3 h-5 w-5" />
            Secciones
          </Link>
          <Link 
            href="/admin/cupones" 
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/cupones' ? 'bg-[var(--color-brand-green)] text-white' : 'text-stone-300 hover:bg-stone-800'}`}
          >
            <Tag className="mr-3 h-5 w-5" />
            Cupones
          </Link>
          <Link 
            href="/admin/configuracion" 
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/configuracion' ? 'bg-[var(--color-brand-green)] text-white' : 'text-stone-300 hover:bg-stone-800'}`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Configuración
          </Link>
        </nav>

        <div className="p-4 border-t border-stone-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
