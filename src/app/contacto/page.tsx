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
                    <h3 className="font-semibold text-stone-900">Dirección y Retiros</h3>
                    <p className="text-stone-600">Pago Fácil Viajantes, Mendoza, Argentina.</p>
                    <p className="text-xs text-[var(--color-brand-green)] font-bold mt-1">✓ Retiro GRATIS de compras web aquí.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-[var(--color-brand-stone)] text-[var(--color-brand-green)] rounded-lg mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Horarios de Atención</h3>
                    <p className="text-stone-600">Lunes a Sábados: 09:00 a 20:00 hs.</p>
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

          {/* Mapa Interactivo de Google Maps */}
          <div className="h-[400px] w-full rounded-xl overflow-hidden border border-stone-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.567!2d-68.8471!3d-32.8894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e093d!2sMendoza!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
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
