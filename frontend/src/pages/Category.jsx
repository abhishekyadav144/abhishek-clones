import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CategoryMenu from '../components/CategoryMenu';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import api from '../services/api';

const Category = () => {
  const { name } = useParams();
  const categoryName = decodeURIComponent(name);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Assuming your backend supports filtering via ?category=
        const { data } = await api.get(`/api/products?category=${encodeURIComponent(categoryName)}`);
        
        // Fallback: If no exact category match, try keyword search
        let filtered = data.filter(p => p.category === categoryName);
        if (filtered.length === 0) {
          const searchKeyword = categoryName.toLowerCase();
          filtered = data.filter(p => 
            p.name.toLowerCase().includes(searchKeyword) || 
            p.category.toLowerCase().includes(searchKeyword) ||
            p.description?.toLowerCase().includes(searchKeyword)
          );
        }
        
        setProducts(filtered);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    
    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [categoryName]);

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen pb-8">
        <CategoryMenu />
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-0 flex flex-col md:flex-row gap-4 mt-4">
          
          {/* Filters Sidebar (Mock) */}
          <div className="hidden md:block w-[280px] shrink-0 bg-white shadow-sm border border-gray-100 h-fit rounded-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-[1.1rem] font-medium text-[#212121]">Filters</h2>
            </div>
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-[0.8rem] font-medium text-[#212121] uppercase mb-3">Categories</h3>
              <div className="text-[0.9rem] text-[#2874f0] font-medium cursor-pointer">
                &lt; {categoryName}
              </div>
            </div>
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-[0.8rem] font-medium text-[#212121] uppercase mb-3">Price</h3>
              <input type="range" className="w-full accent-[#2874f0]" min="0" max="100" />
              <div className="flex justify-between items-center mt-3">
                <select className="border border-gray-300 rounded-sm text-[0.85rem] px-2 py-1 outline-none"><option>Min</option></select>
                <span className="text-gray-400 text-sm">to</span>
                <select className="border border-gray-300 rounded-sm text-[0.85rem] px-2 py-1 outline-none"><option>Max</option></select>
              </div>
            </div>
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-[0.8rem] font-medium text-[#212121] uppercase mb-3">Customer Ratings</h3>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" className="w-4 h-4 accent-[#2874f0]" />
                <span className="text-[0.9rem] text-[#212121]">4★ & above</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 accent-[#2874f0]" />
                <span className="text-[0.9rem] text-[#212121]">3★ & above</span>
              </div>
            </div>
          </div>

          {/* Main Products Grid */}
          <div className="flex-1 bg-white shadow-sm border border-gray-100 rounded-sm min-h-[500px]">
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-[1.3rem] font-medium text-[#212121] inline-block mr-2">{categoryName}</h1>
              <span className="text-gray-500 text-[0.85rem]">(Showing 1 – {products.length} products)</span>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-20"><Loader /></div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty" className="w-48 mb-6" />
                <h3 className="text-[1.2rem] font-medium text-[#212121] mb-2">Sorry, no products found!</h3>
                <p>Please check the spelling or try searching for something else</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-gray-100">
                {products.map(product => (
                  <div key={product._id} className="border-b border-r border-gray-100 hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] transition-shadow">
                    <ProductCard product={{...product, id: product._id}} isGrid={true} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Category;
