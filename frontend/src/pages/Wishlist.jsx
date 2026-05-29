import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useWishlistStore from '../store/useWishlistStore';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f1f3f6] py-4 sm:py-8">
        <div className="max-w-[1200px] mx-auto px-2 sm:px-4">
          
          <div className="bg-white rounded-sm shadow-sm flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-[18px] font-bold text-[#212121]">My Wishlist ({wishlistItems.length})</h1>
            </div>

            {/* Empty State */}
            {wishlistItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="Empty Wishlist" className="w-[300px] mb-6" />
                <h2 className="text-[18px] font-medium text-[#212121] mb-2">Empty Wishlist</h2>
                <p className="text-[14px] text-gray-500 mb-6">You have no items in your wishlist. Start adding!</p>
              </div>
            ) : (
              /* Wishlist Items List */
              <div className="flex flex-col">
                {wishlistItems.map((product) => (
                  <div key={product._id} className="group relative flex flex-col sm:flex-row gap-6 p-6 border-b border-gray-100 hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] transition-shadow">
                    
                    {/* Delete Icon */}
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-6 right-6 text-[#c2c2c2] hover:text-[#2874f0]"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <Link to={`/product/${product._id}`} className="w-[120px] h-[120px] shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link to={`/product/${product._id}`} className="text-[16px] font-medium text-[#212121] hover:text-[#2874f0] line-clamp-1 mb-2">
                        {product.name}
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-[2px] rounded-sm text-[12px] font-medium">
                          {product.rating} ★
                        </div>
                        <span className="text-[#878787] text-[14px] font-medium">({product.numReviews})</span>
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-[18px] ml-2" alt="f-assured" />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[24px] font-bold text-[#212121]">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="text-[14px] text-[#878787] line-through font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            <span className="text-[14px] font-bold text-[#388e3c]">{product.discountPercentage}% off</span>
                          </>
                        )}
                      </div>
                    </div>
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

export default Wishlist;
