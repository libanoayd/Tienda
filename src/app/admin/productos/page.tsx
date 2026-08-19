"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X } from "lucide-react";

interface Product {
  id?: number;
  name: string;
  price: number;
  image_url: string;
  is_active?: boolean;
}

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Cargar productos desde Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error al cargar productos:", error);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Guardar o Actualizar producto
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Por favor completa el nombre y precio.");

    const productData = {
      name,
      price: parseFloat(price),
      image_url: imageUrl || "/productos/yagra.png",
    };

    if (editingProduct?.id) {
      // Editar existente
      const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
      if (error) alert("Error al actualizar: " + error.message);
    } else {
      // Crear nuevo
      const { error } = await supabase.from("products").insert([productData]);
      if (error) alert("Error al guardar: " + error.message);
    }

    setShowModal(false);
    resetForm();
    fetchProducts();
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás segura de eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      fetchProducts();
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setImageUrl(product.image_url);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setImageUrl("");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Gestión de Productos</h1>
          <p className="text-stone-500 text-sm mt-1">Agrega nuevos productos, cambia precios o elimina stock.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center px-4 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" /> Nuevo Producto
        </button>
      </div>

      {/* Lista / Tabla de Productos */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No hay productos cargados todavía en la base de datos.
            <br />
            <span className="text-xs text-stone-400">Nota: Asegúrate de haber corrido el script en el SQL Editor de Supabase.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="py-4 px-6 font-medium">Imagen</th>
                <th className="py-4 px-6 font-medium">Nombre</th>
                <th className="py-4 px-6 font-medium">Precio</th>
                <th className="py-4 px-6 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="h-12 w-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden relative flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-1" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-stone-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 font-medium text-stone-900">{product.name}</td>
                  <td className="py-3 px-6 font-semibold text-[var(--color-brand-terra)]">
                    ${product.price.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 text-stone-600 hover:text-[var(--color-brand-green)] hover:bg-stone-100 rounded-md transition-colors"
                      title="Editar precio o nombre"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => product.id && handleDelete(product.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar"
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

      {/* Modal para Crear / Editar Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-stone-900">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre del producto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sahumerios Canela"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Precio ($ ARS)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ej: 4500"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">URL de la Imagen (Opcional)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ej: /productos/yagra.png o link directo"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none text-xs"
                />
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
                  <Save className="mr-2 h-4 w-4" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
