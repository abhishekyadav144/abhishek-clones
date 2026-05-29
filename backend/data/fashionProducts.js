const categories = [
  { name: 'Men T-Shirts', brands: ['Nike', 'Puma', 'Adidas', 'Under Armour'], basePrice: 25, sizes: ['S', 'M', 'L', 'XL', 'XXL'], gender: 'Men', type: 'clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
  { name: 'Men Shirts', brands: ['Tommy Hilfiger', 'Ralph Lauren', 'Zara', 'H&M'], basePrice: 45, sizes: ['S', 'M', 'L', 'XL', 'XXL'], gender: 'Men', type: 'clothing', image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80' },
  { name: 'Women Dresses', brands: ['Zara', 'H&M', 'Mango', 'Forever 21'], basePrice: 60, sizes: ['XS', 'S', 'M', 'L', 'XL'], gender: 'Women', type: 'clothing', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80' },
  { name: 'Hoodies', brands: ['Nike', 'Champion', 'Superdry', 'Adidas'], basePrice: 55, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], gender: 'Unisex', type: 'clothing', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80' },
  { name: 'Jeans', brands: ['Levi\'s', 'Wrangler', 'Lee', 'Pepe Jeans'], basePrice: 70, sizes: ['28', '30', '32', '34', '36', '38'], gender: 'Unisex', type: 'clothing', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80' },
  { name: 'Sneakers', brands: ['Nike', 'Adidas', 'Jordan', 'Converse'], basePrice: 120, sizes: ['7', '8', '9', '10', '11', '12'], gender: 'Unisex', type: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
  { name: 'Running Shoes', brands: ['Asics', 'Brooks', 'Nike', 'New Balance'], basePrice: 140, sizes: ['7', '8', '9', '10', '11', '12'], gender: 'Unisex', type: 'shoes', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80' },
  { name: 'Jackets', brands: ['The North Face', 'Columbia', 'Patagonia', 'Zara'], basePrice: 150, sizes: ['S', 'M', 'L', 'XL'], gender: 'Unisex', type: 'clothing', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80' },
  { name: 'Watches', brands: ['Fossil', 'Casio', 'Citizen', 'Rolex'], basePrice: 200, sizes: [], gender: 'Unisex', type: 'accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80' },
  { name: 'Bags', brands: ['Gucci', 'Prada', 'Michael Kors', 'Coach'], basePrice: 250, sizes: [], gender: 'Women', type: 'accessories', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80' },
  { name: 'Sarees', brands: ['FabIndia', 'Biba', 'Nalli', 'Sabyasachi'], basePrice: 80, sizes: [], gender: 'Women', type: 'clothing', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80' },
  { name: 'Kurtis', brands: ['W', 'Biba', 'Aurelia', 'Global Desi'], basePrice: 35, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], gender: 'Women', type: 'clothing', image: 'https://images.unsplash.com/photo-1583391733958-6625890adbc6?w=800&q=80' },
  { name: 'Kids Wear', brands: ['Mothercare', 'Carter\'s', 'H&M Kids', 'Zara Kids'], basePrice: 20, sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], gender: 'Kids', type: 'clothing', image: 'https://images.unsplash.com/photo-1519272304859-9941a361bdc2?w=800&q=80' }
];

const adjectives = ['Premium', 'Classic', 'Essential', 'Signature', 'Vintage', 'Urban', 'Athletic', 'Casual', 'Elegant', 'Modern'];
const colorPool = ['Black', 'White', 'Navy Blue', 'Grey', 'Red', 'Olive', 'Beige', 'Maroon'];
const materialPool = ['100% Cotton', 'Polyester Blend', 'Denim', 'Leather', 'Silk', 'Linen', 'Wool', 'Synthetic'];
const fitPool = ['Regular Fit', 'Slim Fit', 'Oversized', 'Relaxed Fit', 'Tailored'];

const generateFashionProducts = () => {
  const products = [];
  
  // Generate ~12 products per category (13 * 12 = 156 products)
  categories.forEach((cat) => {
    for (let i = 0; i < 12; i++) {
      const brand = cat.brands[Math.floor(Math.random() * cat.brands.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const name = `${brand} ${adj} ${cat.name.slice(0, -1)} Edition ${i + 1}`;
      
      const priceOffset = (Math.random() * 0.4) - 0.2; // -20% to +20% variation
      const finalPrice = Number((cat.basePrice * (1 + priceOffset)).toFixed(2));
      const hasDiscount = Math.random() > 0.5;
      const originalPrice = hasDiscount ? Number((finalPrice * (1 + (Math.random() * 0.5 + 0.1))).toFixed(2)) : finalPrice;
      const discountPercentage = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

      // Randomize colors
      const numColors = Math.floor(Math.random() * 3) + 1; // 1 to 3 colors
      const colors = [];
      while(colors.length < numColors) {
        const c = colorPool[Math.floor(Math.random() * colorPool.length)];
        if(!colors.includes(c)) colors.push(c);
      }

      // Randomize images (just duplicating the base image to simulate gallery for now)
      const images = [cat.image, cat.image.replace('800&q=80', '800&q=60'), cat.image.replace('800&q=80', '800&q=40')];

      products.push({
        name,
        brand,
        category: cat.name,
        image: cat.image,
        images,
        description: `Elevate your wardrobe with the ${name}. Designed by ${brand}, this piece offers unparalleled comfort and cutting-edge style. Perfect for any occasion.`,
        price: finalPrice,
        originalPrice,
        discountPercentage,
        countInStock: Math.floor(Math.random() * 100) + 10,
        rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
        numReviews: Math.floor(Math.random() * 2000) + 10,
        sizes: cat.sizes,
        colors: colors,
        gender: cat.gender,
        material: materialPool[Math.floor(Math.random() * materialPool.length)],
        fit: cat.type === 'clothing' ? fitPool[Math.floor(Math.random() * fitPool.length)] : 'Standard',
      });
    }
  });

  return products;
};

const fashionProducts = generateFashionProducts();
export default fashionProducts;
