import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import useCartStore from '../store/useCartStore';

const PlaceOrder = () => {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [shippingAddress] = useState(JSON.parse(localStorage.getItem('shippingAddress')) || {});

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    // In a real app, integrate Stripe/Razorpay here
    alert('Order placed successfully! In a real app, this would integrate with a payment gateway.');
    await clearCart();
    navigate('/');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const discount = itemsPrice > 5000 ? itemsPrice * 0.1 : 0;
  const delivery = itemsPrice > 500 ? 0 : 40;
  const totalAmount = itemsPrice - discount + delivery;

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen py-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 px-2">
          
          <div className="flex-grow flex flex-col gap-4">
            
            <div className="bg-white shadow-sm p-4 flex gap-4">
              <span className="bg-[#f1f3f6] text-[#2874f0] font-medium px-2 py-1 rounded-sm text-sm">1</span>
              <div>
                <h3 className="text-[#878787] uppercase font-bold text-sm mb-1">Delivery Address</h3>
                <p className="text-sm font-medium"><span className="font-bold">{shippingAddress.fullName || 'User'}</span> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
              </div>
              <button onClick={() => navigate('/shipping')} className="ml-auto text-[#2874f0] font-medium uppercase text-sm border border-[#e0e0e0] px-4 py-1 rounded-sm hover:border-[#2874f0] transition-colors">Change</button>
            </div>

            <div className="bg-[#2874f0] text-white shadow-sm p-4 flex items-center gap-4">
              <span className="bg-white text-[#2874f0] font-medium px-2 py-1 rounded-sm text-sm">2</span>
              <h3 className="uppercase font-bold text-sm">Order Summary</h3>
            </div>

            <div className="bg-white shadow-sm">
              {cartItems.map((item) => (
                <div key={item.product} className="flex flex-col sm:flex-row border-b border-gray-100 p-6 gap-6 relative">
                  <div className="flex flex-col items-center gap-4 w-[112px] shrink-0">
                    <Link to={`/product/${item.product}`}>
                      <img src={item.image} alt={item.name} className="w-[112px] h-[112px] object-contain" />
                    </Link>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <Link to={`/product/${item.product}`} className="text-[1.1rem] text-[#212121] hover:text-[#2874f0] font-medium mb-1 line-clamp-1">{item.name}</Link>
                    {(item.size || item.color) && (
                      <div className="text-[#878787] text-[0.9rem] mb-3">
                        {item.size && <span className="mr-3">Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    )}
                    <div className="text-[#878787] text-[0.9rem] mb-3">Seller: RetailNet</div>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-[1.2rem] font-medium text-[#212121]">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-[#878787] font-medium">x {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 shadow-[0_-2px_10px_0_rgba(0,0,0,0.05)] bg-white flex justify-between items-center sticky bottom-0 z-10 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[1.2rem] font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[#2874f0] font-medium cursor-pointer text-sm">View Price Details</span>
                </div>
                <button onClick={placeOrderHandler} className="bg-[#fb641b] text-white px-12 py-3 rounded-sm font-bold text-[1.1rem] shadow-sm hover:bg-[#f35b11]">CONTINUE</button>
              </div>
            </div>

            <div className="bg-white shadow-sm p-4 flex gap-4 text-[#878787]">
              <span className="bg-[#f1f3f6] text-[#878787] font-medium px-2 py-1 rounded-sm text-sm">3</span>
              <h3 className="uppercase font-bold text-sm mt-1">Payment Options</h3>
            </div>

          </div>

          <div className="w-full lg:w-[350px] shrink-0">
            <div className="bg-white shadow-sm sticky top-[76px]">
              <h3 className="uppercase text-[#878787] font-bold px-6 py-4 border-b border-gray-100">Price Details</h3>
              <div className="p-6 flex flex-col gap-4 border-b border-gray-100">
                <div className="flex justify-between text-[1rem] text-[#212121]">
                  <span>Price ({cartItems.reduce((a,c) => a + c.quantity, 0)} items)</span>
                  <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[1rem] text-[#212121]">
                  <span>Discount</span>
                  <span className="text-[#388e3c]">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[1rem] text-[#212121]">
                  <span>Delivery Charges</span>
                  <span className="text-[#388e3c]">{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
                </div>
              </div>
              <div className="p-6 border-b border-gray-100 border-dashed">
                <div className="flex justify-between text-[1.2rem] font-bold text-[#212121]">
                  <span>Total Payable</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {discount > 0 && <div className="p-4 text-[#388e3c] font-bold text-[0.95rem]">Your Total Savings on this order ₹{discount.toLocaleString('en-IN')}</div>}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default PlaceOrder;
