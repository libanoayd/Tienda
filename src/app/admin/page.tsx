"use client";

import { Package, DollarSign, Tag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-stone-900 mb-8">Resumen de tu Tienda</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-500 font-medium">Ventas del Mes</h3>
            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-stone-900">$145.800</p>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" /> +12% vs mes anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-500 font-medium">Productos Activos</h3>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-stone-900">24</p>
          <p className="text-sm text-stone-500 mt-2">En 4 categorías</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-500 font-medium">Cupones Activos</h3>
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
              <Tag className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-stone-900">2</p>
          <p className="text-sm text-stone-500 mt-2">LIBANO10, ENVIOGRATIS</p>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h2 className="text-2xl font-serif text-stone-900 mb-6">Accesos Rápidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Simulación de la tabla copiada del Proyecto Edutec */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-4">Últimos Productos Agregados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-sm">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Categoría</th>
                  <th className="pb-3 font-medium">Precio</th>
                  <th className="pb-3 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-stone-100">
                  <td className="py-3 font-medium text-stone-900">Buda Flujo Inverso</td>
                  <td className="py-3 text-stone-500">Deco</td>
                  <td className="py-3 text-stone-900">$12.500</td>
                  <td className="py-3 text-right"><button className="text-[var(--color-brand-green)] hover:underline">Editar</button></td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 font-medium text-stone-900">Aceite Just Naranja</td>
                  <td className="py-3 text-stone-500">Aromaterapia</td>
                  <td className="py-3 text-stone-900">$15.200</td>
                  <td className="py-3 text-right"><button className="text-[var(--color-brand-green)] hover:underline">Editar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="mt-4 text-sm text-[var(--color-brand-terra)] font-medium hover:underline">
            + Añadir nuevo producto
          </button>
        </div>

      </div>
    </div>
  );
}
