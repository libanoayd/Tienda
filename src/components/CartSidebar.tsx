"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, Minus, Plus, ShoppingBag, Tag, CheckCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeFromCart, getCartTotal } = useCartStore();

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; targetType: string; categoryId?: number | null } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  // User details state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<'retiro' | 'envio'>('retiro');
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplying(true);
    setCouponError("");

    const cleanCode = couponCode.trim().toUpperCase();

    // 1. Consultar Supabase por el cupón activo
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", cleanCode)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      setCouponError("Cupón inválido o expirado");
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon({
        code: data.code,
        discount: data.discount_percentage,
        targetType: data.target_type || "all",
        categoryId: data.category_id,
      });
      setCouponError("");
    }

    setApplying(false);
  };

  // Calcular descuento en dinero ($)
  const calculateDiscountAmount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = getCartTotal();

    if (appliedCoupon.targetType === "all") {
      return (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.targetType === "category" && appliedCoupon.categoryId) {
      // Aplicar porcentaje solo a los productos de esa categoría
      const eligibleTotal = items
        .filter((item: any) => item.category_id === appliedCoupon.categoryId)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

      return (eligibleTotal * appliedCoupon.discount) / 100;
    }

    return 0;
  };

  const discountAmount = calculateDiscountAmount();
  const finalTotal = Math.max(0, getCartTotal() - discountAmount);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCheckout(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          items, 
          total: finalTotal,
          userInfo: {
            name: userName,
            email: userEmail,
            phone: userPhone,
          },
          deliveryInfo: {
            method: deliveryMethod,
            address: deliveryMethod === 'envio' ? shippingAddress : null
          }
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error de Checkout:", data);
        const errorMessage = data.details ? `${data.error}: ${JSON.stringify(data.details)}` : data.error || "Error al procesar el pago";
        throw new Error(errorMessage);
      }
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert(data.error || "Hubo un error al iniciar el pago.");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Hubo un error al iniciar el pago.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={toggleCart} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        
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

        {/* Footer del Carrito con Cupones y Totales */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 p-6 bg-stone-50 overflow-y-auto">
            
            {/* Input de Cupón de Descuento */}
            <form onSubmit={handleApplyCoupon} className="mb-4">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1 text-[var(--color-brand-green)]" /> ¿Tienes un cupón de descuento?
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ej: LIBANO10"
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none uppercase font-bold tracking-wider"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-md hover:bg-stone-800 transition-colors uppercase tracking-wider"
                >
                  {applying ? "..." : "Aplicar"}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-green-700 text-xs mt-1.5 font-medium flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Cupón <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.discount}% OFF)
                </p>
              )}
            </form>

            {/* Totales y Descuentos */}
            <div className="space-y-2 text-sm text-stone-600 mb-4 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toLocaleString('es-AR')}</span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Descuento ({appliedCoupon.discount}%)</span>
                  <span>-${discountAmount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total a pagar</span>
                <span className="text-[var(--color-brand-terra)]">${finalTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <p className="mt-0.5 text-xs text-stone-500 mb-4">✓ Retiro GRATIS en el local (Pago Fácil Viajantes).</p>
            
            <form onSubmit={handleCheckout} className="space-y-3 border-t border-stone-200 pt-4">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Tus datos para el pedido</h4>
              
              {/* Selector de Método de Entrega */}
              <div className="flex flex-col space-y-2 mb-4 p-3 bg-white rounded-md border border-stone-200">
                <label className="flex items-center space-x-2 text-sm text-stone-700 cursor-pointer">
                  <input type="radio" name="deliveryMethod" value="retiro" checked={deliveryMethod === 'retiro'} onChange={() => setDeliveryMethod('retiro')} className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                  <span>Retiro en el local (Gratis)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-stone-700 cursor-pointer">
                  <input type="radio" name="deliveryMethod" value="envio" checked={deliveryMethod === 'envio'} onChange={() => setDeliveryMethod('envio')} className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                  <span>Envío a domicilio (A coordinar)</span>
                </label>
              </div>

              {/* Campos de Contacto */}
              <div>
                <input required type="text" placeholder="Nombre completo" value={userName} onChange={e => setUserName(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
              </div>
              <div>
                <input required type="email" placeholder="Correo electrónico" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
              </div>
              <div>
                <input required type="tel" placeholder="Teléfono / WhatsApp" value={userPhone} onChange={e => setUserPhone(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
              </div>

              {/* Campo de Envío Condicional */}
              {deliveryMethod === 'envio' && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                  <textarea 
                    required 
                    placeholder="Dirección completa y Código Postal. Ej: San Martín 123, CP 5500" 
                    value={shippingAddress} 
                    onChange={e => setShippingAddress(e.target.value)} 
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" 
                  />
                  <p className="text-[10px] text-stone-500 mt-1 leading-tight">Nos comunicaremos contigo por WhatsApp para coordinar el costo y horario de envío.</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isProcessingCheckout}
                className="w-full bg-[var(--color-brand-green)] text-white px-6 py-4 rounded-md font-medium hover:bg-[var(--color-brand-dark)] transition-colors uppercase tracking-wider shadow-md text-sm mt-4 disabled:opacity-70"
              >
                {isProcessingCheckout ? "Procesando..." : "Iniciar Pago Seguro"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
