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
- [x] Barra de navegación (`Navbar.tsx`) con efecto transparente inicial y transición a blanco al hacer scroll (sticky). Oculta automáticamente en la sección administrativa `/admin`.
- [x] Botón flotante de WhatsApp configurado con el número oficial (`+5492612526299`).
- [x] Portada (Hero) dinámica con fotografía de alta calidad generada por IA que representa el nicho del negocio.

### Fase 3: Catálogo y Carrito de Compras
- [x] Creación de `ProductCard.tsx` con efecto hover y botón de "Añadir rápido".
- [x] Implementación de **Zustand** (`store/cartStore.ts`) para manejar el estado del carrito sin recargar la página.
- [x] Barra lateral deslizable (Sidebar) para el carrito de compras.
- [x] Creación de la página oficial de Catálogo (`/catalogo`) con botones de filtro por categorías.

### Fase 4: Pagos (Checkout)
- [x] Integración del SDK de **Mercado Pago** en el backend.
- [x] Creación del endpoint `/api/checkout` que genera la Preferencia de Pago en base a los ítems del carrito y devuelve el link de redirección.

### Fase 5: Panel de Administración (Gestión Interactiva)
- [x] Maquetado del panel de control privado (`/admin`) con métricas y diseño responsivo.
- [x] Creación del módulo de **Gestión de Productos** (`/admin/productos`):
  - Creación de nuevos productos.
  - Edición en tiempo real de nombres y precios.
  - Eliminación de productos.
- [x] Creación de `database_schema.sql` para inicialización de la base de datos de Supabase.
- [x] Conexión activa con el cliente de Supabase (`lib/supabase.ts`) usando las llaves de producción.

## ⚙️ Pasos Siguientes
1. Ejecutar el código SQL en Supabase para habilitar las tablas de producción.
2. Cargar los primeros productos reales mediante la interfaz de `/admin/productos`.
