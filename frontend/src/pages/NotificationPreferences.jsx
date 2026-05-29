import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';

const NotificationPreferences = () => {
const defaultPrefs = {
    orderUpdates: true,
    offers: true,
    wishlistSale: false,
    newArrivals: true,
    accountActivity: true,
    smsAlerts: false,
    emailAlerts: true,
    whatsappAlerts: true,
  };

  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('abhishek-notification-prefs');
      return saved ? JSON.parse(saved) : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('abhishek-notification-prefs', JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ id, checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? 'bg-[#2874f0]' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-[22px] font-bold text-[#212121] mb-6">Notification Preferences</h1>

          {/* Order Notifications */}
          <div className="bg-white shadow-sm mb-4 rounded-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-[#212121]">Order & Account</h2>
              <p className="text-[13px] text-[#878787] mt-1">Notifications related to your orders and account activity</p>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">Order Updates</p>
                  <p className="text-[13px] text-[#878787]">Shipping, delivery and return status</p>
                </div>
                <Toggle checked={prefs.orderUpdates} onChange={() => toggle('orderUpdates')} />
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">Account Activity</p>
                  <p className="text-[13px] text-[#878787]">Login alerts, password changes</p>
                </div>
                <Toggle checked={prefs.accountActivity} onChange={() => toggle('accountActivity')} />
              </div>
            </div>
          </div>

          {/* Promotions */}
          <div className="bg-white shadow-sm mb-4 rounded-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-[#212121]">Offers & Promotions</h2>
              <p className="text-[13px] text-[#878787] mt-1">Deals, discounts and new arrivals</p>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">Offers & Deals</p>
                  <p className="text-[13px] text-[#878787]">Flash sales, coupons and special offers</p>
                </div>
                <Toggle checked={prefs.offers} onChange={() => toggle('offers')} />
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">Wishlist Sale Alerts</p>
                  <p className="text-[13px] text-[#878787]">When items in your wishlist go on sale</p>
                </div>
                <Toggle checked={prefs.wishlistSale} onChange={() => toggle('wishlistSale')} />
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">New Arrivals</p>
                  <p className="text-[13px] text-[#878787]">Latest products in categories you browse</p>
                </div>
                <Toggle checked={prefs.newArrivals} onChange={() => toggle('newArrivals')} />
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="bg-white shadow-sm mb-6 rounded-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-[#212121]">Notification Channels</h2>
              <p className="text-[13px] text-[#878787] mt-1">Choose how you want to receive notifications</p>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-[15px] font-medium text-[#212121]">Email</p>
                    <p className="text-[13px] text-[#878787]">abhishekaryan14042006@gmail.com</p>
                  </div>
                </div>
                <Toggle checked={prefs.emailAlerts} onChange={() => toggle('emailAlerts')} />
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-[15px] font-medium text-[#212121]">SMS</p>
                    <p className="text-[13px] text-[#878787]">+91 98015 93198</p>
                  </div>
                </div>
                <Toggle checked={prefs.smsAlerts} onChange={() => toggle('smsAlerts')} />
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-[15px] font-medium text-[#212121]">WhatsApp</p>
                    <p className="text-[13px] text-[#878787]">+91 98015 93198</p>
                  </div>
                </div>
                <Toggle checked={prefs.whatsappAlerts} onChange={() => toggle('whatsappAlerts')} />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="bg-[#2874f0] text-white px-10 py-3 rounded-sm font-bold text-[16px] hover:bg-[#1c5dcc] transition-colors shadow-sm"
            >
              Save Preferences
            </button>
            {saved && (
              <span className="text-[#388e3c] font-bold text-[15px] flex items-center gap-1">
                ✓ Preferences saved!
              </span>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationPreferences;
