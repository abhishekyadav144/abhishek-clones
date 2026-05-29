import fs from 'fs';

async function searchProductImage(query) {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      for(const p of data.products) {
        if (p.image_front_url) return p.image_front_url;
      }
    }
    return null;
  } catch(e) {
    return null;
  }
}

async function run() {
  console.log('Maggi:', await searchProductImage('maggi noodles'));
  console.log('Amul Butter:', await searchProductImage('amul butter'));
  console.log('Tata Tea:', await searchProductImage('tata tea'));
  console.log('Ketchup:', await searchProductImage('kissan ketchup'));
  console.log('Parle G:', await searchProductImage('parle g'));
  console.log('Nutella:', await searchProductImage('nutella'));
}

run();
