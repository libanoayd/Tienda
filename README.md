# Líbano | Aromas y Decoración - E-commerce

Este es el repositorio oficial del e-commerce para **Líbano Aromas y Decoración**. Construido con tecnologías modernas para asegurar velocidad, SEO y una excelente experiencia de usuario.

## 🛠 Tecnologías Utilizadas
* **Framework:** Next.js 14 (App Router)
* **Estilos:** Tailwind CSS
* **Estado Global (Carrito):** Zustand
* **Base de Datos & Auth:** Supabase (PostgreSQL)
* **Pasarela de Pago:** Mercado Pago SDK v2
* **Iconos:** Lucide React
* **Hosting:** Vercel

## 🚀 Actualizaciones y Progreso (Changelog)

### Fase 1: Estructura Base y Diseño
- [x] Instalación de Next.js y Tailwind CSS.
- [x] Configuración de Paleta de Colores oficial (`globals.css`) extraída del manual de marca SVG.
  - Verde Cerceta (`#207473`), Verde Bosque (`#133C37`), Dorado (`#E2B370`), Terracota (`#E65B3A`).
- [x] Incorporación del logo transparente oficial (SVG / PNG).

### Fase 2: Navegación y UI
- [x] Barra de navegación (`Navbar.tsx`) adaptativa: transparente con sombra sobre la portada y fondo blanco sólido con tipografía verde bosque (`#133C37`) en páginas internas (Catálogo, Contacto). Oculta en `/admin`.
- [x] Integración de reputación oficial de Google Business: **4.3 ★★★★★ (164 opiniones)** y ubicación exacta en **Suipacha 422, Mendoza**.
- [x] Botón flotante de WhatsApp configurado con el número oficial (`+5492612526299`).
- [x] Portada (Hero) dinámica con fotografía de alta calidad que representa el nicho del negocio.

### Fase 3: Catálogo y Carrito de Compras
- [x] Creación de `ProductCard.tsx` con efecto hover y botón de "Añadir rápido".
- [x] Implementación de **Zustand** (`store/cartStore.ts`) para manejar el estado del carrito sin recargar la página.
- [x] Barra lateral deslizable (Sidebar) para el carrito de compras.
- [x] Creación de la página oficial de Catálogo (`/catalogo`) con filtros dinámicos por sección y búsqueda.

### Fase 4: Pagos (Checkout)
- [x] Integración del SDK de **Mercado Pago** en el backend.
- [x] Creación del endpoint `/api/checkout` que genera la Preferencia de Pago en base a los ítems del carrito y devuelve el link de redirección.

### Fase 5: Panel de Administración (Gestión Interactiva & Variaciones)
- [x] Maquetado del panel de control privado (`/admin`) protegido por contraseña (`32840802`).
- [x] Módulo de **Gestión de Productos** (`/admin/productos`) con soporte para variaciones de **Marcas** (*Sagrada Madre, Just, Tera India*) y **Presentación** (*Caja x 8 varillas, 10ml, etc.*).
- [x] Módulo de **Cupones de Descuento** (`/admin/cupones`).
- [x] Esquema de Base de Datos completo en `database_schema.sql`.

## 📸 Guía: ¿Dónde almacenar las fotos de los productos?
Para almacenar y subir las fotos de tus productos:
1. **Opción A (Archivos locales en la carpeta `public`):**
   Puedes guardar las imágenes de tus productos dentro de la carpeta `public/productos/` del proyecto. Al ingresar en el panel de control, la URL será `/productos/nombre-de-foto.png`.
2. **Opción B (Supabase Storage / Cloudflare R2):**
   Dentro de tu panel de Supabase o Cloudflare R2, subes la foto del producto y usas la URL pública directa que te proporciona el sistema.

## ⚙️ Pasos Siguientes
1. Correr el nuevo código de `database_schema.sql` en el SQL Editor de Supabase.
2. Cargar los productos reales con sus marcas y presentaciones desde `/admin/productos`.
