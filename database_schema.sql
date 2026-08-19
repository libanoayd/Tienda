-- Limpiar tablas si existieran antes
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Tabla de Categorías
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
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

-- 3. Tabla de Cupones de Descuento
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Seguridad (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura pública para administración directa
CREATE POLICY "Productos visibles para todos" ON products FOR SELECT USING (true);
CREATE POLICY "Categorías visibles para todos" ON categories FOR SELECT USING (true);
CREATE POLICY "Cupones visibles para todos" ON coupons FOR SELECT USING (true);

CREATE POLICY "Permitir todo en productos" ON products FOR ALL USING (true);
CREATE POLICY "Permitir todo en categorías" ON categories FOR ALL USING (true);
CREATE POLICY "Permitir todo en cupones" ON coupons FOR ALL USING (true);

-- Insertar Categorías Principales
INSERT INTO categories (name, slug) VALUES 
('Sahumerios e Inciensos', 'sahumerios'),
('Aromaterapia y Aceites', 'aromaterapia'),
('Decoración Espiritual', 'deco-espiritual'),
('Hogar y Accesorios', 'hogar');

-- Insertar algunos productos reales de ejemplo con sus marcas y presentaciones
INSERT INTO products (name, brand, presentation, price, image_url, category_id) VALUES
('Incienso Natural Yagra', 'Sagrada Madre', 'Caja x 8 varillas', 4500, '/productos/yagra.png', 1),
('Palo Santo y Lavanda', 'Sagrada Madre', 'Caja x 8 varillas', 4900, '/productos/palo-santo.png', 1),
('Aceite Esencial Naranja 10ml', 'Just', 'Frasco 10ml', 15200, '/productos/incienso.png', 2),
('Buda Flujo Inverso con Velón', 'Líbano Deco', 'Unidad completa', 12500, '/productos/conos.png', 3);
