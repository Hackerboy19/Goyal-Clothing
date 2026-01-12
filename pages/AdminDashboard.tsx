
import React, { useState, useMemo } from 'react';
import { Product, Order, Category, Style, Review } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  updateProducts: (products: Product[]) => void;
  updateOrder: (orderId: string, status: Order['status']) => void;
  deleteReview: (productId: string, reviewId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, updateProducts, updateOrder, deleteReview }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'reviews'>('inventory');
  const [isAdding, setIsAdding] = useState(false);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'Men', style: 'Modern', price: 0, stock: 0, image: 'https://picsum.photos/400/600', description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;

  const displayedProducts = useMemo(() => {
    return filterLowStock ? products.filter(p => p.stock < 5) : products;
  }, [products, filterLowStock]);

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct as Product,
      id: Date.now().toString(),
      reviews: [],
      averageRating: 0
    };
    updateProducts([...products, product]);
    setIsAdding(false);
    setNewProduct({ name: '', category: 'Men', style: 'Modern', price: 0, stock: 0, image: 'https://picsum.photos/400/600', description: '' });
  };

  const handleAutoDescription = async () => {
    if (!newProduct.name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(newProduct.name, newProduct.category!, newProduct.style!);
    setNewProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const updateStock = (id: string, delta: number) => {
    const updated = products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p);
    updateProducts(updated);
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === displayedProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(displayedProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'increase' | 'decrease' | 'restock') => {
    if (selectedProductIds.length === 0) return;
    const updated = products.map(p => {
      if (selectedProductIds.includes(p.id)) {
        if (action === 'increase') return { ...p, stock: p.stock + 10 };
        if (action === 'decrease') return { ...p, stock: Math.max(0, p.stock - 10) };
        if (action === 'restock') return { ...p, stock: Math.max(p.stock, 50) };
      }
      return p;
    });
    updateProducts(updated);
    setSelectedProductIds([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 serif tracking-tight">Executive Dashboard</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-black mt-3">Goyal Cloth Store | Management Console</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-gray-900 text-white px-10 py-4 text-[11px] uppercase tracking-widest font-black hover:bg-gold transition-soft flex items-center gap-3 shadow-xl"
            >
              <i className="fa-solid fa-plus-circle text-xs"></i>
              Add New Silhouette
            </button>
          </div>
        </header>

        {/* Global Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <i className="fa-solid fa-indian-rupee-sign absolute -right-4 -bottom-4 text-7xl text-gray-50 opacity-20"></i>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black block mb-4">Gross Revenue</span>
            <span className="text-4xl font-black text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div 
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`p-8 border shadow-sm cursor-pointer transition-soft ${filterLowStock ? 'bg-red-500 border-red-600 text-white scale-105 z-10 shadow-red-200 shadow-2xl' : 'bg-white border-gray-100'}`}
          >
            <span className={`text-[10px] uppercase tracking-widest font-black block mb-4 ${filterLowStock ? 'text-white/80' : 'text-gray-400'}`}>Stock Warnings</span>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black">{lowStockCount}</span>
              <i className={`fa-solid fa-triangle-exclamation ${filterLowStock ? 'text-white' : 'text-red-500'}`}></i>
            </div>
          </div>
          <div className="bg-white p-8 border border-gray-100 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black block mb-4">Total Orders</span>
            <span className="text-4xl font-black text-gray-900">{orders.length}</span>
          </div>
          <div className="bg-gray-900 p-8 text-white shadow-2xl">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-black block mb-4">Inventory Health</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">92%</span>
              <span className="text-[10px] text-green-400 font-black">OPTIMAL</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-10 gap-10">
          {(['inventory', 'orders', 'reviews'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] uppercase tracking-[0.4em] font-black transition-soft border-b-2 ${activeTab === tab ? 'border-gold text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Content Sections */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Bulk Actions Menu */}
            <div className="bg-white p-4 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={selectedProductIds.length > 0 && selectedProductIds.length === displayedProducts.length} 
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{selectedProductIds.length} Items Selected</span>
              </div>
              
              {selectedProductIds.length > 0 && (
                <div className="group relative">
                  <button className="bg-gray-900 text-white text-[9px] uppercase font-black px-6 py-3 tracking-widest flex items-center gap-2 transition-soft">
                    Bulk Actions
                    <i className="fa-solid fa-chevron-down text-[7px]"></i>
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-100 shadow-2xl hidden group-hover:block z-50">
                    <button onClick={() => handleBulkAction('increase')} className="w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-soft">Add 10 Stock</button>
                    <button onClick={() => handleBulkAction('decrease')} className="w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-soft">Reduce 10 Stock</button>
                    <button onClick={() => handleBulkAction('restock')} className="w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-soft">Restock Minimum (50)</button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">
                      <th className="px-8 py-6 w-12"></th>
                      <th className="px-8 py-6">Silhouette Details</th>
                      <th className="px-8 py-6 text-center">In-Stock Management</th>
                      <th className="px-8 py-6 text-right">Market Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedProducts.map(product => {
                      const isLow = product.stock < 5;
                      const isCritical = product.stock === 0;
                      const isSelected = selectedProductIds.includes(product.id);
                      return (
                        <tr key={product.id} className={`transition-soft ${isSelected ? 'bg-gold/5' : ''} ${isCritical ? 'bg-gray-200 shadow-inner opacity-60' : isLow ? 'bg-red-50/80 border-l-4 border-l-red-500' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-8 py-8">
                             <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => toggleSelectProduct(product.id)}
                              className="w-4 h-4 accent-gold"
                            />
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-6">
                              <img src={product.image} className="w-16 h-24 object-cover rounded-sm shadow-lg border border-gray-100" alt="" />
                              <div>
                                <div className="flex items-center gap-3">
                                  <p className="font-black text-gray-900 text-base">{product.name}</p>
                                  {isCritical && <span className="bg-black text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Depleted</span>}
                                  {isLow && !isCritical && <span className="bg-red-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">Low</span>}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.category} • {product.style}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center justify-center gap-6">
                              <button onClick={() => updateStock(product.id, -1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-soft">-</button>
                              <div className="text-center w-12">
                                <span className={`text-xl font-black ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                                <div className="h-0.5 w-full bg-gray-100 mt-1 rounded-full overflow-hidden">
                                  <div className={`h-full ${product.stock < 5 ? 'bg-red-500 w-1/4' : product.stock < 10 ? 'bg-amber-500 w-2/4' : 'bg-green-500 w-full'}`}></div>
                                </div>
                              </div>
                              <button onClick={() => updateStock(product.id, 1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-500 hover:border-green-500 transition-soft">+</button>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-right font-black text-gray-900 text-lg">
                            ₹{product.price.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders and Reviews tabs remain identical but with enhanced table logic if needed */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-left-8 duration-500">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{order.customerName}</h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">REF: {order.id}</p>
                    </div>
                    <span className={`text-[8px] px-2 py-1 rounded font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-4 mb-8">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-[11px] font-medium text-gray-600 italic">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-bold text-gray-400">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black uppercase text-gray-400">Transaction Value</span>
                    <span className="text-xl font-black text-gray-900">₹{order.total}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateOrder(order.id, 'Shipped')} className="flex-1 text-[9px] uppercase font-black py-3 border border-indigo-100 text-indigo-500 hover:bg-indigo-50 transition-soft">Ship</button>
                    <button onClick={() => updateOrder(order.id, 'Delivered')} className="flex-1 text-[9px] uppercase font-black py-3 border border-green-100 text-green-500 hover:bg-green-50 transition-soft">Deliver</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-48 text-center bg-white border border-dashed border-gray-100 rounded-3xl opacity-30">
                <i className="fa-solid fa-box-open text-4xl mb-6"></i>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black">Awaiting New Orders</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            {products.flatMap(p => (p.reviews || []).map(rev => ({ ...rev, productName: p.name, productId: p.id }))).length > 0 ? 
              products.flatMap(p => (p.reviews || []).map(rev => (
                <div key={rev.id} className="bg-white p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{rev.userName}</h4>
                      <p className="text-[9px] text-gold font-bold uppercase mt-1">on: {rev.productName}</p>
                    </div>
                    <div className="flex text-[8px] text-gold">
                      {[1,2,3,4,5].map(s => <i key={s} className={`fa-solid fa-star ${s <= rev.rating ? '' : 'text-gray-100'}`}></i>)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic font-light leading-relaxed mb-6">"{rev.comment}"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-300">Published: {rev.date}</span>
                    <button 
                      onClick={() => deleteReview(rev.productId, rev.id)}
                      className="text-[9px] uppercase font-black text-red-400 hover:text-red-600 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      Moderate
                    </button>
                  </div>
                </div>
              ))) : (
              <div className="col-span-full py-48 text-center bg-white border border-dashed border-gray-100 rounded-3xl opacity-30">
                <i className="fa-solid fa-comments text-4xl mb-6"></i>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black">No Experiences to Moderate</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden border-t-8 border-gold">
            <div className="px-12 py-10 border-b flex justify-between items-center bg-gray-50/30">
              <h2 className="text-3xl font-bold serif text-gray-900">New Silhouette Entry</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-300 hover:text-gray-900 p-2"><i className="fa-solid fa-xmark text-3xl"></i></button>
            </div>
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="col-span-full">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Product Name</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border-b border-gray-100 py-3 text-base outline-none focus:border-gold transition-colors" placeholder="e.g. Royal Cashmere Blazer" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})} className="w-full border-b border-gray-100 py-3 text-sm outline-none bg-transparent">
                    <option value="Men">Men</option><option value="Women">Women</option><option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Design Type</label>
                  <select value={newProduct.style} onChange={e => setNewProduct({...newProduct, style: e.target.value as Style})} className="w-full border-b border-gray-100 py-3 text-sm outline-none bg-transparent">
                    <option value="Modern">Modern</option><option value="Traditional">Traditional</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-sm">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">AI Copywriter</label>
                  <button onClick={handleAutoDescription} disabled={isGenerating} className="text-[9px] font-black text-gold uppercase flex items-center gap-2 hover:text-amber-700">
                    {isGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                    Optimize Listing
                  </button>
                </div>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full border border-white p-4 h-24 outline-none resize-none text-xs font-light italic leading-relaxed bg-white/50" />
              </div>
            </div>
            <div className="px-12 py-10 bg-gray-50 border-t flex justify-end gap-8">
              <button onClick={() => setIsAdding(false)} className="text-[11px] uppercase font-black text-gray-400 hover:text-gray-900">Cancel</button>
              <button onClick={handleAddProduct} className="bg-gray-900 text-white px-12 py-4 text-[11px] uppercase tracking-[0.3em] font-black hover:bg-gold transition-soft shadow-xl">Commit Silhouette</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
