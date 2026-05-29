import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Shipping = () => {
  const navigate = useNavigate();
  
  const getStored = () => {
    try {
      return JSON.parse(localStorage.getItem('shippingAddress')) || {};
    } catch {
      return {};
    }
  };

  const stored = getStored();
  const [fullName, setFullName] = useState(stored.fullName || '');
  const [address, setAddress] = useState(stored.address || '');
  const [city, setCity] = useState(stored.city || '');
  const [postalCode, setPostalCode] = useState(stored.postalCode || '');
  const [country, setCountry] = useState(stored.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify({ fullName, address, city, postalCode, country }));
    navigate('/placeorder');
  };

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen py-10 flex items-center justify-center">
        <div className="bg-white shadow-sm flex rounded-sm overflow-hidden w-[800px] min-h-[528px]">
          
          {/* Left Panel */}
          <div className="bg-[#2874f0] w-[40%] p-10 flex flex-col text-white relative">
            <h1 className="text-[1.75rem] font-medium mb-4">Delivery Address</h1>
            <p className="text-[1.1rem] leading-relaxed text-[#dbdbdb]">We need this to securely deliver your order.</p>
            <div className="absolute bottom-10 left-10">
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="shipping" />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[60%] p-10 px-14 flex flex-col">
            <form onSubmit={submitHandler} className="flex flex-col flex-grow">
              
              <div className="relative mb-6 mt-4">
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" placeholder="Full Name" />
              </div>
              
              <div className="relative mb-6">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" placeholder="Address (House No, Building, Street, Area)" />
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" placeholder="City / District" />
                </div>
                <div className="relative flex-1">
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" placeholder="Pincode" />
                </div>
              </div>

              <div className="relative mb-10">
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" placeholder="State / Country" />
              </div>

              <button type="submit" className="bg-[#fb641b] text-white py-3 font-medium text-[1rem] rounded-sm shadow-sm hover:shadow-md mb-4 mt-auto">
                Save and Deliver Here
              </button>
            </form>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Shipping;
