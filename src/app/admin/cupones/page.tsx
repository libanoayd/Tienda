"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Tag, Trash2, Save, X, Percent, Layers } from "lucide-react";

interface Coupon {
  id?: number;
  code: string;
  discount_percentage: number;
  target_type: string;
  category_id?: number | null;
  product_id?: number | null;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

export default function AdminCupones() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [targetType, setTargetType] = useState("all");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

  const fetchData = async () => {
    setLoading(true);

    const { data: catData } = await supabase.from("categories").select("*");
    if (catData) setCategories(catData);

    const { data: prodData } = await supabase.from("products").select("id, name");
    if (prodData) setProducts(prodData);

    const { data, error } = await supabase.from("coupons").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error al cargar cupones:", error);
    } else if (data) {
      setCoupons(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return alert("Completa el código y el porcentaje.");

    const { error } = await supabase.from("coupons").insert([
      {
        code: code.toUpperCase().trim(),
        discount_percentage: parseInt(discount),
        target_type: targetType,
        category_id: targetType === "category" && categoryId ? parseInt(categoryId) : null,
        product_id: targetType === "product" && productId ? parseInt(productId) : null,
        is_active: true,
      },
    ]);

    if (error) {
      alert("Error al guardar cupón: " + error.message);
    } else {
      setShowModal(false);
      resetForm();
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cupón de descuento?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      fetchData();
    }
  };

  const resetForm = () => {
    setCode("");
    setDiscount("");
    setTargetType("all");
    setCategoryId("");
    setProductId("");
  };

  const getTargetName = (coupon: Coupon) => {
    if (coupon.target_type === "all") return "Todo el sitio";
    if (coupon.target_type === "category") {
      const found = categories.find((c) => c.id === coupon.category_id);
      return found ? `Categoría: ${found.name}` : "Categoría específica";
    }
    if (coupon.target_type === "product") {
      const found = products.find((p) => p.id === coupon.product_id);
      return found ? `Producto: ${found.name}` : "Producto específico";
    }
    return "Específico";
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Gestión de Cupones de Descuento</h1>
          <p className="text-stone-500 text-sm mt-1">
            Crea promociones para todo el sitio o exclusivas para una sección específica (ej: Solo Sahumerios).
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
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
                <th className="py-4 px-6 font-medium">Aplica a</th>
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
                  <td className="py-4 px-6 text-stone-600">
                    <span className="inline-flex items-center text-xs font-medium bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full border border-stone-200">
                      <Layers className="h-3 w-3 mr-1 text-stone-500" />
                      {getTargetName(coupon)}
                    </span>
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
                  placeholder="Ej: SAHUMERIOS15"
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
                    placeholder="Ej: 15"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                    required
                  />
                  <Percent className="absolute right-3 top-2.5 h-5 w-5 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">¿Dónde aplica el descuento?</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none bg-white font-medium"
                >
                  <option value="all">🌐 Todo el sitio (Todos los productos)</option>
                  <option value="category">🏷️ Solo a una Sección / Categoría específica</option>
                  <option value="product">🎁 Solo a un Producto específico</option>
                </select>
              </div>

              {targetType === "category" && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Selecciona la Sección</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none bg-white"
                    required
                  >
                    <option value="">-- Elige una --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === "product" && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Selecciona el Producto</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none bg-white"
                    required
                  >
                    <option value="">-- Elige uno --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

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
