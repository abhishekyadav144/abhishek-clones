import fs from 'fs';

async function getAmazonImage(query) {
  try {
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    const html = await res.text();
    // Look for the main product image in the search results
    const match = html.match(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9\+\-_]+(?:\._[a-zA-Z0-9_]+_)?\.jpg)"/);
    if (match) {
      // Return a high-res version of the image by stripping the resizing suffix
      return match[1].replace(/\._[a-zA-Z0-9_]+_\.jpg$/, '._SX679_.jpg');
    }
    return null;
  } catch(e) {
    console.error(e);
    return null;
  }
}

async function run() {
  const queries = [
    'Maggi 2-Minute Instant Noodles 140g',
    'Amul Pasteurised Butter 500g',
    'Tata Tea Gold 500g',
    'Haldiram Bhujia Sev 1kg',
    'Kissan Fresh Tomato Ketchup 1kg',
    'Britannia Good Day Cashew Cookies 600g',
    'Daawat Rozana Super Basmati Rice 5kg',
    'Aashirvaad Select Premium Sharbati Atta 5kg',
    'Saffola Gold Blended Edible Oil 5L',
    'Surf Excel Matic Front Load Liquid Detergent 2L',
    'Dettol Original Liquid Handwash Refill 1500ml',
    'Parle-G Original Glucose Biscuits 800g',
    'Nescafe Classic Instant Coffee 100g',
    'Lipton Honey Lemon Green Tea Bags 100 pcs',
    'Nutella Hazelnut Cocoa Spread 350g',
    'Apple iPhone 15 Pro Max',
    'Samsung Galaxy S24 Ultra',
    'Apple MacBook Air M2',
    'Sony WH-1000XM5'
  ];

  for (const q of queries) {
    const img = await getAmazonImage(q);
    console.log(`${q}: ${img}`);
    // Wait a bit to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
