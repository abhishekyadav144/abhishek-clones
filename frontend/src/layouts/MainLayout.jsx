import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#f1f3f6]">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
