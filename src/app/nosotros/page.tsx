import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-stone)] pt-28">
      
      {/* Encabezado */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-brand-dark)] mb-6">Nuestra Filosofía</h1>
        <p className="text-stone-600 text-lg md:text-xl leading-relaxed">
          En Líbano creemos que los aromas tienen el poder de transformar cualquier lugar en un refugio personal. 
          Nuestra misión es crear experiencias sensoriales que eleven tus espacios, conectándote con el bienestar y la tranquilidad.
        </p>
      </section>

      {/* Imagen Principal */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full mb-24">
        <div className="relative h-[40vh] md:h-[60vh] w-full rounded-2xl overflow-hidden shadow-xl">
          <Image 
            src="/hero-libano.jpg" 
            alt="Detalle de productos Líbano" 
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* Valores */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">Lo que nos define</h2>
          <div className="h-1 w-20 bg-[var(--color-brand-mint)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Valor 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
            <div className="mx-auto h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <Leaf className="h-8 w-8 text-[var(--color-brand-green)]" />
            </div>
            <h3 className="text-xl font-serif text-stone-900 mb-4">Insumos Cuidados</h3>
            <p className="text-stone-600 leading-relaxed">
              Trabajamos con ceras y esencias seleccionadas rigurosamente, priorizando opciones respetuosas con el medio ambiente y la salud de tu hogar.
            </p>
          </div>

          {/* Valor 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
            <div className="mx-auto h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-[var(--color-brand-terra)]" />
            </div>
            <h3 className="text-xl font-serif text-stone-900 mb-4">Trabajo Artesanal</h3>
            <p className="text-stone-600 leading-relaxed">
              Cada vela y difusor es vertido a mano con amor y dedicación. No somos una fábrica, somos un taller donde cada detalle importa.
            </p>
          </div>

          {/* Valor 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
            <div className="mx-auto h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-serif text-stone-900 mb-4">Diseño Atemporal</h3>
            <p className="text-stone-600 leading-relaxed">
              Nuestros envases y presentaciones están pensados para integrarse armoniosamente en cualquier estilo de decoración.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-brand-dark)] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-serif mb-6">Descubre nuestra colección</h2>
        <p className="text-stone-300 max-w-2xl mx-auto mb-10 text-lg">
          Lleva la esencia de Líbano a tus ambientes y comienza a disfrutar de un hogar más cálido y acogedor hoy mismo.
        </p>
        <Link 
          href="/catalogo" 
          className="inline-flex items-center px-8 py-4 bg-[var(--color-brand-green)] text-white font-medium hover:bg-[var(--color-brand-terra)] transition-colors uppercase tracking-wider text-sm shadow-lg rounded-sm"
        >
          Ver Productos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

    </div>
  );
}
