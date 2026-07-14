import { ShoppingBag, Trash2, X, Plus, Minus, ArrowRight, Truck, Info, PackageOpen } from 'lucide-react';
import { CartItem } from '../types';
import { PrintData } from './PrintArea';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onDownloadPDF?: (data: PrintData) => void;
}

export default function CartDrawer({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onDownloadPDF,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Totals calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Aggregate lumber stats
  const totalBF = cart.reduce((acc, item) => acc + (item.customCalculations?.boardFeet || 0), 0);
  const totalWeight = cart.reduce((acc, item) => acc + (item.customCalculations?.weightKg || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" aria-labelledby="slide-over-title" role="dialog" aria-modal="true" id="cart-drawer-overlay">
      
      {/* Background backdrop overlay */}
      <div 
        className="absolute inset-0 bg-brand-green-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-brand-green-100">
          
          {/* Header */}
          <div className="bg-brand-green-800 text-white px-5 py-6 flex items-center justify-between border-b border-brand-green-700">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-green-700 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-brand-gold-500" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg tracking-tight">
                  YOUR MATERIAL CART
                </h3>
                <p className="text-xs text-brand-green-200">
                  {totalItems} items selected for review
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-green-200 hover:text-white hover:bg-brand-green-700 transition-all cursor-pointer"
              title="Close Cart"
              id="btn-close-cart-drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Contents list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            
            {cart.length === 0 ? (
              // Empty Cart View
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-5 bg-brand-green-50 rounded-full text-brand-green-700">
                  <PackageOpen className="w-12 h-12 stroke-1.5 text-brand-green-600 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-base text-brand-green-900">Your Cart is Empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    You haven't added any building or timber materials yet. Use our size estimator or browse the store catalog to get started.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Start Exploring Materials
                </button>
              </div>
            ) : (
              // List of Cart items
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 relative group transition-all hover:border-slate-300"
                    id={`cart-item-${item.cartId}`}
                  >
                    
                    {/* Item Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h5 className="font-bold text-xs sm:text-sm text-brand-green-950 pr-4 leading-snug">
                          {item.name}
                        </h5>
                        <button
                          onClick={() => onRemoveItem(item.cartId)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium">
                        {item.descriptionText}
                      </p>

                      {/* Specialized lumber calculation indicator */}
                      {item.customCalculations && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[9px] bg-brand-gold-100/70 text-brand-gold-700 px-1.5 py-0.5 rounded font-mono font-bold">
                            Vol: {item.customCalculations.boardFeet?.toFixed(1)} BF
                          </span>
                          <span className="text-[9px] bg-brand-green-100 text-brand-green-700 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                            <Truck className="w-2.5 h-2.5" />
                            Wt: ~{item.customCalculations.weightKg?.toFixed(0)} kg
                          </span>
                        </div>
                      )}

                      {/* Quantity & Pricing Adjustment */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-7">
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, -1)}
                            className="px-2 text-slate-500 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-brand-green-950 text-xs bg-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, 1)}
                            className="px-2 text-slate-500 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 font-mono">KES {item.unitPrice.toLocaleString()} ea</span>
                          <div className="font-mono text-xs sm:text-sm font-bold text-brand-green-900 leading-tight">
                            KES {item.totalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Cost Summaries */}
          {cart.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-4">
              
              {/* Aggregated Logistics stats for order preview */}
              {(totalBF > 0 || totalWeight > 0) && (
                <div className="bg-brand-green-50 rounded-xl p-3 border border-brand-green-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green-900 uppercase">
                    <Truck className="w-4 h-4 text-brand-gold-500" />
                    <span>Total Haulage Estimates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Board Feet:</span>
                      <strong className="font-mono text-slate-900 block">{totalBF.toFixed(1)} BF</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Weight Load:</span>
                      <strong className="font-mono text-slate-900 block">~{totalWeight.toFixed(0)} kg ({ (totalWeight * 2.204).toFixed(0) } lbs)</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-start gap-1 pt-1 leading-normal">
                    <Info className="w-3.5 h-3.5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <span>Lorry haulage is recommended for total structural weights exceeding 1,200 kg. We coordinate secure logistics at checkout.</span>
                  </div>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-bold text-slate-700 uppercase">
                  ESTIMATED SUB-TOTAL:
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-mono font-bold mr-1">KES</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-brand-green-950">
                    {subtotal.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                    (Excluding delivery charges)
                  </p>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <button
                  onClick={onCheckout}
                  className="w-full bg-brand-gold-500 hover:bg-brand-gold-600 active:bg-brand-gold-700 text-brand-green-950 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer hover:scale-[1.01]"
                  id="btn-cart-proceed-checkout"
                >
                  Proceed to Order Checkout
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>

                {onDownloadPDF && (
                  <button
                    type="button"
                    onClick={() => {
                      onDownloadPDF({
                        title: 'MATERIAL PURCHASE QUOTATION',
                        quoteNo: `LEMA-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                        deliveryType: 'pickup',
                        deliveryLocation: 'Kitengela Town Yard',
                        deliveryCost: 0,
                        subtotal: subtotal,
                        total: subtotal,
                        notes: `Formal material checkout list. Sourced premium-grade Cypress & Mahogany structural timber, treated fencing poles, galvanized chain-link wire fences, and heavy-duty reinforcement steel bars. Sawn lumber volumes: ${totalBF.toFixed(1)} BF. Combined weight load: ~${totalWeight.toFixed(0)} kg.`,
                        items: cart.map(item => ({
                          name: item.name,
                          descriptionText: item.descriptionText,
                          quantity: item.quantity,
                          unitPrice: item.unitPrice,
                          totalPrice: item.totalPrice,
                        }))
                      });
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    📥 Download Quotation PDF
                  </button>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={onClearCart}
                    className="text-slate-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1 py-1 cursor-pointer"
                    id="btn-cart-clear-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Empty My Cart
                  </button>
                  <span className="text-[10px] text-slate-500 italic">
                    *Quote subject to yard validation
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
