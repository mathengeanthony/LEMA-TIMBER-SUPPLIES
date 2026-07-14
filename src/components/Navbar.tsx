import { useState } from 'react';
import { ShoppingCart, Phone, History, Menu, X, Calculator, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenEstimator: () => void;
  onOpenTransport: () => void;
  onOpenHistory: () => void;
  onScrollToSection: (sectionId: string) => void;
  activeView?: 'home' | 'blog';
  onNavigateView?: (view: 'home' | 'blog') => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  onOpenEstimator,
  onOpenTransport,
  onOpenHistory,
  onScrollToSection,
  activeView = 'home',
  onNavigateView,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 bg-brand-green-800 text-white shadow-md border-b border-brand-green-700 font-sans" id="nav-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Area */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => {
              onNavigateView?.('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-lg p-1.5 shadow-inner">
              {/* Custom Vector Mountain Design resembling Lema Logo */}
              <svg className="w-full h-full text-brand-green-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15L85 75H15L50 15Z" fill="currentColor" opacity="0.15" />
                <path d="M50 15L70 55H30L50 15Z" fill="currentColor" />
                <path d="M35 45L60 85H10L35 45Z" fill="currentColor" className="text-brand-gold-500" />
                {/* Tree silhouettes */}
                <path d="M22 80L25 72L28 80H22Z" fill="currentColor" />
                <path d="M78 80L81 72L84 80H78Z" fill="currentColor" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-wide text-white">LEMA</span>
                <span className="font-sans text-[10px] sm:text-xs text-brand-gold-100 font-semibold tracking-wider bg-brand-green-700 px-1.5 py-0.5 rounded">TIMBER</span>
              </div>
              <span className="font-display text-[9px] sm:text-[10px] text-brand-green-100 tracking-[0.18em] uppercase leading-none">A Timeless Vision</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => {
                onNavigateView?.('home');
                setTimeout(() => onScrollToSection('catalog-store'), 50);
              }}
              className={`${activeView === 'home' ? 'text-white border-b-2 border-brand-gold-500' : 'text-brand-green-100'} hover:text-white font-medium text-sm transition-colors pb-0.5 cursor-pointer`}
              id="nav-link-products"
            >
              Browse Products
            </button>
            <button 
              onClick={() => {
                onNavigateView?.('home');
                setTimeout(() => onScrollToSection('timber-calculator-section'), 50);
                onOpenEstimator();
              }}
              className="flex items-center gap-1.5 text-brand-gold-100 hover:text-white font-semibold text-sm transition-colors cursor-pointer bg-brand-green-700/50 hover:bg-brand-green-700 px-3 py-1.5 rounded-full border border-brand-gold-500/30"
              id="nav-link-calculator"
            >
              <Calculator className="w-4 h-4 text-brand-gold-500" />
              Lumber Estimator
            </button>
            <button 
              onClick={() => {
                onNavigateView?.('home');
                onOpenTransport();
              }}
              className="text-brand-green-100 hover:text-white font-medium text-sm transition-colors cursor-pointer"
              id="nav-link-transport"
            >
              Haulage Rates
            </button>
            <button 
              onClick={() => onNavigateView?.('blog')}
              className={`${activeView === 'blog' ? 'text-brand-gold-500 border-b-2 border-brand-gold-500 font-semibold' : 'text-brand-green-100'} hover:text-white font-medium text-sm transition-colors pb-0.5 cursor-pointer`}
              id="nav-link-blog"
            >
              Articles & Blog
            </button>
            <button 
              onClick={() => {
                onNavigateView?.('home');
                setTimeout(() => onScrollToSection('about-lema'), 50);
              }}
              className="text-brand-green-100 hover:text-white font-medium text-sm transition-colors cursor-pointer"
              id="nav-link-about"
            >
              Our Story
            </button>
            <button 
              onClick={() => {
                onNavigateView?.('home');
                setTimeout(() => onScrollToSection('contact-footer'), 50);
              }}
              className="text-brand-green-100 hover:text-white font-medium text-sm transition-colors cursor-pointer"
              id="nav-link-contact"
            >
              Location & Contact
            </button>
          </div>

          {/* User Operations Panel */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Order History */}
            <button
              onClick={onOpenHistory}
              className="p-2 text-brand-green-100 hover:text-white transition-colors relative group cursor-pointer"
              title="My Order History & Invoices"
              id="btn-nav-history"
            >
              <History className="w-5.5 h-5.5" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-brand-green-900 text-[10px] font-sans text-brand-green-50 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Invoices & Quotes
              </span>
            </button>

            {/* Cart Widget */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-brand-gold-500 hover:bg-brand-gold-600 active:bg-brand-gold-700 text-brand-green-900 font-semibold px-4 py-2.5 rounded-full transition-all shadow-md hover:scale-105 relative cursor-pointer"
              id="btn-nav-cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span className="text-sm">Store Cart</span>
              {totalItemsCount > 0 ? (
                <span className="bg-brand-green-800 text-white font-mono text-xs w-5 h-5 flex items-center justify-center rounded-full absolute -top-1.5 -right-1.5 font-bold border border-brand-gold-100 animate-bounce">
                  {totalItemsCount}
                </span>
              ) : (
                <span className="text-brand-green-800/60 text-xs font-mono">0</span>
              )}
            </button>

            {/* WhatsApp Hotlink */}
            <a
              href="https://wa.me/254729352131"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg border border-emerald-500 transition-all shadow-sm"
              id="btn-nav-whatsapp"
            >
              <Phone className="w-4 h-4 text-emerald-100 fill-emerald-100" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] leading-none text-emerald-100">WhatsApp Sales</span>
                <span className="font-mono text-[11px] font-bold">+254 729 352131</span>
              </div>
            </a>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Cart Button Mobile */}
            <button
              onClick={onOpenCart}
              className="p-2 rounded-lg bg-brand-green-700 text-brand-gold-100 relative cursor-pointer"
              id="btn-nav-cart-mobile"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold-500 text-brand-green-950 font-bold font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-green-800">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-brand-green-700 text-white hover:text-brand-gold-100 transition-colors cursor-pointer"
              id="btn-nav-toggle-mobile"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-brand-green-900 border-t border-brand-green-800 px-4 pt-3 pb-6 space-y-3 font-sans animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigateView?.('home');
                setIsOpen(false);
                setTimeout(() => onScrollToSection('catalog-store'), 50);
              }}
              className="bg-brand-green-800 text-left px-4 py-3 rounded-lg text-sm font-semibold text-brand-green-100 hover:text-white"
            >
              Browse Products
            </button>
            <button
              onClick={() => {
                onNavigateView?.('home');
                setIsOpen(false);
                setTimeout(() => {
                  onScrollToSection('timber-calculator-section');
                  onOpenEstimator();
                }, 50);
              }}
              className="bg-brand-green-800 text-left px-4 py-3 rounded-lg text-sm font-semibold text-brand-gold-100 flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-brand-gold-500" />
              Estimator
            </button>
            <button
              onClick={() => {
                onNavigateView?.('home');
                setIsOpen(false);
                onOpenTransport();
              }}
              className="bg-brand-green-800 text-left px-4 py-3 rounded-lg text-sm font-semibold text-brand-green-100"
            >
              Haulage Rates
            </button>
            <button
              onClick={() => {
                onNavigateView?.('home');
                setIsOpen(false);
                setTimeout(() => onScrollToSection('about-lema'), 50);
              }}
              className="bg-brand-green-800 text-left px-4 py-3 rounded-lg text-sm font-medium text-brand-green-100"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                onNavigateView?.('home');
                setIsOpen(false);
                setTimeout(() => onScrollToSection('contact-footer'), 50);
              }}
              className="bg-brand-green-800 text-left px-4 py-3 rounded-lg text-sm font-medium text-brand-green-100"
            >
              Yard Location
            </button>
            <button
              onClick={() => {
                onNavigateView?.('blog');
                setIsOpen(false);
              }}
              className="bg-brand-green-800 text-left px-4 py-3 rounded-lg text-sm font-bold text-brand-gold-500 col-span-2 flex items-center justify-between"
            >
              <span>Articles & Blog Guides</span>
              <span className="text-[10px] bg-brand-gold-500 text-brand-green-950 px-2 py-0.5 rounded-full font-sans font-black">NEW</span>
            </button>
          </div>

          <div className="h-px bg-brand-green-800 my-2"></div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpenHistory();
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-2 bg-brand-green-800 hover:bg-brand-green-700 text-brand-green-50 font-semibold py-3 rounded-lg text-sm cursor-pointer"
            >
              <History className="w-4.5 h-4.5 text-brand-gold-500" />
              My Orders & Quotes History
            </button>

            <a
              href="https://wa.me/254729352131"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm shadow-md"
            >
              <Phone className="w-4.5 h-4.5 fill-white text-emerald-50" />
              WhatsApp Hotline: +254 729 352131
            </a>
          </div>

          <div className="text-center text-[11px] text-brand-green-200/60 pt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold-500/70" />
            KEBS Certified Construction Materials
          </div>
        </div>
      )}
    </nav>
  );
}
