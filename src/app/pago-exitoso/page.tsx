"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function PagoExitoso() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    
    const searchParams = new URLSearchParams(window.location.search);
    const externalRef = searchParams.get("external_reference");
    
    if (externalRef) {
      setOrderId(externalRef);
      
      // Enviar correo de confirmación de forma asíncrona
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: externalRef })
      }).catch(err => console.error("Error al enviar email:", err));
    }
  }, [clearCart]);

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
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 shadow-inner">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">
          ¡Pago Exitoso!
        </h2>

        {orderId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-1 uppercase tracking-wider">Tu Número de Orden</p>
            <p className="text-3xl font-bold text-green-900">#{orderId}</p>
            <p className="text-xs text-green-700 mt-2">Por favor, guarda este número para cualquier consulta o para retirar tu pedido por el local.</p>
          </div>
        )}
        
        <p className="text-stone-600 mb-8 leading-relaxed">
          Tu pago ha sido procesado correctamente. Recibirás un correo electrónico de Mercado Pago con los detalles de la transacción. ¡Gracias por confiar en Líbano Aromas!
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-dark)] transition-colors uppercase tracking-wider"
          >
            Volver al Inicio
          </Link>
          
          <Link
            href="/catalogo"
            className="w-full flex items-center justify-center px-6 py-3 border border-stone-200 rounded-lg shadow-sm text-base font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors"
          >
            Seguir Comprando <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
