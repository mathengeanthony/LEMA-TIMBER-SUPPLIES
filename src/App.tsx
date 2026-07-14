import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Search, Filter, Calculator, Sparkles, Building2, Phone, HelpCircle, ArrowRight, ShieldCheck, Mail, ClipboardCheck, History, ShoppingCart, Printer } from 'lucide-react';
import { CartItem, OrderInquiry, ProductCategory } from './types';
import { PRODUCTS } from './data';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LumberCalculator from './components/LumberCalculator';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import InquiryHistory from './components/InquiryHistory';
import Footer from './components/Footer';
import BlogPage from './components/BlogPage';
import ProductDetail from './components/ProductDetail';
import TransportEstimator from './components/TransportEstimator';
import PrintArea, { PrintData } from './components/PrintArea';

export default function App() {
  // --- STATE MANAGERS ---
  const [activeView, setActiveView] = useState<'home' | 'blog'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return PRODUCTS.find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId]);
  
  // Overlay modals coordinator
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Invoice reprint coordinator
  const [reprintOrder, setReprintOrder] = useState<OrderInquiry | null>(null);
  const [activePrintData, setActivePrintData] = useState<PrintData | null>(null);

  // Quick inquiry form state
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickMsg, setQuickMsg] = useState('');
  const [quickFeedback, setQuickFeedback] = useState('');

  // --- LOCALSTORAGE SYNC HYDRATION ---
  useEffect(() => {
    // Hydrate cart
    const savedCart = localStorage.getItem('lema_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    // Hydrate orders
    const savedOrders = localStorage.getItem('lema_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('lema_cart', JSON.stringify(updatedCart));
  };

  const saveOrdersToStorage = (updatedOrders: OrderInquiry[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('lema_orders', JSON.stringify(updatedOrders));
  };

  // --- CART OPERATIONS ---
  const handleAddToCart = (newItem: Omit<CartItem, 'cartId' | 'totalPrice'>) => {
    // Generate unique ID based on product ID and its specs to differentiate custom attributes
    const cartId = `${newItem.productId}-${newItem.descriptionText.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const existingIndex = cart.findIndex((item) => item.cartId === cartId);
    let updated: CartItem[];

    if (existingIndex > -1) {
      // Increment quantity
      updated = [...cart];
      updated[existingIndex].quantity += newItem.quantity;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
    } else {
      // Insert new line
      const fullItem: CartItem = {
        ...newItem,
        cartId,
        totalPrice: newItem.quantity * newItem.unitPrice
      };
      updated = [...cart, fullItem];
    }

    saveCartToStorage(updated);
  };

  const handleUpdateCartQuantity = (cartId: string, delta: number) => {
    const existingIndex = cart.findIndex((item) => item.cartId === cartId);
    if (existingIndex === -1) return;

    let updated = [...cart];
    const newQty = updated[existingIndex].quantity + delta;

    if (newQty <= 0) {
      // Remove item
      updated = updated.filter((item) => item.cartId !== cartId);
    } else {
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].totalPrice = newQty * updated[existingIndex].unitPrice;
    }

    saveCartToStorage(updated);
  };

  const handleRemoveCartItem = (cartId: string) => {
    const updated = cart.filter((item) => item.cartId !== cartId);
    saveCartToStorage(updated);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // --- ORDER HISTORY MANAGEMENT ---
  const handleSubmitOrder = (newOrder: OrderInquiry) => {
    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this quote record from your local history?')) {
      const updated = orders.filter((item) => item.id !== orderId);
      saveOrdersToStorage(updated);
    }
  };

  // --- NAVIGATION SMOOTH SCROLLER ---
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- PRODUCT FILTER PIPELINE ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // --- QUICK CONTACT INQUIRY ---
  const handleQuickContact = (e: FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      alert('Please fill in your Name and Phone Number.');
      return;
    }

    // Format a brief WhatsApp message for direct sales
    const text = `*LEMA QUICK CONTACT INQUIRY*\n*Name:* ${quickName}\n*Phone:* ${quickPhone}\n*Message:* ${quickMsg}`;
    const url = `https://wa.me/254729352131?text=${encodeURIComponent(text)}`;

    setQuickFeedback('Connecting you with LEMA Sales on WhatsApp...');
    setTimeout(() => {
      window.open(url, '_blank');
      setQuickFeedback('');
      setQuickName('');
      setQuickPhone('');
      setQuickMsg('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-green-50 text-brand-green-900 selection:bg-brand-gold-500/30 selection:text-brand-green-950 flex flex-col justify-between">
      
      {/* 1. STICKY BRAND HEADER NAVBAR */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onOpenTransport={() => setIsTransportOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onScrollToSection={handleScrollToSection}
        activeView={activeView}
        onNavigateView={(view) => {
          setActiveView(view);
          setSelectedProductId(null);
        }}
      />

      {/* 1.5. GLOBAL SCROLLING MARQUEE BANNER DIRECTLY BELOW THE HEADER */}
      <div className="bg-brand-gold-500 text-brand-green-950 py-1.5 border-y border-brand-gold-600 font-sans select-none overflow-hidden relative z-10 animate-fadeIn" id="global-scrolling-marquee">
        <div className="marquee-container">
          <div className="marquee-content flex items-center gap-16 text-xs sm:text-sm font-black uppercase tracking-wider">
            {/* Iteration 1 */}
            <span className="flex items-center gap-2 shrink-0">★ BUILDING STRONGER. BUILDING TOGETHER.</span>
            <span className="flex items-center gap-2 shrink-0">★ KEBS APPROVED QUALITY ASSURED</span>
            <span className="flex items-center gap-2 shrink-0">★ PREMIUM PRESSURE-TREATED EUCALYPTUS POLES</span>
            <span className="flex items-center gap-2 shrink-0">★ HIGH-STRENGTH CYPRESS & MAHOGANY BEAMS</span>
            <span className="flex items-center gap-2 shrink-0">★ UV-STABILIZED HEAVY DUTY CYLINDRICAL TANKS</span>
            <span className="flex items-center gap-2 shrink-0">★ REINFORCING STEEL BARS Y8 - Y16</span>
            <span className="flex items-center gap-2 shrink-0">★ BEST WHOLESALE PRICES IN KAJIADO & NAIROBI</span>
            <span className="flex items-center gap-2 shrink-0">★ RELIABLE FLATBED YARD LOGISTICS DIRECT TO SITE</span>
            
            {/* Iteration 2 */}
            <span className="flex items-center gap-2 shrink-0">★ BUILDING STRONGER. BUILDING TOGETHER.</span>
            <span className="flex items-center gap-2 shrink-0">★ KEBS APPROVED QUALITY ASSURED</span>
            <span className="flex items-center gap-2 shrink-0">★ PREMIUM PRESSURE-TREATED EUCALYPTUS POLES</span>
            <span className="flex items-center gap-2 shrink-0">★ HIGH-STRENGTH CYPRESS & MAHOGANY BEAMS</span>
            <span className="flex items-center gap-2 shrink-0">★ UV-STABILIZED HEAVY DUTY CYLINDRICAL TANKS</span>
            <span className="flex items-center gap-2 shrink-0">★ REINFORCING STEEL BARS Y8 - Y16</span>
            <span className="flex items-center gap-2 shrink-0">★ BEST WHOLESALE PRICES IN KAJIADO & NAIROBI</span>
            <span className="flex items-center gap-2 shrink-0">★ RELIABLE FLATBED YARD LOGISTICS DIRECT TO SITE</span>
          </div>
        </div>
      </div>

      {activeView === 'home' ? (
        selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProductId(null)}
            onAddToCart={handleAddToCart}
            onSelectProduct={(id) => setSelectedProductId(id)}
            onDownloadPDF={setActivePrintData}
          />
        ) : (
          <>
            {/* 2. MAIN HERO STORY & CORE HIGHLIGHTS */}
            <Hero
              onOpenEstimator={() => setIsEstimatorOpen(true)}
              onExploreProducts={() => handleScrollToSection('catalog-store')}
            />

          {/* 3. CORE INTERACTIVE LUMBER CALCULATOR SECTION */}
          <section className="bg-[#FAF8F3]/60 py-8 border-b border-brand-green-200/50" id="timber-calculator-section">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center mb-4">
                <span className="text-xs font-bold text-brand-gold-600 tracking-widest uppercase block">
                  REAL-TIME WOOD ESTIMATION
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-green-950 mt-1">
                  CUSTOM LUMBER BOARD-FEET CALCULATOR
                </h2>
                <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
                  Choose your timber species, enter structural dimensions, and instantly calculate volumes, weight profiles, and estimated costs in KES before ordering.
                </p>
              </div>

              <LumberCalculator onAddToCart={handleAddToCart} onDownloadPDF={setActivePrintData} />

              {/* Haulage Transport Rates Promo Banner */}
              <div className="mt-8 bg-brand-green-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-brand-green-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-brand-green-700 p-2.5 rounded-xl text-brand-gold-500">🚚</span>
                  <div>
                    <h4 className="font-display font-extrabold text-lg sm:text-xl tracking-tight">CALCULATE FLATBED & PICKUP HAULAGE RATES</h4>
                    <p className="text-xs text-brand-green-200">
                      Instantly calculate precise delivery transport fees to Devki, Athi River, Syokimau, Isinya, Kajiado, and surrounding regions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTransportOpen(true)}
                  className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all hover:scale-[1.02]"
                >
                  Launch Transport Estimator
                </button>
              </div>

            </div>
          </section>

          {/* 4. ONLINE STORE CATALOG (THE MAIN PRODUCT CENTER) */}
          <section className="py-8 bg-brand-green-50" id="catalog-store">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Section Heading */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-green-200 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-brand-green-700 tracking-widest uppercase block">
                    LEMA KITENGELA YARD INVENTORY
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-green-950 mt-1">
                    ONLINE MATERIAL STORE
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    Browse premium sawn lumber, high-strength reinforcing rebars, Creosote-treated fencing posts, fencing rolls, and UV-stabilized water tanks.
                  </p>
                </div>

                {/* Live cart button shortcut if items are selected */}
                {cart.length > 0 && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-brand-gold-500 hover:bg-brand-gold-600 active:bg-brand-gold-700 text-brand-green-950 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Review Cart ({cart.length} unique lines)</span>
                  </button>
                )}
              </div>

              {/* Search and Category Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-4">
                
                {/* Category selection bar */}
                <div className="flex flex-wrap gap-1.5 bg-brand-green-100 p-1 rounded-xl border border-brand-green-200 overflow-x-auto font-sans">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-brand-green-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Materials
                  </button>
                  <button
                    onClick={() => setSelectedCategory('timber')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'timber'
                        ? 'bg-brand-green-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Timber & Fascia
                  </button>
                  <button
                    onClick={() => setSelectedCategory('steel')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'steel'
                        ? 'bg-brand-green-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Reinforcing Steel Rebars
                  </button>
                  <button
                    onClick={() => setSelectedCategory('poles')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'poles'
                        ? 'bg-brand-green-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Treated Fencing Poles
                  </button>
                  <button
                    onClick={() => setSelectedCategory('fencing')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'fencing'
                        ? 'bg-brand-green-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chain Link Mesh
                  </button>
                  <button
                    onClick={() => setSelectedCategory('tanks')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'tanks'
                        ? 'bg-brand-green-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Water Tanks
                  </button>
                </div>

                {/* Keyword Search input */}
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-brand-green-600/60" />
                  <input
                    type="text"
                    placeholder="Search rebar gauge, poles, cypress, tanks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-3.5 border border-brand-green-200 rounded-xl focus:border-brand-green-700 focus:outline-none bg-brand-green-100 focus:bg-white transition-all text-brand-green-900"
                  />
                </div>

              </div>

              {/* Grid display products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50">
                  <p className="text-slate-500 text-sm font-semibold">No materials match your filter requirements.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 text-xs bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Clear All Search Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(productId) => {
                        setSelectedProductId(productId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* 5. ABOUT LEMA HISTORY (EXPLAINING STORY FROM IMAGE DETAILS) */}
          <section className="py-8 bg-slate-100 border-y border-slate-200" id="about-lema">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Visual stacked timber image mockup column */}
                <div className="lg:col-span-5 relative order-last lg:order-first">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                    <img 
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                      alt="Stocked Timber in Kenyan Yard" 
                      className="w-full h-80 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/85 via-brand-green-950/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs space-y-1">
                      <h4 className="font-bold text-sm">Industrial Creosote / Tanalith Autoclave</h4>
                      <p className="text-brand-green-200 text-[10px]">Eucalyptus poles pressure treated for 15+ years durability against termites, water and soil damage.</p>
                    </div>
                  </div>
                </div>

                {/* Story contents */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-gold-600 tracking-widest uppercase block">
                      LEMA TIMBER & SUPPLIES
                    </span>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-green-950 leading-tight">
                      SERVING KITENGELA TOWN AND BEYOND WITH EXCELLENCE
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    Headquartered in Kitengela Town, along the major Namanga Road corridor, LEMA is a trusted standard supplier of structural materials. Our founders established the yard with a simple, timeless vision: <strong>"BUILDING STRONGER. BUILDING TOGETHER."</strong>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-brand-gold-600 text-xs font-bold tracking-wider uppercase block">
                        Structural Safety
                      </span>
                      <p className="text-xs text-slate-600 leading-normal">
                        Our high-yield steel bars Y8 to Y16 conform to standard ribbed reinforcement indices, giving structural foundations the strength to bear tall structures securely.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-brand-gold-600 text-xs font-bold tracking-wider uppercase block">
                        Water Independence
                      </span>
                      <p className="text-xs text-slate-600 leading-normal">
                        We supply heavy-duty dual-layer food-grade plastic cylindrical tanks in capacities from 500L to 10,000L, securing water harvesting in Kitengela and surrounding farm sectors.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic border-l-2 border-brand-gold-500 pl-3">
                    *We offer personalized industrial wood profiling, fascia sizing, truss planning, cross-cutting, and standard flatbed logistics. Contact our sales hotline to discuss wholesale price index cuts.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* 6. INSTANT CONTACT & SALES INQUIRY FORM */}
          <section className="py-8 bg-white" id="quick-inquiry-section">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="bg-brand-green-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-brand-green-700">
                {/* Decorative back pattern */}
                <div className="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none timber-pattern"></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left explanation column */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-brand-gold-500 text-xs font-bold tracking-widest uppercase block">
                        QUICK DIRECT HOTLINE
                      </span>
                      <h3 className="font-display font-extrabold text-xl sm:text-2xl leading-snug">
                        HAVE A CUSTOM ESTIMATE IN MIND?
                      </h3>
                    </div>
                    <p className="text-xs text-brand-green-100 leading-relaxed">
                      Send a direct text to our yard sales operators. We will validate current wholesale prices, availability, and delivery logistics options instantly.
                    </p>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-brand-gold-100 flex items-center gap-1.5">
                        <ClipboardCheck className="w-4.5 h-4.5 text-brand-gold-500" />
                        KEBS Standardized Wood & Steel
                      </p>
                      <p className="font-semibold text-brand-gold-100 flex items-center gap-1.5">
                        <ClipboardCheck className="w-4.5 h-4.5 text-brand-gold-500" />
                        Same-Day Regional Deliveries
                      </p>
                    </div>
                  </div>

                  {/* Right contact form column */}
                  <form onSubmit={handleQuickContact} className="lg:col-span-7 bg-white/95 backdrop-blur-xs rounded-2xl p-6 text-slate-800 space-y-4 shadow-md">
                    
                    <h4 className="font-display font-bold text-sm text-brand-green-950 border-b border-slate-100 pb-1.5">
                      Direct WhatsApp Yard Inquiry
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Kamau"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-brand-green-700 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Phone Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +254 729 352131"
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-brand-green-700 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Material Inquiry details</label>
                      <textarea
                        placeholder="e.g. 'Quote me on 50 pcs of Cypress 3x2, and 12 bars of Y12 with delivery to Isinya.'"
                        value={quickMsg}
                        onChange={(e) => setQuickMsg(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 h-16 bg-slate-50 focus:bg-white focus:border-brand-green-700 focus:outline-none"
                      />
                    </div>

                    {quickFeedback && (
                      <p className="text-xs text-brand-green-700 font-bold font-sans text-center bg-brand-green-100/50 py-1 px-2 rounded">
                        {quickFeedback}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 fill-brand-green-950" />
                      Connect to Yard Agent
                    </button>

                  </form>

                </div>
              </div>

            </div>
          </section>
          </>
        )
      ) : (
        <BlogPage
          onBackToHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
          }}
          onOpenEstimator={() => {
            setActiveView('home');
            setTimeout(() => {
              const el = document.getElementById('timber-calculator-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setIsEstimatorOpen(true);
            }, 50);
          }}
        />
      )}

      {/* 7. DETAILED FOOTER WITH DIRECTIONAL MAP & TIMING */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenEstimator={() => {
          handleScrollToSection('timber-calculator-section');
          setIsEstimatorOpen(true);
        }}
      />

      {/* --- DRAWERS AND OVERLAY MODALS --- */}
      
      {/* Drawer: Shopping Cart Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onDownloadPDF={setActivePrintData}
      />

      {/* Modal: Lumber Calculator Dedicated Overlay (Fallback or trigger modal) */}
      {isEstimatorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-brand-green-950/75 backdrop-blur-xs" onClick={() => setIsEstimatorOpen(false)}></div>
          <div className="relative max-w-4xl w-full text-left shadow-2xl transition-all my-8">
            <LumberCalculator 
              onAddToCart={handleAddToCart} 
              onClose={() => setIsEstimatorOpen(false)} 
              onDownloadPDF={setActivePrintData}
            />
          </div>
        </div>
      )}

      {/* Modal: Transport Estimator Overlay */}
      {isTransportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-brand-green-950/75 backdrop-blur-xs" onClick={() => setIsTransportOpen(false)}></div>
          <div className="relative max-w-4xl w-full text-left shadow-2xl transition-all my-8">
            <TransportEstimator
              onClose={() => setIsTransportOpen(false)}
              onDownloadPDF={setActivePrintData}
            />
          </div>
        </div>
      )}

      {/* Modal: Checkout Inquiry Wizard */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleSubmitOrder}
        onClearCart={handleClearCart}
      />

      {/* Modal: Order History Logs */}
      <InquiryHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        onDeleteOrder={handleDeleteOrder}
        onViewInvoice={(order) => {
          setReprintOrder(order);
          setIsHistoryOpen(false);
        }}
      />

      {/* Modal Overlay: Reprint Invoice Reader */}
      {reprintOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans p-4 flex items-center justify-center bg-black/60 print:bg-white">
          <div className="fixed inset-0 bg-brand-green-950/70 backdrop-blur-xs print:hidden" onClick={() => setReprintOrder(null)}></div>
          <div className="bg-white rounded-2xl max-w-2xl w-full text-left shadow-2xl border border-slate-100 overflow-hidden relative z-10 my-8">
            
            {/* Control bar for Reprint */}
            <div className="bg-brand-green-800 text-white p-4 flex items-center justify-between border-b border-brand-green-700 print:hidden">
              <span className="text-xs font-bold font-mono">Invoice reprint: {reprintOrder.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Invoice
                </button>
                <button
                  onClick={() => setReprintOrder(null)}
                  className="text-brand-green-100 hover:text-white text-xs px-2 py-1.5 rounded"
                >
                  Close ×
                </button>
              </div>
            </div>

            {/* Render Print Sheet */}
            <div className="p-8 space-y-6 font-mono text-xs text-slate-800" id="reprint-invoice-sheet">
              {/* Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div className="space-y-1">
                  <h2 className="text-base font-extrabold text-slate-950 tracking-wider">
                    LEMA TIMBER & SUPPLIES
                  </h2>
                  <p className="text-[10px] text-slate-600">A Timeless Vision</p>
                  <p className="text-[10px] text-slate-600">
                    Kitengela Town, along Namanga Road, Kajiado County, Kenya.
                  </p>
                  <p className="text-[10px] text-slate-600">Tel: +254 729 352131</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-bold border border-slate-900 px-2 py-0.5 uppercase block w-fit ml-auto">
                    OFFICIAL QUOTATION REPRINT
                  </span>
                  <p className="font-bold text-slate-950 mt-1">
                    No: {reprintOrder.id}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Date: {reprintOrder.timestamp}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-950 block border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                    CLIENT BILLING DETAILS:
                  </span>
                  <p className="font-bold text-slate-900">{reprintOrder.customerName}</p>
                  <p>Phone: {reprintOrder.phone}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-950 block border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                    LOGISTICS DESTINATION:
                  </span>
                  <p className="font-bold capitalize">{reprintOrder.deliveryType} Delivery</p>
                  <p className="text-slate-700">Location: {reprintOrder.deliveryLocation}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 font-bold text-slate-900">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center w-16">Qty</th>
                      <th className="py-2 text-right w-28">Unit (KES)</th>
                      <th className="py-2 text-right w-32">Total (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reprintOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200 font-medium">
                        <td className="py-2 max-w-sm">
                          <span className="font-bold text-slate-950 block">{item.name}</span>
                          <span className="text-[10px] text-slate-500 block leading-tight">{item.descriptionText}</span>
                        </td>
                        <td className="py-2 text-center font-bold">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">{item.unitPrice.toLocaleString()}</td>
                        <td className="py-2 text-right font-mono font-bold">{item.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-right font-medium">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Products Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">KES {reprintOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Regional Haulage Fee:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {reprintOrder.deliveryCost === 0 ? 'FREE / Pickup' : `KES ${reprintOrder.deliveryCost.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="border-t border-slate-400 my-1"></div>
                  <div className="flex justify-between text-xs font-bold text-slate-950 pt-0.5">
                    <span className="uppercase">Grand Total:</span>
                    <span className="font-mono text-sm">KES {reprintOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {reprintOrder.notes && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 uppercase block text-[9px] mb-1">
                    Special Client Instructions:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-sans">{reprintOrder.notes}</p>
                </div>
              )}

              {/* Terms */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[9px] text-slate-500 font-sans leading-normal">
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-700 uppercase">LEMA Yard Terms & Details:</h5>
                  <p>1. This quotation is calculated based on current timber and steel prices in Kenya. Prices are valid for 14 days.</p>
                  <p>2. Unloading from the delivery lorry is completed at the client eave side. Interior hauling is not included.</p>
                  <p>3. Planing, cross-cutting, and profiling can be arranged directly with LEMA yard operators prior to haulage.</p>
                </div>
                <div className="flex flex-col justify-end text-right space-y-4">
                  <div className="h-10 w-44 border-b border-slate-400 ml-auto"></div>
                  <p className="font-mono text-[8px] uppercase">Authorized Yard Official Stamp / Sign</p>
                </div>
              </div>
            </div>

            {/* Reprint Close bar (hidden in printing) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end print:hidden">
              <button
                type="button"
                onClick={() => setReprintOrder(null)}
                className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold px-6 py-2 rounded-lg text-xs cursor-pointer"
              >
                Close Reprint Screen
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Printable Invoice/Quotation Popup Area */}
      <PrintArea 
        data={activePrintData} 
        onClose={() => setActivePrintData(null)} 
      />

    </div>
  );
}
