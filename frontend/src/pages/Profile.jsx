import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, CreditCard, Star, Settings, Power, Camera } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../store/useAuthStore';

const Profile = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile-details');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setGender(user.gender || 'Male');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setSuccessMsg('');
    const success = await updateProfile({ 
      name: `${firstName} ${lastName}`.trim(), 
      gender,
      email,
      phone,
      avatar
    });
    setLoading(false);
    if (success) {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const displayName = user?.name || 'User';

  const renderTabContent = () => {
    if (activeTab === 'my-orders') {
      return (
        <div className="p-8 text-center py-24">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-[20px] font-bold text-gray-800 mb-2">My Orders</h2>
          <p className="text-gray-500 text-[15px]">You haven't placed any orders yet. Start shopping!</p>
          <button className="mt-6 border border-[#f43397] text-[#f43397] font-semibold px-8 py-3 rounded-lg hover:bg-[#fcecf4] transition-colors">Start Shopping</button>
        </div>
      );
    }
    if (activeTab === 'bank-details') {
      return (
        <div className="p-8 text-center py-24">
          <CreditCard className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-[20px] font-bold text-gray-800 mb-2">Bank & UPI Details</h2>
          <p className="text-gray-500 text-[15px]">Add your bank details to receive refunds quickly.</p>
          <button className="mt-6 border border-[#f43397] text-[#f43397] font-semibold px-8 py-3 rounded-lg hover:bg-[#fcecf4] transition-colors">+ Add Bank Account</button>
        </div>
      );
    }
    if (activeTab === 'abhishek-credits') {
      return (
        <div className="p-8 text-center py-24">
          <Star className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-[20px] font-bold text-gray-800 mb-2">Abhishek Credits</h2>
          <p className="text-gray-500 text-[15px]">You have 0 Credits available.</p>
        </div>
      );
    }
    if (activeTab === 'settings') {
      return (
        <div className="p-8 text-center py-24">
          <Settings className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-[20px] font-bold text-gray-800 mb-2">Account Settings</h2>
          <p className="text-gray-500 text-[15px]">Manage your notifications and privacy.</p>
        </div>
      );
    }

    // Default: Profile Details
    return (
      <div className="p-6 md:p-10">
        <h2 className="text-[22px] font-bold text-gray-800 mb-8">Edit Profile Details</h2>
        
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
            {successMsg}
          </div>
        )}

        <div className="space-y-6 max-w-2xl">
          {/* Name Row */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-[14px] font-semibold text-gray-600 mb-2">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-gray-800 outline-none focus:border-[#f43397] focus:ring-1 focus:ring-[#f43397] transition-all" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-[14px] font-semibold text-gray-600 mb-2">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-gray-800 outline-none focus:border-[#f43397] focus:ring-1 focus:ring-[#f43397] transition-all" 
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-600 mb-3">Gender</label>
            <div className="flex gap-4">
              <label className={`flex items-center justify-center px-6 py-2.5 rounded-full border cursor-pointer transition-colors ${gender === 'Male' ? 'border-[#f43397] bg-[#fcecf4] text-[#f43397] font-semibold' : 'border-gray-300 text-gray-600 hover:border-[#f43397]'}`}>
                <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} className="hidden" />
                Male
              </label>
              <label className={`flex items-center justify-center px-6 py-2.5 rounded-full border cursor-pointer transition-colors ${gender === 'Female' ? 'border-[#f43397] bg-[#fcecf4] text-[#f43397] font-semibold' : 'border-gray-300 text-gray-600 hover:border-[#f43397]'}`}>
                <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} className="hidden" />
                Female
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-600 mb-2">Mobile Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Mobile Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-gray-800 outline-none focus:border-[#f43397] focus:ring-1 focus:ring-[#f43397] transition-all" 
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-gray-600 mb-2">Email ID</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-gray-800 outline-none focus:border-[#f43397] focus:ring-1 focus:ring-[#f43397] transition-all" 
            />
          </div>

          <div className="pt-6">
            <button 
              disabled={loading} 
              onClick={handleSaveAll} 
              className="w-full md:w-auto bg-[#f43397] text-white font-bold text-[16px] px-12 py-3.5 rounded-lg hover:bg-[#d9227f] transition-colors shadow-md disabled:opacity-70"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const menuItems = [
    { id: 'profile-details', icon: User, label: 'Profile Details' },
    { id: 'my-orders', icon: Package, label: 'My Orders' },
    { id: 'bank-details', icon: CreditCard, label: 'Bank & UPI Details' },
    { id: 'abhishek-credits', icon: Star, label: 'Abhishek Credits' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <MainLayout>
      <div className="bg-[#f8f8fb] w-full pt-8 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar (Meesho Style) */}
          <div className="w-full lg:w-[320px] shrink-0">
            {/* User Profile Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col items-center text-center relative overflow-hidden">
              <div 
                className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-4 relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=fcecf4&color=f43397&size=150`} alt="Avatar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6 mb-1" />
                  <span className="text-white text-[10px] font-semibold uppercase tracking-wider">Change</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              <h2 className="text-[20px] font-bold text-gray-800">{displayName}</h2>
              <p className="text-[14px] text-gray-500 font-medium mt-1">{phone || 'Add Mobile Number'}</p>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                      activeTab === item.id 
                        ? 'bg-[#fcecf4] text-[#f43397]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[15px]">{item.label}</span>
                  </button>
                ))}

                <div className="my-2 border-t border-gray-100"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <Power className="w-5 h-5" />
                  <span className="text-[15px]">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area (Meesho Style) */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
