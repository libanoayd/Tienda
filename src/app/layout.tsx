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

export const metadata: Metadata = {
  title: "Líbano | Aromas y Decoración",
  description: "Velas, difusores, deco y aromas para tu hogar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[var(--color-brand-stone)] text-[var(--color-brand-dark)]`}>
        <Navbar />
        <CartSidebar />
        
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
        
        <WhatsAppButton />

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="relative h-24 w-24 mb-4 opacity-100">
                  <Image src="/logo-oficial.png" alt="Líbano Logo" fill sizes="96px" className="object-contain rounded-md" />
                </div>
                <p className="text-stone-500 text-sm">
                  Transformando tus espacios en lugares mágicos a través del aroma y la decoración.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 tracking-wider uppercase mb-4">Navegación</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/nosotros" className="text-base text-stone-500 hover:text-stone-900">Nosotros</Link>
                  </li>
                  <li>
                    <Link href="/catalogo" className="text-base text-stone-500 hover:text-stone-900">Catálogo</Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="text-base text-stone-500 hover:text-stone-900">Contacto</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 tracking-wider uppercase mb-4">Visítanos</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-stone-400 mr-2 flex-shrink-0" />
                    <span className="text-base text-stone-500">
                      <strong>Pago Fácil Viajantes</strong><br />
                      Suipacha 422, 6ta Sección<br />
                      Ciudad de Mendoza
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-base text-stone-400">
                &copy; 2026 Líbano Aromas y Decoración.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="https://instagram.com/libanoayd" target="_blank" rel="noopener noreferrer" className="flex items-center text-stone-400 hover:text-stone-900 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="mailto:libanoayd@gmail.com" className="flex items-center text-stone-400 hover:text-stone-900 transition-colors">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>libanoayd@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
