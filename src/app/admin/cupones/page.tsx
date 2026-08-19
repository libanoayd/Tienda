"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Tag, Trash2, Save, X, Percent } from "lucide-react";

interface Coupon {
  id?: number;
  code: string;
  discount_percentage: number;
  is_active: boolean;
}

export default function AdminCupones() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("coupons").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error al cargar cupones:", error);
    } else if (data) {
      setCoupons(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return alert("Completa el código y el porcentaje.");

    const { error } = await supabase.from("coupons").insert([
      {
        code: code.toUpperCase().trim(),
        discount_percentage: parseInt(discount),
        is_active: true,
      },
    ]);

    if (error) {
      alert("Error al guardar cupón: " + error.message);
    } else {
      setShowModal(false);
      setCode("");
      setDiscount("");
      fetchCoupons();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cupón de descuento?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      fetchCoupons();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Gestión de Cupones de Descuento</h1>
          <p className="text-stone-500 text-sm mt-1">Crea códigos promocionales para tus clientes (ej: LIBANO10).</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" /> Nuevo Cupón
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando cupones...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No hay cupones creados todavía. ¡Crea el primero como LIBANO10 con 10% de descuento!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="py-4 px-6 font-medium">Código</th>
                <th className="py-4 px-6 font-medium">Descuento</th>
                <th className="py-4 px-6 font-medium">Estado</th>
                <th className="py-4 px-6 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[var(--color-brand-dark)] tracking-wider">
                    <span className="inline-flex items-center px-3 py-1 bg-stone-100 rounded-md border border-stone-200">
                      <Tag className="h-4 w-4 mr-2 text-[var(--color-brand-green)]" />
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[var(--color-brand-terra)]">
                    {coupon.discount_percentage}% OFF
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Activo
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => coupon.id && handleDelete(coupon.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-stone-900">Crear Nuevo Cupón</h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Código del Cupón</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: LIBANO20"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none uppercase font-bold tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Porcentaje de Descuento (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Ej: 20"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                    required
                  />
                  <Percent className="absolute right-3 top-2.5 h-5 w-5 text-stone-400" />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center px-5 py-2 bg-[var(--color-brand-green)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-brand-dark)] transition-colors"
                >
                  <Save className="mr-2 h-4 w-4" /> Guardar Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
