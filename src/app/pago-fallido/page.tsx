"use client";

import Link from "next/link";
import Image from "next/image";
import { XCircle, RefreshCcw } from "lucide-react";

export default function PagoFallido() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo elegante */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-libano.jpg" 
          alt="Fondo Líbano" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6 shadow-inner">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        
        <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">
          Pago Rechazado
        </h2>
        
        <p className="text-stone-600 mb-8 leading-relaxed">
          Lo sentimos, Mercado Pago no pudo procesar tu pago. Puede deberse a fondos insuficientes o a un rechazo por seguridad de tu tarjeta. Por favor, intenta nuevamente.
        </p>

        <div className="space-y-4">
          <Link
            href="/catalogo"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[var(--color-brand-terra)] hover:opacity-90 transition-opacity uppercase tracking-wider"
          >
            <RefreshCcw className="mr-2 h-5 w-5" /> Volver a Intentar
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 border border-stone-200 rounded-lg shadow-sm text-base font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
