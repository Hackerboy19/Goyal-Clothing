
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category, Style, Review } from '../types';
import { getStyleRecommendation } from '../services/geminiService';

interface ShopProps {
  products: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const Shop: React.FC<ShopProps> = ({ products, addToCart, addReview, wishlist, toggleWishlist }) => {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    searchParams.get('category') ? [searchParams.get('category') as Category] : []
  );
  const [selectedStyles, setSelectedStyles] = useState<Style[]>(
    searchParams.get('style') ? [searchParams.get('style') as Style] : []
  );
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'price-asc' | 'price-desc'>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiData, setAiData] = useState<{ advice: string; recommendedIds: string[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeQuickViewImage, setActiveQuickViewImage] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [showComparisonSlider, setShowComparisonSlider] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isARActive, setIsARActive] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const zoomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const cat = searchParams.get('category') as Category;
    if (cat && !selectedCategories.includes(cat)) setSelectedCategories([cat]);
    const style = searchParams.get('style') as Style;
    if (style && !selectedStyles.includes(style)) setSelectedStyles([style]);
    
    if (searchParams.get('ai') === 'true') {
      const el = document.getElementById('ai-concierge');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  useEffect(() => {
    const saved = localStorage.getItem('goyal_recent');
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      const recent = ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
      setRecentlyViewed(recent);
    }
  }, [products]);

  const updateRecentlyViewed = (id: string) => {
    const saved = localStorage.getItem('goyal_recent');
    let ids = saved ? (JSON.parse(saved) as string[]) : [];
    ids = [id, ...ids.filter(i => i !== id)].slice(0, 6);
    localStorage.setItem('goyal_recent', JSON.stringify(ids));
    const recent = ids.map(rid => products.find(p => p.id === rid)).filter(Boolean) as Product[];
    setRecentlyViewed(recent);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesStyle = selectedStyles.length === 0 || selectedStyles.includes(p.style);
      return matchesSearch && matchesCategory && matchesStyle;
    });

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedStyles, sortBy]);

  const relatedProducts = useMemo(() => {
    if (!quickViewProduct) return [];
    return products
      .filter(p => p.id !== quickViewProduct.id && (p.category === quickViewProduct.category || p.style === quickViewProduct.style))
      .slice(0, 4);
  }, [quickViewProduct, products]);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleAiAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiData(null);
    const data = await getStyleRecommendation(aiPrompt, products);
    setAiData(data);
    setIsAiLoading(false);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setActiveQuickViewImage(product.image);
    setQuickViewQuantity(1);
    setShowComparisonSlider(false);
    setSliderPosition(50);
    setIsARActive(false);
    updateRecentlyViewed(product.id);
  };

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current || showComparisonSlider) return;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const img = zoomRef.current.querySelector('img');
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsARActive(true);
      }
    } catch (err) {
      alert("Camera access is required for AR View. Please enable permissions in your browser settings.");
    }
  };

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsARActive(false);
  };

  const renderStars = (rating: number) => (
    <div className="flex text-[10px] text-gold">
      {[1, 2, 3, 4, 5].map(star => (
        <i key={star} className={`fa-solid fa-star ${star <= Math.round(rating) ? '' : 'text-gray-200'}`}></i>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-48">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="w-full md:w-auto">
          <h1 className="text-5xl font-bold text-gray-900 serif tracking-tight">The Curation</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-black mt-3">Goyal Cloth Store | Est. 1994</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end gap-6 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <input 
              type="text"
              placeholder="Search silhouettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 py-3 pl-8 text-[11px] uppercase tracking-widest focus:border-gold outline-none transition-soft"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-0 top-1/2 -translate-y-1/2 text-gray-300"></i>
          </div>

          <div className="relative w-full sm:w-48">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-transparent border-b border-gray-200 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-gold transition-soft appearance-none cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="rating">Most Celebrated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-gray-300 pointer-events-none"></i>
          </div>

          {(selectedCategories.length > 0 || searchQuery || sortBy !== 'default') && (
            <button 
              onClick={() => { setSelectedCategories([]); setSelectedStyles([]); setSearchQuery(''); setSortBy('default'); }}
              className="bg-gold text-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-soft flex items-center gap-3 shadow-2xl shadow-gold/30 border-2 border-gold whitespace-nowrap active:scale-95"
            >
              <i className="fa-solid fa-filter-circle-xmark"></i>
              Clear All Choices
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="w-full lg:w-64 space-y-12 shrink-0">
          <div id="ai-concierge" className="bg-gray-900 text-white p-8 rounded-sm space-y-6 shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-soft"></div>
             <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold">Style Concierge</h3>
             <p className="text-[10px] text-gray-400 font-light leading-relaxed">AI powered recommendations for your perfect look.</p>
             <form onSubmit={handleAiAdvice} className="space-y-4">
               <textarea 
                 value={aiPrompt}
                 onChange={(e) => setAiPrompt(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 p-3 text-[10px] text-white outline-none focus:border-gold transition-colors resize-none h-20"
                 placeholder="e.g. A formal dinner look..."
               />
               <button 
                 disabled={isAiLoading}
                 className="w-full bg-gold text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-soft"
               >
                 {isAiLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Consult Gemini'}
               </button>
             </form>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex justify-between items-center w-full text-[12px] font-black uppercase tracking-[0.3em] text-gray-900 mb-6">
              <span>Collections</span>
              <i className={`fa-solid fa-chevron-${isCategoryOpen ? 'up' : 'down'} text-[8px] transition-transform`}></i>
            </button>
            <div className={`space-y-4 overflow-hidden transition-all duration-500 ${isCategoryOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
              {(['Men', 'Women', 'Kids'] as Category[]).map(cat => (
                <label key={cat} className="flex items-center group cursor-pointer select-none" onClick={() => toggleCategory(cat)}>
                  <div className={`w-4 h-4 border flex items-center justify-center mr-4 transition-soft ${selectedCategories.includes(cat) ? 'bg-gold border-gold' : 'border-gray-200 group-hover:border-gold'}`}>
                    {selectedCategories.includes(cat) && <i className="fa-solid fa-check text-[8px] text-white"></i>}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-medium transition-soft ${selectedCategories.includes(cat) ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (
              <div key={product.id} className="group flex flex-col relative">
                <div 
                  className="aspect-[3/4] relative overflow-hidden bg-gray-50 cursor-pointer mb-6 border border-gray-100 group/card"
                  onClick={() => openQuickView(product)}
                >
                  <img 
                    src={product.image} 
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-1000 ${product.additionalImages?.length ? 'group-hover/card:opacity-0 group-hover/card:scale-105' : 'group-hover:scale-110'}`} 
                    alt={product.name} 
                  />
                  {product.additionalImages?.[0] && (
                    <img 
                      src={product.additionalImages[0]} 
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-all duration-1000 scale-110 group-hover/card:scale-100" 
                      alt={`${product.name} Detail`}
                    />
                  )}
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.stock === 0 ? (
                      <span className="bg-black text-white px-3 py-1 text-[8px] uppercase font-black tracking-widest shadow-xl border border-white/20">Out of Stock</span>
                    ) : product.stock < 5 ? (
                      <span className="bg-red-500 text-white px-3 py-1 text-[8px] uppercase font-black tracking-widest shadow-xl animate-pulse">Low Stock</span>
                    ) : null}
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center transition-soft z-10 ${wishlist.includes(product.id) ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}`}
                  >
                    <i className={`${wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart text-xs`}></i>
                  </button>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-soft flex flex-col justify-end p-6">
                    <p className="text-white text-[9px] uppercase tracking-widest font-black mb-4 translate-y-4 group-hover/card:translate-y-0 transition-all delay-100">
                      Explore Silhouette Details
                    </p>
                    <button className="w-full bg-white text-gray-900 py-3 text-[9px] uppercase tracking-widest font-black hover:bg-gold hover:text-white transition-soft shadow-xl">
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold">{product.category} • {product.style}</span>
                    <h3 className="text-lg font-medium text-gray-900 serif mt-1 leading-tight">{product.name}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      {renderStars(product.averageRating || 0)}
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">({product.reviews?.length || 0} Reviews)</span>
                    </div>
                  </div>
                  <p className="font-black text-gray-900 text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Quick View Modal with REFINED LUXURY COMPARISON SLIDER */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl relative border-l-8 border-gold ring-1 ring-white/20">
            {/* Improved Close Button to match image */}
            <button 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute top-8 right-8 z-[110] w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-soft active:scale-90 border border-gray-100"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            
            <div className="flex flex-col md:flex-row overflow-y-auto max-h-full">
              {/* Media Section with Improved Slider Design */}
              <div className="md:w-3/5 bg-gray-50 p-1 relative border-r border-gray-100">
                {isARActive ? (
                  <div className="relative aspect-[4/5] bg-black overflow-hidden rounded-sm">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60"></video>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img src={quickViewProduct.image} className="w-48 h-auto drop-shadow-2xl animate-float" alt="AR Overlay" />
                    </div>
                    <button onClick={stopAR} className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-gold hover:text-white transition-soft">Exit AR Experience</button>
                  </div>
                ) : showComparisonSlider && quickViewProduct.additionalImages && quickViewProduct.additionalImages.length > 0 ? (
                  /* THE REFINED COMPARISON SLIDER - MATCHING USER SCREENSHOT */
                  <div className="relative aspect-[4/5] overflow-hidden select-none cursor-ew-resize rounded-sm shadow-inner bg-white group/slider">
                    {/* The "After" Image (Detail/Background) */}
                    <img src={quickViewProduct.additionalImages[0]} loading="lazy" className="absolute inset-0 w-full h-full object-cover" alt="Detail View" />
                    
                    {/* The "Before" Image (Front/Foreground) */}
                    <div 
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-[clip-path] duration-75"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img src={quickViewProduct.image} loading="lazy" className="w-full h-full object-cover" alt="Front View" />
                    </div>

                    {/* Accurate Handle with Vertical Line and Arrows Icon */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border border-gray-200">
                        <i className="fa-solid fa-arrows-left-right text-gray-500 text-[10px]"></i>
                      </div>
                    </div>

                    {/* Labels Styled Exactly as the screenshot */}
                    <div className="absolute bottom-10 left-10 bg-[#3D0C0E] text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm z-10 shadow-xl border border-white/10">
                      FRONT VIEW
                    </div>
                    <div className="absolute bottom-10 right-10 bg-[#5A5A5A] text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm z-10 shadow-xl border border-white/10">
                      DETAIL VIEW
                    </div>

                    {/* Range input for interaction */}
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sliderPosition} 
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                    />
                  </div>
                ) : (
                  /* Standard Lens Zoom Section */
                  <div 
                    ref={zoomRef}
                    onMouseMove={handleImageZoom}
                    className="relative aspect-[4/5] overflow-hidden bg-white cursor-zoom-in group rounded-sm shadow-inner"
                  >
                    <img 
                      src={activeQuickViewImage || quickViewProduct.image} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[2.5]" 
                      alt={quickViewProduct.name} 
                    />
                    <div className="absolute bottom-8 right-8 flex flex-col gap-4">
                       {quickViewProduct.additionalImages && quickViewProduct.additionalImages.length > 0 && (
                         <button onClick={() => setShowComparisonSlider(true)} className="w-14 h-14 bg-white/95 backdrop-blur rounded-full shadow-2xl flex items-center justify-center text-gray-600 hover:text-gold transition-soft border border-gray-100 hover:scale-110" title="Compare Detail">
                            <i className="fa-solid fa-sliders text-base"></i>
                         </button>
                       )}
                       <button onClick={startAR} className="w-14 h-14 bg-white/95 backdrop-blur rounded-full shadow-2xl flex items-center justify-center text-gray-600 hover:text-gold transition-soft border border-gray-100 hover:scale-110" title="Visualize in AR">
                          <i className="fa-solid fa-vr-cardboard text-base"></i>
                       </button>
                    </div>
                    <div className="absolute bottom-8 left-8 flex gap-4">
                       {[quickViewProduct.image, ...(quickViewProduct.additionalImages || [])].map((img, i) => (
                         <button key={i} onClick={() => setActiveQuickViewImage(img)} className={`w-14 h-18 border-2 transition-all duration-300 shadow-xl ${activeQuickViewImage === img ? 'border-gold scale-110 z-10' : 'border-white/50 hover:border-gold/30'}`}>
                           <img src={img} loading="lazy" className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                         </button>
                       ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Product Info Section */}
              <div className="md:w-2/5 p-12 md:p-20 flex flex-col bg-white">
                <div className="mb-14">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[12px] uppercase tracking-[0.6em] text-gold font-black block">The Goyal Edit</span>
                    <button onClick={() => toggleWishlist(quickViewProduct.id)} className={`text-2xl transition-all duration-300 ${wishlist.includes(quickViewProduct.id) ? 'text-red-500 scale-125' : 'text-gray-200 hover:text-red-400'}`}>
                      <i className={`${wishlist.includes(quickViewProduct.id) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                    </button>
                  </div>
                  <h2 className="text-5xl font-bold serif text-gray-900 mb-8 leading-[1.1] tracking-tight">{quickViewProduct.name}</h2>
                  <div className="flex items-center gap-8">
                     <p className="text-3xl font-black text-gray-900 tracking-wider">₹{quickViewProduct.price.toLocaleString('en-IN')}</p>
                     <div className="flex items-center gap-3">
                        {renderStars(quickViewProduct.averageRating || 0)}
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">({quickViewProduct.reviews?.length} Reviews)</span>
                     </div>
                  </div>
                </div>
                
                <div className="space-y-10 mb-16 flex-1">
                  <p className="text-gray-500 text-base font-light leading-relaxed italic border-l-4 border-gold/20 pl-8">"{quickViewProduct.description}"</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">Inventory Status</p>
                      <p className={`text-[11px] font-black ${quickViewProduct.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{quickViewProduct.stock > 0 ? `${quickViewProduct.stock} Available` : 'Currently Depleted'}</p>
                    </div>
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">Couture Type</p>
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{quickViewProduct.style}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 rounded-sm border border-gray-200 shadow-inner">
                      <button onClick={() => setQuickViewQuantity(q => Math.max(1, q-1))} className="w-16 h-16 hover:bg-gold hover:text-white transition-soft text-xl font-light border-r border-gray-200">-</button>
                      <span className="w-16 h-16 flex items-center justify-center font-black text-lg">{quickViewQuantity}</span>
                      <button onClick={() => setQuickViewQuantity(q => q+1)} className="w-16 h-16 hover:bg-gold hover:text-white transition-soft text-xl font-light border-l border-gray-200">+</button>
                    </div>
                    <button 
                      disabled={quickViewProduct.stock === 0}
                      onClick={() => { addToCart(quickViewProduct, quickViewQuantity); setQuickViewProduct(null); }}
                      className={`flex-1 py-6 text-[12px] uppercase tracking-[0.6em] font-black transition-all duration-300 shadow-2xl ${quickViewProduct.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gold active:scale-95'}`}
                    >
                      {quickViewProduct.stock === 0 ? 'Item Depleted' : 'Acquire Piece'}
                    </button>
                  </div>
                  <div className="flex justify-center items-center gap-6 text-gray-300">
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Hand-Delivered Heritage</span>
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewing History */}
      {recentlyViewed.length > 0 && (
        <section className="mt-40 pt-20 border-t border-gray-100">
          <div className="flex justify-between items-baseline mb-12">
            <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-gray-400">Recently Considered</h3>
            <button onClick={() => { localStorage.removeItem('goyal_recent'); setRecentlyViewed([]); }} className="text-[10px] uppercase tracking-widest text-gray-300 hover:text-red-500 font-bold transition-colors">Clear registry</button>
          </div>
          <div className="flex gap-10 overflow-x-auto pb-10 snap-x no-scrollbar">
            {recentlyViewed.map(p => (
              <div key={p.id} className="min-w-[180px] md:min-w-[240px] snap-start group cursor-pointer" onClick={() => openQuickView(p)}>
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-6 rounded-sm shadow-md border border-gray-100">
                  <img src={p.image} loading="lazy" className="w-full h-full object-cover transition-soft duration-700 group-hover:scale-110" alt={p.name} />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 truncate group-hover:text-gold transition-colors">{p.name}</h4>
                <p className="text-[11px] text-gold font-black mt-2 tracking-widest">₹{p.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1)); }
          50% { transform: translateY(-15px) scale(1.05); filter: drop-shadow(0 25px 25px rgba(0,0,0,0.2)); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 4px;
          height: 1000px;
          background: transparent;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Shop;
