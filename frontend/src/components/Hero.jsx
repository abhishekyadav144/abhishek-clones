import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 1,
    image: '/flights-banner.png',
    link: '/?category=Travel'
  },
  {
    id: 2,
    image: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/b8e072699bf10459.jpg?q=20',
    link: '/?category=Fashion'
  },
  {
    id: 3,
    image: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/1aaeb0a6531bef88.jpg?q=20',
    link: '/?category=Appliances'
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-0 mb-4 group relative">
      <div className="w-full h-[150px] sm:h-[200px] md:h-[270px] overflow-hidden relative shadow-sm rounded-sm bg-gray-100">
        
        {banners.map((banner, index) => (
          <Link to={banner.link} key={banner.id}>
            <img 
              src={banner.image} 
              alt="Sale Banner" 
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
          </Link>
        ))}

        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 w-[40px] h-[80px] flex items-center justify-center rounded-r-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="14" height="24" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
            <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="#000" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 w-[40px] h-[80px] flex items-center justify-center rounded-l-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="14" height="24" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="#000" />
          </svg>
        </button>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
