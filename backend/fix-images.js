import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// A mapping of keywords to high quality unsplash images
const imageMap = {
  'Mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  'Home & Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  'Appliances': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
  'Travel': 'https://images.unsplash.com/photo-1553835973-dec43bfddbeb?w=600&q=80',
  'Beauty & Toys': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54c28?w=600&q=80',
  'Two Wheelers': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80'
};

const groceryMap = {
  'Maggi': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80',
  'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80',
  'Tea': 'https://images.unsplash.com/photo-1594910243467-336df3146453?w=600&q=80',
  'Bhujia': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
  'Ketchup': 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&q=80',
  'Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
  'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=600&q=80',
  'Atta': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
  'Detergent': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&q=80',
  'Handwash': 'https://images.unsplash.com/photo-1584464457692-73ec6ba4eb41?w=600&q=80',
  'Biscuits': 'https://images.unsplash.com/photo-1590080875515-8a3a1040eddf?w=600&q=80',
  'Coffee': 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&q=80',
  'Nutella': 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=600&q=80'
};

// Regex to find each product object block
const regex = /{[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'[\s\S]*?}/g;

content = content.replace(regex, (match, name, category, oldImage) => {
  let newImage = oldImage;
  
  if (category === 'Grocery') {
    let found = false;
    for (const [key, url] of Object.entries(groceryMap)) {
      if (name.includes(key)) {
        newImage = url;
        found = true;
        break;
      }
    }
    if (!found) newImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; // fallback grocery
  } else {
    newImage = imageMap[category] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
  }

  return match.replace(oldImage, newImage);
});

fs.writeFileSync(productsFilePath, content, 'utf8');
console.log('Successfully replaced all images with reliable Unsplash URLs.');
