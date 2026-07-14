import { useState, useMemo } from 'react';
import { Phone, CheckCircle, Printer, X, ShoppingBag, Truck, MessageSquare, Landmark, Info } from 'lucide-react';
import { CartItem, OrderInquiry } from '../types';
import { KENYAN_TOWNS } from '../data';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onSubmitOrder: (order: OrderInquiry) => void;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  cart,
  onClose,
  onSubmitOrder,
  onClearCart,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedTownIdx, setSelectedTownIdx] = useState(0);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<OrderInquiry | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const deliveryCost = useMemo(() => {
    if (deliveryType === 'pickup') return 0;
    return KENYAN_TOWNS[selectedTownIdx].cost;
  }, [deliveryType, selectedTownIdx]);

  const grandTotal = subtotal + deliveryCost;

  // Formats text for WhatsApp
  const generateWhatsAppMessage = (invoiceId: string) => {
    let msg = `*LEMA TIMBER & SUPPLIES - ORDER QUOTE REQUEST*\n`;
    msg += `*Quote ID:* ${invoiceId}\n`;
    msg += `*Customer Name:* ${customerName}\n`;
    msg += `*Phone:* ${phone}\n`;
    msg += `*Delivery Type:* ${deliveryType === 'pickup' ? 'Yard Pickup (Kitengela Town)' : `Delivery to ${KENYAN_TOWNS[selectedTownIdx].name}`}\n`;
    if (notes.trim()) msg += `*Notes/Directions:* ${notes}\n`;
    msg += `\n*ITEMS ORDERED:*\n`;

    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} - ${item.quantity} pcs\n`;
      msg += `   _Spec: ${item.descriptionText}_\n`;
      msg += `   _Price: KES ${item.totalPrice.toLocaleString()}_\n`;
    });

    msg += `\n*Subtotal:* KES ${subtotal.toLocaleString()}`;
    msg += `\n*Delivery Fee:* KES ${deliveryCost.toLocaleString()}`;
    msg += `\n*GRAND TOTAL:* KES ${grandTotal.toLocaleString()}\n`;
    msg += `\n---------------------------------\n`;
    msg += `Please validate inventory and confirm delivery scheduling. Thanks!`;
    return encodeURIComponent(msg);
  };

  const handleProcessOrder = (checkoutMethod: 'whatsapp' | 'invoice') => {
    if (!customerName.trim() || !phone.trim()) {
      setValidationError('Please fill in your Full Name and Phone Number to complete your order quote.');
      return;
    }

    setValidationError('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceId = `LEMA-Q-${new Date().getFullYear()}-${randomSuffix}`;
    const destination = deliveryType === 'pickup' ? 'Kitengela Yard' : KENYAN_TOWNS[selectedTownIdx].name;

    const newOrder: OrderInquiry = {
      id: invoiceId,
      timestamp: new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
      customerName,
      phone,
      deliveryType,
      deliveryLocation: destination,
      deliveryCost,
      items: [...cart],
      subtotal,
      total: grandTotal,
      status: 'Pending Quote',
      notes: notes.trim() || undefined,
    };

    // Save order history (triggers localStorage update in parent)
    onSubmitOrder(newOrder);
    setGeneratedInvoice(newOrder);
    setOrderSuccess(true);

    if (checkoutMethod === 'whatsapp') {
      const waText = generateWhatsAppMessage(invoiceId);
      const waUrl = `https://wa.me/254729352131?text=${waText}`;
      // Open WhatsApp
      window.open(waUrl, '_blank');
    }
  };

  // Printing utility
  const handlePrintQuote = () => {
    window.print();
  };

  const handleCloseAndReset = () => {
    onClearCart(); // empty cart on success
    setOrderSuccess(false);
    setGeneratedInvoice(null);
    setCustomerName('');
    setPhone('');
    setNotes('');
    setValidationError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" role="dialog" aria-modal="true" id="checkout-modal-overlay">
      
      {/* Backdrop */}
      <div className="fixed inset-0 bg-brand-green-950/70 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Main Container */}
      <div className="flex items-center justify-center min-h-screen p-4 text-center z-10 relative">
        <div className="bg-white rounded-2xl max-w-2xl w-full text-left shadow-2xl border border-slate-100 overflow-hidden transition-all my-8 flex flex-col">
          
          {/* Header */}
          <div className="bg-brand-green-800 text-white p-6 flex items-center justify-between border-b border-brand-green-700 print:hidden">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5.5 h-5.5 text-brand-gold-500" />
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight">
                  ORDER CHECKOUT ESTIMATOR
                </h3>
                <p className="text-xs text-brand-green-200">
                  Review specifications, calculate regional deliveries, and submit to the yard.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-green-200 hover:text-white hover:bg-brand-green-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!orderSuccess ? (
            /* --- STEP 1: FILL DETAILS --- */
            cart.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="text-4xl bg-slate-100 p-4 rounded-full">🛒</div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base">Your Material Cart is Empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                    Please select some building materials or use our estimator to populate your list before requesting a quote.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer transition-colors"
                >
                  Return to Store Catalog
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto print:hidden">
                
                {validationError && (
                  <div className="bg-red-50 text-red-800 border-2 border-red-200 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-fadeIn">
                    <span className="text-sm">⚠️</span>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Customer Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-brand-green-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    1. Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Kamau"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:border-brand-green-600 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Phone Number (WhatsApp Preferred) *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. 0729352131 or +254..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 focus:border-brand-green-600 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-brand-green-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    2. Delivery & Logistical Setup
                  </h4>
                  
                  {/* Pickup vs Delivery Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-950 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Landmark className={`w-5 h-5 ${deliveryType === 'pickup' ? 'text-brand-green-700' : 'text-slate-400'}`} />
                      <div className="text-center">
                        <div>Yard Self Pickup</div>
                        <div className="text-[10px] font-normal text-slate-500">Kitengela Town Yard (FREE)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-950 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className={`w-5 h-5 ${deliveryType === 'delivery' ? 'text-brand-green-700' : 'text-slate-400'}`} />
                      <div className="text-center">
                        <div>Deliver to Site</div>
                        <div className="text-[10px] font-normal text-slate-500">Calculated regional haulage</div>
                      </div>
                    </button>
                  </div>

                  {/* Regional selector */}
                  {deliveryType === 'delivery' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 animate-fadeIn">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Select Construction Site Destination Town:
                      </label>
                      <select
                        value={selectedTownIdx}
                        onChange={(e) => setSelectedTownIdx(parseInt(e.target.value))}
                        className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:border-brand-green-600 focus:outline-none font-medium text-slate-800"
                      >
                        {KENYAN_TOWNS.map((town, idx) => (
                          <option key={idx} value={idx}>
                            {town.name} — KES {town.cost.toLocaleString()} ({town.time})
                          </option>
                        ))}
                      </select>

                      <div className="text-[10px] text-brand-green-700 flex items-start gap-1.5 leading-normal bg-brand-green-100/50 p-2.5 rounded border border-brand-green-200/50">
                        <Info className="w-4 h-4 text-brand-green-700 flex-shrink-0 mt-0.5" />
                        <span>
                          Deliveries are handled by LEMA flatbeds/canters. Transport fees are computed directly. Make sure roads are navigable for high-payload commercial lorries.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                    3. Cutting / Custom Instructions (Optional)
                  </label>
                  <textarea
                    placeholder="e.g. 'Cut Cypress timber pieces into equal halves', 'Provide specific directions near Kitengela Mall', etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 h-20 focus:border-brand-green-600 focus:outline-none"
                  />
                </div>

                {/* Cost Summary list */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Summary of Quote
                  </h5>
                  <div className="space-y-2 text-xs">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex justify-between items-baseline text-slate-600 font-medium">
                        <span className="truncate max-w-xs">{item.name} (x{item.quantity})</span>
                        <span className="font-mono text-slate-900">KES {item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                    
                    <div className="h-px bg-slate-200 my-1"></div>

                    <div className="flex justify-between text-slate-600">
                      <span>Products Subtotal:</span>
                      <span className="font-mono font-bold text-slate-900">KES {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Haulage Delivery Fee:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {deliveryCost === 0 ? 'FREE / Pickup' : `KES ${deliveryCost.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="h-px bg-slate-300 my-1"></div>

                    <div className="flex justify-between items-baseline text-sm font-bold text-brand-green-950">
                      <span className="uppercase">Grand Estimated Total:</span>
                      <div className="text-right">
                        <span className="text-[10px] font-mono mr-1">KES</span>
                        <span className="font-mono text-lg font-black">{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Submit Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  
                  {/* Option 1: WhatsApp Checkout */}
                  <button
                    type="button"
                    onClick={() => handleProcessOrder('whatsapp')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
                    id="btn-checkout-whatsapp"
                  >
                    <MessageSquare className="w-5 h-5 fill-white" />
                    Order / Send Quote via WhatsApp
                  </button>

                  {/* Option 2: Print/Submit Quote Invoice */}
                  <button
                    type="button"
                    onClick={() => handleProcessOrder('invoice')}
                    className="flex-1 bg-brand-green-800 hover:bg-brand-green-700 active:bg-brand-green-900 text-white font-bold py-3.5 rounded-xl border border-brand-green-600 shadow-md transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
                    id="btn-checkout-invoice"
                  >
                    <Landmark className="w-5 h-5 text-brand-gold-500" />
                    Generate Local Yard Invoice
                  </button>

                </div>

              </div>
            )
          ) : (
            /* --- STEP 2: ORDER SUCCESS / INVOICE PRINT VIEW --- */
            <div className="flex-1 overflow-y-auto max-h-[85vh]">
              
              {/* Success Ribbon (Hidden in printing) */}
              <div className="bg-emerald-50 border-b border-emerald-200 p-6 flex flex-col items-center text-center space-y-2 print:hidden">
                <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
                <h4 className="font-display font-extrabold text-lg text-emerald-800 uppercase tracking-tight">
                  QUOTE RECEIVED SUCCESSFULLY!
                </h4>
                <p className="text-xs text-emerald-700 max-w-md">
                  Your estimated invoice has been logged locally. You can print this out or present it at Lema Yard in Kitengela Town for fulfillment.
                </p>
                <button
                  onClick={handlePrintQuote}
                  className="mt-2 inline-flex items-center gap-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print/Save Invoice PDF
                </button>
              </div>

              {/* The Actual Invoice Print Document */}
              <div className="p-8 space-y-6 bg-white font-mono text-xs text-slate-800" id="print-invoice-sheet">
                
                {/* Header Letterhead */}
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
                      OFFICIAL QUOTATION
                    </span>
                    <p className="font-bold text-slate-950 mt-1">
                      No: {generatedInvoice?.id}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Date: {generatedInvoice?.timestamp}
                    </p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-950 block border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                      CLIENT BILLING DETAILS:
                    </span>
                    <p className="font-bold text-slate-900">{generatedInvoice?.customerName}</p>
                    <p>Phone: {generatedInvoice?.phone}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 block border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                      LOGISTICS DESTINATION:
                    </span>
                    <p className="font-bold capitalize">{generatedInvoice?.deliveryType} Delivery</p>
                    <p className="text-slate-700">Location: {generatedInvoice?.deliveryLocation}</p>
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
                      {generatedInvoice?.items.map((item, idx) => (
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
                      <span className="font-mono font-bold text-slate-900">KES {generatedInvoice?.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Regional Haulage Fee:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {generatedInvoice?.deliveryCost === 0 ? 'FREE / Pickup' : `KES ${generatedInvoice?.deliveryCost.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="border-t border-slate-400 my-1"></div>
                    <div className="flex justify-between text-xs font-bold text-slate-950 pt-0.5">
                      <span className="uppercase">Estimated Total:</span>
                      <span className="font-mono text-sm">KES {generatedInvoice?.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Notes */}
                {generatedInvoice?.notes && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="font-bold text-slate-900 uppercase block text-[9px] mb-1">
                      Special Client Instructions:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-sans">{generatedInvoice.notes}</p>
                  </div>
                )}

                {/* Terms and Signatures */}
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

              {/* Footer Close (Hidden in printing) */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
