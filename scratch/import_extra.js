const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/[\`"']/g, '');
  return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const rawData = `Producto	Columna 1	venta	total venta
geometria sagrada	6	$2,400.00	$14,400.00
aros economicos	66	$2,000.00	$132,000.00
llaveros mios	14	$3,900.00	$54,600.00
platos cl	3	$5,500.00	$16,500.00
buda resina	5	$7,900.00	$39,500.00
cencicero fantasma	1	$12,000.00	$12,000.00
cenicero dado	2	$8,000.00	$16,000.00
sagrada madre blend masala	2	$6,200.00	$12,400.00
velas de noche	7	$3,000.00	$21,000.00
aceites	33	$2,000.00	$66,000.00
sagrada madre x 20	1	$5,000.00	$5,000.00
sagrada madre natural	10	$3,000.00	$30,000.00
sagrada madre palo santo	36	$2,700.00	$97,200.00
bolso matero	1	$55,000.00	$55,000.00
mate pintado	1	$12,000.00	$12,000.00
set yerba azucar	2	$10,000.00	$20,000.00
lata deco con cordon	1	$6,800.00	$6,800.00
plato cl grande	1	$6,900.00	$6,900.00
esfera deco	2	$5,200.00	$10,400.00
posavaso ceramico	6	$4,600.00	$27,600.00
lata deco 	3	$4,500.00	$13,500.00
sahumerio nuna tera	4	$3,500.00	$14,000.00
sahumerio santoral			$0.00
tablilla 7 chakras	1	$13,000.00	$13,000.00
frasco hermetico	2	$12,500.00	$25,000.00
lata arroz	2	$9,900.00	$19,800.00
lata condimentos	2	$7,300.00	$14,600.00
buda mini	4	$1,800.00	$7,200.00
frasco estriado cl	4	$12,000.00	$48,000.00
deco home	2	$8,500.00	$17,000.00
cascada yeso chica	5	$4,200.00	$21,000.00
cono aromanza	2	$3,500.00	$7,000.00
cascada resina	2	$12,000.00	$24,000.00
fanal vitreaux	3	$5,500.00	$16,500.00
sahumerio aromanza tibetano	19	$4,000.00	$76,000.00
bolso grande	2	$25,000.00	$50,000.00
morral	2	$21,000.00	$42,000.00
cartera cuadrada	2	$15,000.00	$30,000.00
caireles mini	7	$7,500.00	$52,500.00
caireles chico	9	$13,000.00	$117,000.00
caireles mediano	5	$15,000.00	$75,000.00
caireles grande	4	$17,000.00	$68,000.00
deco wifi	3	$7,500.00	$22,500.00
cabeza de buda yeso	11	$2,600.00	$28,600.00
manta 2 plazas	2	$40,000.00	$80,000.00
mantas 1 plaza	2	$30,000.00	$60,000.00
manta 2 plazas	1	$35,000.00	$35,000.00
buda grande	5	$7,500.00	$37,500.00
manta oro	2	$45,000.00	$90,000.00
cascada gr yeso	4	$5,800.00	$23,200.00
bombitas sagrada	56	$500.00	$28,000.00
bombitas sagrada	10	$700.00	$7,000.00
yeso blanco grande	11	$2,200.00	$24,200.00
yeso blanco mediano	1	$1,900.00	$1,900.00
yeso blanco chico	4	$1,000.00	$4,000.00
ceramica chica oro	3	$5,600.00	$16,800.00
ceramica mediana oro	6	$7,500.00	$45,000.00
mano porta vela	2	$3,700.00	$7,400.00
velas de noche perfume	24	$500.00	$12,000.00
vela de soja	1	$9,800.00	$9,800.00
llaveros brillo	4	$7,000.00	$28,000.00
ceramica abuelos	1	$19,000.00	$19,000.00
detapador iman	9	$6,000.00	$54,000.00
camino de mesa rectang	2	$19,000.00	$38,000.00
atrapasol	2	$8,200.00	$16,400.00
elefantes x 3	4	$12,700.00	$50,800.00
elefantes	2	$32,000.00	$64,000.00
elefantes	1	$28,000.00	$28,000.00
mandala metal	2	$11,500.00	$23,000.00
arbol metal	3	$14,400.00	$43,200.00
mano metal	1	$7,500.00	$7,500.00
mandala vidrio 30cm	5	$37,000.00	$185,000.00
mandala vidrio 20cm	4	$10,400.00	$41,600.00
mandala vidrio 14cm	2	$7,200.00	$14,400.00
cuadro ohm	5	$11,000.00	$55,000.00
centro de mesa redondo	2	$25,000.00	$50,000.00
pouch seven	5	$3,500.00	$17,500.00
pulseras	16	$3,500.00	$56,000.00
difusor auto	2	$6,000.00	$12,000.00
blister pulseras	2	$9,000.00	$18,000.00
pulsera acero	2	$9,900.00	$19,800.00
colgante ceramica	2	$6,100.00	$12,200.00
llaveros hindu	13	$5,000.00	$65,000.00
pinza pelo	3	$1,500.00	$4,500.00
pinza pelo	2	$2,000.00	$4,000.00
colgante metal	2	$12,000.00	$24,000.00
colgante metal	3	$15,000.00	$45,000.00
colgante metal	3	$11,000.00	$33,000.00
manta centro de mesa	1	$12,000.00	$12,000.00
tira elefantes	7	$8,000.00	$56,000.00
maneki ceramico	1	$9,900.00	$9,900.00
tiras almohadas	10	$6,500.00	$65,000.00
movil elefantes	1	$13,400.00	$13,400.00
movil elefantes	1	$18,500.00	$18,500.00
movil elefantes	3	$14,000.00	$42,000.00
movil elefantes	3	$5,200.00	$15,600.00
lampara pla	1	$43,600.00	$43,600.00
lampara pla	2	$31,900.00	$63,800.00
cubrecama	2	$63,000.00	$126,000.00
llamador	1	$5,200.00	$5,200.00
florero yeso color	6	$6,800.00	$40,800.00
florero pla	1	$17,400.00	$17,400.00
florero pla	4	$4,500.00	$18,000.00
florero pla	5	$6,300.00	$31,500.00
porta maceta cl	1	$7,700.00	$7,700.00
home spray	6	$8,200.00	$49,200.00
difusor 	21	$6,000.00	$126,000.00
tarjetas aromaticas	2	$7,400.00	$14,800.00
textil	71	$4,100.00	$291,100.00
aerosol ambar	15	$4,500.00	$67,500.00
aerosol sap	8	$6,000.00	$48,000.00
lampara astronauta	2	$25,000.00	$50,000.00
ganesh	1	$8,500.00	$8,500.00
soporte celu	5	$4,000.00	$20,000.00
guante	1	$8,100.00	$8,100.00
estrella deco	2	$12,000.00	$24,000.00
corazon deco	2	$10,000.00	$20,000.00
corazon deco	2	$12,000.00	$24,000.00
elefantes	55	$1,000.00	$55,000.00
plato venecitas	2	$12,500.00	$25,000.00
plato totora	2	$6,800.00	$13,600.00
maceta pla	1	$3,800.00	$3,800.00
maceta pla	1	$4,800.00	$4,800.00
centro de mesa yute	6	$5,500.00	$33,000.00
caja porcelana	3	$7,500.00	$22,500.00
caja porcelana	2	$5,500.00	$11,000.00
textil ambar	2	$2,300.00	$4,600.00
maceta buho	3	$7,000.00	$21,000.00
centro de mesa punto	2	$4,500.00	$9,000.00
hexa 1	89	$1,500.00	$133,500.00
hexa 2	92	$1,000.00	$92,000.00
alfombra	2	$38,000.00	$76,000.00
elefantes	2	$12,500.00	$25,000.00
elefantes resina	2	$10,000.00	$20,000.00
crema natura	1	$13,500.00	$13,500.00
crema natura	1	$20,000.00	$20,000.00
jabones	2	$13,600.00	$27,200.00
bruma	1		$0.00
frescor	1	$46,400.00	$46,400.00
fluido masaje	2	$14,900.00	$29,800.00
bolsa maquillaje	1	$5,700.00	$5,700.00
jabon liq	1	$6,500.00	$6,500.00
crema natura	1	$20,100.00	$20,100.00
labial	1	$15,900.00	$15,900.00
perfume luna	1	$74,000.00	$74,000.00
homem	1	$97,800.00	$97,800.00
kaiak	4	$64,000.00	$256,000.00
humor	5	$60,200.00	$301,000.00
taza	1	$9,000.00	$9,000.00
taza	2	$12,000.00	$24,000.00
vaso parlante	3	$42,000.00	$126,000.00
medias	5	$3,200.00	$16,000.00
medias	2	$5,500.00	$11,000.00
cubiertos	3	$4,800.00	$14,400.00
pinza comida	2	$9,000.00	$18,000.00
taza	1	$9,000.00	$9,000.00
bowl	3	$12,000.00	$36,000.00
bowl	5	$4,900.00	$24,500.00
centro mesa	4	$9,000.00	$36,000.00
deco led	3	$12,000.00	$36,000.00
elefante ch	4	$2,000.00	$8,000.00
elefante m	4	$3,000.00	$12,000.00
elefante xl	4	$4,500.00	$18,000.00
porta pla	13	$1,800.00	$23,400.00
porta pla	3	$2,300.00	$6,900.00
porta	2	$4,800.00	$9,600.00
porta	3	$4,900.00	$14,700.00
porta	2	$3,200.00	$6,400.00
porta	9	$3,500.00	$31,500.00
porta	3	$5,500.00	$16,500.00
porta	4	$3,000.00	$12,000.00
porta	1	$8,900.00	$8,900.00
porta	1	$4,000.00	$4,000.00
iguanas	3	$3,400.00	$10,200.00
ojo turco	4	$19,000.00	$76,000.00
posavaso ceramico	6	$5,000.00	$30,000.00
velon 7 d	9	$8,200.00	$73,800.00
velon 3d	22	$5,500.00	$121,000.00
elefantes	4	$9,000.00	$36,000.00
cepillo espejo	2	$9,000.00	$18,000.00
atrapasueños	2	$4,200.00	$8,400.00
hornitos	3	$7,500.00	$22,500.00
LAMPARA SAL	1	$25,000.00	$25,000.00
CONO CASCADA	10	$2,000.00	$20,000.00
palo santo	1	$32,000.00	$32,000.00`;

async function run() {
  const catName = "Decoración y Varios";
  let { data: cat } = await supabase.from('categories').select('*').eq('slug', slugify(catName)).single();
  
  if (!cat) {
    const res = await supabase.from('categories').insert([{ name: catName, slug: slugify(catName) }]).select();
    cat = res.data[0];
  }
  
  const lines = rawData.split('\n').slice(1).map(l => l.trim()).filter(l => l);
  const products = lines.map(line => {
    const parts = line.split('\t');
    const name = parts[0].trim();
    // Parse quantity (default 0)
    let stock = 0;
    if (parts[1]) {
      stock = parseInt(parts[1].trim(), 10);
      if (isNaN(stock)) stock = 0;
    }
    // Parse price (remove $ and commas)
    let price = 0;
    if (parts[2]) {
      const pStr = parts[2].trim().replace('$', '').replace(/,/g, '');
      price = parseFloat(pStr);
      if (isNaN(price)) price = 0;
    }
    
    // Quick title case for product name
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    return {
      name: formattedName,
      price,
      stock,
      image_url: '/productos/yagra.png',
      category_id: cat.id,
      is_active: true
    };
  });
  
  if (products.length > 0) {
    const { error } = await supabase.from('products').insert(products);
    if (error) console.log('Bulk insert error:', error.message);
  }
  console.log('Done importing custom stock!');
}
run();
