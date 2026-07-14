import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Check, ShieldCheck, Phone, MapPin, Sparkles, AlertCircle, Calculator } from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data';
import LumberCalculator from './LumberCalculator';
import { PrintData } from './PrintArea';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: Omit<CartItem, 'cartId' | 'totalPrice'>) => void;
  onSelectProduct: (productId: string) => void;
  onDownloadPDF?: (data: PrintData) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart, onSelectProduct, onDownloadPDF }: ProductDetailProps) {
  // Reset scroll position to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Option indices tracker. Standard product can have multiple options (e.g., Option 0, Option 1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (product.options) {
      product.options.forEach((opt) => {
        initial[opt.name] = 0; // default to first value
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Re-calculate options state when product changes
  useEffect(() => {
    const initial: Record<string, number> = {};
    if (product.options) {
      product.options.forEach((opt) => {
        initial[opt.name] = 0;
      });
    }
    setSelectedOptions(initial);
    setQuantity(1);
    setAddedAnimation(false);
  }, [product]);

  // Compute price based on options
  const calculatedUnitPrice = useMemo(() => {
    let price = product.basePrice;
    if (product.options && Object.keys(selectedOptions).length > 0) {
      product.options.forEach((opt) => {
        const selectedValueIdx = selectedOptions[opt.name];
        if (opt.priceModifiers && opt.priceModifiers[selectedValueIdx] !== undefined) {
          price += opt.priceModifiers[selectedValueIdx];
        }
      });
    }
    return price;
  }, [product, selectedOptions]);

  // Compute current display specifications text based on options
  const selectedOptionsLabel = useMemo(() => {
    if (!product.options) return '';
    return product.options
      .map((opt) => {
        const selectedValueIdx = selectedOptions[opt.name];
        return `${opt.name}: ${opt.values[selectedValueIdx]}`;
      })
      .join(', ');
  }, [product, selectedOptions]);

  const handleOptionChange = (optionName: string, valueIdx: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: valueIdx,
    }));
  };

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    const optionsText = selectedOptionsLabel ? ` (${selectedOptionsLabel})` : '';
    const finalName = product.name;

    onAddToCart({
      productId: product.id,
      name: finalName,
      category: product.category,
      unitPrice: calculatedUnitPrice,
      quantity: quantity,
      descriptionText: `${product.unit}${optionsText}`,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Quick Direct Inquiry Link for this particular product
  const handleProductInquiry = () => {
    const specDetails = selectedOptionsLabel ? ` [Configured: ${selectedOptionsLabel}]` : '';
    const text = `*LEMA DIRECT PRODUCT INQUIRY*\n*Product:* ${product.name}${specDetails}\n*Desired Quantity:* ${quantity} ${product.unit.split('per ')[1] || 'units'}\n*Estimated Unit Price:* KES ${calculatedUnitPrice.toLocaleString()}/-\n\nHi LEMA, I would like to inquire about stock availability, bulk discounts, and transport options for this material to my site.`;
    const url = `https://wa.me/254729352131?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Get related products in the same category (excluding current)
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  }, [product]);

  // Determine initial tab for the embedded calculator
  const initialCalculatorTab = useMemo(() => {
    if (['timber', 'poles', 'fencing', 'steel'].includes(product.category)) {
      return product.category as 'timber' | 'poles' | 'fencing' | 'steel';
    }
    return 'timber';
  }, [product.category]);

  // Category labels and styles
  const categoryStyles = {
    timber: { label: 'TIMBER PLANK', color: 'bg-brand-gold-500/15 text-brand-green-800 border-brand-gold-500/30' },
    steel: { label: 'REINFORCING STEEL', color: 'bg-brand-gold-500/15 text-brand-green-800 border-brand-gold-500/30' },
    poles: { label: 'TREATED POLE', color: 'bg-brand-gold-500/15 text-brand-green-800 border-brand-gold-500/30' },
    fencing: { label: 'WIRE FENCING', color: 'bg-brand-gold-500/15 text-brand-green-800 border-brand-gold-500/30' },
    tanks: { label: 'WATER STORAGE', color: 'bg-brand-gold-500/15 text-brand-green-800 border-brand-gold-500/30' },
  };

  const catStyle = categoryStyles[product.category] || { label: 'MATERIAL', color: 'bg-brand-green-100 text-brand-green-900 border-brand-green-200' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-brand-green-950 animate-fadeIn" id="product-detail-page">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-green-800 hover:text-brand-green-950 bg-brand-green-100/60 hover:bg-brand-green-100 border border-brand-green-200/50 px-3.5 py-2 rounded-xl transition-all mb-6 cursor-pointer"
        id="btn-back-to-catalog"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Materials
      </button>

      {/* Main Grid: Left Image, Right Specs & Purchase panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-brand-green-200/40 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Left Column: Premium Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden bg-brand-green-50 border border-slate-100 shadow-xs">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Category Pill */}
            <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full border shadow-md ${catStyle.color}`}>
              {catStyle.label}
            </span>

            {/* KEBS Approved Stamp */}
            {(product.category === 'steel' || product.category === 'poles' || product.category === 'tanks') && (
              <span className="absolute top-4 right-4 bg-brand-green-800 text-white text-[9px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold-500" />
                KEBS APPROVED
              </span>
            )}
          </div>

          {/* Quick Informational Tip */}
          <div className="p-4 bg-brand-green-50/50 rounded-2xl border border-brand-green-200/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-brand-green-950">LEMA Kitengela Delivery Logistics</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Same-day transport is organized directly from our Namanga Road yard using dedicated flatbeds or light pickups. You can calculate custom distance fees upon checking out.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Purchasing Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Header titles */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                product.stockStatus === 'In Stock' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                ● {product.stockStatus}
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                ID: {product.id.toUpperCase()}
              </span>
            </div>
            
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-green-950 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <p className="text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specs List */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-brand-green-900 uppercase tracking-wider">
              MATERIAL SPECIFICATIONS:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-brand-green-700 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Option Selections */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-brand-green-900 uppercase tracking-wider">
                CONFIGURE OPTIONAL DIMENSIONS & PROFILES:
              </h4>
              <div className="space-y-3">
                {product.options.map((opt) => (
                  <div key={opt.name} className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Select {opt.name}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val, idx) => {
                        const isSelected = selectedOptions[opt.name] === idx;
                        const modifier = opt.priceModifiers ? opt.priceModifiers[idx] : 0;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionChange(opt.name, idx)}
                            className={`text-xs font-medium px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? 'bg-brand-green-800 text-white border-brand-green-800 font-semibold shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{val}</span>
                            {modifier !== 0 && (
                              <span className={`text-[10px] font-mono ${isSelected ? 'text-brand-gold-300' : 'text-slate-500 font-medium'}`}>
                                ({modifier > 0 ? `+KES ${modifier}` : `-KES ${Math.abs(modifier)}`})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing, Quantity Stepper, and Add-to-Cart Panel */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 space-y-4">
            
            {/* Real-time total pricing calculation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                  Calculated Price ({quantity} {quantity === 1 ? 'unit' : 'units'})
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-slate-500 font-mono">KES</span>
                  <span className="font-mono text-2xl font-black text-brand-green-950">
                    {(calculatedUnitPrice * quantity).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium lowercase">
                    (KES {calculatedUnitPrice.toLocaleString()} / {product.unit.split('per ')[1] || 'item'})
                  </span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1 bg-brand-green-100 text-brand-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-green-200/50">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold-500" />
                Real-Time Price
              </div>
            </div>

            {/* Stepper + Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Stepper */}
              <div className="flex items-center justify-between bg-white border border-brand-green-200 rounded-xl overflow-hidden h-12 px-1">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold rounded-lg cursor-pointer transition-all"
                  title="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center font-mono font-bold text-brand-green-950 text-sm bg-white focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold rounded-lg cursor-pointer transition-all"
                  title="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart with success state */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-green-800 text-white hover:bg-brand-green-700 active:bg-brand-green-900'
                }`}
                id={`btn-detail-add-to-cart`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    Added to Active Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Inquiry Cart
                  </>
                )}
              </button>

            </div>

            {/* Direct WhatsApp quote specifically about this stock */}
            <button
              onClick={handleProductInquiry}
              className="w-full bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold h-12 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Phone className="w-4 h-4 fill-brand-green-950" />
              Direct WhatsApp Quote Inquiry For This Configuration
            </button>

            {onDownloadPDF && (
              <button
                type="button"
                onClick={() => {
                  onDownloadPDF({
                    title: 'PRODUCT PRICE QUOTATION',
                    quoteNo: `LEMA-PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    deliveryType: 'pickup',
                    deliveryLocation: 'Kitengela Town Yard',
                    deliveryCost: 0,
                    subtotal: calculatedUnitPrice * quantity,
                    total: calculatedUnitPrice * quantity,
                    notes: `Official material price quotation for ${product.name}. ${product.description}. Sourced and verified by LEMA central transport yard in Kitengela. Spec: ${selectedOptionsLabel || product.unit}.`,
                    items: [
                      {
                        name: product.name,
                        descriptionText: `${product.unit}${selectedOptionsLabel ? ` (${selectedOptionsLabel})` : ''}`,
                        quantity: quantity,
                        unitPrice: calculatedUnitPrice,
                        totalPrice: calculatedUnitPrice * quantity,
                      }
                    ]
                  });
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold h-12 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs"
              >
                📥 Download Product Quotation PDF
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Interactive Yard Material Estimator */}
      <div key={product.id} className="mt-12 bg-[#FAF8F3]/65 border border-brand-green-200/50 rounded-3xl p-6 sm:p-8" id="product-estimator-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-brand-green-200 pb-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-gold-500" />
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-brand-green-950 uppercase tracking-tight">
                LEMA Interactive Structural Estimator
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Calculate standard, custom-size, or structural roofing list requirements for <strong>{product.name}</strong> contextually.
            </p>
          </div>
          <span className="text-[10px] bg-brand-green-800 text-white font-mono font-bold px-3 py-1.5 rounded-full border shadow-sm self-start sm:self-center">
            CONTEXT: {initialCalculatorTab.toUpperCase()} ACTIVE
          </span>
        </div>

        <div className="bg-white border border-brand-green-100 rounded-2xl overflow-hidden shadow-xs">
          <LumberCalculator 
            onAddToCart={onAddToCart}
            onDownloadPDF={onDownloadPDF}
            initialTab={initialCalculatorTab}
          />
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t border-brand-green-200/40 pt-10" id="related-products-section">
          <h3 className="font-display font-extrabold text-xl text-brand-green-950 mb-6 uppercase tracking-tight">
            Related Materials in the LEMA Yard:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => {
              const rCatStyle = categoryStyles[p.category] || { label: 'MATERIAL', color: 'bg-brand-green-100 text-brand-green-900 border-brand-green-200' };
              return (
                <div 
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${rCatStyle.color}`}>
                      {rCatStyle.label}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm text-brand-green-950 group-hover:text-brand-green-700 transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                      <div className="font-mono text-xs font-bold text-brand-green-950">
                        KES {p.basePrice.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal lowercase">/{p.unit.split('per ')[1] || 'item'}</span>
                      </div>
                      <span className="text-[10px] text-brand-green-800 font-bold group-hover:underline">View details →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
