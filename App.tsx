
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CartPage from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import { Product, CartItem, Order, Review } from './types';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('goyal_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('goyal_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('goyal_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('goyal_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('goyal_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('goyal_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('goyal_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('goyal_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [...(p.reviews || []), newReview];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return { ...p, reviews: updatedReviews, averageRating: avg };
      }
      return p;
    }));
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = (p.reviews || []).filter(r => r.id !== reviewId);
        const avg = updatedReviews.length > 0 ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length : 0;
        return { ...p, reviews: updatedReviews, averageRating: avg };
      }
      return p;
    }));
  };

  const updateOrder = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: "Exclusive Guest",
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    alert("Order Confirmed. Your Goyal silhouettes are being curated for delivery.");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar cartCount={cartCount} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/shop" element={
              <Shop 
                products={products} 
                addToCart={addToCart} 
                addReview={addReview}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            } />
            <Route path="/cart" element={
              <CartPage 
                items={cart} 
                updateQuantity={updateCartQuantity} 
                removeFromCart={removeFromCart} 
                checkout={handleCheckout} 
              />
            } />
            <Route path="/admin" element={
              <AdminDashboard 
                products={products} 
                orders={orders} 
                updateProducts={setProducts} 
                updateOrder={updateOrder}
                deleteReview={deleteReview}
              />
            } />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-100 py-24">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 serif tracking-tighter block leading-none mb-3">GOYAL</h2>
              <span className="text-[11px] tracking-[0.6em] uppercase text-gold font-black block mb-8">CLOTH STORE</span>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-light italic">
                Defining luxury through generation-spanning heritage and avant-garde craftsmanship. A timeless curation for the global contemporary family.
              </p>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-900 mb-8">Navigation</h4>
              <ul className="space-y-4 text-[11px] uppercase tracking-widest font-bold text-gray-400">
                <li><a href="#" className="hover:text-gold transition">Our Story</a></li>
                <li><a href="#/shop" className="hover:text-gold transition">The Collection</a></li>
                <li><a href="#" className="hover:text-gold transition">Shipping & Returns</a></li>
              </ul>
            </div>
            <div className="flex flex-col md:items-end">
              <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-900 mb-8">Follow Our Edit</h4>
              <div className="flex space-x-8 text-gray-300">
                <a href="#" className="hover:text-gold transition text-xl"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="hover:text-gold transition text-xl"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="hover:text-gold transition text-xl"><i className="fa-brands fa-pinterest-p"></i></a>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-300 mt-12 font-black">© 2024 Goyal Cloth Store Elite Edition</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
