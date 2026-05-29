import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart, fetchCart, deliveryPincode, setDeliveryPincode } = useCartStore();
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlistStore();

  const [showPincodeInput, setShowPincodeInput] = React.useState(false);
  const [pincode, setPincode] = React.useState('');
  const [pincodeError, setPincodeError] = React.useState('');
  const [isDetecting, setIsDetecting] = React.useState(false);

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && !isNaN(pincode)) {
      setDeliveryPincode(pincode);
      setShowPincodeInput(false);
      setPincodeError('');
    } else {
      setPincodeError('Invalid pincode');
    }
  };

  const removePincode = () => {
    setDeliveryPincode('');
    setPincode('');
    setShowPincodeInput(false);
    setPincodeError('');
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setPincodeError('');
    
    const setSuccess = (code) => {
      setDeliveryPincode(code);
      setPincode('');
      setShowPincodeInput(false);
      setPincodeError('');
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

  const handleSaveForLater = (item) => {
    const productForWishlist = {
      _id: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      rating: item.rating || 4.1,
      numReviews: item.numReviews || 45,
    };
    if (!isInWishlist(item.product)) {
      toggleWishlist(productForWishlist);
    }
    removeFromCart(item.product);
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const handleMoveToCart = (item) => {
    // Add to cart
    addToCart(item._id || item.id, 1, item.size || 'M', item.color || 'Default');
    
    // Remove from wishlist
    toggleWishlist(item);
  };

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const discount = itemsPrice > 5000 ? itemsPrice * 0.1 : 0;
  const delivery = itemsPrice > 500 ? 0 : 40;
  const totalAmount = itemsPrice - discount + delivery;

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen py-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 px-2">
          
          {/* Left Column: Cart Items */}
          <div className="flex-grow flex flex-col gap-4">
            
            <div className="bg-white shadow-sm flex items-center justify-between p-4">
              <span className="font-medium text-[1.1rem]">AbhishekCart ( {cartItems.reduce((a,c) => a + c.quantity, 0)} )</span>
              <div className="flex items-center gap-2 relative">
                <span className="text-[#878787] text-[0.9rem] hidden sm:inline">Deliver to:</span>
                
                {deliveryPincode ? (
                  <div className="flex items-center gap-2 border border-gray-300 rounded-sm px-3 py-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="text-[#212121] font-medium text-[0.9rem]">{deliveryPincode}</span>
                    <button onClick={removePincode} className="text-gray-400 hover:text-red-500 ml-2" title="Remove Pincode">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ) : showPincodeInput ? (
                  <div className="flex flex-col relative">
                    <form onSubmit={handlePincodeSubmit} className="flex items-center">
                      <input 
                        type="text" 
                        autoFocus
                        maxLength={6}
                        placeholder="Enter Pincode" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="border border-[#2874f0] outline-none text-[0.9rem] px-3 py-1 rounded-sm w-[130px]"
                      />
                      <button type="submit" className="bg-[#2874f0] text-white px-3 py-1 text-[0.9rem] rounded-r-sm hover:bg-[#1c64d9] transition-colors -ml-1">Check</button>
                    </form>
                    <button 
                      onClick={handleDetectLocation} 
                      type="button" 
                      className="absolute top-full left-0 mt-1 text-[#2874f0] text-[0.8rem] font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                      {isDetecting ? 'Detecting...' : 'Use my current location'}
                    </button>
                    {pincodeError && <span className="absolute top-full right-0 text-red-500 text-[0.75rem] mt-1 whitespace-nowrap">{pincodeError}</span>}
                  </div>
                ) : (
                  <button onClick={() => setShowPincodeInput(true)} className="border border-gray-300 rounded-sm px-4 py-1 text-[#2874f0] hover:border-[#2874f0] transition-colors font-medium text-[0.9rem]">Select Pincode</button>
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-[200px] mb-4" />
                  <h2 className="text-[1.2rem] font-medium mb-2">Your cart is empty!</h2>
                  <p className="text-[#878787] text-[0.9rem] mb-6">Add items to it now.</p>
                  <Link to="/" className="bg-[#2874f0] text-white px-16 py-3 rounded-sm shadow-sm font-medium">Shop now</Link>
                </div>
              ) : (
                <div className="flex flex-col">
                  {cartItems.map((item) => {
                    const originalPrice = item.originalPrice || Math.round(item.price * 1.5);
                    const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);
                    return (
                      <div key={item.product} className="flex flex-col border-b border-gray-100 bg-white group">
                        
                        {/* Top Content */}
                        <div className="flex flex-col sm:flex-row p-6 gap-6 relative">
                          {/* Image & Qty */}
                          <div className="flex flex-col items-center gap-2 w-[112px] shrink-0">
                            {item.discountPercentage > 20 && <span className="text-[#388e3c] text-[10px] font-bold self-start">Grwm Deal</span>}
                            <Link to={`/product/${item.product}`}>
                              <img src={item.image} alt={item.name} className="w-[112px] h-[112px] object-contain" />
                            </Link>
                            
                            {/* Qty Select */}
                            <div className="mt-2 w-full flex items-center justify-between border border-gray-200 rounded-sm px-2 py-1 text-[14px] cursor-pointer bg-white group/qty relative">
                              <span className="font-medium text-[#212121]">Qty: {item.quantity}</span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
                              
                              {/* Simple hover dropdown for Qty */}
                              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-md hidden group-hover/qty:flex flex-col z-20 max-h-[150px] overflow-y-auto">
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                  <div 
                                    key={n} 
                                    className={`px-3 py-1 hover:bg-[#f1f3f6] ${item.quantity === n ? 'bg-[#f1f3f6] font-bold' : ''}`}
                                    onClick={() => updateQuantity(item.product, n)}
                                  >
                                    {n}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Product Data */}
                          <div className="flex flex-col flex-grow">
                            <Link to={`/product/${item.product}`} className="text-[16px] text-[#212121] hover:text-[#2874f0] font-medium mb-1 leading-snug">{item.name}</Link>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-[2px] rounded-sm text-[12px] font-medium">
                                {item.rating || 4.1} ★
                              </div>
                              <span className="text-[#878787] text-[14px] font-medium">({item.numReviews || 794})</span>
                              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-[18px] ml-2" alt="f-assured" />
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[#388e3c] font-bold text-[14px]">↓{discountPercent}%</span>
                              <span className="text-[#878787] text-[14px] line-through font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>
                              <span className="text-[18px] font-bold text-[#212121]">₹{item.price.toLocaleString('en-IN')}</span>
                            </div>
                            
                            {item.price > 500 && (
                              <div className="text-[14px] font-bold mb-4">
                                <span className="text-[#2874f0]">WOW!</span> <span className="text-[#2874f0]">Buy at ₹{Math.floor(item.price * 0.95)}</span>
                              </div>
                            )}

                            <div className="text-[14px] text-[#212121] mt-auto">
                              Delivery by {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center border-t border-gray-100 divide-x divide-gray-100">
                          <button 
                            onClick={() => handleSaveForLater(item)} 
                            className="flex-1 py-4 text-[#212121] font-medium text-[16px] hover:text-[#2874f0] transition-colors flex items-center justify-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            Save for later
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.product)} 
                            className="flex-1 py-4 text-[#212121] font-medium text-[16px] hover:text-[#2874f0] transition-colors flex items-center justify-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            Remove
                          </button>
                          <button 
                            onClick={checkoutHandler} 
                            className="flex-1 py-4 text-[#212121] font-medium text-[16px] hover:text-[#2874f0] transition-colors flex items-center justify-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            Buy this now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved For Later (Wishlist) Section */}
            {wishlistItems && wishlistItems.length > 0 && (
              <div className="bg-white shadow-sm mt-4">
                <div className="font-medium text-[1.1rem] p-4 border-b border-gray-100">
                  Saved For Later ({wishlistItems.length})
                </div>
                <div className="flex flex-col">
                  {wishlistItems.map((item) => {
                    const originalPrice = item.originalPrice || Math.round(item.price * 1.5);
                    const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);
                    return (
                      <div key={item._id || item.id} className="flex flex-col border-b border-gray-100 bg-white group">
                        
                        <div className="flex flex-col sm:flex-row p-6 gap-6 relative">
                          <div className="flex flex-col items-center gap-2 w-[112px] shrink-0">
                            <Link to={`/product/${item._id || item.id}`}>
                              <img src={item.image} alt={item.name} className="w-[112px] h-[112px] object-contain opacity-75" />
                            </Link>
                          </div>

                          <div className="flex flex-col flex-grow">
                            <Link to={`/product/${item._id || item.id}`} className="text-[16px] text-[#212121] hover:text-[#2874f0] font-medium mb-1 leading-snug line-clamp-2">{item.name}</Link>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-[2px] rounded-sm text-[12px] font-medium">
                                {item.rating || 4.1} ★
                              </div>
                              <span className="text-[#878787] text-[14px] font-medium">({item.numReviews || 794})</span>
                              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-[18px] ml-2" alt="f-assured" />
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[#388e3c] font-bold text-[14px]">↓{discountPercent}%</span>
                              <span className="text-[#878787] text-[14px] line-through font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>
                              <span className="text-[18px] font-bold text-[#212121]">₹{item.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center border-t border-gray-100 divide-x divide-gray-100">
                          <button 
                            onClick={() => handleMoveToCart(item)} 
                            className="flex-1 py-4 text-[#2874f0] font-medium text-[16px] transition-colors flex items-center justify-center gap-2 uppercase"
                          >
                            Move to Cart
                          </button>
                          <button 
                            onClick={() => toggleWishlist(item)} 
                            className="flex-1 py-4 text-[#212121] font-medium text-[16px] hover:text-red-500 transition-colors flex items-center justify-center gap-2 uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column: Price Details */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-[350px] shrink-0">
              <div className="bg-white shadow-sm sticky top-[76px]">
                <h3 className="uppercase text-[#878787] font-bold px-6 py-4 border-b border-gray-100">Price Details</h3>
                
                <div className="p-6 flex flex-col gap-5 border-b border-gray-100 border-dashed">
                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Price ({cartItems.reduce((a,c) => a + c.quantity, 0)} item{cartItems.length > 1 ? 's' : ''})</span>
                    <span>₹{cartItems.reduce((acc, item) => acc + item.quantity * (item.originalPrice || Math.round(item.price * 1.5)), 0).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Discount</span>
                    <span className="text-[#388e3c]">- ₹{(cartItems.reduce((acc, item) => acc + item.quantity * (item.originalPrice || Math.round(item.price * 1.5)), 0) - itemsPrice).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Coupons for you</span>
                    <span className="text-[#388e3c]">- ₹90</span>
                  </div>

                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Platform Fee</span>
                    <span>₹11</span>
                  </div>

                  <div className="flex justify-between text-[16px] text-[#212121]">
                    <span>Delivery Charges</span>
                    <span className="text-[#388e3c]">Free</span>
                  </div>
                </div>
                
                <div className="p-6 border-b border-gray-100 border-dashed">
                  <div className="flex justify-between text-[18px] font-bold text-[#212121]">
                    <span>Total Amount</span>
                    <span>₹{(totalAmount - 90 + 11).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <div className="bg-[#e5f7ed] text-[#388e3c] font-bold text-[14px] p-3 rounded-sm text-center">
                    You'll save ₹{((cartItems.reduce((acc, item) => acc + item.quantity * (item.originalPrice || Math.round(item.price * 1.5)), 0) - itemsPrice) + 90).toLocaleString('en-IN')} on this order!
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white border-t border-gray-100 text-[#878787] text-[13px] font-medium leading-tight">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Safe and secure payments. Easy returns. 100% Authentic products.
                </div>

                {/* Sticky Place Order button on mobile/desktop */}
                <div className="p-4 shadow-[0_-2px_10px_0_rgba(0,0,0,0.05)] bg-white flex justify-between items-center sticky bottom-0 z-10 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[14px] line-through text-[#878787]">₹{cartItems.reduce((acc, item) => acc + item.quantity * (item.originalPrice || Math.round(item.price * 1.5)), 0).toLocaleString('en-IN')}</span>
                    <span className="text-[20px] font-bold text-[#212121] flex items-center gap-1">
                      ₹{(totalAmount - 90 + 11).toLocaleString('en-IN')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#878787" strokeWidth="2" className="cursor-pointer"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </span>
                  </div>
                  <button 
                    onClick={checkoutHandler}
                    className="bg-[#fb641b] text-white px-8 py-3 rounded-sm font-bold text-[16px] shadow-sm hover:bg-[#f35b11]"
                  >
                    Place Order
                  </button>
                </div>
                
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
