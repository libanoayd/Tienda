"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Clock, Star, MapPin, CheckCircle, X } from "lucide-react";

export default function AdminConfiguracion() {
  const [schedule, setSchedule] = useState("Lunes a Sábados: 09:00 a 20:00 hs");
  const [rating, setRating] = useState("4.3");
  const [reviews, setReviews] = useState("164");
  const [address, setAddress] = useState("Suipacha 422, M5500 Mendoza, Argentina");
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("store_settings").select("*");
    if (data && data.length > 0) {
      data.forEach((item: { key: string; value: string }) => {
        if (item.key === "schedule") setSchedule(item.value);
        if (item.key === "google_rating") setRating(item.value);
        if (item.key === "google_reviews") setReviews(item.value);
        if (item.key === "address") setAddress(item.value);
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const settingsToSave = [
      { key: "schedule", value: schedule },
      { key: "google_rating", value: rating },
      { key: "google_reviews", value: reviews },
      { key: "address", value: address },
    ];

    for (const setting of settingsToSave) {
      await supabase.from("store_settings").upsert(setting, { onConflict: "key" });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-stone-900">Configuración de la Tienda</h1>
        <p className="text-stone-500 text-sm mt-1">
          Modifica tus horarios de atención, la puntuación de Google Maps y la dirección de tu local.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center shadow-sm">
          <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
          <span>¡Configuración guardada correctamente! La web ya refleja los nuevos datos.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-6">
        
        {/* Horarios */}
        <div>
          <label className="block font-medium text-stone-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[var(--color-brand-green)]" /> Horarios de Atención
          </label>
          
          <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
            {schedule.split('\n').map((line, index) => {
              const [daysPart, ...hoursPart] = line.split(':');
              const days = daysPart || '';
              const hours = hoursPart.join(':').trim() || '';

              return (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Días</label>
                    <input 
                      type="text" 
                      value={days}
                      onChange={(e) => {
                        const newLines = schedule.split('\n');
                        newLines[index] = `${e.target.value}: ${hours}`;
                        setSchedule(newLines.join('\n'));
                      }}
                      placeholder="Ej: Lunes a Viernes"
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-green)]"
                    />
                  </div>
                  <div className="w-full sm:flex-1">
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Horario</label>
                    <input 
                      type="text" 
                      value={hours}
                      onChange={(e) => {
                        const newLines = schedule.split('\n');
                        newLines[index] = `${days}: ${e.target.value}`;
                        setSchedule(newLines.join('\n'));
                      }}
                      placeholder="Ej: 09:00 a 13:00 hs y 16:30 a 18:30 hs"
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-green)]"
                    />
                  </div>
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        const newLines = schedule.split('\n');
                        newLines.splice(index, 1);
                        setSchedule(newLines.join('\n'));
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar fila"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                const newLines = schedule ? schedule.split('\n') : [];
                newLines.push("Nuevos Días: 00:00 a 00:00");
                setSchedule(newLines.join('\n'));
              }}
              className="mt-2 text-sm font-medium text-[var(--color-brand-green)] hover:text-[var(--color-brand-dark)] flex items-center bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm transition-colors"
            >
              + Agregar otro día/horario
            </button>
          </div>
        </div>

        {/* Puntuación de Google */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
          <div>
            <label className="block font-medium text-stone-900 mb-2 flex items-center">
              <Star className="h-5 w-5 mr-2 text-amber-500" /> Puntuación de Google Maps
            </label>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Ej: 4.3"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-stone-900 mb-2">
              Cantidad de Opiniones en Google
            </label>
            <input
              type="text"
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              placeholder="Ej: 164"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="pt-4 border-t border-stone-100">
          <label className="block font-medium text-stone-900 mb-2 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-[var(--color-brand-green)]" /> Dirección Exacta
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Suipacha 422, M5500 Mendoza, Argentina"
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
            required
          />
        </div>

        <div className="pt-6 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors shadow-md uppercase tracking-wider text-sm"
          >
            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
