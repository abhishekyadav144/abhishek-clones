import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const match = html.match(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9\+\-_]+(?:\._[a-zA-Z0-9_]+_)?\.jpg)"/);
    if (match) {
      return match[1].replace(/\._[a-zA-Z0-9_]+_\.jpg$/, '._SX679_.jpg');
    }
    return null;
  } catch(e) {
    return null;
  }
}

const db = [
  { cat: 'Mobiles', items: [
    { name: 'Apple iPhone 15 Pro Max (Titanium, 256 GB)', brand: 'Apple', price: 159900, originalPrice: 159900, desc: 'Forged in titanium with A17 Pro chip and customizable Action button.', query: 'Apple iPhone 15 Pro Max' },
    { name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)', brand: 'Samsung', price: 129999, originalPrice: 134999, desc: 'Meet Galaxy S24 Ultra, the ultimate form of Galaxy with new titanium exterior.', query: 'Samsung Galaxy S24 Ultra' },
    { name: 'Google Pixel 8 Pro (Bay, 128 GB)', brand: 'Google', price: 93999, originalPrice: 106999, desc: 'Pro-level Pixel phone featuring Google Tensor G3 and advanced cameras.', query: 'Google Pixel 8 Pro' },
    { name: 'Nothing Phone (2a) 5G (White, 128 GB)', brand: 'Nothing', price: 23999, originalPrice: 25999, desc: 'Uniquely designed with iconic Glyph Interface. Powered by MediaTek Dimensity 7200 Pro.', query: 'Nothing Phone 2a smartphone' },
    { name: 'Motorola Edge 50 Pro 5G (Luxe Lavender, 256 GB)', brand: 'Motorola', price: 31999, originalPrice: 35999, desc: 'World\'s first Pantone validated camera and display. TurboPower 125W charging.', query: 'Motorola Edge 50 Pro' },
    { name: 'OnePlus 12 5G (Flowy Emerald, 256 GB)', brand: 'OnePlus', price: 64999, originalPrice: 69999, desc: 'Smooth beyond belief. Snapdragon 8 Gen 3, Hasselblad Camera for Mobile.', query: 'OnePlus 12 5G' }
  ]},
  { cat: 'Electronics', items: [
    { name: 'Apple MacBook Air M2 (13.6 inch, 8GB/256GB)', brand: 'Apple', price: 99990, originalPrice: 114900, desc: 'Supercharged by M2. Strikingly thin design, 1080p FaceTime HD camera.', query: 'Apple MacBook Air M2' },
    { name: 'Sony WH-1000XM5 Noise Cancelling Headphones', brand: 'Sony', price: 26990, originalPrice: 34990, desc: 'Industry-leading noise cancellation. Ultra-comfortable lightweight design.', query: 'Sony WH-1000XM5' },
    { name: 'ASUS ROG Strix G16 Core i7 RTX 4060', brand: 'ASUS', price: 139990, originalPrice: 154990, desc: 'High-performance gaming laptop with 165Hz ROG Nebula display.', query: 'ASUS ROG Strix G16' },
    { name: 'Samsung Odyssey G9 Curved Gaming Monitor', brand: 'Samsung', price: 115999, originalPrice: 135000, desc: 'Immersive 1000R curved screen. 240Hz refresh rate, 1ms response time.', query: 'Samsung Odyssey G9 Monitor' },
    { name: 'Apple iPad Pro 11-inch (M2, 256GB)', brand: 'Apple', price: 89900, originalPrice: 89900, desc: 'Astonishing performance, incredibly advanced displays. Ultimate iPad experience.', query: 'Apple iPad Pro 11-inch M2' },
    { name: 'Canon EOS R5 Full-Frame Mirrorless Camera', brand: 'Canon', price: 339990, originalPrice: 350000, desc: 'Professional grade mirrorless camera. 45MP resolution, 8K video.', query: 'Canon EOS R5 Camera' }
  ]},
  { cat: 'Fashion', items: [
    { name: 'Nike Air Max 270 Men\'s Sneakers', brand: 'Nike', price: 12995, originalPrice: 12995, desc: 'Legendary Air Max cushioning combined with a sleek, modern upper.', query: 'Nike Air Max 270 Sneakers' },
    { name: 'Puma Men\'s Graphic Printed T-Shirt', brand: 'Puma', price: 749, originalPrice: 1499, desc: 'Comfortable everyday essential with classic Puma branding.', query: 'Puma Printed T-Shirt' },
    { name: 'Levi\'s 511 Slim Fit Men\'s Jeans', brand: 'Levi\'s', price: 1889, originalPrice: 3499, desc: 'A modern slim with room to move. The 511 Slim Fit Jeans are a classic.', query: 'Levis 511 Slim Fit Jeans' },
    { name: 'Casio G-Shock Analog-Digital Watch', brand: 'Casio', price: 9995, originalPrice: 10495, desc: 'Tough, durable, water resistant to 200m with carbon core guard.', query: 'Casio G-Shock Watch' },
    { name: 'Adidas Ultraboost Light Running Shoes', brand: 'Adidas', price: 13299, originalPrice: 18999, desc: 'The lightest Ultraboost ever. Epic energy, designed for ultimate performance.', query: 'Adidas Ultraboost Running Shoes' },
    { name: 'Fastrack Aviator Sunglasses', brand: 'Fastrack', price: 1099, originalPrice: 2299, desc: 'Classic aviator style with UV protection. Lightweight metal frame.', query: 'Fastrack Aviator Sunglasses' }
  ]},
  { cat: 'Grocery', items: [
    { name: 'Maggi 2-Minute Instant Noodles, 140g', brand: 'Nestle', price: 28, originalPrice: 30, desc: 'Favorite delicious Maggi noodles, ready in just 2 minutes.', query: 'Maggi Noodles 140g' },
    { name: 'Amul Pasteurised Butter, 500g', brand: 'Amul', price: 265, originalPrice: 280, desc: 'Utterly butterly delicious Amul Butter. Made from pure milk.', query: 'Amul Butter 500g' },
    { name: 'Tata Tea Gold, 500g', brand: 'Tata', price: 259, originalPrice: 340, desc: 'Unique blend of fine Assam tea leaves with special 15% long leaves.', query: 'Tata Tea Gold 500g' },
    { name: 'Haldiram\'s Bhujia Sev, 1kg', brand: 'Haldiram\'s', price: 240, originalPrice: 260, desc: 'Classic crunchy, spicy, and savory Indian snack.', query: 'Haldiram Bhujia Sev 1kg' },
    { name: 'Kissan Fresh Tomato Ketchup, 1kg', brand: 'Kissan', price: 135, originalPrice: 150, desc: '100% real juicy tomatoes. Perfect companion for your snacks.', query: 'Kissan Tomato Ketchup 1kg' },
    { name: 'Britannia Good Day Cashew Cookies, 600g', brand: 'Britannia', price: 110, originalPrice: 140, desc: 'Crispy cookies loaded with rich cashews. Smile in every bite!', query: 'Britannia Good Day Cookies 600g' }
  ]},
  { cat: 'Home & Furniture', items: [
    { name: 'Wakefit Orthopedic Memory Foam Mattress', brand: 'Wakefit', price: 6499, originalPrice: 12499, desc: 'Advanced memory foam adapts to your body shape. Breathable fabric.', query: 'Wakefit Orthopedic Mattress' },
    { name: 'Sleepyhead Foldable Sofa Bed', brand: 'Sleepyhead', price: 4999, originalPrice: 8999, desc: 'Space-saving foldable sofa that easily converts into a comfortable bed.', query: 'Sleepyhead Foldable Sofa Bed' },
    { name: 'HomeTown Engineered Wood Queen Bed', brand: 'HomeTown', price: 12499, originalPrice: 24999, desc: 'Elegant wenge finish queen size bed with box storage.', query: 'HomeTown Queen Bed' },
    { name: 'Nilkamal Mid Back Ergonomic Office Chair', brand: 'Nilkamal', price: 3499, originalPrice: 7500, desc: 'Comfortable mesh back chair with adjustable height and tilt tension.', query: 'Nilkamal Office Chair' },
    { name: 'Spaces Cotton Double Bedsheet', brand: 'Spaces', price: 999, originalPrice: 2499, desc: 'Premium soft cotton bedsheet with elegant floral prints.', query: 'Spaces Double Bedsheet' },
    { name: 'Bombay Dyeing Microfiber Pillow Set', brand: 'Bombay Dyeing', price: 499, originalPrice: 1199, desc: 'Ultra-soft microfiber filled pillows for neck support.', query: 'Bombay Dyeing Pillow' }
  ]},
  { cat: 'Appliances', items: [
    { name: 'Samsung 236 L Double Door Refrigerator', brand: 'Samsung', price: 24990, originalPrice: 33990, desc: 'Digital Inverter Compressor. Works longer, uses less energy.', query: 'Samsung Double Door Refrigerator' },
    { name: 'LG 7 Kg Front Load Washing Machine', brand: 'LG', price: 28990, originalPrice: 38990, desc: 'Inverter Direct Drive Motor. 6 Motion DD technology.', query: 'LG Front Load Washing Machine' },
    { name: 'Dyson V11 Absolute Pro Cord-Free Vacuum', brand: 'Dyson', price: 49900, originalPrice: 52900, desc: 'Intelligently optimizes suction and run time. LCD screen displays performance.', query: 'Dyson V11 Vacuum' },
    { name: 'Philips Air Fryer HD9200/90', brand: 'Philips', price: 6999, originalPrice: 9995, desc: 'Fry, bake, grill, roast with up to 90% less fat. Rapid Air Technology.', query: 'Philips Air Fryer' },
    { name: 'Voltas 1.5 Ton 3 Star Split AC', brand: 'Voltas', price: 32990, originalPrice: 62990, desc: 'High ambient cooling, active dehumidifier, adjustable mode.', query: 'Voltas 1.5 Ton Split AC' },
    { name: 'Morphy Richards 30L OTG', brand: 'Morphy Richards', price: 5499, originalPrice: 8495, desc: 'Motorized rotisserie, illuminated chamber, temperature control.', query: 'Morphy Richards OTG' }
  ]},
  { cat: 'Travel', items: [
    { name: 'American Tourister 68 cms Luggage', brand: 'American Tourister', price: 3499, originalPrice: 7999, desc: 'Lightweight, scratch-resistant polycarbonate shell with spinner system.', query: 'American Tourister Luggage' },
    { name: 'Safari Ray Polycarbonate Trolley Bag', brand: 'Safari', price: 2999, originalPrice: 8599, desc: 'Tough, spacious check-in luggage with TSA lock.', query: 'Safari Trolley Bag' },
    { name: 'Skybags Rubik 29L Backpack', brand: 'Skybags', price: 999, originalPrice: 2299, desc: 'Durable everyday backpack with multiple compartments.', query: 'Skybags Backpack' },
    { name: 'Wildcraft 45L Trekking Backpack', brand: 'Wildcraft', price: 2199, originalPrice: 4299, desc: 'High-utility trekking rucksack with load adjusters.', query: 'Wildcraft Trekking Backpack' },
    { name: 'GoPro HERO12 Black Action Camera', brand: 'GoPro', price: 37990, originalPrice: 45000, desc: 'Capture travels in stunning 5.3K. Waterproof, rugged.', query: 'GoPro HERO12' },
    { name: 'Swiss Military Travel Adapter', brand: 'Swiss Military', price: 899, originalPrice: 1999, desc: 'All-in-one international power adapter with dual USB ports.', query: 'Swiss Military Travel Adapter' }
  ]},
  { cat: 'Beauty & Toys', items: [
    { name: 'Maybelline New York Fit Me Foundation', brand: 'Maybelline', price: 449, originalPrice: 629, desc: 'Flawless matte finish that minimizes pores.', query: 'Maybelline Fit Me Foundation' },
    { name: 'L\'Oréal Paris Hyaluronic Acid Serum', brand: 'L\'Oréal Paris', price: 799, originalPrice: 999, desc: 'Intensely hydrates and plumps skin for radiant glow.', query: 'LOreal Hyaluronic Acid Serum' },
    { name: 'Dior Sauvage Eau de Parfum', brand: 'Dior', price: 11500, originalPrice: 11500, desc: 'Radically fresh composition. Bergamot and amberwood trail.', query: 'Dior Sauvage Parfum' },
    { name: 'LEGO City Police Station', brand: 'LEGO', price: 4999, originalPrice: 5999, desc: 'Features 3-level police station, patrol car, helicopter.', query: 'LEGO City Police Station' },
    { name: 'Hot Wheels 10-Car Pack', brand: 'Hot Wheels', price: 999, originalPrice: 1199, desc: 'Assortment of 10 highly detailed 1:64 scale die-cast vehicles.', query: 'Hot Wheels 10-Car Pack' },
    { name: 'Barbie Dreamhouse Playset', brand: 'Barbie', price: 15999, originalPrice: 19999, desc: 'Massive dreamhouse with 3 stories, 8 rooms, working elevator.', query: 'Barbie Dreamhouse' }
  ]},
  { cat: 'Two Wheelers', items: [
    { name: 'Ather 450X Gen 3 Electric Scooter', brand: 'Ather', price: 139999, originalPrice: 155000, desc: 'Quickest smart electric scooter. 105 km TrueRange.', query: 'Ather 450X Electric Scooter' },
    { name: 'Ola S1 Pro Electric Scooter', brand: 'Ola', price: 129999, originalPrice: 139999, desc: '170km ARAI range, cruise control, massive storage.', query: 'Ola S1 Pro Electric Scooter' },
    { name: 'TVS iQube Electric Scooter', brand: 'TVS', price: 117000, originalPrice: 125000, desc: 'Silent powerful electric scooter with SmartXonnect.', query: 'TVS iQube Electric Scooter' },
    { name: 'Studds Ninja Elite Super Helmet', brand: 'Studds', price: 1250, originalPrice: 1450, desc: 'Aerodynamic design with UV resistant paint.', query: 'Studds Ninja Helmet' },
    { name: 'Motul 300V Synthetic Engine Oil', brand: 'Motul', price: 1050, originalPrice: 1150, desc: '100% synthetic racing lubricant for ultimate performance.', query: 'Motul 300V Engine Oil' },
    { name: 'Vega Crux Flip-up Helmet', brand: 'Vega', price: 1550, originalPrice: 1850, desc: 'Durable ABS shell flip-up helmet with easy button release.', query: 'Vega Crux Helmet' }
  ]}
];

