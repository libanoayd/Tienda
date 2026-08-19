import Link from "next/link";
import { LayoutDashboard, Package, Tag, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-stone-100">
      {/* Sidebar de Administración */}
      <aside className="w-64 bg-[var(--color-brand-dark)] text-white flex flex-col">
        <div className="p-6 border-b border-stone-700">
          <h2 className="text-2xl font-serif tracking-widest">LÍBANO</h2>
          <p className="text-stone-400 text-sm mt-1">Panel de Control</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center px-4 py-3 bg-[var(--color-brand-green)] rounded-md transition-colors">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/productos" className="flex items-center px-4 py-3 text-stone-300 hover:bg-stone-800 hover:text-white rounded-md transition-colors">
            <Package className="mr-3 h-5 w-5" />
            Productos
          </Link>
          <Link href="/admin/cupones" className="flex items-center px-4 py-3 text-stone-300 hover:bg-stone-800 hover:text-white rounded-md transition-colors">
            <Tag className="mr-3 h-5 w-5" />
            Cupones
          </Link>
          <Link href="/admin/configuracion" className="flex items-center px-4 py-3 text-stone-300 hover:bg-stone-800 hover:text-white rounded-md transition-colors">
            <Settings className="mr-3 h-5 w-5" />
            Configuración
          </Link>
        </nav>

        <div className="p-4 border-t border-stone-700">
          <button className="flex items-center w-full px-4 py-2 text-stone-400 hover:text-white transition-colors">
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
