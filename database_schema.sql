-- Limpiar tablas si existieran antes
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;

-- 1. Tabla de Categorías / Secciones
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla de Productos con Variaciones (Marca, Presentación, Stock)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT, -- Ej: Sagrada Madre, Just, Tera India
  presentation TEXT, -- Ej: Caja x 8 varillas, Frasco 10ml, Unidad
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Cupones de Descuento (Todo el sitio o Categoría seleccionada)
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL,
  target_type TEXT DEFAULT 'all', -- 'all' (Todo el sitio) o 'category' (Categoría seleccionada)
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabla de Configuración de la Tienda (Horarios, Puntuación Google, Dirección)
CREATE TABLE store_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

-- 5. Tabla de Órdenes / Pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_email TEXT,
  user_phone TEXT,
  user_name TEXT,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  payment_id TEXT,
  delivery_method TEXT, -- 'retiro' or 'envio'
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Items de cada Orden
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- Insertar Configuración Inicial
INSERT INTO store_settings (key, value) VALUES
('schedule', 'Lunes a Sábados: 09:00 a 20:00 hs'),
('address', 'Suipacha 422, M5500 Mendoza, Argentina'),
('google_rating', '4.3'),
('google_reviews', '164')
ON CONFLICT (key) DO NOTHING;

-- Habilitar Seguridad (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura pública para administración directa
CREATE POLICY "Productos visibles para todos" ON products FOR SELECT USING (true);
CREATE POLICY "Categorías visibles para todos" ON categories FOR SELECT USING (true);
CREATE POLICY "Cupones visibles para todos" ON coupons FOR SELECT USING (true);
CREATE POLICY "Configuración visible para todos" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Órdenes visibles para todos" ON orders FOR SELECT USING (true);
CREATE POLICY "Items de orden visibles para todos" ON order_items FOR SELECT USING (true);

CREATE POLICY "Permitir todo en productos" ON products FOR ALL USING (true);
CREATE POLICY "Permitir todo en categorías" ON categories FOR ALL USING (true);
CREATE POLICY "Permitir todo en cupones" ON coupons FOR ALL USING (true);
CREATE POLICY "Permitir todo en configuracion" ON store_settings FOR ALL USING (true);
CREATE POLICY "Permitir todo en órdenes" ON orders FOR ALL USING (true);
CREATE POLICY "Permitir todo en items de orden" ON order_items FOR ALL USING (true);

-- Insertar Categorías Principales
INSERT INTO categories (name, slug) VALUES 
('Sahumerios e Inciensos', 'sahumerios'),
('Aromaterapia y Aceites', 'aromaterapia'),
('Decoración Espiritual', 'deco-espiritual'),
('Hogar y Accesorios', 'hogar');

-- Insertar algunos productos reales de ejemplo
INSERT INTO products (name, brand, presentation, price, image_url, category_id, stock) VALUES
('Incienso Natural Yagra', 'Sagrada Madre', 'Caja x 8 varillas', 4500, '/productos/yagra.png', 1, 10),
('Palo Santo y Lavanda', 'Sagrada Madre', 'Caja x 8 varillas', 4900, '/productos/palo-santo.png', 1, 5),
('Aceite Esencial Naranja 10ml', 'Just', 'Frasco 10ml', 15200, '/productos/incienso.png', 2, 0),
('Buda Flujo Inverso con Velón', 'Líbano Deco', 'Unidad completa', 12500, '/productos/conos.png', 3, 2);
