import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, User } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';

const BottomNav = () => {
  const location = useLocation();
  const { wishlistItems } = useWishlistStore();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, count: wishlistItems.length },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 sm:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/#categories' && location.hash === '#categories');
          
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors ${isActive ? 'text-[#2874f0]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive && item.name === 'Wishlist' ? 'fill-[#2874f0]' : ''}`} />
                {item.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[0.6rem] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[0.65rem] font-bold tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
