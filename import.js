const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/[`\"']/g, '');
  return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/à-ϯ/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  const categories = ['Esencias', 'Fragancias Textiles', 'Accesorios', 'Sprays', 'Velas', 'Sahumerios Importados', 'Sahumerios Nacionales', 'Sahumerios Goloka', 'Defumación'];
  const catMap = {};
  
  for (const cat of categories) {
    let { data } = await supabase.from('categories').select('*').eq('slug', slugify(cat)).single();
    if (!data) {
      const res = await supabase.from('categories').insert([{ name: cat, slug: slugify(cat) }]).select();
      data = res.data[0];
    }
    catMap[cat] = data.id;
  }
  
  const products = [
    { name: 'Esencia para Hornitos 10cc', category: 'Esencias', variants: ['Alcanfort', 'Almendra', 'Almizcle', 'Ámbar', 'Azahar', 'Baby', 'Bamboo', 'Benjui', 'Café', 'Canela', 'Cannabis', 'Champa', 'Chocolate', 'Citronella', 'Coco', 'Dulces Sueños', 'Durazno', 'Estoraque', 'Eucalipto', 'Flor Azul', 'Floral', 'Fresia', 'Frutilla', 'Gardenia', 'Incienso', 'Jazmín', 'Lavanda', 'LImó', 'Loto', 'Madre Selva', 'Maderas del Oriente', 'Magnolia', 'Mandarina', 'Manzana', 'Marina', 'Melón', 'Menta', 'Mirra', 'Musk', 'Naranja', 'Nardo', 'Opium', 'Palo Santo', 'Patchouly', 'Pomelo con Naranja', 'Ratnamala', 'Reina de la Noche', 'Romero', 'Rosa', 'Ruda', 'Sándalo', 'Sándalo con Canela', 'Sándalo con Limón', 'Sándalo con Rosa', 'Sándalo Dulce', 'Tilo', 'Vainilla', 'Vainilla con Naranja', '7 Poderes', 'Abre Caminos', 'Amansa', 'Amarre', 'Atrae Clientes', 'Atrae Dinero', 'Conmigo Nadie Puede', 'Contra Envidia', 'Destraba Negocio', 'Destrabe', 'Dominio', 'Energía y Vitalidad', 'Fuera Demonio', 'Imposibles', 'Lava Casa', 'Llama Suerte', 'Progreso', 'Relax', 'Sacatecho', 'Salud', 'Superprotector', 'Unión de Familia', 'Unión de Pareja'] },
    { name: 'Fragancia Textil 250cc (Aroma Intenso)', category: 'Fragancias Textiles', variants: ['Amour (Kenzo)', 'Black Label', 'Bubble (Chicle)', 'Bella (Nina Ricci)', 'Citrus', 'Coco con Vainilla', 'Champa', 'Coniglio', 'Cotton', 'Frutilla', 'Jazmín', 'Limón', 'Nina Ricci', 'One Million (Paco Rabanne)', 'Paula Danvers', 'Patio Bulrich', 'Sandía Pepino', 'Style', 'Soft', 'Verbena'] },
    { name: 'Fragancia Textil 250cc (Aroma Medio)', category: 'Fragancias Textiles', variants: ['Amour (Kenzo)', 'Apolo', 'Apple', 'Bamboo', 'Beauty', 'Citrus', 'Cristóbal', 'Daniel (Deditos)', 'Duvet', 'Flowers', 'Green', 'Guaraná', 'Indiana', 'Jazmin', 'Lady', 'Limón', 'Linah', 'Magnolia y Fresias', 'Man', 'Maracuyá', 'Mery', 'Naranja Pimienta', 'New York', 'Nina Ricci', 'Oriente', 'Papaya', 'Patio Bulrich', 'Pitanga', 'Rosas', 'Tropical', 'Uva', 'Vainilla', 'Verbena', 'Violetas'] },
    { name: 'Porta Sahumerio', category: 'Accesorios', variants: [] },
    { name: 'Spray Concentrado 60cc', category: 'Sprays', variants: ['Ángel', 'Bamboo', 'Bebé', 'Citrus', 'Coco con Vainilla', 'Coniglio', 'Green', 'Hawai', 'Lavanda', 'Limón', 'Linah', 'Magnolia y Fresias', 'Marino', 'Mery', 'Oriente', 'Paula Danvers', 'Rocío', 'Tropical', 'Uva', 'Vainilla'] },
    { name: 'Vela de Parafina Corta', category: 'Velas', variants: ['Blanco', 'Negro', 'Rojo', 'Azul', 'Amarillo', 'Verde', 'Rosa', 'Violeta', 'Naranja', 'Marrón', 'Celeste'] },
    { name: 'Vela de Parafina Larga', category: 'Velas', variants: ['Blanco', 'Negro', 'Rojo', 'Azul', 'Amarillo', 'Verde', 'Rosa', 'Violeta', 'Naranja', 'Marrón', 'Celeste'] },
    { name: 'Sahumerios Hexagonales Importados (x 15)', category: 'Sahumerios Importados', variants: ['7 Arcángeles', '7 Chakras', '7 Hierbas', '7 Poderes', 'Abre Caminos', 'Almizcle', 'Atrae Clientes', 'Atrae Dinero', 'Benjuí', 'Canela', 'Chandan', 'Citronela', 'Coco', 'Contra Envidia', 'Contra Todo Mal', 'Copal', 'Destrabe', 'Energía', 'Especias de la India', 'Eucalipto', 'Menta', 'Feng Shui', 'Flor de Loto', 'Frutilla', 'Gardenia', 'Nardo', 'Incienso', 'Incienso con Mirra', 'Jaz}ín', 'Kamasutra', 'Lava Casa', 'Limón', 'Lluvia de Oro', 'Madera de Sándalo', 'Meditación', 'Mirra', 'Ohm', 'Palo Santo', 'Palo Santo con Sándalo', 'Patchouly', 'Protección', 'Reina de la Noche', 'Relajación', 'Rosa', 'Ruda', 'Salvia Blanca', 'San Miguel Arcángel', 'Sándalo', 'Sándalo con Canela', 'Sándalo con Rosa', 'Sangre de Drago', 'Sri Ganesh', 'Súper Sándalo', 'Vainilla', 'Vainilla con Rosa'] },
    { name: 'Sahumerios Naturales (x 9)', category: 'Sahumerios Nacionales', variants: ['Lavanda y Olíbano', 'Incienso Blanco'] },
    { name: 'Sahumerios Finos (x 12)', category: 'Sahumerios Nacionales', variants: ['7 Poderes', 'Abre Caminos', 'Almendra', 'Almizcle', 'Ámbar', 'Amor', 'Atrae Clientes', 'Atrae Dinero', 'Azahar', 'Baby', 'Bamboo', 'Benjuí', 'Cafeä', 'Canela', 'Champa', 'Citronella', 'Coco', 'Contra Envidia', 'Descarga', 'Destrabe', 'Durazno', 'Estudio', 'Eucalipto', 'Felicidad', 'Fresias', 'Frutas Tropicales', 'Guaraná', 'Heno de Pravia', 'Incienso', 'Jazmín', 'Kenzo Femenino', 'Kenzo Masculino', 'Lava Casa', 'Lavanda', 'Limón', 'Loto', 'Maderas del Oriente', 'Mango', 'Manzana', 'Menta', 'Miel', 'Mil Flores', 'Mirra', 'Musk', 'Naranja', 'Nardo', 'Nina Ricci', 'Opium', 'Orquídea', 'Patchouly', 'Palo Santo', 'Paraíso', 'Reina de la Noche', 'Rosa', 'Ruda', 'Salud', 'Sándalo', 'Sándalo Hindú', 'Tilo', 'Trabajo', 'Unión Familiar', 'Uva', 'Vainilla', 'Variedad', 'Violeta'] },
    { name: 'Sahumerios Gruesos (x 9)', category: 'Sahumerios Nacionales', variants: ['7 Poderes', 'Armonía del Hogar', 'Aromas del Bosque', 'Azahar', 'Benjuí', 'Café', 'Champa', 'Chocolate', 'Copal', 'Energía Limpia', 'Esencia de la India', 'Frutilla', 'Incienso', 'Lavanda', 'Limón', 'Mango', 'Mirra', 'Miel', 'Nardo', 'Noche de Ensueño', 'Opium', 'Palo Santo', 'Reina de la Noche', 'Rosa', 'Sándalo', 'Vainilla', 'Variedad'] },
    { name: 'Sahumerios Doble Empaste (x 5)', category: 'Sahumerios Nacionales', variants: ['Atrae Dinero', 'Benjuí', 'Champa', 'Citronella', 'Coco', 'Energía', 'Frutilla', 'Incienso', 'Jazsmín', 'Lavanda', 'Limón', 'Mirra', 'Opium', 'Palo Santo', 'Patchouly', 'Reina de la Noche', 'Ruda', 'Sándalo', 'Sándalo Hindú', 'Vainilla', 'Variedad', 'Violeta'] },
    { name: 'Sahumerios Hexagonales (x 20)', category: 'Sahumerios Importados', variants: ['Alcanfort', 'Anti Stress', 'Café', 'Chocolate', 'Contra Envidia', 'Contra Todo', 'Lavanda Inglesa', 'Mango Papaya', 'Mil Flores', 'Naranja Canela', 'Opium', 'Reina de la Noche', 'Romero0', 'Atrae Clientes', 'Benjuí', 'Chocolate con Naranja', 'Lava Casa', 'Patchouly con Mandarina', 'Sándalo con Canela', 'Vainilla con Canela', 'Vainilla con Naranja'] },
    { name: 'Sahumerios Goloka Fit (x 15)', category: 'Sahumerios Goloka', variants: ['7 Chakras', '7 Poderes', 'Almizcle', 'Ámbar', 'Atrae Dinero0', 'Ayurveda', 'Canela', 'Chandan', 'Citronella', 'Copal', 'Feng Shui', 'Hare Krishna', 'Incienso', 'Incienso con Mirra', 'Lava Casa', 'Lavanda', 'Limón', 'Lluvia de Oro', 'Maestro Espiritual', 'Meditación', 'Mirra', 'Ohm', 'Rosa PasióN', 'Ruda', 'Salvia Blanca', 'Sándalo con Canela', 'Vainilla', 'Vainilla con Rosa'] },
    { name: 'Sahumerios Corona Da Bahia (x 20)', category: 'Sahumerios Importados', variants: ['Almizcle', 'Antitaba', 'Atracción Hombre', 'Atrae Amor Femenino', 'Azahar', 'Benjuí', 'Bosque de Pinos', 'Brindavan', 'Canela', 'Cedro', 'Citronella', 'Coco', 'Eucalipto', 'Frutilla', 'Ganesha', 'Geranio', 'Jazmín', 'Krishna', 'Lakshmi', 'Lavanda', 'Limón', 'Lyrica', 'Magnolia', 'Manzana Verde', 'Menta', 'Musk', 'Naranja', 'Nardo', 'Opium', 'Patchouly', 'Ratnamala', 'Romero', 'Rosa', 'Ruda', 'Sándalo', 'Sándalo Dulce', 'Uva', 'Vainilla', 'Variedad', 'Violeta'] },
    { name: 'Bombitas Naturales de Defumación (x 4)', category: 'Defumación', variants: ['7 Hierbas Copal', '7 Poderes', 'Abre Caminos', 'Atrae Dinero', 'Defumación Completa', 'Destrabe', 'Limpieza Energética', 'Palo Santo', 'Variedad'] }
  ];

  for (const p of products) {
    const payload = { name: p.name, price: 0, stock: 0, image_url: '/productos/yagra.png', category_id: catMap[p.category], variants: p.variants, is_active: true };
    const { error } = await supabase.from('products').insert([payload]);
    if (error) console.log('Error', p.name, error.message);
    else console.log('Inserted', p.name);
  }
}
run();
