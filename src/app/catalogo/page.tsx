"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/store/cartStore";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
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
        }));
        setProducts(mapped);
      } else {
        // Fallback inicial si la base de datos está vacía
        setProducts([
          { id: 1, name: "Yagra", price: 4500, image: "/productos/yagra.png" },
          { id: 2, name: "Caja Palo Santo", price: 8900, image: "/productos/palo-santo.png" },
          { id: 3, name: "Incienso", price: 3200, image: "/productos/incienso.png" },
          { id: 4, name: "Conos Aromáticos", price: 5400, image: "/productos/conos.png" },
        ]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Filtrar productos por categoría elegida
  const filteredProducts = selectedCategory === "todos"
    ? products
    : products.filter((p: any) => p.category_id === parseInt(selectedCategory));

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-stone)] pt-28">
      
      {/* Encabezado del catálogo */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-brand-dark)] mb-6">Nuestro Catálogo</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explora nuestra cuidada selección de aromas y objetos decorativos diseñados para transformar cada rincón de tu hogar en un espacio único.
          </p>
        </div>
      </section>

      {/* Filtros dinámicos */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory("todos")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
              selectedCategory === "todos"
                ? "bg-[var(--color-brand-dark)] text-white"
                : "bg-white text-stone-600 hover:text-[var(--color-brand-dark)] border border-stone-200"
            }`}
          >
            Todos
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
                selectedCategory === cat.id.toString()
                  ? "bg-[var(--color-brand-dark)] text-white"
                  : "bg-white text-stone-600 hover:text-[var(--color-brand-dark)] border border-stone-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Grilla de Productos */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24">
        {loading ? (
          <div className="text-center py-12 text-stone-500">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-stone-500">No hay productos en esta categoría.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
