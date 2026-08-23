
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/[\"']/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('categories').insert([{ name: 'TestCat', slug: 'test-cat' }]).select();
  if (error) { console.error('Error:', error.message); }
  else { 
    console.log('Success', data); 
    await supabase.from('categories').delete().eq('id', data[0].id);
  }
}
testInsert();

