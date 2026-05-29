import React from 'react';
import { Link, useParams } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Grocery', image: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100' },
  { id: 2, name: 'Mobiles', image: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
  { id: 3, name: 'Fashion', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100' },
  { id: 4, name: 'Electronics', image: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
  { id: 5, name: 'Home & Furniture', image: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
  { id: 6, name: 'Appliances', image: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
  { id: 7, name: 'Travel', image: 'https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100' },
  { id: 8, name: 'Beauty & Toys', image: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
  { id: 9, name: 'Two Wheelers', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/05d708653beff580.png?q=100' }
];

const CategoryMenu = () => {
  const { name: currentCategory } = useParams();

  return (
    <div className="bg-white shadow-sm mt-2 mb-4 mx-2 sm:mx-4 md:mx-auto max-w-7xl rounded-sm">
      <div className="flex justify-between md:justify-center md:gap-12 overflow-x-auto px-4 py-4 scrollbar-hide">
        {categories.map((cat) => (
          <Link 
            to={`/category/${encodeURIComponent(cat.name)}`} 
            key={cat.id} 
            className="flex flex-col items-center gap-2 min-w-[70px] group decoration-transparent shrink-0"
          >
            <div className={`w-[64px] h-[64px] transition-transform duration-200 ${decodeURIComponent(currentCategory || '') === cat.name ? 'scale-110' : 'group-hover:scale-105'}`}>
              <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
            </div>
            <span className={`text-[0.85rem] font-medium text-center whitespace-nowrap ${decodeURIComponent(currentCategory || '') === cat.name ? 'text-[#2874f0]' : 'text-[#212121] group-hover:text-[#2874f0]'}`}>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