async function run() {
  console.log('Starting Amazon scraping for 54 products...');
  const productsOutput = [];

  for (const category of db) {
    for (const item of category.items) {
      console.log(`Fetching image for: ${item.query}`);
      let img = await getAmazonImage(item.query);
      if (!img) {
         // Fallback if scraping fails for any reason
         console.log(`Failed for ${item.query}, trying generic...`);
         img = 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'; 
      }
      
      const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
      
      productsOutput.push({
        name: item.name,
        brand: item.brand,
        category: category.cat,
        image: img,
        description: item.desc,
        price: item.price,
        originalPrice: item.originalPrice,
        discountPercentage: discount > 0 ? discount : 0,
        countInStock: Math.floor(Math.random() * 50) + 5,
        rating: (Math.random() * 1 + 4).toFixed(1),
        numReviews: Math.floor(Math.random() * 10000) + 100
      });
      // Delay to avoid Amazon blocking us
      await new Promise(r => setTimeout(r, 600));
    }
  }

  const fileContent = `const products = ${JSON.stringify(productsOutput, null, 2)};\n\nexport default products;\n`;
  const productsFilePath = path.join(__dirname, 'data', 'products.js');
  
  fs.writeFileSync(productsFilePath, fileContent, 'utf8');
  console.log('Successfully wrote 54 products to products.js!');
}

run();
