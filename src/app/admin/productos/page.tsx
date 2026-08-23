"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, Tag, Box, Hash, Folder, FileImage, Loader2, ArrowLeft } from "lucide-react";

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
  description?: string;
  variants?: string[];
}

interface Category {
  id: number;
  name: string;
  parent_id?: number | null;
}

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("todos");

  // Form State con Variaciones y Stock
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [presentation, setPresentation] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [variantsString, setVariantsString] = useState("");

  // Google Drive Gallery State
  const [showDriveGallery, setShowDriveGallery] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveHistory, setDriveHistory] = useState<string[]>(["1ea_JtBvrukki8S0nQQ91wKAjQQyrOWQR"]);
  const [loadingDrive, setLoadingDrive] = useState(false);

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

  const fetchDriveFolder = async (folderId: string) => {
    setLoadingDrive(true);
    try {
      const res = await fetch(`/api/drive?folderId=${folderId}`);
      const data = await res.json();
      if (res.ok) {
        // Ordenar: Carpetas primero, luego archivos
        const sorted = (data.files || []).sort((a: any, b: any) => {
          if (a.mimeType === "application/vnd.google-apps.folder" && b.mimeType !== "application/vnd.google-apps.folder") return -1;
          if (a.mimeType !== "application/vnd.google-apps.folder" && b.mimeType === "application/vnd.google-apps.folder") return 1;
          return a.name.localeCompare(b.name);
        });
        setDriveFiles(sorted);
      } else {
        alert("Error cargando Drive: " + data.error);
      }
    } catch (err: any) {
      alert("Error de red cargando Drive");
    }
    setLoadingDrive(false);
  };

  const openDriveGallery = () => {
    setShowDriveGallery(true);
    if (driveFiles.length === 0) {
      fetchDriveFolder(driveHistory[driveHistory.length - 1]);
    }
  };

  const handleDriveFolderClick = (folderId: string) => {
    const newHistory = [...driveHistory, folderId];
    setDriveHistory(newHistory);
    fetchDriveFolder(folderId);
  };

  const handleDriveBack = () => {
    if (driveHistory.length > 1) {
      const newHistory = [...driveHistory];
      newHistory.pop();
      setDriveHistory(newHistory);
      fetchDriveFolder(newHistory[newHistory.length - 1]);
    }
  };

  const handleSelectDriveImage = (file: any) => {
    // Usar el thumbnail de alta resolución
    const directLink = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
    setImageUrl(directLink);
    setShowDriveGallery(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Por favor completa el nombre y precio.");

    // Convertir enlace de Google Drive a enlace directo si es necesario
    let finalImageUrl = imageUrl || "/productos/yagra.png";
    const driveMatch = finalImageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      // Usar el endpoint de thumbnails de Google Drive (el único que funciona actualmente para img tags)
      finalImageUrl = `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
    }

    let parsedVariants: string[] = [];
    if (variantsString.trim()) {
      parsedVariants = variantsString.split(',').map(v => v.trim()).filter(v => v);
    }

    const productData = {
      name,
      brand: brand || "Líbano",
      presentation: presentation || "Unidad",
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category_id: categoryId ? parseInt(categoryId) : null,
      image_url: finalImageUrl,
      description: description || "",
      variants: parsedVariants,
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

  const handleQuickUpdate = async (productId: number, field: string, value: number) => {
    // Update local state for immediate feedback
    setProducts(products.map(p => p.id === productId ? { ...p, [field]: value } : p));
    
    // Update Supabase
    const { error } = await supabase.from("products").update({ [field]: value }).eq("id", productId);
    if (error) {
      alert(`Error al actualizar ${field}: ` + error.message);
      fetchData(); // Rollback on error
    }
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
    setDescription(product.description || "");
    setVariantsString(product.variants ? product.variants.join(", ") : "");
    setShowModal(true);
  };

  const renderCategoryOptions = (parentId: number | null = null, level: number = 0): React.ReactNode[] => {
    return categories
      .filter((cat) => cat.parent_id === parentId)
      .map((cat) => (
        <React.Fragment key={cat.id}>
          <option value={cat.id.toString()}>
            {"\u00A0\u00A0".repeat(level)} {level > 0 ? "└ " : ""}{cat.name}
          </option>
          {renderCategoryOptions(cat.id, level + 1)}
        </React.Fragment>
      ));
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
    setDescription("");
    setVariantsString("");
  };

  const filteredProducts = filterCategory === "todos" 
    ? products 
    : products.filter(p => p.category_id?.toString() === filterCategory);

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
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-stone-600">Filtrar por Categoría:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
            >
              <option value="todos">Todas las categorías</option>
              {renderCategoryOptions()}
            </select>
          </div>
          <div className="text-sm text-stone-500">
            Mostrando {filteredProducts.length} producto(s)
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando catálogo...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No hay productos cargados o que coincidan con este filtro.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 bg-stone-50 z-10 shadow-sm">
                <tr className="border-b border-stone-200 text-stone-500 text-sm">
                  <th className="py-4 px-6 font-medium">Imagen</th>
                  <th className="py-4 px-6 font-medium">Producto</th>
                  <th className="py-4 px-6 font-medium">Categoría</th>
                  <th className="py-4 px-6 font-medium">Marca</th>
                  <th className="py-4 px-6 font-medium">Presentación</th>
                  <th className="py-4 px-6 font-medium">Stock</th>
                  <th className="py-4 px-6 font-medium">Precio</th>
                  <th className="py-4 px-6 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredProducts.map((product) => (
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
                      {categories.find(c => c.id === product.category_id)?.name || "Sin Categoría"}
                    </td>
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
                    <input
                      type="number"
                      className="w-20 px-2 py-1 text-sm border border-stone-200 rounded-md focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none transition-all"
                      defaultValue={product.stock || 0}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val !== product.stock && product.id) {
                          handleQuickUpdate(product.id, "stock", val);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </td>
                  <td className="py-3 px-6 font-semibold text-[var(--color-brand-terra)] flex items-center gap-1">
                    $
                    <input
                      type="number"
                      className="w-24 px-2 py-1 text-sm border border-stone-200 rounded-md focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none transition-all font-semibold"
                      defaultValue={product.price || 0}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val !== product.price && product.id) {
                          handleQuickUpdate(product.id, "price", val);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
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
          </div>
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
                    {renderCategoryOptions(null, 0)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Descripción del Producto</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles adicionales, aromas, propiedades..."
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none min-h-[80px] resize-y text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Variantes (opcional)</label>
                <input
                  type="text"
                  value={variantsString}
                  onChange={(e) => setVariantsString(e.target.value)}
                  placeholder="Ej: Lavanda, Vainilla, Rosa (separadas por coma)"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">URL de la Imagen</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Pega el link o busca en Drive ->"
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={openDriveGallery}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Folder className="h-4 w-4 mr-2" /> Explorar Drive
                  </button>
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
                  <Save className="mr-2 h-4 w-4" /> Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Explorador de Google Drive */}
      {showDriveGallery && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <div className="flex items-center">
                {driveHistory.length > 1 && (
                  <button onClick={handleDriveBack} className="mr-4 p-2 hover:bg-stone-100 rounded-full transition">
                    <ArrowLeft className="h-5 w-5 text-stone-600" />
                  </button>
                )}
                <h2 className="text-xl font-serif text-stone-900 flex items-center">
                  <Folder className="h-6 w-6 mr-2 text-blue-500" /> Explorador de Google Drive
                </h2>
              </div>
              <button onClick={() => setShowDriveGallery(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {loadingDrive ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-500 space-y-4 py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p>Leyendo tu Google Drive...</p>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="text-center py-20 text-stone-500">
                  Carpeta vacía o sin permisos.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {driveFiles.map((file) => (
                    <div 
                      key={file.id}
                      onClick={() => {
                        if (file.mimeType === "application/vnd.google-apps.folder") {
                          handleDriveFolderClick(file.id);
                        } else {
                          handleSelectDriveImage(file);
                        }
                      }}
                      className="group cursor-pointer flex flex-col items-center p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all text-center"
                    >
                      {file.mimeType === "application/vnd.google-apps.folder" ? (
                        <Folder className="h-16 w-16 text-blue-400 group-hover:text-blue-500 mb-2 transition-colors" />
                      ) : file.thumbnailLink ? (
                        <div className="h-16 w-16 mb-2 rounded shadow-sm bg-stone-100 overflow-hidden relative">
                          <img src={file.thumbnailLink} alt={file.name} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <FileImage className="h-16 w-16 text-stone-300 mb-2" />
                      )}
                      <span className="text-xs text-stone-600 font-medium truncate w-full px-1" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
