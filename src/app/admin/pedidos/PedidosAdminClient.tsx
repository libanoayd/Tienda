"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, CheckCircle, Clock, XCircle } from "lucide-react";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  product?: { image_url: string };
}

interface Order {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  total: number;
  status: string;
  payment_id: string;
  delivery_method?: string;
  shipping_address?: string;
  created_at: string;
  items?: OrderItem[];
}

export default function PedidosAdminClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    // Fetch orders and their items with product image
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product:products(image_url)
        )
      `)
      .neq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && ordersData) {
      const mappedOrders = ordersData.map(o => ({
        ...o,
        items: o.order_items
      }));
      setOrders(mappedOrders);
    }
    setLoading(false);
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending": return <Clock className="h-5 w-5 text-orange-500" />;
      case "cancelled": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-stone-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Pagado";
      case "pending": return "Pendiente";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 flex items-center">
            <ShoppingCart className="mr-3 text-[var(--color-brand-green)]" />
            Pedidos
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Administra las ventas y órdenes de tu tienda.
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md text-sm hover:bg-stone-300 transition"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-500">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-stone-500">No hay pedidos registrados aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">ID Pedido</th>
                  <th className="p-4 font-medium">Fecha</th>
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium">Entrega</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-medium text-stone-900">#{order.id}</td>
                      <td className="p-4 text-stone-500">
                        {new Date(order.created_at).toLocaleDateString("es-AR", {
                          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-stone-900">{order.user_name}</div>
                        <div className="text-xs text-stone-500">{order.user_phone}</div>
                        <div className="text-xs text-stone-500">{order.user_email}</div>
                      </td>
                      <td className="p-4">
                        {order.delivery_method === 'envio' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Envío a Domicilio
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-200 text-stone-800">
                            Retiro Local
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-[var(--color-brand-terra)]">
                        ${order.total.toLocaleString("es-AR")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className="font-medium text-stone-700">{getStatusLabel(order.status)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="text-[var(--color-brand-green)] hover:text-[var(--color-brand-dark)] text-xs font-semibold uppercase tracking-wider"
                        >
                          {expandedOrder === order.id ? "Ocultar Detalles" : "Ver Detalles"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr className="bg-stone-50 border-t-0">
                        <td colSpan={7} className="p-6">
                          
                          {order.delivery_method === 'envio' && order.shipping_address && (
                            <div className="mb-6 p-4 bg-white border border-blue-100 rounded-md">
                              <h4 className="font-bold text-stone-900 mb-1 uppercase text-xs tracking-wider text-blue-800">Dirección de Envío</h4>
                              <p className="text-stone-700 whitespace-pre-line">{order.shipping_address}</p>
                            </div>
                          )}

                          <h4 className="font-bold text-stone-900 mb-4 uppercase text-xs tracking-wider">Artículos del Pedido</h4>
                          <ul className="space-y-4">
                            {order.items?.map(item => (
                              <li key={item.id} className="flex justify-between text-sm items-center">
                                <div className="flex items-center">
                                  {item.product?.image_url ? (
                                    <img src={item.product.image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded-md mr-4 border border-stone-200" />
                                  ) : (
                                    <div className="w-12 h-12 bg-stone-200 rounded-md mr-4 flex items-center justify-center text-stone-400 text-xs">Sin foto</div>
                                  )}
                                  <span className="font-medium">{item.quantity}x {item.product_name}</span>
                                </div>
                                <span className="text-stone-500">${item.price.toLocaleString("es-AR")}</span>
                              </li>
                            ))}
                          </ul>
                          {order.payment_id && (
                            <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-500">
                              Ref. MercadoPago: {order.payment_id}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
