import React from 'react';

const AuthLayout = ({ children }) => (
  <main className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden bg-[#080A12] z-0 font-sans">
    
    {/* Cinematic Background Elements */}
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Top Left Huge Purple Orb */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#5b21b6] opacity-30 blur-[150px]" />
      
      {/* Top Right Blue Orb */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#1e3a8a] opacity-30 blur-[120px]" />
      
      {/* Bottom Center Intense Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-t from-[#ea580c]/20 via-[#4f46e5]/20 to-transparent blur-[100px]" />
      <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[600px] h-[10px] rounded-[100%] bg-gradient-to-r from-transparent via-[#f97316] to-transparent opacity-50 blur-[10px]" />
    </div>

    {/* Main Auth Container */}
    <div className="relative z-10 w-full flex justify-center animate-[fadeIn_0.8s_ease-out]">
      {children}
    </div>

    {/* Bottom Security Text */}
    <div className="relative z-10 mt-10 flex items-center gap-4 text-center animate-[fadeIn_1s_ease-out_0.5s_both]">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
      </div>
      <div className="text-left">
        <p className="text-white/80 text-[0.95rem] font-medium tracking-wide">Your security is our priority</p>
        <p className="text-white/40 text-[0.85rem]">Protected by advanced encryption</p>
      </div>
    </div>

  </main>
);

export default AuthLayout;
