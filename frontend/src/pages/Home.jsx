import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import CategoryMenu from '../components/CategoryMenu';
import ProductCard from '../components/ProductCard';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';

const ProductRow = ({ title, products, bgColor = "bg-white" }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <div className={`${bgColor} shadow-sm mx-2 sm:mx-4 md:mx-auto max-w-7xl mb-4 pt-4`}>
      <div className="flex justify-between items-center px-6 mb-4">
        <h2 className="text-[1.3rem] font-medium text-[#212121]">{title}</h2>
        <button className="bg-[#2874f0] text-white px-4 py-2 rounded-sm text-sm font-medium shadow-sm hover:bg-[#1a5bc2]">
          VIEW ALL
        </button>
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-6 pt-2 scrollbar-hide snap-x">
        {products.map(product => (
          <div key={product._id} className="min-w-[240px] md:min-w-[280px] shrink-0 snap-start">
            <ProductCard product={{...product, id: product._id}} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 text-red-700 p-6 rounded-sm text-center max-w-7xl mx-auto mt-4">
          Error loading products: {error}
        </div>
      </MainLayout>
    );
  }

  // Filter products for different sections
  const electronics = products.filter(p => ['Mobiles', 'Laptops', 'Electronics'].includes(p.category));
  const fashion = products.filter(p => ['Fashion', 'Shoes', 'Watches'].includes(p.category));
  const appliances = products.filter(p => ['Appliances', 'Electronics'].includes(p.category)).reverse(); // Just to mix it up
  const gaming = products.filter(p => p.category === 'Gaming' || p.category === 'Laptops');

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen pb-8">
        <CategoryMenu />
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : (
          <>
            <Hero />
            
            <ProductRow 
              title="Best of Electronics" 
              products={electronics.slice(0, 8)} 
            />
            
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-0 mb-4 hidden md:block">
              <img src="https://rukminim1.flixcart.com/fk-p-flap/3376/560/image/24a1b069d275330e.jpg?q=50" alt="Bank Offer" className="w-full shadow-sm rounded-sm" />
            </div>

            <ProductRow 
              title="Trending Fashion" 
              products={fashion.slice(0, 8)} 
            />
            
            <ProductRow 
              title="Appliance for Cool Summer" 
              products={appliances.slice(0, 8)} 
            />

            <ProductRow 
              title="Gaming Essentials" 
              products={gaming.slice(0, 8)} 
            />
            
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-0 mb-4">
              <div className="bg-white p-6 shadow-sm rounded-sm text-center text-sm text-gray-500">
                <p>AbhishekCart - The best place to buy authentic products. We offer a massive collection across Categories.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
