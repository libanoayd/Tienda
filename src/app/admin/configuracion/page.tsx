"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Clock, Star, MapPin, CheckCircle } from "lucide-react";

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
          <label className="block font-medium text-stone-900 mb-2 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[var(--color-brand-green)]" /> Horarios de Atención
          </label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Ej: Lunes a Sábados: 09:00 a 20:00 hs"
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
            required
          />
          <p className="text-xs text-stone-500 mt-1">Este texto aparecerá en la sección de contacto del local.</p>
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
