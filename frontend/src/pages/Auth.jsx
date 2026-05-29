import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import useAuthStore from '../store/useAuthStore';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading, error, clearError } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
    setValidationError('');
    setSuccessMsg('');
    if (clearError) clearError();
  }, [location.pathname]);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = (mode) => {
    setIsLogin(mode === 'login');
    setValidationError('');
    setSuccessMsg('');
    if (clearError) clearError();
    navigate(mode === 'login' ? '/login' : '/register', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');
    
    if (!email.trim() || !password.trim()) {
      setValidationError('Please fill out all required fields.');
      return;
    }

    if (isLogin) {
      const success = await login(email, password);
      if (success) navigate('/');
    } else {
      if (!name.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      const success = await register(name, email, password);
      if (success) {
        setSuccessMsg('Account created successfully. Please login.');
        switchMode('login');
        setPassword('');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const GoogleButton = ({ text }) => (
    <button 
      type="button" 
      onClick={handleGoogleLogin}
      className="w-full h-[60px] bg-white text-gray-900 font-semibold text-[1.05rem] rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
      {text}
    </button>
  );

  return (
    <AuthLayout>
      <div 
        className="w-full max-w-[1150px] min-h-[720px] rounded-[36px] flex flex-col md:flex-row relative z-10 transition-all duration-700"
        style={{
          background: 'rgba(15, 18, 34, 0.72)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 100px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)'
        }}
      >
        
        {/* LEFT SIDE: BRANDING (45%) */}
        <div className="hidden md:flex flex-col w-[45%] p-12 lg:p-14 relative border-r border-white/[0.05]">
          
          <div className="animate-[fadeIn_1s_ease-out_0.2s_both]">
            <Link to="/" className="text-[2.2rem] font-bold tracking-tighter block mb-4 flex items-center">
              <span className="text-white">Abhishek</span><span className="text-[#6366f1]">Cart</span>
            </Link>
            <div className="w-[45px] h-[2px] bg-[#6366f1] mb-10 rounded-full" />
            
            <h1 className="text-[2.6rem] lg:text-[2.8rem] font-bold leading-tight tracking-tight text-white mb-3">
              {isLogin ? "Welcome Back!" : "Join Us Today!"}
            </h1>
            <p className="text-[1.05rem] text-indigo-200/60 leading-relaxed font-light">
              {isLogin ? "Sign in to continue your premium shopping experience" : "Create an account to discover premium shopping"}
            </p>
          </div>
          
          {/* 3D ECOMMERCE ILLUSTRATION */}
          <div className="relative z-10 flex-grow flex justify-center items-center mt-2 animate-[fadeIn_1s_ease-out_0.4s_both]">
             <img 
               src="/neon_shopping_cart.png" 
               alt="3D Shopping Cart" 
               className="max-h-[220px] object-contain drop-shadow-[0_10px_30px_rgba(99,102,241,0.5)]"
               onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.nextElementSibling.style.display = 'flex';
               }}
             />
             <div className="hidden w-[220px] h-[220px] rounded-full border border-[#6366f1]/30 bg-gradient-to-t from-[#6366f1]/20 to-transparent items-center justify-center relative shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
             </div>
          </div>

          {/* FEATURE LIST WITH GLOWING ICONS */}
          <div className="relative z-10 flex flex-col gap-5 mt-4 animate-[fadeIn_1s_ease-out_0.6s_both]">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#4c1d95]/50 flex items-center justify-center border border-[#7c3aed]/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-[0.95rem] tracking-tight">Fast Delivery</h4>
                <p className="text-white/40 text-[0.85rem] mt-0.5">Lightning fast delivery at your doorstep</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#1e3a8a]/50 flex items-center justify-center border border-[#3b82f6]/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-[0.95rem] tracking-tight">Secure Payments</h4>
                <p className="text-white/40 text-[0.85rem] mt-0.5">100% secure & trusted payments</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#4c1d95]/50 flex items-center justify-center border border-[#7c3aed]/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-[0.95rem] tracking-tight">Trusted Shopping</h4>
                <p className="text-white/40 text-[0.85rem] mt-0.5">Shop from millions of happy customers</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* RIGHT SIDE: FORM (55%) */}
        <div className="w-full md:w-[55%] py-8 px-10 md:px-16 flex flex-col justify-center items-center relative z-10">
          
          {/* FORM CONTAINER: 430px max width */}
          <div className="w-full max-w-[430px] flex flex-col justify-center transition-all duration-700 ease-in-out">
            
            <div className="mb-8 text-center">
              <Link to="/" className="md:hidden text-[2rem] font-bold tracking-tight text-white block mb-6">
                <span className="text-white">Abhishek</span><span className="text-[#6366f1]">Cart</span>
              </Link>
              <h2 className="text-[2.2rem] font-bold text-white leading-tight tracking-tight mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-white/50 text-[1rem] font-normal">
                {isLogin ? "Welcome back. Access your account" : "Join the future of digital commerce."}
              </p>
            </div>

            {successMsg && (
              <div className="bg-emerald-500/10 text-emerald-400 text-[0.95rem] px-5 py-4 mb-6 rounded-[20px] border border-emerald-500/20 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {successMsg}
              </div>
            )}

            {(error || validationError) && (
              <div className="bg-red-500/10 text-red-400 text-[0.95rem] px-5 py-4 mb-6 rounded-[20px] border border-red-500/20 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {validationError || error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-5 w-full">
              
              {!isLogin && (
                <div className="relative flex flex-col gap-2">
                  <label className="text-[0.95rem] font-semibold text-white/90">Full Name</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-5 text-white/40 pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-[64px] rounded-[20px] border border-white/15 bg-white/5 text-white caret-white text-[1rem] pl-[52px] pr-5 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="relative flex flex-col gap-2">
                <label className="text-[0.95rem] font-semibold text-white/90">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-5 text-white/40 pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[64px] rounded-[20px] border border-white/15 bg-white/5 text-white caret-white text-[1rem] pl-[52px] pr-5 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="text-[0.95rem] font-semibold text-white/90">Password</label>
                <div className="relative flex items-center w-full">
                  <div className="absolute left-5 text-white/40 pointer-events-none z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[64px] rounded-[20px] border border-white/15 bg-white/5 text-white caret-white text-[1rem] pl-[52px] pr-[52px] focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] relative z-0"
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-1 flex items-center justify-center bg-transparent border-0 outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between pt-1 pb-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded-[6px] border border-white/20 bg-transparent flex items-center justify-center group-hover:border-[#6366f1] transition-colors">
                      <input type="checkbox" className="opacity-0 absolute w-0 h-0" />
                      <svg className="w-3.5 h-3.5 text-white hidden group-has-[:checked]:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5l10 -10"></path></svg>
                    </div>
                    <span className="text-[0.95rem] text-white/90 font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-[#818cf8] text-[0.95rem] font-medium hover:text-indigo-300 transition-colors">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-[64px] mt-2 rounded-[20px] text-white font-semibold text-[1.1rem] bg-gradient-to-r from-[#4f46e5] to-[#3b82f6] hover:-translate-y-[2px] shadow-[0_8px_25px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.6)] transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Processing...' : (isLogin ? 'Sign In →' : 'Create Account →')}
                </span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-white/[0.08]"></div>
                <span className="px-4 text-white/40 text-[0.85rem] font-medium tracking-wide">OR</span>
                <div className="flex-grow border-t border-white/[0.08]"></div>
              </div>

              <GoogleButton text={`Continue with Google`} />

              <div className="mt-6 text-center text-[0.95rem] text-white/50 font-normal">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => switchMode(isLogin ? 'register' : 'login')}
                  className="text-[#818cf8] font-medium hover:text-[#a5b4fc] transition-colors ml-1"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>

            </form>
          </div>
          
        </div>
      </div>
    </AuthLayout>
  );
};

export default Auth;
