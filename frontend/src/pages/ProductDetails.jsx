import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import api from '../services/api';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // null, 'checking', 'valid', 'invalid'
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { cartItems, addToCart, removeFromCart, deliveryPincode, setDeliveryPincode } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const isWished = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setMainImage(data.image);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        setLoading(false);
        
        const relatedRes = await api.get(`/api/products?category=${data.category}`);
        setRelatedProducts(relatedRes.data.filter(p => p._id !== data._id).slice(0, 4));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, qty, selectedSize, selectedColor);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    setAdding(true);
    const success = await addToCart(product._id, qty, selectedSize, selectedColor);
    setAdding(false);
    if(success) navigate('/cart');
  };

  const handlePincodeCheck = () => {
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus('invalid');
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      setPincodeStatus('valid');
      setDeliveryPincode(pincode);
    }, 800);
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setPincodeStatus('checking');

    const setSuccess = (code) => {
      setPincode(code);
      setDeliveryPincode(code);
      setPincodeStatus('valid');
      setIsDetecting(false);
    };

    try {
      // Fast IP-based detection
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.postal) {
          return setSuccess(data.postal);
        }
      }
    } catch (e) {
      console.log('IP location failed, trying HTML5...');
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          const detectedPincode = (data && data.address && data.address.postcode) ? data.address.postcode : '110001';
          setSuccess(detectedPincode);
        } catch (error) {
          setSuccess('110001');
        }
      }, (error) => {
        setSuccess('110001');
      }, { timeout: 4000, enableHighAccuracy: false });
    } else {
      setSuccess('110001');
    }
  };

  const isInCart = product ? cartItems.some((item) => item.product === product._id) : false;

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Loader /></div></MainLayout>;

  if (error || !product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto my-12 text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-sm">{error || 'Product not found'}</div>
          <Link to="/" className="inline-block mt-4 text-[#2874f0] hover:underline">&larr; Go Back</Link>
        </div>
      </MainLayout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : [];
  const colors = product.colors && product.colors.length > 0 ? product.colors : [];

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen py-6 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto bg-white shadow-sm flex flex-col md:flex-row border border-gray-200">
          
          {/* Left Column: Sticky Image Section & Action Buttons */}
          <div className="w-full md:w-[45%] p-6 border-r border-gray-100 flex flex-col relative shrink-0">
            <div className="sticky top-[80px]">
              
              <div className="flex gap-4">
                {/* Vertical Thumbnails */}
                {images.length > 1 && (
                  <div className="flex flex-col gap-2 w-[64px] shrink-0 hidden sm:flex">
                    {images.map((img, idx) => (
                      <div key={idx} 
                        onClick={() => setMainImage(img)}
                        className={`w-16 h-16 border rounded-sm p-1 cursor-pointer transition-colors ${mainImage === img ? 'border-[#2874f0]' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="flex-grow border border-gray-100 rounded-sm relative overflow-hidden group h-[300px] sm:h-[450px] flex items-center justify-center bg-white">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain p-4 transition-transform duration-300 group-hover:scale-125 cursor-crosshair origin-center"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400/png?text=No+Image'; }}
                  />
                  
                  {/* Share/Favorite icons overlay could go here */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:shadow-md transition-all shadow-sm z-10"
                  >
                    <Heart className={`w-5 h-5 ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                  </button>
                </div>
              </div>

              {/* Action Buttons directly under the image */}
              <div className="flex gap-4 mt-6">
                {isInCart ? (
                  <button 
                    className="flex-1 py-4 bg-gray-100 text-[#212121] border border-gray-300 font-medium text-[1.1rem] rounded-md shadow-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    onClick={() => removeFromCart(product._id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    REMOVE FROM CART
                  </button>
                ) : (
                  <button 
                    className="flex-1 py-4 bg-[#ff9f00] text-white font-medium text-[1.1rem] rounded-md shadow-sm flex items-center justify-center gap-2 hover:bg-[#f39800] transition-colors disabled:opacity-50"
                    disabled={product.countInStock === 0 || adding}
                    onClick={handleAddToCart}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    {adding ? 'ADDING...' : 'ADD TO CART'}
                  </button>
                )}
                <button 
                  className="flex-1 py-4 bg-[#fb641b] text-white font-medium text-[1.1rem] rounded-md shadow-sm flex items-center justify-center gap-2 hover:bg-[#e05a18] transition-colors disabled:opacity-50"
                  disabled={product.countInStock === 0}
                  onClick={handleBuyNow}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full md:w-[55%] p-8">
            <nav className="text-[0.8rem] text-gray-500 mb-4 flex gap-2">
              <Link to="/" className="hover:text-[#2874f0] transition-colors">Home</Link>
              <span>&gt;</span>
              <Link to={`/?category=${product.category}`} className="hover:text-[#2874f0] transition-colors">{product.category}</Link>
              <span>&gt;</span>
              <span className="truncate text-gray-400">{product.name}</span>
            </nav>
            
            {/* Title & Brand */}
            <h1 className="text-[1.3rem] md:text-[1.5rem] font-medium text-[#212121] leading-snug mb-1">
              {product.name}
            </h1>
            <p className="text-[#007185] text-[0.95rem] hover:underline cursor-pointer mb-3 inline-block">Visit the {product.brand} Store</p>
            
            {/* Ratings */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1.5 bg-[#388e3c] text-white text-[0.85rem] font-bold px-2 py-0.5 rounded-sm">
                {product.rating || 4.1} <span className="text-[0.7rem]">★</span>
              </div>
              <span className="text-[#007185] font-medium text-[0.95rem] hover:underline cursor-pointer">
                {product.numReviews} Ratings & 45 Reviews
              </span>
            </div>

            {/* Price Area */}
            <div className="mb-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-[2rem] font-medium text-[#212121] leading-none">
                  <span className="text-[1.2rem] align-top mr-1 font-normal">₹</span>{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[#565959] text-[1.1rem] line-through mb-1">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="text-[#388e3c] font-bold text-[1.1rem] mb-1">
                    {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                )}
              </div>
              <p className="text-[#565959] text-[0.9rem]">Inclusive of all taxes</p>
            </div>
            
            {/* Offers */}
            <div className="text-[0.95rem] text-[#212121] mb-8">
              <p className="font-bold mb-3 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                Available Offers
              </p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  <span><span className="font-bold">Bank Offer</span> 5% Cashback on AbhishekCart Axis Bank Card <span className="text-[#2874f0] cursor-pointer hover:underline">T&C</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  <span><span className="font-bold">Special Price</span> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-[#2874f0] cursor-pointer hover:underline">T&C</span></span>
                </li>
              </ul>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-6">
                <p className="text-[#878787] text-[0.95rem] font-medium mb-3">Color</p>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-14 h-14 border p-1 rounded-sm cursor-pointer transition-all"
                      style={{ borderColor: selectedColor === color ? '#2874f0' : '#e0e0e0', boxShadow: selectedColor === color ? '0 0 0 1px #2874f0' : 'none' }}
                      title={color}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: color.toLowerCase() }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-[#878787] text-[0.95rem] font-medium mb-3">Size</p>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-2 border text-[0.95rem] font-medium rounded-sm transition-colors ${selectedSize === size ? 'border-[#2874f0] text-[#2874f0] bg-blue-50' : 'border-gray-300 text-[#212121] hover:border-[#2874f0]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Highlights & Delivery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
              
              <div>
                <span className="text-[#878787] text-[0.95rem] font-medium mb-4 block">Highlights</span>
                <ul className="list-disc pl-5 space-y-2 text-[0.95rem] text-[#212121]">
                  <li>Brand: {product.brand}</li>
                  <li>Category: {product.category}</li>
                  <li>Material: {product.material || 'Premium Quality'}</li>
                  <li>Fit: {product.fit || 'Regular'}</li>
                  <li>Warranty: 1 Year Manufacturer Warranty</li>
                </ul>
              </div>

              <div>
                <span className="text-[#878787] text-[0.95rem] font-medium mb-4 block flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Delivery Options
                </span>
                
                {deliveryPincode && pincodeStatus !== 'checking' ? (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#212121] font-medium text-[0.95rem]">Delivery to {deliveryPincode}</span>
                    <span 
                      onClick={() => { setDeliveryPincode(''); setPincode(''); setPincodeStatus(null); }}
                      className="text-[#2874f0] text-[0.85rem] font-medium cursor-pointer hover:underline"
                    >
                      Change
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col mb-2 relative">
                      <div className="flex items-center gap-2 relative">
                        <input 
                          type="text" 
                          placeholder="Enter Pincode" 
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className={`border-b-2 outline-none text-[0.95rem] py-1 font-medium text-[#212121] bg-transparent w-full transition-colors ${pincodeStatus === 'invalid' ? 'border-red-500' : 'border-[#2874f0]'}`} 
                        />
                        <span 
                          onClick={handlePincodeCheck}
                          className="text-[#2874f0] text-[0.95rem] font-bold cursor-pointer hover:underline uppercase absolute right-0"
                        >
                          Check
                        </span>
                      </div>
                      
                      {pincodeStatus !== 'checking' && (
                        <button 
                          onClick={handleDetectLocation} 
                          type="button" 
                          className="mt-2 text-[#2874f0] text-[0.85rem] font-medium hover:underline flex items-center gap-1 w-fit"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                          Use my current location
                        </button>
                      )}
                    </div>
                    
                    {pincodeStatus === 'invalid' && (
                      <p className="text-red-500 text-[0.8rem] mb-2 font-medium">Please enter a valid 6-digit pincode.</p>
                    )}
                    
                    {pincodeStatus === 'checking' && (
                      <p className="text-gray-500 text-[0.85rem] mb-2 flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span> {isDetecting ? 'Detecting location...' : 'Checking availability...'}
                      </p>
                    )}
                  </>
                )}
                
                {pincodeStatus === 'valid' && (
                  <p className="text-green-600 text-[0.85rem] mb-2 font-medium">✓ Delivery available for {deliveryPincode || pincode}</p>
                )}

                <div className="text-[0.95rem] mt-4">
                  <p className="text-[#212121]">Delivery by <span className="font-bold">{new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span> | <span className="text-[#388e3c] font-medium">Free</span> <span className="line-through text-[#878787]">₹40</span></p>
                  <p className="text-gray-500 text-[0.8rem] mt-1">If ordered before 4:00 PM</p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-[#878787] text-[0.95rem] font-medium mb-3 block">Seller</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#2874f0] text-[1.05rem] font-medium cursor-pointer hover:underline">RetailNet</span>
                      <div className="flex flex-wrap gap-2 mt-1 items-center">
                        <span className="bg-[#2874f0] text-white text-[0.7rem] px-1.5 py-0.5 rounded-sm font-bold flex items-center">4.8 ★</span>
                        <span className="text-[0.8rem] text-gray-500">7 Days Replacement Policy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 mt-8 pt-8">
              <span className="text-[#878787] text-[1.1rem] font-medium mb-4 block">Product Description</span>
              <p className="text-[0.95rem] text-[#212121] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-8">
            <h2 className="text-[1.3rem] font-medium text-[#212121] mb-4">Related Products</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
              {relatedProducts.map(prod => (
                <div key={prod._id} className="min-w-[240px] md:min-w-[280px] shrink-0 snap-start">
                  <ProductCard product={{...prod, id: prod._id}} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default ProductDetails;
