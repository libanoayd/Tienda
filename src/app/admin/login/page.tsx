"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Contraseña establecida por el usuario
    if (password === "32840802") {
      localStorage.setItem("libano_admin_auth", "true");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-dark)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-[var(--color-brand-stone)] text-[var(--color-brand-green)] rounded-full mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-serif text-stone-900">LÍBANO Admin</h1>
          <p className="text-stone-500 text-sm mt-1">Ingresa tu contraseña para administrar la tienda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-2">
              Contraseña Secreta
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none text-center text-lg tracking-widest"
              required
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 text-center">
                Contraseña incorrecta. Inténtalo de nuevo.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors uppercase tracking-wider text-sm shadow-md"
          >
            Ingresar al Panel
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
