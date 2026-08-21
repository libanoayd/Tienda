"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Tag, CheckCircle, ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal } = useCartStore();

  // Redirigir al inicio si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  // State (copiado de lo que estaba en CartSidebar)
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; targetType: string; categoryId?: number | null; productId?: number | null } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<'retiro' | 'envio'>('retiro');
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [zipcode, setZipcode] = useState("");
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<any | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  if (items.length === 0) {
    return null; // El useEffect redirigirá
  }

  const handleQuoteShipping = async () => {
    if (!zipcode.trim()) return;
    setIsQuoting(true);
    setQuoteError("");
    setShippingRates([]);
    setSelectedShippingOption(null);

    try {
      const res = await fetch("/api/zipnova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          destinationZip: zipcode.trim(),
          cartTotal: getCartTotal()
        })
      });
      const data = await res.json();
      
      if (data.error || (!data.rates && !data.all_results)) {
        setQuoteError("No se pudieron obtener opciones de envío para este CP.");
      } else {
        const ratesArray = data.all_results || data.rates || [];
        const validRates = ratesArray
          .filter((r: any) => r.amounts && r.amounts.price_incl_tax)
          .sort((a: any, b: any) => a.amounts.price_incl_tax - b.amounts.price_incl_tax);
        
        if (validRates.length === 0) {
          setQuoteError("No hay opciones de envío disponibles para este CP.");
        } else {
          setShippingRates(validRates);
          setSelectedShippingOption(validRates[0]); // más barato por defecto
        }
      }
    } catch (err) {
      setQuoteError("Error de conexión al cotizar el envío.");
    } finally {
      setIsQuoting(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplying(true);
    setCouponError("");

    const cleanCode = couponCode.trim().toUpperCase();

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
        productId: data.product_id,
      });
      setCouponError("");
    }
    setApplying(false);
  };

  const calculateDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const { discount, targetType, categoryId, productId } = appliedCoupon;
    
    let applicableTotal = 0;

    if (targetType === "all") {
      applicableTotal = getCartTotal();
    } else if (targetType === "category" && categoryId) {
      applicableTotal = items.reduce((total, item) => {
        return item.category_id === categoryId ? total + (item.price * item.quantity) : total;
      }, 0);
    } else if (targetType === "product" && productId) {
      applicableTotal = items.reduce((total, item) => {
        return item.id === productId ? total + (item.price * item.quantity) : total;
      }, 0);
    }

    return (applicableTotal * discount) / 100;
  };

  const subtotal = getCartTotal();
  const discountAmount = calculateDiscountAmount();
  const shippingCost = deliveryMethod === 'envio' && selectedShippingOption ? selectedShippingOption.amounts.price_incl_tax : 0;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCheckout(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items, 
          total: finalTotal,
          discountAmount: discountAmount,
          userInfo: {
            name: userName,
            email: userEmail,
            phone: userPhone,
          },
          deliveryInfo: {
            method: deliveryMethod,
            address: deliveryMethod === 'envio' ? shippingAddress : null,
            zipcode: deliveryMethod === 'envio' ? zipcode : null,
            carrier: deliveryMethod === 'envio' && selectedShippingOption ? selectedShippingOption.carrier.name : null,
            service: deliveryMethod === 'envio' && selectedShippingOption ? selectedShippingOption.service_type.name : null,
            cost: shippingCost
          }
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details ? `${data.error}: ${JSON.stringify(data.details)}` : data.error || "Error al procesar el pago");
      }
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error(data.error || "Hubo un error al iniciar el pago.");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Hubo un error al iniciar el pago.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-stone)] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/catalogo" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-[var(--color-brand-green)] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a la tienda
        </Link>

        <h1 className="text-3xl font-serif text-[var(--color-brand-dark)] mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              
              {/* Sección 1: Datos de Contacto */}
              <section>
                <h2 className="text-lg font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">1. Tus datos de contacto</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nombre y Apellido</label>
                    <input required type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                      <input required type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono (WhatsApp)</label>
                      <input required type="tel" value={userPhone} onChange={e => setUserPhone(e.target.value)} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 2: Método de Entrega */}
              <section>
                <h2 className="text-lg font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">2. Entrega</h2>
                
                <div className="space-y-3 mb-6">
                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${deliveryMethod === 'retiro' ? 'border-[var(--color-brand-green)] bg-green-50/30' : 'border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" checked={deliveryMethod === 'retiro'} onChange={() => { setDeliveryMethod('retiro'); setQuoteError(""); }} className="h-4 w-4 text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)] border-stone-300" />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-stone-900">Retiro en el local</span>
                        <span className="block text-xs text-stone-500">Gratis - Pago Fácil Viajantes</span>
                      </div>
                    </div>
                  </label>
                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${deliveryMethod === 'envio' ? 'border-[var(--color-brand-green)] bg-green-50/30' : 'border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" checked={deliveryMethod === 'envio'} onChange={() => { setDeliveryMethod('envio'); setSelectedShippingOption(null); }} className="h-4 w-4 text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)] border-stone-300" />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-stone-900">Envío a domicilio</span>
                        <span className="block text-xs text-stone-500">Calculado en el siguiente paso</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Detalles de Envío */}
                {deliveryMethod === 'envio' && (
                  <div className="bg-stone-50 p-4 sm:p-6 rounded-lg border border-stone-200 animate-in fade-in space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Código Postal</label>
                      <div className="flex space-x-2">
                        <input type="text" value={zipcode} onChange={e => setZipcode(e.target.value)} placeholder="Ej: 2700" className="w-1/2 px-4 py-2 border border-stone-300 rounded-lg focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
                        <button type="button" onClick={handleQuoteShipping} disabled={isQuoting || !zipcode.trim()} className="px-4 py-2 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50">
                          {isQuoting ? "Cotizando..." : "Cotizar Envío"}
                        </button>
                      </div>
                      {quoteError && <p className="text-red-500 text-sm mt-2">{quoteError}</p>}
                    </div>

                    {shippingRates.length > 0 && (
                      <div className="pt-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Selecciona una opción de envío:</label>
                        <div className="space-y-2">
                          {shippingRates.map((rate, idx) => (
                            <label key={idx} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedShippingOption === rate ? 'border-[var(--color-brand-green)] bg-white shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                              <div className="flex items-center space-x-3">
                                <input type="radio" checked={selectedShippingOption === rate} onChange={() => setSelectedShippingOption(rate)} className="h-4 w-4 text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)] border-stone-300" />
                                <div>
                                  <p className="text-sm font-semibold text-stone-900">{rate.carrier.name}</p>
                                  <p className="text-xs text-stone-500">{rate.service_type.name}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-stone-900">${rate.amounts.price_incl_tax.toLocaleString('es-AR')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedShippingOption && (
                      <div className="pt-2">
                        <label className="block text-sm font-medium text-stone-700 mb-1">Dirección completa</label>
                        <input required type="text" placeholder="Calle, Número, Piso, Depto, Localidad" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
                      </div>
                    )}
                  </div>
                )}
              </section>

            </form>
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Resumen del pedido */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 sticky top-24">
              <h2 className="text-lg font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto stylish-scroll pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative h-16 w-16 rounded-md bg-stone-50 border border-stone-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      <span className="absolute -top-2 -right-2 bg-stone-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-stone-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm font-bold text-[var(--color-brand-terra)] mt-1">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cupones */}
              <form onSubmit={handleApplyCoupon} className="mb-6 pt-4 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center">
                  <Tag className="h-3.5 w-3.5 mr-1 text-[var(--color-brand-green)]" /> Cupón de descuento
                </label>
                <div className="flex space-x-2">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Ej: LIBANO10" className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-md uppercase focus:ring-[var(--color-brand-green)] focus:border-[var(--color-brand-green)]" />
                  <button type="submit" disabled={applying || !couponCode.trim()} className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-md uppercase hover:bg-stone-800 transition-colors disabled:opacity-50">
                    {applying ? "..." : "Aplicar"}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              </form>

              {/* Totales */}
              <div className="space-y-3 pt-4 border-t border-stone-100 text-sm">
                <div className="flex justify-between text-stone-600">
                  <p>Subtotal</p>
                  <p className="font-medium">${subtotal.toLocaleString('es-AR')}</p>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[var(--color-brand-green)]">
                    <p className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" /> Cupón ({appliedCoupon.discount}%)
                    </p>
                    <p className="font-medium">-${discountAmount.toLocaleString('es-AR')}</p>
                  </div>
                )}

                {deliveryMethod === 'envio' && selectedShippingOption && (
                  <div className="flex justify-between text-stone-600">
                    <p>Envío ({selectedShippingOption.carrier.name})</p>
                    <p className="font-medium">${shippingCost.toLocaleString('es-AR')}</p>
                  </div>
                )}

                <div className="flex justify-between items-end pt-4 border-t border-stone-100">
                  <p className="text-base font-bold text-stone-900">Total</p>
                  <p className="text-2xl font-bold text-[var(--color-brand-terra)]">${finalTotal.toLocaleString('es-AR')}</p>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessingCheckout || (deliveryMethod === 'envio' && (!selectedShippingOption || !shippingAddress.trim()))}
                className="w-full mt-8 flex items-center justify-center px-6 py-4 bg-[#009EE3] text-white font-medium hover:bg-[#008ACB] transition-colors shadow-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingCheckout ? (
                  <span className="flex items-center">Procesando...</span>
                ) : (
                  <span className="flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5" /> Pagar con Mercado Pago
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
