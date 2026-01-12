
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col">
      {/* Utility Bar (Nordstrom inspired) */}
      <div className="bg-gray-900 text-white text-[10px] uppercase tracking-[0.2em] py-2 px-4 text-center font-medium">
        Free Shipping on all orders over ₹2000 | New Arrivals in Traditional Wear
      </div>
      
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Section (Kalki inspired) */}
            <div className="flex items-center">
              <Link to="/" className="group">
                <span className="text-2xl md:text-3xl font-bold text-gray-900 serif tracking-tighter block leading-none">
                  GOYAL
                </span>
                <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-light block ml-0.5">
                  CLOTH STORE
                </span>
              </Link>
            </div>

            {/* Main Links */}
            {!isAdmin && (
              <div className="hidden lg:flex space-x-10 text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-600">
                <Link to="/shop" className="hover:text-gold transition-colors">The Collection</Link>
                <Link to="/shop?category=Women" className="hover:text-gold transition-colors">Women</Link>
                <Link to="/shop?category=Men" className="hover:text-gold transition-colors">Men</Link>
                <Link to="/shop?category=Kids" className="hover:text-gold transition-colors">Kids</Link>
                <Link to="/shop?style=Traditional" className="hover:text-gold transition-colors text-amber-700">Traditional</Link>
              </div>
            )}
            
            <div className="flex items-center space-x-6">
              <Link 
                to={isAdmin ? "/" : "/admin"} 
                className="hidden md:flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-indigo-600 transition"
              >
                <i className="fa-solid fa-user-shield"></i>
                <span>{isAdmin ? "Exit Storefront" : "Manager"}</span>
              </Link>
              
              {!isAdmin && (
                <Link to="/cart" className="relative p-2 text-gray-900 hover:text-gold transition-soft">
                  <i className="fa-solid fa-bag-shopping text-xl"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              
              <button className="lg:hidden text-gray-900">
                <i className="fa-solid fa-bars-staggered text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
