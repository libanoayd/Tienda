"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/store/cartStore";
import { Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'price-asc', 'price-desc'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Cargar Categorías de Supabase
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData && catData.length > 0) {
        setCategories(catData);
      }

      // Cargar Productos de Supabase
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
      } else {
        // Fallback inicial si la base de datos está vacía
        setProducts([
          { id: 1, name: "Yagra", price: 4500, image: "/productos/yagra.png", stock: 10 } as any,
          { id: 2, name: "Caja Palo Santo", price: 8900, image: "/productos/palo-santo.png", stock: 5 } as any,
          { id: 3, name: "Incienso", price: 3200, image: "/productos/incienso.png", stock: 0 } as any,
          { id: 4, name: "Conos Aromáticos", price: 5400, image: "/productos/conos.png", stock: 2 } as any,
        ]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filtrar por Categoría
    if (selectedCategory !== "todos") {
      result = result.filter((p: any) => p.category_id === parseInt(selectedCategory));
    }

    // 2. Filtrar por Búsqueda
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    // 3. Ordenar
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest (por ID descendente asumiendo que IDs más grandes son más nuevos)
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-stone)] pt-28">
      
      {/* Encabezado del catálogo */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-brand-dark)] mb-6">Nuestro Catálogo</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explora nuestra cuidada selección de aromas y objetos decorativos diseñados para transformar cada rincón de tu hogar en un espacio único.
          </p>
        </div>
      </section>

      {/* Controles: Búsqueda, Filtros y Ordenamiento */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
            {/* Categorías (Dropdown on mobile, buttons on desktop if space allows, or just select) */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]"
            >
              <option value="todos">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>

            {/* Ordenamiento */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grilla de Productos */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24">
        {loading ? (
          <div className="text-center py-12 text-stone-500">Cargando productos...</div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12 text-stone-500">No hay productos que coincidan con tu búsqueda.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
