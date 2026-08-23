
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, DollarSign, Tag, FolderPlus, Edit2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LatestProduct {
  id: number;
  name: string;
  price: number;
  brand?: string;
}

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [couponsCount, setCouponsCount] = useState<number>(0);
  const [latestProducts, setLatestProducts] = useState<LatestProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<{id: number; name: string; stock: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);

      // 1. Conteo de Productos
      const { count: prodCount } = await supabase.from("products").select("*", { count: "exact", head: true });
      if (prodCount !== null) setProductsCount(prodCount);

      // 2. Conteo de Categorías
      const { count: catCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
      if (catCount !== null) setCategoriesCount(catCount);

      // 3. Conteo de Cupones Activos
      const { count: coupCount } = await supabase.from("coupons").select("*", { count: "exact", head: true });
      if (coupCount !== null) setCouponsCount(coupCount);

      // 4. Últimos productos agregados reales
      const { data: latest } = await supabase.from("products").select("id, name, price, brand").order("id", { ascending: false }).limit(4);
      if (latest) setLatestProducts(latest);

      // 5. Productos con stock bajo
      const { data: lowStock } = await supabase.from("products").select("id, name, stock").lte("stock", 3).eq("is_active", true).order("stock", { ascending: true });
      if (lowStock) setLowStockProducts(lowStock);

      setLoading(false);
    }

    loadMetrics();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-stone-900">Resumen en Tiempo Real de tu Tienda</h1>
        <p className="text-stone-500 text-sm mt-1">Métricas en vivo conectadas a tu base de datos Supabase.</p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex justify-between items-start mb-4">
            <p className="text-stone-500 text-sm font-medium">Productos Activos</p>
            <div className="p-2 bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] rounded-lg">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="text-4xl font-bold text-stone-900">{loading ? "..." : productsCount}</p>
          <p className="text-xs text-stone-500 mt-2">En {loading ? "..." : categoriesCount} secciones / categorías</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex justify-between items-start mb-4">
            <p className="text-stone-500 text-sm font-medium">Secciones Creadas</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FolderPlus className="h-6 w-6" />
            </div>
          </div>
          <p className="text-4xl font-bold text-stone-900">{loading ? "..." : categoriesCount}</p>
          <p className="text-xs text-stone-500 mt-2">Para organizar el catálogo</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex justify-between items-start mb-4">
            <p className="text-stone-500 text-sm font-medium">Cupones de Descuento</p>
            <div className="p-2 bg-orange-50 text-[var(--color-brand-terra)] rounded-lg">
              <Tag className="h-6 w-6" />
            </div>
          </div>
          <p className="text-4xl font-bold text-stone-900">{loading ? "..." : couponsCount}</p>
          <p className="text-xs text-stone-500 mt-2">Promociones listas</p>
        </div>
      </div>

      {/* Accesos Rápidos y Últimos Productos Reales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif text-stone-900">Últimos Productos en la Base de Datos</h3>
            <Link href="/admin/productos" className="text-xs text-[var(--color-brand-green)] font-semibold hover:underline flex items-center">
              Ver todos <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-stone-400 text-sm">Cargando datos reales...</div>
          ) : latestProducts.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              No hay productos aún. Agrega el primero desde la pestaña Productos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-medium">Producto</th>
                    <th className="pb-3 font-medium">Marca</th>
                    <th className="pb-3 font-medium">Precio</th>
                    <th className="pb-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-stone-100">
                  {latestProducts.map((prod) => (
                    <tr key={prod.id}>
                      <td className="py-3 font-medium text-stone-900">{prod.name}</td>
                      <td className="py-3 text-stone-500 text-xs">{prod.brand || "Líbano"}</td>
                      <td className="py-3 font-semibold text-[var(--color-brand-terra)]">${prod.price.toLocaleString("es-AR")}</td>
                      <td className="py-3 text-right">
                        <Link href="/admin/productos" className="text-stone-400 hover:text-[var(--color-brand-green)]">
                          <Edit2 className="h-4 w-4 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acceso a Secciones */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif text-stone-900 mb-2">Gestión de Secciones y Categorías</h3>
            <p className="text-stone-500 text-sm mb-6">
              Crea nuevas categorías (como Velas, Sahumerios, Deco Espiritual) para que aparezcan en los botones de filtro de tu tienda pública.
            </p>
          </div>
          <Link
            href="/admin/categorias"
            className="inline-flex items-center justify-center px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors text-sm uppercase tracking-wider"
          >
            Administrar Secciones <FolderPlus className="ml-2 h-4 w-4" />
          </Link>
        </div>

      </div>

      {/* Alerta de Stock Bajo */}
      {!loading && lowStockProducts.length > 0 && (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 mt-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-serif text-red-900 flex items-center">
                ⚠️ Atención: Productos con stock bajo
              </h3>
              <p className="text-red-700 text-sm mt-1">
                Hay {lowStockProducts.length} productos con 3 o menos unidades disponibles. Recuerda reponer inventario.
              </p>
            </div>
            <Link href="/admin/productos" className="text-sm font-semibold text-red-700 hover:underline">
              Ir al Inventario &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lowStockProducts.slice(0, 8).map((p) => (
              <div key={p.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex justify-between items-center hover:border-red-300 transition-colors">
                <span className="text-sm font-medium text-stone-900 truncate pr-2" title={p.name}>{p.name}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                  {p.stock} unid.
                </span>
              </div>
            ))}
          </div>
          {lowStockProducts.length > 8 && (
            <div className="mt-4 text-center">
              <Link href="/admin/productos" className="inline-block px-4 py-2 bg-white text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                Ver {lowStockProducts.length - 8} productos más en el Inventario
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

