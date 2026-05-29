import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Package, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  const { wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?keyword=${searchInput}`);
      setShowDropdown(false);
    } else {
      navigate('/');
    }
  };

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchInput.trim().length > 1) {
        setIsSearching(true);
        try {
          const { data } = await api.get(`/api/products?keyword=${searchInput}`);
          setSearchResults(data.products.slice(0, 5)); // show top 5
          setShowDropdown(true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-[0_1px_4px_0_rgba(0,0,0,0.1)] h-[64px] flex items-center">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between gap-4 lg:gap-10">
        
        {/* Left: Logo */}
        <Link to="/" className="text-[#212121] text-[1.5rem] font-black tracking-tight shrink-0 flex items-center gap-1">
          Abhishek<span className="text-[#2874f0]">Cart</span>
        </Link>
        
        {/* Center: Advanced Search Bar */}
        <div ref={searchRef} className="hidden sm:flex flex-grow max-w-[650px] relative">
          <form onSubmit={submitHandler} className="w-full bg-[#f0f5ff] rounded-sm overflow-hidden h-[40px] flex items-center px-4 border border-transparent focus-within:border-[#2874f0] focus-within:bg-white focus-within:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-all relative z-20">
            <Search className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
            <input 
              type="text" 
              className="flex-grow outline-none text-[15px] text-gray-800 bg-transparent placeholder-gray-500" 
              placeholder="Search for products, brands and more" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-[#2874f0] border-t-transparent rounded-full animate-spin ml-2"></div>
            )}
          </form>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((product) => (
                    <Link 
                      key={product._id} 
                      to={`/product/${product._id}`}
                      onClick={() => { setShowDropdown(false); setSearchInput(''); }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-contain mix-blend-multiply" />
                      <div>
                        <h4 className="text-[14px] text-gray-800 line-clamp-1">{product.name}</h4>
                        <p className="text-[12px] text-gray-500">in {product.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchInput.length > 1 && !isSearching ? (
                <div className="p-4 text-center text-gray-500 text-sm">No products found for "{searchInput}"</div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 text-[#212121] shrink-0 h-full">
          
          {/* User Account / Login */}
          <div className="group relative cursor-pointer flex items-center h-[64px]">
            <Link to={user ? "/profile" : "/login"} className="flex items-center gap-2 group-hover:text-[#2874f0] transition-colors">
              <User className="w-[22px] h-[22px]" />
              <span className="hidden sm:inline font-medium text-[16px]">{user ? user.name.split(' ')[0] : 'Login'}</span>
              <ChevronDown className="w-4 h-4 hidden sm:inline group-hover:-rotate-180 transition-transform duration-200" />
            </Link>
            
            {/* Dropdown */}
            <div className="absolute top-[64px] left-1/2 -translate-x-1/2 hidden group-hover:block w-[260px] z-50">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200 z-20"></div>
              
              <div className="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-200 flex flex-col relative z-10 rounded-[4px] mt-0 pb-2">
                
                {!user && (
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <span className="text-[14px] text-[#212121] font-medium">New customer?</span>
                    <Link to="/register" className="text-[14px] font-bold text-[#2874f0] hover:underline">Sign Up</Link>
                  </div>
                )}

                <div className="flex flex-col pt-2">
                  <Link to="/profile" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <User className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" strokeWidth={1.5} />
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">My Profile</span>
                  </Link>

                  <Link to="/orders" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <Package className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" strokeWidth={1.5} />
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Orders</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <Heart className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" strokeWidth={1.5} />
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Wishlist</span>
                  </Link>

                  <Link to="/rewards" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <svg className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Rewards</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <svg className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Gift Cards</span>
                  </Link>
                  <Link to="/notifications" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <svg className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Notification Preferences</span>
                  </Link>
                  <Link to="/helpcenter" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <svg className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">24x7 Customer Care</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <svg className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Advertise</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors group/item">
                    <svg className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Download App</span>
                  </Link>

                  {user && (
                    <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-[10px] hover:bg-[#f5faff] transition-colors border-t border-gray-100 w-full text-left mt-2 pt-3 group/item">
                      <LogOut className="w-[18px] h-[18px] text-gray-500 group-hover/item:text-[#2874f0]" strokeWidth={1.5} />
                      <span className="text-[14px] text-[#212121] font-medium group-hover/item:text-[#2874f0]">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* More Dropdown */}
          <div className="group relative cursor-pointer flex items-center h-[64px]">
            <div className="flex items-center gap-2 group-hover:text-[#2874f0] transition-colors">
              <span className="hidden sm:inline font-medium text-[16px]">More</span>
              <ChevronDown className="w-4 h-4 hidden sm:inline group-hover:-rotate-180 transition-transform duration-200" />
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-2 hover:text-[#2874f0] transition-colors relative h-[64px]">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline font-medium text-[16px]">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-[16px] left-[12px] bg-[#fb641b] text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white leading-none">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
