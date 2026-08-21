"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, Minus, Plus, ShoppingBag, Tag, CheckCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeFromCart, getCartTotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={toggleCart} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[500px] bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-2xl font-serif text-stone-900 flex items-center">
            <ShoppingBag className="mr-3 text-[var(--color-brand-green)]" /> Tu Carrito
          </h2>
          <button onClick={toggleCart} className="text-stone-500 hover:text-stone-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-500">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex py-2">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-50 relative">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-stone-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-stone-300 rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-[var(--color-brand-terra)] hover:text-red-500">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-200 p-6 bg-stone-50">
            <div className="flex justify-between text-base font-bold text-stone-900 mb-2">
              <p>Subtotal</p>
              <p>${getCartTotal().toLocaleString('es-AR')}</p>
            </div>
            <p className="mt-0.5 text-sm text-stone-500 mb-6">
              El costo de envío y cupones se calculan en el siguiente paso.
            </p>

            <button
              onClick={() => {
                toggleCart();
                window.location.href = "/checkout";
              }}
              className="w-full flex items-center justify-center px-6 py-4 bg-[var(--color-brand-green)] text-white font-medium hover:bg-[var(--color-brand-dark)] transition-colors uppercase tracking-wider text-sm shadow-md rounded-lg"
            >
              Ir a Pagar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
