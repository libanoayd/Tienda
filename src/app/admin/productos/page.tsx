"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, Tag, Box, Hash } from "lucide-react";

interface Product {
  id?: number;
  name: string;
  brand?: string;
  presentation?: string;
  price: number;
  stock?: number;
  image_url: string;
  category_id?: number;
  is_active?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State con Variaciones y Stock
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [presentation, setPresentation] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    
    // Cargar Categorías
    const { data: catData } = await supabase.from("categories").select("*");
    if (catData) setCategories(catData);

    // Cargar Productos
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error al cargar productos:", error);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Por favor completa el nombre y precio.");

    // Convertir enlace de Google Drive a enlace directo si es necesario
    let finalImageUrl = imageUrl || "/productos/yagra.png";
    const driveMatch = finalImageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      finalImageUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    const productData = {
      name,
      brand: brand || "Líbano",
      presentation: presentation || "Unidad",
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category_id: categoryId ? parseInt(categoryId) : null,
      image_url: finalImageUrl,
    };

    if (editingProduct?.id) {
      const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
      if (error) alert("Error al actualizar: " + error.message);
    } else {
      const { error } = await supabase.from("products").insert([productData]);
      if (error) alert("Error al guardar: " + error.message);
    }

    setShowModal(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás segura de eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      fetchData();
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setBrand(product.brand || "");
    setPresentation(product.presentation || "");
    setPrice(product.price.toString());
    setStock(product.stock !== undefined ? product.stock.toString() : "10");
    setCategoryId(product.category_id ? product.category_id.toString() : "");
    setImageUrl(product.image_url);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setBrand("");
    setPresentation("");
    setPrice("");
    setStock("10");
    setCategoryId("");
    setImageUrl("");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Gestión de Productos, Stock y Variaciones</h1>
          <p className="text-stone-500 text-sm mt-1">Carga productos especificando marca, presentación y cantidad en stock.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center px-4 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No hay productos cargados todavía en Supabase.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="py-4 px-6 font-medium">Imagen</th>
                <th className="py-4 px-6 font-medium">Producto</th>
                <th className="py-4 px-6 font-medium">Marca</th>
                <th className="py-4 px-6 font-medium">Presentación</th>
                <th className="py-4 px-6 font-medium">Stock</th>
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
                  <td className="py-3 px-6 text-stone-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                      <Tag className="h-3 w-3 mr-1" /> {product.brand || "Líbano"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-stone-600">
                    <span className="inline-flex items-center text-xs text-stone-500">
                      <Box className="h-3 w-3 mr-1" /> {product.presentation || "Unidad"}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-medium">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-bold ${
                      (product.stock || 0) > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {product.stock || 0} unidades
                    </span>
                  </td>
                  <td className="py-3 px-6 font-semibold text-[var(--color-brand-terra)]">
                    ${product.price.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 text-stone-600 hover:text-[var(--color-brand-green)] hover:bg-stone-100 rounded-md transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => product.id && handleDelete(product.id)}
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
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-stone-900">
                {editingProduct ? "Editar Producto" : "Nuevo Producto con Variación"}
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
                  placeholder="Ej: Incienso Natural Yagra"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Marca / Proveedor</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej: Sagrada Madre, Just"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Presentación</label>
                  <input
                    type="text"
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    placeholder="Ej: Caja x 8 varillas, 10ml"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stock (Cant.)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Ej: 10"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Sección</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none bg-white text-sm"
                  >
                    <option value="">-- Seleccionar --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ej: /productos/yagra.png o enlace"
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
                  <Save className="mr-2 h-4 w-4" /> Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
