"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function PagoExitoso() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Limpiamos el carrito porque la compra ya se realizó
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
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
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
