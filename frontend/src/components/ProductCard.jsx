import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group flex flex-col bg-white border border-gray-200 hover:shadow-[0_8px_24px_rgba(149,157,165,0.2)] transition-shadow duration-300 rounded-lg overflow-visible w-full max-w-[280px] mx-auto h-[400px] decoration-transparent cursor-pointer relative"
    >
      
      {/* Product Image Section */}
      <div className="w-full h-[220px] bg-white flex items-center justify-center p-4 border-b border-gray-50 overflow-hidden rounded-t-lg group-hover:bg-gray-50 transition-colors relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://placehold.co/220x220/png?text=No+Image'; }}
        />
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-[#cc0c39] text-white text-[0.7rem] font-bold px-2 py-1 rounded-sm shadow-sm">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Product Details - Tightly Packed */}
      <div className="flex flex-col p-4 flex-grow bg-white">
        
        {/* Brand */}
        <span className="text-[#565959] text-[0.8rem] font-medium uppercase tracking-wide leading-tight mb-1">{product.brand}</span>
        
        {/* Title */}
        <h3 className="text-[#0F1111] font-medium text-[0.95rem] leading-[1.3rem] line-clamp-2 group-hover:text-[#2874f0] transition-colors mb-2 h-[2.6rem]">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2 mt-auto">
          <div className="flex text-[#F69B00] text-[1rem]">
            {'★'.repeat(Math.round(product.rating || 0))}
            <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating || 0))}</span>
          </div>
          <span className="text-[0.8rem] text-[#007185] group-hover:underline">
            {product.numReviews || product.reviews}
          </span>
        </div>
        
        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[1.3rem] font-medium text-[#0F1111] leading-none">
            <span className="text-[0.85rem] align-top mr-0.5">₹</span>{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[0.85rem] text-[#565959] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        {/* Delivery text */}
        <div className="text-[0.8rem] text-[#565959]">
          Get it by <span className="font-bold text-[#0F1111]">Tomorrow</span>
        </div>
        
        {/* Bank Offer */}
        <div className="text-[0.75rem] font-medium text-[#388e3c] mt-1">
          Bank Offer
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;
