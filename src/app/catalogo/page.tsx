
"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/store/cartStore";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

function CatalogoContent() {
  const searchParams = useSearchParams();
  const queryQ = searchParams?.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState(queryQ);
  const [sortBy, setSortBy] = useState("newest"); // "newest", "price-asc", "price-desc"
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setSearchQuery(queryQ);
  }, [queryQ]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: catData } = await supabase.from("categories").select("*");
      if (catData && catData.length > 0) {
        setCategories(catData);
      }

      const { data: prodData } = await supabase.from("products").select("*").eq("is_active", true);

      if (prodData && prodData.length > 0) {
        const mapped = prodData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image_url || "/productos/yagra.png",
          category_id: p.category_id,
          stock: p.stock ?? 0,
        }));
        setProducts(mapped);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    const getAllCategoryIds = (parentId: number): number[] => {
      let ids = [parentId];
      const children = categories.filter((c) => c.parent_id === parentId);
      for (const child of children) {
        ids = [...ids, ...getAllCategoryIds(child.id)];
      }
      return ids;
    };

    if (selectedCategory !== "todos") {
      const selectedId = parseInt(selectedCategory);
      const allowedCategoryIds = getAllCategoryIds(selectedId);
      result = result.filter((p: any) => allowedCategoryIds.includes(p.category_id));
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, categories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-stone)] pt-28 pb-24">
      
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-brand-dark)] mb-6">Nuestro Catálogo</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explora nuestra cuidada selección de aromas y objetos decorativos diseñados para transformar cada rincón de tu hogar en un espacio único.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 lg:sticky lg:top-32">
              <h3 className="font-serif text-lg text-stone-900 mb-4 border-b border-stone-100 pb-2">Buscar</h3>
              <div className="relative w-full mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]"
                />
              </div>

              <h3 className="font-serif text-lg text-stone-900 mb-4 border-b border-stone-100 pb-2">Categorías</h3>
              <ul className="space-y-2 text-sm text-stone-600 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                <li>
                  <button 
                    onClick={() => setSelectedCategory("todos")}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${selectedCategory === "todos" ? "bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] font-medium" : "hover:bg-stone-50"}`}
                  >
                    Todas las categorías
                  </button>
                </li>
                {categories.filter(c => !c.parent_id).map((cat) => (
                  <React.Fragment key={cat.id}>
                    <li>
                      <button 
                        onClick={() => setSelectedCategory(cat.id.toString())}
                        className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${selectedCategory === cat.id.toString() ? "bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] font-medium" : "hover:bg-stone-50"}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                    {categories.filter(sub => sub.parent_id === cat.id).map(sub => (
                      <li key={sub.id}>
                        <button 
                          onClick={() => setSelectedCategory(sub.id.toString())}
                          className={`w-full text-left px-2 py-1.5 pl-6 rounded-md transition-colors ${selectedCategory === sub.id.toString() ? "bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] font-medium" : "hover:bg-stone-50"}`}
                        >
                          └ {sub.name}
                        </button>
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>

              <h3 className="font-serif text-lg text-stone-900 mb-4 border-b border-stone-100 pb-2 mt-6">Ordenar por</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)] bg-white"
              >
                <option value="newest">Más recientes</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 text-sm text-stone-500">
              Mostrando {paginatedProducts.length} de {filteredAndSortedProducts.length} productos
            </div>

            {loading ? (
              <div className="text-center py-12 text-stone-500">Cargando productos...</div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-stone-200">
                <p className="text-stone-500 mb-4">No hay productos que coincidan con tu búsqueda.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("todos"); }}
                  className="text-[var(--color-brand-green)] hover:underline font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-600 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
                    
                    <div className="flex flex-wrap gap-1 justify-center max-w-[60vw]">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                            currentPage === page 
                              ? "bg-[var(--color-brand-green)] text-white border-transparent" 
                              : "border border-stone-300 text-stone-600 bg-white hover:bg-stone-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-600 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Catalogo() {
  return (
    <Suspense fallback={<div className="text-center pt-32">Cargando...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}

