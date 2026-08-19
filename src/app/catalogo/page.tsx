import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export default function Catalogo() {
  // Productos extendidos para el catálogo
  const allProducts = [
    { id: 1, name: "Yagra", price: 4500, image: "/productos/yagra.png", category: "resinas" },
    { id: 2, name: "Caja Palo Santo", price: 8900, image: "/productos/palo-santo.png", category: "maderas" },
    { id: 3, name: "Incienso", price: 3200, image: "/productos/incienso.png", category: "resinas" },
    { id: 4, name: "Conos Aromáticos", price: 5400, image: "/productos/conos.png", category: "conos" },
    // Más productos pueden ir aquí
  ];

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

      {/* Filtros */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-2 bg-[var(--color-brand-dark)] text-white rounded-full text-sm font-medium transition-colors shadow-sm">
            Todos
          </button>
          <button className="px-6 py-2 bg-white text-stone-600 hover:text-[var(--color-brand-dark)] hover:bg-stone-100 border border-stone-200 rounded-full text-sm font-medium transition-colors shadow-sm">
            Resinas
          </button>
          <button className="px-6 py-2 bg-white text-stone-600 hover:text-[var(--color-brand-dark)] hover:bg-stone-100 border border-stone-200 rounded-full text-sm font-medium transition-colors shadow-sm">
            Maderas Sagradas
          </button>
          <button className="px-6 py-2 bg-white text-stone-600 hover:text-[var(--color-brand-dark)] hover:bg-stone-100 border border-stone-200 rounded-full text-sm font-medium transition-colors shadow-sm">
            Conos
          </button>
        </div>
      </section>

      {/* Grilla de Productos */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
