import { useState, useMemo } from 'react';
import { ShoppingCart, Check, ShieldCheck } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (item: Omit<CartItem, 'cartId' | 'totalPrice'>) => void;
  onViewDetails?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
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

  // Category visual styles
  const categoryStyles = {
    timber: { label: 'TIMBER PLANK', color: 'bg-brand-gold-500/20 text-brand-green-800 border-brand-gold-500/30' },
    steel: { label: 'REINFORCING STEEL', color: 'bg-brand-gold-500/20 text-brand-green-800 border-brand-gold-500/30' },
    poles: { label: 'TREATED POLE', color: 'bg-brand-gold-500/20 text-brand-green-800 border-brand-gold-500/30' },
    fencing: { label: 'WIRE FENCING', color: 'bg-brand-gold-500/20 text-brand-green-800 border-brand-gold-500/30' },
    tanks: { label: 'WATER STORAGE', color: 'bg-brand-gold-500/20 text-brand-green-800 border-brand-gold-500/30' },
  };

  const catStyle = categoryStyles[product.category] || { label: 'MATERIAL', color: 'bg-brand-green-100 text-brand-green-900 border-brand-green-200' };

  return (
    <div className="natural-card overflow-hidden flex flex-col justify-between transition-all group font-sans" id={`product-card-${product.id}`}>
      
      {/* Product Image Panel */}
      <div 
        onClick={() => onViewDetails?.(product.id)}
        className="relative h-52 w-full overflow-hidden bg-brand-green-100 cursor-pointer"
        title="Click to view material details"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Category Pill Overlaid */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${catStyle.color}`}>
          {catStyle.label}
        </span>
        
        {/* KEBS verified badge for steel and timber poles */}
        {(product.category === 'steel' || product.category === 'poles' || product.category === 'tanks') && (
          <span className="absolute top-3 right-3 bg-brand-green-800 text-white text-[8px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-brand-gold-500" />
            KEBS APPROVED
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div 
          onClick={() => onViewDetails?.(product.id)}
          className="space-y-1.5 cursor-pointer group/title"
          title="Click to view material details"
        >
          <h4 className="font-display font-extrabold text-base text-brand-green-950 tracking-tight leading-tight group-hover/title:text-brand-green-700 transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
          <span className="text-[10px] text-brand-green-700 font-bold group-hover/title:underline block">
            View Full Specs & Configurator →
          </span>
        </div>

        {/* Product Spec Checklist Bullet Points */}
        <div className="bg-brand-green-100/50 rounded-xl p-3.5 space-y-1.5 border border-brand-green-200/40">
          {product.specs.map((spec, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
              <Check className="w-3.5 h-3.5 text-brand-green-700 mt-0.5 flex-shrink-0" />
              <span>{spec}</span>
            </div>
          ))}
        </div>

        {/* Interactive Option Dropdowns/Selections */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {product.options.map((opt) => (
              <div key={opt.name} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Select {opt.name}:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {opt.values.map((val, idx) => {
                    const isSelected = selectedOptions[opt.name] === idx;
                    const modifier = opt.priceModifiers ? opt.priceModifiers[idx] : 0;
                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(opt.name, idx)}
                        className={`text-[11px] font-medium p-1.5 text-center rounded-md border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-green-700 text-white border-brand-green-700 font-semibold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>{val}</div>
                        {modifier !== 0 && (
                          <div className={`text-[9px] ${isSelected ? 'text-brand-gold-100' : 'text-slate-500'}`}>
                            {modifier > 0 ? `+KES ${modifier}` : `-KES ${Math.abs(modifier)}`}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Dynamic Purchase Bar */}
      <div className="bg-brand-green-100/50 border-t border-brand-green-200 p-5 flex flex-col space-y-3">
        
        {/* Dynamic Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              ESTIMATED UNIT PRICE
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[11px] font-bold text-slate-700 font-mono">KES</span>
              <span className="font-mono text-lg font-black text-brand-green-950">
                {calculatedUnitPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-medium lowercase">
                /{product.unit.split('per ')[1] || 'item'}
              </span>
            </div>
          </div>

          {/* Stock Status indicator */}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            product.stockStatus === 'In Stock' 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            ● {product.stockStatus}
          </span>
        </div>

        {/* Quantity Selection and Purchase Button */}
        <div className="flex items-center gap-2">
          
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-brand-green-200 rounded-lg overflow-hidden h-10">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2.5 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
              title="Decrease quantity"
            >
              -
            </button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="w-10 text-center font-mono font-bold text-brand-green-950 text-xs bg-white focus:outline-none"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2.5 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
              title="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-green-800 text-white hover:bg-brand-green-700 active:bg-brand-green-900'
            }`}
            id={`btn-add-to-cart-${product.id}`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
