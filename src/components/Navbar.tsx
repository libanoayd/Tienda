"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, Heart, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((state) => state.getCartCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomePage = pathname === "/";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        !isHomePage || isScrolled ? "bg-white shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button type="button" className={`p-2 ${!isHomePage || isScrolled ? 'text-stone-900' : 'text-white'}`}>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <Link href="/" className="flex items-center group">
              <div className={`relative transition-all duration-300 ${!isHomePage || isScrolled ? 'h-16 w-16' : 'h-24 w-24'} group-hover:scale-105`}>
                <Image src="/logo-oficial.png" alt="Líbano Logo" fill sizes="(max-width: 768px) 80px, 96px" className="object-contain drop-shadow-md" priority />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className={`text-sm font-medium transition-colors uppercase tracking-wider ${!isHomePage || isScrolled ? 'text-[var(--color-brand-dark)] hover:text-[var(--color-brand-green)]' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              Inicio
            </Link>
            <Link href="/nosotros" className={`text-sm font-medium transition-colors uppercase tracking-wider ${!isHomePage || isScrolled ? 'text-[var(--color-brand-dark)] hover:text-[var(--color-brand-green)]' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              Nosotros
            </Link>
            <Link href="/catalogo" className={`text-sm font-medium transition-colors uppercase tracking-wider ${!isHomePage || isScrolled ? 'text-[var(--color-brand-dark)] hover:text-[var(--color-brand-green)]' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
              Productos
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative ml-4">
              <input 
                type="text" 
                placeholder="Buscar aroma..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-3 pr-10 py-1.5 rounded-full text-sm border focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-green)] transition-all ${
                  !isHomePage || isScrolled 
                    ? 'bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400' 
                    : 'bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/90 focus:text-stone-900'
                }`}
              />
              <button type="submit" className={`absolute right-3 top-1.5 ${!isHomePage || isScrolled ? 'text-stone-400' : 'text-white/70'}`}>
                <Search className="h-4 w-4" />
              </button>
            </form>
          </nav>

          {/* Icons (Wishlist & Cart) */}
          <div className="flex items-center space-x-2">
            <Link href="/favoritos" className={`p-2 relative transition-colors ${!isHomePage || isScrolled ? 'text-[var(--color-brand-dark)] hover:text-red-500' : 'text-white hover:text-red-400 drop-shadow-md'}`}>
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={toggleCart} className={`p-2 relative transition-colors ${!isHomePage || isScrolled ? 'text-[var(--color-brand-dark)] hover:text-[var(--color-brand-green)]' : 'text-white hover:text-stone-200 drop-shadow-md'}`}>
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
