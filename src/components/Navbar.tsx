"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button type="button" className={`p-2 ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <Link href="/" className="flex items-center group">
              <div className={`relative transition-all duration-300 ${isScrolled ? 'h-16 w-16' : 'h-24 w-24'} group-hover:scale-105`}>
                <Image src="/logo-oficial.png" alt="Líbano Logo" fill sizes="(max-width: 768px) 80px, 96px" className="object-contain drop-shadow-md" priority />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex space-x-8">
            <Link href="/" className={`text-sm font-medium transition-colors uppercase tracking-wider ${isScrolled ? 'text-stone-900 hover:text-stone-500' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              Inicio
            </Link>
            <Link href="/catalogo" className={`text-sm font-medium transition-colors uppercase tracking-wider ${isScrolled ? 'text-stone-900 hover:text-stone-500' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              Productos
            </Link>
            <Link href="/contacto" className={`text-sm font-medium transition-colors uppercase tracking-wider ${isScrolled ? 'text-stone-900 hover:text-stone-500' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              Local
            </Link>
          </nav>

          {/* Cart */}
          <div className="flex items-center">
            <button onClick={toggleCart} className={`p-2 relative transition-colors ${isScrolled ? 'text-stone-900 hover:text-stone-500' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[var(--color-brand-terra)] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
