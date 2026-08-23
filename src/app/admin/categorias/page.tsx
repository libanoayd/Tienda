
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, FolderTree, Trash2, Edit2, Save, X, Tags } from "lucide-react";

interface Category {
  id?: number;
  name: string;
  slug: string;
  parent_id?: number | null;
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error al cargar categorías:", error);
    } else if (data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ingresa el nombre de la sección.");

    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
    if (editingCategory?.id && parentId === editingCategory.id) {
      return alert("Una categoría no puede ser subcategoría de sí misma.");
    }

    const payload = {
      name,
      slug,
      parent_id: parentId === "" ? null : parentId,
    };

    if (editingCategory?.id) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editingCategory.id);
      if (error) alert("Error al actualizar: " + error.message);
    } else {
      const { error } = await supabase.from("categories").insert([payload]);
      if (error) alert("Error al crear la sección: " + error.message);
    }

    setShowModal(false);
    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás segura de borrar esta sección? Los productos asociados quedarán sin categoría.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      fetchCategories();
    }
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentId(cat.parent_id || "");
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setParentId("");
  };

  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Secciones y Categorías</h1>
          <p className="text-stone-500 text-sm mt-1">
            Organiza tu tienda visualmente. Crea secciones principales y agrega subcategorías.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center px-4 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" /> Nueva Sección
        </button>
      </div>

      <div className="max-w-5xl">
        {loading ? (
          <div className="p-12 text-center text-stone-500 bg-white rounded-xl shadow-sm border border-stone-200">Cargando secciones...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-white rounded-xl shadow-sm border border-stone-200">
            No hay secciones creadas todavía. ¡Crea la primera para organizar tu catálogo!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parentCategories.map((parent) => {
              const children = categories.filter((c) => c.parent_id === parent.id);
              
              return (
                <div key={parent.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:border-[var(--color-brand-green)]/30 transition-colors group">
                  <div className="p-5 border-b border-stone-100 flex justify-between items-start bg-stone-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--color-brand-green)]/10 rounded-lg text-[var(--color-brand-green)]">
                        <FolderTree className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900">{parent.name}</h3>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">{parent.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(parent)} className="p-1.5 text-stone-400 hover:text-[var(--color-brand-green)] rounded-md hover:bg-stone-100" title="Editar">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => parent.id && handleDelete(parent.id)} className="p-1.5 text-stone-400 hover:text-red-500 rounded-md hover:bg-red-50" title="Eliminar">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center">
                      <Tags className="h-3.5 w-3.5 mr-1" /> Subcategorías ({children.length})
                    </h4>
                    
                    {children.length > 0 ? (
                      <ul className="space-y-2">
                        {children.map(child => (
                          <li key={child.id} className="flex justify-between items-center group/item p-2 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-colors">
                            <span className="text-sm text-stone-700">{child.name}</span>
                            <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button onClick={() => openEditModal(child)} className="p-1 text-stone-400 hover:text-[var(--color-brand-green)]">
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button onClick={() => child.id && handleDelete(child.id)} className="p-1 text-stone-400 hover:text-red-500">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-stone-400 italic">No hay subcategorías.</p>
                    )}
                    
                    <button 
                      onClick={() => { resetForm(); setParentId(parent.id || ""); setShowModal(true); }}
                      className="mt-4 text-xs font-medium text-[var(--color-brand-green)] hover:text-[var(--color-brand-dark)] flex items-center"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Añadir subcategoría
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-stone-900">
                {editingCategory ? "Editar Sección" : "Nueva Sección"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre de la Sección</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Velas Aromáticas, Sahumerios, Deco"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">¿Pertenece a otra sección?</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                >
                  <option value="">Ninguna (Es una Sección Principal)</option>
                  {parentCategories
                    .filter(cat => cat.id !== editingCategory?.id)
                    .map(cat => (
                      <option key={cat.id} value={cat.id || ""}>
                        {cat.name}
                      </option>
                  ))}
                </select>
                <p className="text-xs text-stone-500 mt-1">Si eliges una sección, esta será una subcategoría.</p>
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
                  <Save className="mr-2 h-4 w-4" /> Guardar Sección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

