import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/Loader';
import api from '../services/api';

const categoriesData = [
  { id: 1, name: 'Grocery', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100' },
  { id: 2, name: 'Mobiles', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
  { id: 3, name: 'Fashion', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100' },
  { id: 4, name: 'Electronics', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
  { id: 5, name: 'Home & Furniture', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
  { id: 6, name: 'Appliances', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
  { id: 7, name: 'Travel', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100' },
  { id: 8, name: 'Beauty & Toys', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
  { id: 9, name: 'Two Wheelers', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/05d708653beff580.png?q=100' }
];

const AllCategories = () => {
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Map UI category names to DB category names
        let searchCategory = activeCategory.name;
        if (searchCategory === 'Home & Furniture') searchCategory = 'Home';
        if (searchCategory === 'Beauty & Toys') searchCategory = 'Beauty';

        const { data } = await api.get(`/api/products?category=${encodeURIComponent(searchCategory)}`);
        
        let filtered = data.filter(p => p.category === searchCategory || p.category.includes(searchCategory.split(' ')[0]));
        if (filtered.length === 0) {
          const keyword = searchCategory.split(' ')[0].toLowerCase();
          filtered = data.filter(p => p.category.toLowerCase().includes(keyword) || p.name.toLowerCase().includes(keyword));
        }
        
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchCategoryProducts();
  }, [activeCategory]);

  return (
    <MainLayout>
      <div className="bg-white min-h-[calc(100vh-60px)] flex flex-col md:flex-row pb-16 md:pb-0">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden bg-white p-4 border-b border-gray-200 sticky top-[60px] z-10 shadow-sm">
          <h1 className="text-[16px] font-medium text-[#212121]">All Categories</h1>
        </div>

        {/* Master Detail Layout */}
        <div className="flex flex-1 w-full max-w-7xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
          
          {/* Left Sidebar (Parent Categories) */}
          <div className="w-[85px] sm:w-[120px] md:w-[250px] shrink-0 bg-[#f1f3f6] overflow-y-auto border-r border-gray-200 scrollbar-hide">
            {categoriesData.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex flex-col items-center justify-center gap-1 md:gap-3 py-4 md:py-6 px-1 md:px-4 border-b border-gray-200 transition-colors relative
                  ${activeCategory.id === cat.id ? 'bg-white' : 'bg-[#f1f3f6] hover:bg-gray-100'}
                `}
              >
                {/* Active Indicator Border */}
                {activeCategory.id === cat.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#2874f0]"></div>
                )}
                
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center p-1 md:p-2">
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <span className={`text-[10px] md:text-[14px] text-center font-medium
                  ${activeCategory.id === cat.id ? 'text-[#2874f0]' : 'text-[#212121]'}
                `}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* Right Content (Products) */}
          <div className="flex-1 bg-white overflow-y-auto p-2 sm:p-4 md:p-8">
            <div className="mb-4 sm:mb-6 flex justify-between items-center border-b border-gray-100 pb-2 px-2">
              <h2 className="text-[16px] md:text-[20px] font-medium text-[#212121]">{activeCategory.name} Products</h2>
              <Link to={`/category/${encodeURIComponent(activeCategory.name)}`} className="text-[12px] md:text-[14px] text-[#2874f0] font-medium px-4 py-1 rounded-full bg-[#f1f3f6]">View All</Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10"><Loader /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-sm">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {products.map((product) => (
                  <Link 
                    key={product._id} 
                    to={`/product/${product._id}`}
                    className="flex flex-col border border-gray-100 rounded-md p-2 sm:p-3 hover:shadow-md transition-shadow group bg-white"
                  >
                    <div className="aspect-square mb-2 overflow-hidden flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-[12px] sm:text-[14px] font-medium text-[#212121] line-clamp-2 leading-snug mb-1">
                        {product.name}
                      </span>
                      <div className="mt-auto">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="bg-[#388e3c] text-white text-[10px] px-1 rounded-sm font-medium">
                            {product.rating} ★
                          </div>
                          <span className="text-[10px] text-gray-500">({product.numReviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] sm:text-[16px] font-bold text-[#212121]">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default AllCategories;
