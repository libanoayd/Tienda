import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-stone)] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-brand-dark)] mb-4">Visítanos en Nuestro Local</h1>
          <p className="text-stone-600 max-w-xl mx-auto">
            Vení a conocer todos nuestros aromas, probar las fragancias de los aceites y elegir tus objetos de decoración preferidos en persona.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          
          {/* Información de Contacto */}
          <div className="flex flex-col justify-between space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-[var(--color-brand-dark)] mb-6">Información del Local</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 bg-[var(--color-brand-stone)] text-[var(--color-brand-green)] rounded-lg mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Dirección Exacta</h3>
                    <p className="text-stone-700 font-medium">Pago Fácil Viajantes</p>
                    <p className="text-stone-600">Suipacha 422, M5500 Mendoza, Argentina.</p>
                    <p className="text-xs text-[var(--color-brand-green)] font-bold mt-1">✓ Retiro GRATIS de compras web en el local.</p>
                  </div>
                </div>

                {/* Badge de Reseñas de Google */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold">
                      <span className="text-lg text-stone-900 mr-2">4.3</span>
                      ★ ★ ★ ★ ☆
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">164 opiniones reales en Google Maps</p>
                  </div>
                  <span className="text-xs bg-white text-stone-700 font-semibold px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                    Perfil Verificado
                  </span>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-[var(--color-brand-stone)] text-[var(--color-brand-green)] rounded-lg mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Horarios de Atención</h3>
                    <p className="text-stone-600">Abre a las 9:00 a.m. (Lunes a Sábados).</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-[var(--color-brand-stone)] text-[var(--color-brand-green)] rounded-lg mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Atención Directa por WhatsApp</h3>
                    <p className="text-stone-600">+54 9 261 252-6299</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/5492612526299?text=Hola,%20quisiera%20saber%20si%20tienen%20stock%20de..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-all rounded-xl shadow-lg font-medium text-sm uppercase tracking-wider"
            >
              <MessageCircle className="mr-3 h-5 w-5" /> Enviar WhatsApp al Local
            </a>
          </div>

          {/* Mapa Interactivo de Google Maps centrado en Suipacha 422 */}
          <div className="h-[420px] w-full rounded-xl overflow-hidden border border-stone-200 relative shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.254189381!2d-68.8471904!3d-32.8856641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09214ab3b379%3A0x7d6f51950d995c7!2sSuipacha%20422%2C%20M5500%20Mendoza!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
