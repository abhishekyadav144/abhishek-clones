const categories = [
  { 
    name: 'Mobiles', 
    brands: ['Samsung', 'Apple', 'Xiaomi'], 
    basePrice: 50000, 
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=800&q=80', 'https://images.unsplash.com/photo-1601784551446-20c9e07cd5d3?w=800&q=80']
  },
  { 
    name: 'Laptops', 
    brands: ['Apple', 'HP', 'Dell'], 
    basePrice: 80000,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', 'https://images.unsplash.com/photo-1531297172868-9f140cece067?w=800&q=80', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80']
  },
  { 
    name: 'Fashion', 
    brands: ['Nike', 'Adidas', 'Puma'], 
    basePrice: 2500,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80']
  },
  { 
    name: 'Shoes', 
    brands: ['Nike', 'Adidas', 'Puma'], 
    basePrice: 4000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80']
  },
  { 
    name: 'Watches', 
    brands: ['Titan', 'Apple', 'Samsung'], 
    basePrice: 15000,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80']
  },
  { 
    name: 'Electronics', 
    brands: ['Sony', 'Boat', 'Logitech'], 
    basePrice: 5000,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80']
  },
  { 
    name: 'Gaming', 
    brands: ['Sony', 'Logitech', 'Dell'], 
    basePrice: 45000,
    images: ['https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80', 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80']
  }
];

const adjectives = ['Pro', 'Max', 'Ultra', 'Premium', 'Essential', 'Gaming Edition', 'Lite', 'Plus', 'Next-Gen', 'Elite'];
const colorPool = ['Black', 'White', 'Silver', 'Blue', 'Red'];

const generateIndianProducts = () => {
  const products = [];
  
  // Generate 6 products per category (7 * 6 = 42 products)
  categories.forEach((cat) => {
    for (let i = 0; i < 6; i++) {
      const brand = cat.brands[Math.floor(Math.random() * cat.brands.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      
      let name = '';
      if(cat.name === 'Mobiles' || cat.name === 'Laptops') name = `${brand} ${cat.name.slice(0, -1)} ${adj} ${i + 1}G`;
      else if(cat.name === 'Fashion' || cat.name === 'Shoes') name = `${brand} ${adj} Edition ${i + 1}`;
      else name = `${brand} ${adj} ${cat.name.slice(0, -1)} Model ${i + 1}`;
      
      const priceOffset = (Math.random() * 0.4) - 0.2; 
      let finalPrice = Math.round(cat.basePrice * (1 + priceOffset));
      
      // Make prices end in 99 or 999 for authenticity
      if(finalPrice > 10000) finalPrice = Math.floor(finalPrice / 1000) * 1000 - 1;
      else if(finalPrice > 1000) finalPrice = Math.floor(finalPrice / 100) * 100 - 1;

      const hasDiscount = Math.random() > 0.3;
      const originalPrice = hasDiscount ? Math.round(finalPrice * (1 + (Math.random() * 0.4 + 0.1))) : finalPrice;
      const discountPercentage = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

      const numColors = Math.floor(Math.random() * 3) + 1;
      const colors = [];
      while(colors.length < numColors) {
        const c = colorPool[Math.floor(Math.random() * colorPool.length)];
        if(!colors.includes(c)) colors.push(c);
      }

      let sizes = [];
      if(cat.name === 'Shoes') sizes = ['7', '8', '9', '10', '11'];
      else if(cat.name === 'Fashion') sizes = ['S', 'M', 'L', 'XL'];
      else if(cat.name === 'Laptops' || cat.name === 'Mobiles') sizes = ['128GB', '256GB', '512GB']; // Using sizes for storage variants

      const image = cat.images[Math.floor(Math.random() * cat.images.length)];
      const images = [image, image.replace('800&q=80', '800&q=60')];

      products.push({
        name,
        brand,
        category: cat.name,
        image: image,
        images,
        description: `Experience the best with the ${name} by ${brand}. Featuring top-tier performance and premium build quality, perfectly suited for the Indian market. Grab it now on sale!`,
        price: finalPrice,
        originalPrice,
        discountPercentage,
        countInStock: Math.floor(Math.random() * 50) + 5,
        rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
        numReviews: Math.floor(Math.random() * 5000) + 100,
        sizes,
        colors,
        gender: 'Unisex',
        material: 'Premium',
        fit: 'Standard',
      });
    }
  });

  return products;
};

const indianProducts = generateIndianProducts();
export default indianProducts;
