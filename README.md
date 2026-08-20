# Líbano | Aromas y Decoración - E-commerce

Este es el repositorio oficial del e-commerce para **Líbano Aromas y Decoración**. Construido con tecnologías modernas para asegurar velocidad, SEO, escalabilidad y una excelente experiencia de usuario.

## 🚀 Tecnologías Utilizadas
* **Framework:** Next.js 14 (App Router)
* **Estilos:** Tailwind CSS
* **Estado Global (Carrito):** Zustand
* **Base de Datos & Auth:** Supabase (PostgreSQL)
* **Pasarela de Pago:** Mercado Pago SDK v3
* **Cotizador de Envíos:** Zipnova API v2
* **Iconos:** Lucide React
* **Hosting:** Vercel

## 📦 Características Implementadas

### Interfaz Pública y Ventas
- **Portada Dinámica:** Se conecta a Supabase para mostrar en tiempo real los últimos 4 productos agregados al inventario.
- **Catálogo Inteligente Recursivo:** Filtros por categoría que incluyen automáticamente todos los productos de las subcategorías "hijas" asociadas.
- **Carrito de Compras (Zustand):** Sidebar lateral ultra optimizado para gestionar cantidades y precios dinámicamente.
- **Páginas Informativas:** Sección "Nosotros" detallando la filosofía de la marca e información de Contacto/Ubicación interactiva.
- **Botón de WhatsApp:** Integrado para consultas rápidas.

### 🚚 Envíos y Logística
- **Cotizador Automático (Zipnova):** Al ingresar el Código Postal en el carrito, el sistema se conecta por detrás de escena a Zipnova para ofrecer tarifas reales (Correo Argentino, Andreani, OCA, etc.) basadas en el valor del carrito para asegurar el paquete.
- **Suma al Checkout:** El costo de logística seleccionado se suma automáticamente a la pasarela de pagos.
- **Retiro en Local:** Opción gratuita que no requiere código postal.

### 💳 Checkout, Pagos y Promociones
- **Integración de Preferencias Mercado Pago:** Cálculo exacto de precios. Parche dinámico del `origin` para evitar errores de URLs en `auto_return` tanto en producción como local.
- **Cupones Multi-nivel:** Soporte para cupones que aplican descuentos globales, descuentos exclusivos para toda una categoría, o descuentos enfocados a un único producto específico.
- **Páginas de Retorno Automático:** Vaciado de carrito y confirmación visual al volver desde Mercado Pago.

### ⚙️ Panel de Administrador (`/admin`)
- **Dashboard Estadístico:** Métricas en tiempo real conectadas a Supabase.
- **Gestión Inteligente de Pedidos:** 
  - Visualización de compras con fotos de cada artículo, ocultando automáticamente los "Carritos abandonados" (pedidos pendientes sin pagar) para mantener limpio el panel.
- **Gestión de Categorías Recursivas:** Creación de subcategorías con validación anti-ciclos infinitos (una categoría no puede ser hija de sí misma). Interfaz con indentado visual (`└`) en forma de árbol.
- **Inventario y Productos:** ABM completo conectado a Supabase.
- **Configuración de Tienda:** Horarios editables dinámicamente.

## 🛠️ Configuración Inicial
Si vas a clonar el repositorio, asegúrate de configurar las siguientes variables en un archivo `.env.local` y en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
MP_ACCESS_TOKEN=tu_access_token_de_mercado_pago
```

El esquema completo de la base de datos se encuentra en `database_schema.sql` (Ejecutar en el SQL Editor de Supabase).

## 📷 Almacenamiento
Imágenes servidas gratuitamente mediante enlaces directos optimizados (`?sz=w800`) desde Google Drive, sin costos de hosting por almacenamiento en Supabase/Vercel.
