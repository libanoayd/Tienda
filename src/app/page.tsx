import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  // Productos mockeados para la fase inicial, usando las imagenes de la carpeta Productos PNG
  const featuredProducts = [
    { id: 1, name: "Yagra", price: 4500, image: "/productos/yagra.png" },
    { id: 2, name: "Caja Palo Santo", price: 8900, image: "/productos/palo-santo.png" },
    { id: 3, name: "Incienso", price: 3200, image: "/productos/incienso.png" },
    { id: 4, name: "Conos Aromáticos", price: 5400, image: "/productos/conos.png" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center -mt-20">
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/hero-libano.jpg" 
            alt="Líbano Home Decor" 
            fill
            sizes="100vw"
            className="object-cover object-center brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl pt-20">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-md">
            El aroma de tu hogar, tu firma personal
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto drop-shadow">
            Descubrí nuestra nueva colección de velas, difusores y objetos decorativos diseñados para elevar tus espacios.
          </p>
          <Link 
            href="/catalogo" 
            className="inline-flex items-center px-8 py-4 bg-[var(--color-brand-green)] text-white font-medium hover:bg-[var(--color-brand-dark)] transition-colors uppercase tracking-wider text-sm shadow-lg rounded-sm"
          >
            Ver Catálogo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[var(--color-brand-stone)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">Lo Más Elegido</h2>
          <div className="h-1 w-20 bg-[var(--color-brand-mint)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/catalogo" className="text-stone-900 font-medium hover:text-stone-500 uppercase tracking-wider text-sm underline underline-offset-8">
            Ver Todos Los Productos
          </Link>
        </div>
      </section>

    </div>
  );
}
