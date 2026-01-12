
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface HomeProps {
  products: Product[];
}

const Home: React.FC<HomeProps> = ({ products }) => {
  const featured = products.filter(p => p.featured);

  return (
    <div className="pb-24">
      {/* Hero Section - Minimalist & Impactful */}
      <section className="relative h-[90vh] w-full flex items-center overflow-hidden bg-gray-100">
        <img 
          src="https://images.unsplash.com/photo-1590117591724-81744b3fd827?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover brightness-90 contrast-110"
          alt="Luxury Fashion"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-gold mb-6 block">Premium Edition</span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter">
              Curated <br/> Couture.
            </h1>
            <p className="text-lg mb-10 text-gray-200 font-light leading-relaxed tracking-wide">
              Embrace the harmony of traditional craftsmanship and modern silhouettes. Designed for the discerning family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="bg-white text-gray-900 px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-white transition-soft text-center">
                Explore the Collection
              </Link>
              <Link to="/shop?style=Traditional" className="backdrop-blur-md bg-white/10 border border-white/30 text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white/20 transition-soft text-center">
                Traditional Wear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Trust Bar */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: 'fa-gem', label: 'Premium Quality' },
            { icon: 'fa-truck-fast', label: 'Express Delivery' },
            { icon: 'fa-handshake', label: 'Trusted by Thousands' },
            { icon: 'fa-rotate-left', label: 'Easy Exchanges' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <i className={`fa-solid ${item.icon} text-gold text-lg`}></i>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section - Nordstrom/Kalki Lookbook Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-bold mb-3 block">Season's Pick</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 serif">Signature Styles</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((product, idx) => (
            <div key={product.id} className={`group relative transition-soft ${idx === 1 ? 'md:mt-12' : ''}`}>
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full w-full object-cover transition-soft group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-soft"></div>
                {/* Quick Add Overlay */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-soft">
                  <Link to="/shop" className="block w-full bg-white/90 backdrop-blur text-center py-3 text-[10px] uppercase tracking-widest font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold mb-1 block">
                  {product.category} • {product.style}
                </span>
                <h3 className="text-xl font-medium text-gray-900 serif mb-1">{product.name}</h3>
                <p className="text-sm font-semibold text-gray-600 tracking-wider">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Discovery */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Large Category - Women */}
            <Link to="/shop?category=Women" className="relative h-[600px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover brightness-75 transition-soft group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-5xl font-bold serif mb-4 tracking-tight">The Women's Edit</h3>
                <span className="border-b border-white pb-1 text-xs uppercase tracking-[0.3em] font-bold">Shop Now</span>
              </div>
            </Link>
            
            <div className="grid grid-rows-2 gap-4">
              <Link to="/shop?category=Men" className="relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1594932224828-b4b059b6f6ee?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover brightness-75 transition-soft group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-3xl font-bold serif mb-2 tracking-tight">Men's Essentials</h3>
                  <span className="border-b border-white pb-1 text-[10px] uppercase tracking-[0.3em] font-bold">Explore</span>
                </div>
              </Link>
              <Link to="/shop?category=Kids" className="relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover brightness-75 transition-soft group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-3xl font-bold serif mb-2 tracking-tight">Little Styles</h3>
                  <span className="border-b border-white pb-1 text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
