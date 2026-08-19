"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function PagoPendiente() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Limpiamos el carrito porque la compra ya se registró
    clearCart();
    
    // Obtener número de orden de la URL (MercadoPago envía external_reference)
    const searchParams = new URLSearchParams(window.location.search);
    const externalRef = searchParams.get("external_reference");
    if (externalRef) {
      setOrderId(externalRef);
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[var(--color-brand-stone)] flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-6">
          <Clock className="h-10 w-10 text-amber-600" />
        </div>
        
        <h2 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-4">
          Pago Pendiente
        </h2>

        {orderId && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium mb-1 uppercase tracking-wider">Tu Número de Orden</p>
            <p className="text-3xl font-bold text-amber-900">#{orderId}</p>
            <p className="text-xs text-amber-700 mt-2">Por favor, guarda este número para referenciar tu pedido.</p>
          </div>
        )}
        
        <p className="text-stone-600 mb-8 leading-relaxed">
          Tu pago está siendo procesado por Mercado Pago. Esto suele ocurrir si elegiste pagar en efectivo (Pago Fácil/Rapipago) o si tu tarjeta requiere una validación adicional. 
          Te enviaremos un correo apenas se acredite.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors uppercase tracking-wider"
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
