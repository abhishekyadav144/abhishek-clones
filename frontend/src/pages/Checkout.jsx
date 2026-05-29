import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, Zap, ShieldCheck, ChevronRight, Lock, CreditCard, Ticket } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useCartStore from '../store/useCartStore';
import useOrderStore from '../store/useOrderStore';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  
  const [deliveryMethod, setDeliveryMethod] = useState('Standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [addressType, setAddressType] = useState('Home');

  // Address state
  const [savedAddressState, setSavedAddressState] = useState(JSON.parse(localStorage.getItem('shippingAddress')) || {});
  const [address, setAddress] = useState({
    fullName: savedAddressState.fullName || '',
    phone: savedAddressState.phone || '',
    altPhone: savedAddressState.altPhone || '',
    postalCode: savedAddressState.postalCode || '',
    city: savedAddressState.city || '',
    state: savedAddressState.state || '',
    houseNo: savedAddressState.houseNo || '',
    area: savedAddressState.area || '',
    landmark: savedAddressState.landmark || '',
  });

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(!savedAddressState.fullName);

  useEffect(() => {
    if (cartItems.length === 0 && !processing) {
      navigate('/cart');
    }
    window.scrollTo(0, 0);
  }, [cartItems, navigate, processing]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'ABHISHEK50') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code!');
    }
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (isAddingNewAddress) {
      alert('Please save the delivery address first.');
      return;
    }
    try {
      setProcessing(true);
      
      const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const baseDiscount = itemsPrice > 5000 ? itemsPrice * 0.1 : 0;
      const extraDiscount = couponApplied ? 500 : 0;
      const totalDiscount = baseDiscount + extraDiscount;
      
      // Delivery fee logic based on method
      let deliveryFee = 0;
      if (deliveryMethod === 'Express') deliveryFee = 99;
      if (deliveryMethod === 'SameDay') deliveryFee = 199;
      if (deliveryMethod === 'Standard' && itemsPrice < 500) deliveryFee = 40;

      const totalAmount = itemsPrice - totalDiscount + deliveryFee + 5; // +5 platform fee

      // Format full address for backward compatibility with orderModel
      const fullAddressString = `${address.houseNo}, ${address.area}, ${address.landmark ? address.landmark + ', ' : ''}${address.city}, ${address.state}`;

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          postalCode: address.postalCode,
          city: address.city,
          address: fullAddressString
        },
        paymentMethod: 'COD', // Defaulting to COD for this stage as per requirements
        itemsPrice,
        taxPrice: 5, // Platform fee mapped to taxPrice
        shippingPrice: deliveryFee,
        discount: totalDiscount,
        totalPrice: totalAmount,
      };

      // Save locally
      localStorage.setItem('shippingAddress', JSON.stringify(address));

      await createOrder(orderData);
      
      // Simulate premium payment processing delay
      setTimeout(async () => {
        await clearCart();
        navigate('/orders', { state: { success: true } });
      }, 2000);
      
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
      setProcessing(false);
    }
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const baseDiscount = itemsPrice > 5000 ? itemsPrice * 0.1 : 0;
  const extraDiscount = couponApplied ? 500 : 0;
  const totalDiscount = baseDiscount + extraDiscount;
  
  let deliveryFee = 0;
  if (deliveryMethod === 'Express') deliveryFee = 99;
  if (deliveryMethod === 'SameDay') deliveryFee = 199;
  if (deliveryMethod === 'Standard' && itemsPrice < 500) deliveryFee = 40;

  const totalAmount = itemsPrice - totalDiscount + deliveryFee + 5;

  if (processing) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Securing your order</h2>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" /> 100% Secure Encrypted Connection
          </p>
        </div>
      </div>
    );
  }

  // Floating Label Input Component
  const FloatingInput = ({ label, name, type = "text", value, onChange, required = false, className = "" }) => (
    <div className={`relative ${className}`}>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block px-5 pb-3 pt-6 w-full text-base text-gray-900 bg-white/50 border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 peer transition-all shadow-sm shadow-gray-100/50"
        placeholder=" "
      />
      <label 
        htmlFor={name}
        className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-600 font-medium"
      >
        {label}
      </label>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] py-12 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-400/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 text-sm font-medium text-gray-400 mb-10">
            <Link to="/cart" className="hover:text-indigo-600 transition-colors">Bag</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Delivery & Checkout</span>
          </div>

          <form onSubmit={placeOrderHandler} className="flex flex-col lg:flex-row gap-10">
            
            {/* Left Column: Form */}
            <div className="flex-grow space-y-8 lg:max-w-[65%]">
              
              {/* Delivery Details Card */}
              <div className="bg-white border-b border-gray-200 pb-8 sm:px-4">
                <div className="flex items-center gap-4 mb-6 pt-4">
                  <h2 className="text-2xl font-bold text-[#c45500]">1. Delivery Address</h2>
                </div>

                {!isAddingNewAddress && savedAddressState.fullName ? (
                  <div className="space-y-4 animate-fade-in">
                    {/* Saved Address Card (Amazon Style) */}
                    <div className="border border-[#e77600] bg-[#fcf4e8] rounded-lg p-5 flex items-start gap-4 cursor-pointer relative">
                      <input type="radio" checked readOnly className="mt-1 w-4 h-4 text-[#e77600] focus:ring-[#e77600] border-gray-300" />
                      <div className="flex-1 text-sm text-[#0F1111]">
                        <p className="font-bold text-base mb-1">{savedAddressState.fullName}</p>
                        <p>{savedAddressState.houseNo}, {savedAddressState.area}</p>
                        {savedAddressState.landmark && <p>{savedAddressState.landmark}</p>}
                        <p className="font-medium mt-0.5">{savedAddressState.city}, {savedAddressState.state} {savedAddressState.postalCode}</p>
                        <p className="mt-1 text-gray-600">Mobile: <span className="font-medium text-[#0F1111]">{savedAddressState.phone}</span></p>
                        
                        <div className="mt-4 flex gap-4">
                          <button type="button" onClick={() => setIsAddingNewAddress(true)} className="text-[#007185] hover:text-[#c45500] hover:underline font-medium">Edit address</button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => { 
                        setAddress({ fullName: '', phone: '', altPhone: '', postalCode: '', city: '', state: '', houseNo: '', area: '', landmark: '' }); 
                        setIsAddingNewAddress(true); 
                      }} 
                      className="flex items-center gap-3 text-gray-600 hover:text-[#c45500] mt-6 group text-sm font-medium border-t pt-4"
                    >
                      <span className="text-xl text-gray-400 font-normal">+</span> Add a new address
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="font-bold text-xl mb-6 text-gray-900 border-b pb-3">Add a new address</h3>
                    
                    <div className="space-y-4">
                      {/* Name & Phone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Full name (First and Last name)</label>
                        <input type="text" name="fullName" value={address.fullName} onChange={handleAddressChange} required={isAddingNewAddress} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Mobile number</label>
                        <input type="tel" name="phone" value={address.phone} onChange={handleAddressChange} required={isAddingNewAddress} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                      </div>

                      {/* Address Fields */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Pincode</label>
                        <input type="text" name="postalCode" value={address.postalCode} onChange={handleAddressChange} required={isAddingNewAddress} placeholder="6 digits [0-9] PIN code" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Flat, House no., Building, Company, Apartment</label>
                        <input type="text" name="houseNo" value={address.houseNo} onChange={handleAddressChange} required={isAddingNewAddress} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Area, Street, Sector, Village</label>
                        <input type="text" name="area" value={address.area} onChange={handleAddressChange} required={isAddingNewAddress} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Landmark</label>
                        <input type="text" name="landmark" value={address.landmark} onChange={handleAddressChange} placeholder="E.g. near apollo hospital" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1">Town/City</label>
                          <input type="text" name="city" value={address.city} onChange={handleAddressChange} required={isAddingNewAddress} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1">State</label>
                          <input type="text" name="state" value={address.state} onChange={handleAddressChange} required={isAddingNewAddress} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all" />
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          type="button" 
                          onClick={() => {
                            if(!address.fullName || !address.phone || !address.houseNo || !address.city || !address.state || !address.postalCode) {
                              alert("Please fill all required address fields");
                              return;
                            }
                            setSavedAddressState(address);
                            localStorage.setItem('shippingAddress', JSON.stringify(address));
                            setIsAddingNewAddress(false);
                          }}
                          className="bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] text-[#0F1111] px-6 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
                        >
                          Use this address
                        </button>
                        {savedAddressState.fullName && (
                          <button 
                            type="button" 
                            onClick={() => { setAddress(savedAddressState); setIsAddingNewAddress(false); }}
                            className="ml-4 px-6 py-2 text-[#007185] hover:underline font-medium text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Method Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">2</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Delivery Method</h2>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Standard */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${deliveryMethod === 'Standard' ? 'border-indigo-600 bg-indigo-50/30 shadow-[0_4px_20px_rgb(79,70,229,0.1)]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input type="radio" name="deliveryMethod" value="Standard" checked={deliveryMethod === 'Standard'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mt-1 w-5 h-5 text-indigo-600 focus:ring-indigo-600 border-gray-300" />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Package className={`w-5 h-5 ${deliveryMethod === 'Standard' ? 'text-indigo-600' : 'text-gray-400'}`} />
                          <span className="font-bold text-gray-900">Standard Delivery</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Delivery in 3-5 business days</p>
                      </div>
                      <span className="font-bold text-gray-900">{itemsPrice >= 500 ? 'FREE' : '₹40'}</span>
                    </div>
                  </label>

                  {/* Express */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${deliveryMethod === 'Express' ? 'border-indigo-600 bg-indigo-50/30 shadow-[0_4px_20px_rgb(79,70,229,0.1)]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input type="radio" name="deliveryMethod" value="Express" checked={deliveryMethod === 'Express'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mt-1 w-5 h-5 text-indigo-600 focus:ring-indigo-600 border-gray-300" />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className={`w-5 h-5 ${deliveryMethod === 'Express' ? 'text-indigo-600' : 'text-gray-400'}`} />
                          <span className="font-bold text-gray-900">Express Delivery</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Delivery in 1-2 business days</p>
                      </div>
                      <span className="font-bold text-gray-900">₹99</span>
                    </div>
                  </label>

                  {/* Same Day */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${deliveryMethod === 'SameDay' ? 'border-indigo-600 bg-indigo-50/30 shadow-[0_4px_20px_rgb(79,70,229,0.1)]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input type="radio" name="deliveryMethod" value="SameDay" checked={deliveryMethod === 'SameDay'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mt-1 w-5 h-5 text-indigo-600 focus:ring-indigo-600 border-gray-300" />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className={`w-5 h-5 ${deliveryMethod === 'SameDay' ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                          <span className="font-bold text-gray-900">Same Day Delivery</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Delivery by tonight 9PM</p>
                      </div>
                      <span className="font-bold text-gray-900">₹199</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Floating Order Summary */}
            <div className="w-full lg:w-[35%] shrink-0">
              <div className="sticky top-28 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-white/60 overflow-hidden flex flex-col">
                
                <div className="p-8 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Order Summary</h3>
                  
                  {/* Mini Product Preview */}
                  <div className="flex -space-x-4 mb-6">
                    {cartItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-14 h-14 rounded-full bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-[3] relative" style={{ zIndex: 10 - idx }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center z-[1] relative text-sm font-bold text-gray-600">
                        +{cartItems.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium text-gray-500">{cartItems.reduce((a,c) => a + c.quantity, 0)} items in your bag</p>
                </div>

                {/* Coupon Code */}
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-900">
                    <Ticket className="w-4 h-4 text-indigo-600" /> Apply Promo Code
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. ABHISHEK50" 
                      disabled={couponApplied}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none uppercase font-bold text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-inner" 
                    />
                    <button 
                      type="button"
                      onClick={handleApplyCoupon} 
                      disabled={couponApplied || !couponCode}
                      className="bg-gray-900 text-white px-6 rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {couponApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {couponApplied && <p className="text-sm text-green-600 font-bold mt-3 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Coupon applied! ₹500 off.</p>}
                </div>

                {/* Pricing Breakdown */}
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{itemsPrice.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-medium animate-fade-in">
                      <span>Discount</span>
                      <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Platform Fee</span>
                    <span className="text-gray-900">₹5</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-bold' : 'text-gray-900'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <hr className="border-gray-100 my-4" />

                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Due</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tight">₹{totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={orderLoading || isAddingNewAddress}
                    className="w-full py-3 mt-6 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0F1111] font-medium text-[15px] shadow-sm transition-colors disabled:opacity-50"
                  >
                    Place your order
                  </button>

                  {/* Secure Payment Badges */}
                  <div className="pt-6 flex flex-col items-center justify-center gap-3 opacity-60">
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> 100% Secure Payments
                    </p>
                    <div className="flex items-center gap-3 text-gray-400">
                      <CreditCard className="w-6 h-6" />
                      <div className="font-bold text-[10px] border border-gray-300 px-1.5 rounded uppercase">UPI</div>
                      <div className="font-bold text-[10px] border border-gray-300 px-1.5 rounded uppercase">Visa</div>
                      <div className="font-bold text-[10px] border border-gray-300 px-1.5 rounded uppercase">Mastercard</div>
                      <div className="font-bold text-[10px] border border-gray-300 px-1.5 rounded uppercase">COD</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </form>

        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
