
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, updateQuantity, removeFromCart, checkout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
      <h1 className="text-4xl font-bold serif mb-10 text-gray-900">Your Shopping Bag</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-8 p-6 bg-white border border-gray-100 shadow-sm relative group transition-soft hover:shadow-xl">
                <div className="w-24 h-36 flex-shrink-0 relative overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover transition-soft group-hover:scale-110" alt={item.name} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl serif">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{item.category} • {item.style}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-soft h-fit p-2"
                        title="Remove from bag"
                      >
                        <i className="fa-solid fa-xmark text-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-4 bg-gray-50 rounded-sm p-1 border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gold hover:text-white hover:border-gold transition-soft">-</button>
                      <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gold hover:text-white hover:border-gold transition-soft">+</button>
                    </div>
                    <p className="font-black text-gray-900 text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-8 border border-gray-100 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em]">Bag Summary</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-500 uppercase tracking-widest text-[10px] font-black">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 uppercase tracking-widest text-[10px] font-black">
                  <span>Concierge Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900'}>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Final Investment</span>
                  <span className="text-3xl font-black text-gray-900 serif">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button 
                onClick={checkout}
                className="w-full bg-gray-900 text-white py-6 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-gold transition-soft shadow-2xl shadow-gray-200"
              >
                Checkout Now
              </button>
              <div className="flex items-center justify-center space-x-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <i className="fa-solid fa-shield-halved text-gold"></i>
                <span>Premium Secure Checkout</span>
              </div>
            </div>
            <Link to="/shop" className="block text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-soft">
              &larr; Return to Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-48 bg-white border border-dashed border-gray-100 shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-soft"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 text-gray-200">
              <i className="fa-solid fa-bag-shopping text-4xl"></i>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 serif italic">Your collection bag is empty</h2>
            <p className="text-gray-400 mb-12 max-w-sm mx-auto text-xs font-light leading-relaxed uppercase tracking-widest">
              Goyal Cloth Store's curated couture is waiting for you. Discover pieces that bridge the gap between tradition and modernity.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <Link to="/shop" className="inline-block bg-gray-900 text-white px-20 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold transition-soft shadow-2xl">
                Explore The Collection
              </Link>
              
              <div className="mt-8 pt-8 border-t border-gray-100 w-full max-w-xs flex flex-col items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gold">Unsure where to begin?</p>
                <Link to="/shop?ai=true" className="text-sm font-bold serif border-b-2 border-gold hover:text-gold transition-soft flex items-center gap-3 active:scale-95">
                  <i className="fa-solid fa-wand-magic-sparkles text-gold animate-pulse"></i>
                  Ask our AI Style Concierge
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
