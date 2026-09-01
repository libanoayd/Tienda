
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60; // Refrescar caché cada 60s

export default async function Home() {
  // 1. Obtener últimos 8 productos
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: false })
    .limit(8);

  // 2. Obtener categorías principales
  const { data: mainCategories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("parent_id", null)
    .limit(3);

  const featuredProducts = (dbProducts || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image_url || "/placeholder.jpg",
    stock: p.stock || 0
  }));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center -mt-20">
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
        <div className="relative z-10 text-center px-4 max-w-4xl pt-20">
          <span className="text-[var(--color-brand-mint)] font-medium tracking-[0.2em] uppercase text-sm mb-4 block drop-shadow-md">
            Bienvenido a tu Refugio
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-lg leading-tight">
            Líbano Aromas <br className="hidden md:block"/> y Decoración
          </h1>
          <p className="text-xl text-stone-100 mb-10 font-light drop-shadow-md max-w-2xl mx-auto">
            Descubrí nuestra colección exclusiva de esencias, sahumerios y objetos de decoración diseñados para armonizar tus espacios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalogo" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-brand-green)] text-white font-medium hover:bg-[var(--color-brand-dark)] transition-colors uppercase tracking-wider text-sm shadow-lg rounded-sm"
            >
              Comprar Ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[var(--color-brand-dark)] text-stone-300 py-12 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-700">
            <div className="flex flex-col items-center p-4">
              <Truck className="h-8 w-8 text-[var(--color-brand-mint)] mb-4" />
              <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-2">Envíos a todo el país</h3>
              <p className="text-sm">Recibí tus productos en la puerta de tu casa de forma segura.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <CreditCard className="h-8 w-8 text-[var(--color-brand-mint)] mb-4" />
              <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-2">Pagos Seguros</h3>
              <p className="text-sm">Aboná con todas las tarjetas a través de Mercado Pago.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <ShieldCheck className="h-8 w-8 text-[var(--color-brand-mint)] mb-4" />
              <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-2">Calidad Garantizada</h3>
              <p className="text-sm">Seleccionamos los mejores aromas y materiales para vos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      {mainCategories && mainCategories.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[var(--color-brand-stone)]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">Descubrí nuestras colecciones</h2>
            <div className="h-1 w-20 bg-[var(--color-brand-mint)] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainCategories.map((cat, index) => (
              <Link key={cat.id} href={`/catalogo?categoria=${cat.slug}`} className="group block relative h-80 overflow-hidden rounded-xl shadow-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? "from-[#425752] to-[#2B3B37]" : index === 1 ? "from-[#0A8280] to-[#076B69]" : "from-[#D97D5B] to-[#C06A4A]"} transition-transform duration-700 group-hover:scale-105`}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">{cat.name}</h3>
                  <span className="text-sm uppercase tracking-wider font-medium flex items-center group-hover:text-[var(--color-brand-mint)] transition-colors">
                    Explorar <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[var(--color-brand-stone)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">Novedades y Favoritos</h2>
          <div className="h-1 w-20 bg-[var(--color-brand-mint)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/catalogo" className="inline-block px-8 py-4 bg-white text-[var(--color-brand-dark)] font-medium border border-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors uppercase tracking-wider text-sm rounded-sm">
            Ver Todos Los Productos
          </Link>
        </div>
      </section>

      {/* About Section CTA */}
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="aspect-square relative rounded-full bg-stone-100 overflow-hidden flex items-center justify-center p-12">
              <Image src="/logo-oficial.png" alt="Líbano Logo" width={300} height={300} className="object-contain relative z-10" />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-6">La magia detrás de Líbano</h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              Nacimos con el propósito de acercarte a un estado de calma y bienestar. Creemos firmemente que el ambiente que te rodea influye en tu energía diaria.
            </p>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Por eso, seleccionamos con muchísimo amor cada sahumerio, cada esencia y cada elemento decorativo. Buscamos que tu casa se sienta como un verdadero hogar, un refugio donde puedas relajarte y conectar con vos mismo.
            </p>
            <Link href="/nosotros" className="text-[var(--color-brand-green)] font-bold uppercase tracking-wider text-sm hover:text-[var(--color-brand-dark)] transition-colors underline underline-offset-4">
              Conocé nuestra historia
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

