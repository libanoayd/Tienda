# Líbano | Aromas y Decoración - E-commerce

Este es el repositorio oficial del e-commerce para **Líbano Aromas y Decoración**. Construido con tecnologías modernas para asegurar velocidad, SEO, escalabilidad y una excelente experiencia de usuario.

## 🚀 Tecnologías Utilizadas
* **Framework:** Next.js 14 (App Router)
* **Estilos:** Tailwind CSS
* **Estado Global (Carrito):** Zustand
* **Base de Datos & Auth:** Supabase (PostgreSQL)
* **Pasarela de Pago:** Mercado Pago SDK v2
* **Iconos:** Lucide React
* **Hosting:** Vercel

## 📦 Características Implementadas

### Interfaz Pública y Ventas
- **Portada Dinámica:** Se conecta a Supabase para mostrar en tiempo real los últimos 4 productos agregados al inventario.
- **Catálogo Inteligente:** Filtros por categoría y subcategorías jerárquicas.
- **Carrito de Compras (Zustand):** Sidebar lateral para gestionar cantidades, aplicar cupones de descuento y visualizar totales sin recargar la página.
- **Páginas Informativas:** Sección "Nosotros" detallando la filosofía de la marca e información de Contacto/Ubicación interactiva.
- **Botón de WhatsApp:** Integrado para consultas rápidas.

### 💳 Checkout y Pagos (Mercado Pago)
- **Integración de Preferencias MP:** Cálculo exacto de precios y descuentos enviados a la pasarela con `auto_return` dinámico basado en el entorno de ejecución (Vercel).
- **Manejo de Errores Detallado:** Captura de fallos de la API de Mercado Pago para notificar al cliente el motivo exacto del rechazo.
- **Páginas de Retorno Automático:**
  - `pago-exitoso`: Vacía el carrito automáticamente y le otorga un "Número de Orden" claro al cliente.
  - `pago-pendiente`: Para pagos en efectivo (RapiPago / PagoFácil).
  - `pago-fallido`: Permite volver a intentar el pago.
- **Opciones de Entrega:** El cliente puede seleccionar en el carrito entre **Retiro en Local (Gratis)** o **Envío a Domicilio (A coordinar)**.

### ⚙️ Panel de Administrador (`/admin`)
- **Dashboard Estadístico:** Métricas en tiempo real conectadas a Supabase.
- **Gestión de Pedidos:** 
  - Visualización de compras con fotos miniatura de cada artículo de la orden.
  - Identificación del método de entrega (Retiro / Envío).
  - Resaltado de la dirección de envío del cliente.
  - Generación de Número de Orden atado a Mercado Pago.
- **Inventario y Productos:** ABM (Alta, Baja, Modificación) conectado a Supabase con control de stock real.
- **Gestión de Categorías:** Soporte para Subcategorías (jerarquías `parent_id` en Supabase).
- **Configuración de Tienda:** Permite cambiar fácilmente (en múltiples líneas) el horario de atención de la tienda física (ej. Lunes a Viernes de 09:00 a 13:00 y de 16:30 a 18:30).

## 🛠️ Configuración Inicial
Si vas a clonar el repositorio, asegúrate de configurar las siguientes variables en un archivo `.env.local` y en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
MP_ACCESS_TOKEN=tu_access_token_de_mercado_pago
```

El esquema completo de la base de datos se encuentra en `database_schema.sql` (Ejecutar en el SQL Editor de Supabase).

## 📷 ¿Dónde almacenar las fotos de los productos?
1. **Opción A (Archivos locales):** Puedes guardar imágenes dentro de `public/productos/`. La URL a registrar en el panel será `/productos/nombre.jpg`.
2. **Opción B (Recomendada - Supabase Storage):** Sube la foto a un Bucket (ej. `products-images`) en Supabase y pega la URL pública generada directamente en la ficha del producto en el panel de administrador.
