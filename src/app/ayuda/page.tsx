import Link from "next/link";
import { ArrowRight, Truck, RefreshCw, CreditCard, HelpCircle } from "lucide-react";

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-stone)] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-brand-dark)] mb-6">
            Centro de Ayuda
          </h1>
          <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto">
            Resolvé todas tus dudas sobre envíos, pagos y devoluciones. 
            Queremos que tu experiencia de compra sea perfecta.
          </p>
        </div>

        <div className="space-y-16">
          {/* FAQ Section */}
          <section id="faq" className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 bg-stone-50 rounded-full flex items-center justify-center mr-4">
                <HelpCircle className="h-6 w-6 text-[var(--color-brand-terra)]" />
              </div>
              <h2 className="text-2xl font-serif text-stone-900">Preguntas Frecuentes</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">¿Tienen local físico?</h3>
                <p className="text-stone-600 leading-relaxed">
                  ¡Sí! Tenemos nuestra sucursal física ubicada en Suipacha 422, Mendoza. Te esperamos para que puedas conocer y probar todos nuestros aromas en persona.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">¿Venden por mayor?</h3>
                <p className="text-stone-600 leading-relaxed">
                  Sí, contamos con precios especiales para ventas mayoristas. Por favor contactanos directamente por WhatsApp o a nuestro mail para recibir el catálogo mayorista y las condiciones.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">¿Es seguro comprar en la web?</h3>
                <p className="text-stone-600 leading-relaxed">
                  Totalmente. Tu pago es procesado de forma 100% segura a través de Mercado Pago, y nosotros no almacenamos los datos de tus tarjetas de crédito ni débito.
                </p>
              </div>
            </div>
          </section>

          {/* Envíos Section */}
          <section id="envios" className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 bg-stone-50 rounded-full flex items-center justify-center mr-4">
                <Truck className="h-6 w-6 text-[var(--color-brand-green)]" />
              </div>
              <h2 className="text-2xl font-serif text-stone-900">Políticas de Envío</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Métodos y Tiempos de Entrega</h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Realizamos envíos a todo el país a través de Oca y Correo Argentino. Una vez despachado el pedido:
                </p>
                <ul className="list-disc pl-5 text-stone-600 space-y-2">
                  <li><strong>Envíos a Mendoza:</strong> Suelen demorar entre 1 y 3 días hábiles.</li>
                  <li><strong>Resto del país:</strong> La demora habitual es de 3 a 7 días hábiles, dependiendo de tu localidad.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Seguimiento de tu paquete</h3>
                <p className="text-stone-600 leading-relaxed">
                  Cuando tu pago se confirma y armamos tu pedido, te enviaremos por email el código de seguimiento (tracking number) para que sepas en todo momento dónde se encuentra tu paquete.
                </p>
              </div>
            </div>
          </section>

          {/* Devoluciones Section */}
          <section id="devoluciones" className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 bg-stone-50 rounded-full flex items-center justify-center mr-4">
                <RefreshCw className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif text-stone-900">Cambios y Devoluciones</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">¿Qué pasa si mi pedido llega roto?</h3>
                <p className="text-stone-600 leading-relaxed">
                  Embalamos cada producto con extremo cuidado utilizando material anti-impactos. Sin embargo, si algún producto sufriera un daño durante el traslado, por favor contactanos dentro de las 48hs de recibido con fotos del producto y la caja, para que podamos brindarte una solución o reemplazo inmediato.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">¿Puedo cambiar un producto?</h3>
                <p className="text-stone-600 leading-relaxed">
                  Los productos aromáticos (difusores, velas que hayan sido encendidas, sahumerios abiertos) no tienen cambio por una cuestión de higiene y calidad garantizada. Para el resto de artículos de decoración, tenés 15 días corridos desde la recepción de la compra para solicitar un cambio. Los costos de envío de ida y vuelta corren por cuenta del cliente.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="text-stone-500 mb-6">¿Todavía tenés dudas?</p>
          <Link 
            href="/contacto" 
            className="inline-flex items-center px-8 py-4 bg-[var(--color-brand-dark)] text-white font-medium hover:bg-[var(--color-brand-terra)] transition-colors uppercase tracking-wider text-sm shadow-lg rounded-sm"
          >
            Contactanos por WhatsApp
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
