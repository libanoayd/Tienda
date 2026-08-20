"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useCartStore, Product } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";

export default function ProductoDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function loadProduct() {
      // 1. Intentar cargar de Supabase
      const { data, error } = await supabase.from("products").select("*").eq("id", productId).single();
      
      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.image_url || "/productos/yagra.png",
          stock: data.stock !== undefined ? data.stock : 10,
          description: data.description,
        });
      } else {
        // Fallback a los datos mockeados si no existe en Supabase aún
        const mockProducts: Record<number, Product> = {
          1: { id: 1, name: "Yagra", price: 4500, image: "/productos/yagra.png", stock: 10 },
          2: { id: 2, name: "Caja Palo Santo", price: 8900, image: "/productos/palo-santo.png", stock: 10 },
          3: { id: 3, name: "Incienso", price: 3200, image: "/productos/incienso.png", stock: 10 },
          4: { id: 4, name: "Conos Aromáticos", price: 5400, image: "/productos/conos.png", stock: 10 },
        };
        setProduct(mockProducts[productId] || null);
      }
      setLoading(false);
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-stone-500">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-serif text-stone-900 mb-4">Producto no encontrado</h1>
        <Link href="/catalogo" className="text-[var(--color-brand-green)] hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-stone)] pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón Volver destacado */}
        <Link 
          href="/catalogo" 
          className="inline-flex items-center px-5 py-2.5 bg-white text-stone-700 hover:text-[var(--color-brand-dark)] hover:bg-stone-100 border border-stone-200 rounded-full font-medium text-sm shadow-sm transition-all mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 text-[var(--color-brand-green)] group-hover:-translate-x-1 transition-transform" /> 
          Volver al Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          
          {/* Fotografía de Producto */}
          <div className="aspect-square relative rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Información del Producto */}
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest text-[var(--color-brand-green)] font-bold mb-2 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" /> Edición Especial Líbano
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--color-brand-dark)] mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-[var(--color-brand-terra)] mb-6">
              ${product.price.toLocaleString("es-AR")}
            </p>

            <p className="text-stone-600 mb-8 leading-relaxed whitespace-pre-line">
              {product.description || "Diseñado para transformar el ambiente de tu hogar. Elaborado con materias primas de la más alta calidad para garantizar una experiencia aromática prolongada y equilibrada."}
            </p>

            {/* Botón Agregar al Carrito */}
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`w-full flex items-center justify-center px-8 py-4 font-medium uppercase tracking-wider text-sm shadow-lg rounded-lg mb-8 transition-colors
                ${product.stock > 0 
                  ? "bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-dark)]" 
                  : "bg-stone-300 text-stone-500 cursor-not-allowed"}`}
            >
              <ShoppingBag className="mr-3 h-5 w-5" /> 
              {product.stock > 0 ? "Añadir al Carrito" : "Agotado"}
            </button>

            {/* Beneficios */}
            <div className="border-t border-stone-100 pt-6 space-y-4 text-sm text-stone-600">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-[var(--color-brand-green)] mr-3 flex-shrink-0" />
                <span>Retiro GRATIS en local Pago Fácil Viajantes o envíos a todo el país.</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-[var(--color-brand-green)] mr-3 flex-shrink-0" />
                <span>Garantía de calidad Líbano Aromas y Decoración.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
