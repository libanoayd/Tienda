
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Menu, MapPin, Mail } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

import { Navbar } from "@/components/Navbar";
import { CartSidebar } from "@/components/CartSidebar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://tienda-libano.vercel.app"),
  title: "Líbano | Aromas y Decoración",
  description: "Aromas de primera calidad y objetos de decoración seleccionados para crear ambientes de paz. Envíos a todo el país.",
  openGraph: {
    title: "Líbano | Aromas y Decoración",
    description: "Aromas de primera calidad y objetos de decoración seleccionados para crear ambientes de paz. Envíos a todo el país.",
    url: "https://tienda-libano.vercel.app",
    siteName: "Líbano Aromas",
    images: [
      {
        url: "/hero-libano.jpg", // Using an existing attractive image
        width: 1200,
        height: 630,
        alt: "Líbano Aromas y Decoración",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Líbano | Aromas y Decoración",
    description: "Aromas de primera calidad y objetos de decoración seleccionados para crear ambientes de paz.",
    images: ["/hero-libano.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[var(--color-brand-stone)] text-[var(--color-brand-dark)]`}>
        <Analytics />
        <Navbar />
        <CartSidebar />
        
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
        
        <WhatsAppButton />

        <footer className="bg-[var(--color-brand-dark)] text-stone-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="relative h-28 w-28 mb-6 flex items-center justify-center">
                  <Image src="/logo-oficial.png" alt="Líbano Logo" fill sizes="112px" className="object-contain" />
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Transformando tus espacios en lugares mágicos a través del aroma y la decoración.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Navegación</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/nosotros" className="text-sm text-stone-300 hover:text-white transition-colors">Nosotros</Link>
                  </li>
                  <li>
                    <Link href="/catalogo" className="text-sm text-stone-300 hover:text-white transition-colors">Catálogo</Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="text-sm text-stone-300 hover:text-white transition-colors">Contacto</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Ayuda</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/ayuda" className="text-sm text-stone-300 hover:text-white transition-colors">Preguntas Frecuentes</Link>
                  </li>
                  <li>
                    <Link href="/ayuda#envios" className="text-sm text-stone-300 hover:text-white transition-colors">Políticas de Envío</Link>
                  </li>
                  <li>
                    <Link href="/ayuda#devoluciones" className="text-sm text-stone-300 hover:text-white transition-colors">Cambios y Devoluciones</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Visítanos</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-[var(--color-brand-mint)] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-300 leading-relaxed">
                      <strong className="text-white font-semibold">Pago Fácil Viajantes</strong><br />
                      Suipacha 422, 6ta Sección<br />
                      Ciudad de Mendoza
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-stone-400">
                &copy; 2026 Líbano Aromas y Decoración. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 mt-6 md:mt-0">
                <a href="https://instagram.com/libanoayd" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[var(--color-brand-mint)] transition-transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://facebook.com/libanoayd" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[var(--color-brand-mint)] transition-transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="mailto:hola@tiendalibano.com" className="text-stone-400 hover:text-[var(--color-brand-mint)] transition-transform hover:scale-110">
                  <span className="sr-only">Email</span>
                  <Mail className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

