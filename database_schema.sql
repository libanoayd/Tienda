-- 1. Crear tabla de Categorías
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Crear tabla de Productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Crear tabla de Cupones de Descuento
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

-- Políticas de lectura pública (Cualquier visitante puede ver los productos)
CREATE POLICY "Productos visibles para todos" ON products FOR SELECT USING (true);
CREATE POLICY "Categorías visibles para todos" ON categories FOR SELECT USING (true);

-- Insertar algunas categorías iniciales de prueba
INSERT INTO categories (name, slug) VALUES 
('Aromaterapia', 'aromaterapia'),
('Sahumerios', 'sahumerios'),
('Deco Hogar', 'deco');
