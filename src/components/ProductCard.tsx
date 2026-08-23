"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore, Product } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const isOutOfStock = product.stock <= 0;
  const isFav = isInWishlist(product.id);

  return (
    <div className={`group relative flex flex-col ${isOutOfStock ? 'opacity-70' : ''}`}>
      <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-white shadow-sm relative mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-contain object-center p-4 transition-transform duration-500 ${isOutOfStock ? '' : 'group-hover:scale-105'}`}
        />
        
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-stone-900 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
            Agotado
          </div>
        )}

        <button 
          onClick={(e) => {
            e.preventDefault(); // Prevent link click
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm z-20 transition-colors ${
            isFav ? 'bg-red-50 text-red-500' : 'bg-white/80 text-stone-400 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Button Overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (product.variants && product.variants.length > 0) {
                  // Redirect to product page to select variant
                  window.location.href = `/producto/${product.id}`;
                } else {
                  addToCart(product);
                }
              }}
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-[var(--color-brand-dark)] p-3 rounded-full shadow-lg hover:bg-[var(--color-brand-green)] hover:text-white"
              aria-label="Añadir al carrito"
            >
              <ShoppingBag className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-[var(--color-brand-dark)]">
        <Link href={`/producto/${product.id}`}>
          <span aria-hidden="true" className="absolute inset-0 z-10" />
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-[var(--color-brand-terra)] font-bold">${product.price.toLocaleString('es-AR')}</p>
    </div>
  );
}
