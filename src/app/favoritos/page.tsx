"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function FavoritosPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-brand-stone)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center mb-12 border-b border-stone-200 pb-6">
          <Heart className="h-8 w-8 text-red-500 mr-4 fill-current" />
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-brand-dark)]">
            Mis Favoritos
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-stone-200">
            <Heart className="h-16 w-16 text-stone-200 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-stone-900 mb-4">Tu lista está vacía</h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Explorá nuestro catálogo y tocá el corazoncito en los productos que más te gusten para guardarlos acá.
            </p>
            <Link 
              href="/catalogo"
              className="inline-flex items-center px-8 py-4 bg-[var(--color-brand-dark)] text-white font-medium hover:bg-[var(--color-brand-terra)] transition-colors uppercase tracking-wider text-sm shadow-lg rounded-sm"
            >
              Ver Catálogo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
