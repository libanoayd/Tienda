"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, FolderPlus, Trash2, Edit2, Save, X, CornerDownRight } from "lucide-react";

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

  // Form state
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

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    const payload = { 
      name: name.trim(), 
      slug, 
      parent_id: parentId === "" ? null : parentId 
    };

    if (editingCategory?.id) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editingCategory.id);

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

  // Organizar jerárquicamente para la vista
  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Gestión de Secciones / Categorías</h1>
          <p className="text-stone-500 text-sm mt-1">
            Crea las secciones de tu tienda (ej: Velas, Sahumerios) y subcategorías (ej: Velas de Soja).
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center px-4 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" /> Nueva Sección
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden max-w-3xl">
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando secciones...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No hay secciones creadas todavía. ¡Crea la primera para organizar tu catálogo!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="py-4 px-6 font-medium">Nombre de la Sección</th>
                <th className="py-4 px-6 font-medium">Identificador (Slug)</th>
                <th className="py-4 px-6 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {parentCategories.map((parent) => (
                <React.Fragment key={parent.id}>
                  {/* Categoría Padre */}
                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/30">
                    <td className="py-4 px-6 font-semibold text-[var(--color-brand-dark)] flex items-center">
                      <FolderPlus className="h-4 w-4 mr-3 text-[var(--color-brand-green)]" />
                      {parent.name}
                    </td>
                    <td className="py-4 px-6 text-stone-500 font-mono text-xs">
                      {parent.slug}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(parent)}
                        className="p-2 text-stone-600 hover:text-[var(--color-brand-green)] hover:bg-stone-100 rounded-md transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => parent.id && handleDelete(parent.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {/* Subcategorías */}
                  {categories.filter(c => c.parent_id === parent.id).map(sub => (
                    <tr key={sub.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-6 pl-12 font-medium text-stone-700 flex items-center">
                        <CornerDownRight className="h-4 w-4 mr-2 text-stone-300" />
                        {sub.name}
                      </td>
                      <td className="py-3 px-6 text-stone-400 font-mono text-xs">
                        {sub.slug}
                      </td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-2 text-stone-600 hover:text-[var(--color-brand-green)] hover:bg-stone-100 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sub.id && handleDelete(sub.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
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
                <label className="block text-sm font-medium text-stone-700 mb-1">¿Es subcategoría de...?</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
                >
                  <option value="">Ninguna (Es una Categoría Principal)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
