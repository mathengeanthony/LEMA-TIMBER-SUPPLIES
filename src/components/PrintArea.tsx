import { Award, ShieldCheck, Printer, X, MessageSquare, Landmark } from 'lucide-react';
import { useMemo } from 'react';

export interface PrintItem {
  name: string;
  descriptionText: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PrintData {
  title: string;
  quoteNo: string;
  customerName?: string;
  phone?: string;
  deliveryType?: 'pickup' | 'delivery';
  deliveryLocation?: string;
  deliveryCost?: number;
  items: PrintItem[];
  subtotal: number;
  total: number;
  notes?: string;
}

interface PrintAreaProps {
  data: PrintData | null;
  onClose: () => void;
}

export default function PrintArea({ data, onClose }: PrintAreaProps) {
  if (!data) return null;

  const timestamp = useMemo(() => {
    return new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  }, [data]);

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-green-950/80 backdrop-blur-xs p-4 overflow-y-auto font-sans print:p-0 print:bg-white print:relative print:inset-auto print:z-0">
      
      {/* Backdrop (hidden during printing) */}
      <div className="fixed inset-0 cursor-pointer print:hidden" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 print:my-0 print:border-none print:shadow-none print:rounded-none flex flex-col max-h-[90vh] print:max-h-none">
        
        {/* Interactive Header (Hidden during printing) */}
        <div className="bg-brand-green-800 text-white p-5 flex items-center justify-between border-b border-brand-green-700 print:hidden flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-brand-green-700 rounded-lg">
              <Printer className="w-5 h-5 text-brand-gold-500" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base uppercase tracking-tight">
                GENERATE QUOTATION SHEET
              </h3>
              <p className="text-[11px] text-brand-green-200">
                Review this formal print-ready document or save as PDF
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-green-200 hover:text-white hover:bg-brand-green-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 bg-white font-mono text-xs text-slate-800 print:overflow-visible print:p-0" id="print-sheet-invoice">
          
          {/* Header Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-wider">
                LEMA TIMBER & SUPPLIES
              </h2>
              <p className="text-[10px] text-slate-600">A Timeless Vision</p>
              <p className="text-[10px] text-slate-600">
                Namanga Road, Kitengela Town, Kajiado County, Kenya.
              </p>
              <p className="text-[10px] text-slate-600">Tel: +254 729 352131 | Email: info@lematimber.co.ke</p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[9px] font-bold border-2 border-slate-950 px-2.5 py-0.5 uppercase block w-fit ml-auto">
                {data.title}
              </span>
              <p className="font-bold text-slate-950 mt-1">
                No: {data.quoteNo}
              </p>
              <p className="text-[10px] text-slate-500">
                Date: {timestamp}
              </p>
            </div>
          </div>

          {/* Client & Shipping Metadata */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 border border-slate-200 print:bg-slate-50">
            <div>
              <span className="font-bold text-slate-950 block border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                CLIENT BILLING DETAILS:
              </span>
              {data.customerName ? (
                <>
                  <p className="font-bold text-slate-900">{data.customerName}</p>
                  <p>Phone: {data.phone}</p>
                </>
              ) : (
                <>
                  <p className="text-slate-400 italic">____________________________</p>
                  <p className="text-slate-400 mt-1">Phone: ____________________</p>
                </>
              )}
            </div>
            <div>
              <span className="font-bold text-slate-950 block border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                LOGISTICS DESTINATION:
              </span>
              {data.deliveryType ? (
                <>
                  <p className="font-bold capitalize">{data.deliveryType} Delivery</p>
                  <p className="text-slate-700">Location: {data.deliveryLocation || 'Kitengela Town Yard'}</p>
                </>
              ) : (
                <>
                  <p className="text-slate-400 italic">____________________________</p>
                  <p className="text-slate-400 mt-1">Location: __________________</p>
                </>
              )}
            </div>
          </div>

          {/* Material Specs Table */}
          <div className="space-y-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 font-bold text-slate-900">
                  <th className="py-2 text-[10px] uppercase">Material Description</th>
                  <th className="py-2 text-center w-16 text-[10px] uppercase">Qty</th>
                  <th className="py-2 text-right w-28 text-[10px] uppercase">Unit (KES)</th>
                  <th className="py-2 text-right w-32 text-[10px] uppercase">Total (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="font-medium text-slate-800">
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

          {/* Totals Section */}
          <div className="flex justify-end pt-4 border-t border-slate-900">
            <div className="w-72 space-y-1.5 text-right font-medium">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Products Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">KES {data.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Regional Haulage Fee:</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.deliveryCost === undefined ? 'Pending Yard Review' : (data.deliveryCost === 0 ? 'FREE / Yard Pickup' : `KES ${data.deliveryCost.toLocaleString()}`)}
                </span>
              </div>
              <div className="border-t border-slate-300 my-1"></div>
              <div className="flex justify-between text-xs font-bold text-slate-950 pt-0.5">
                <span className="uppercase">Grand Estimated Total:</span>
                <span className="font-mono text-sm sm:text-base font-black">KES {data.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions block */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 print:bg-slate-50">
            <span className="font-bold text-slate-900 uppercase block text-[9px] mb-1">
              OFFICIAL WORK NOTES & SPECIFICATIONS:
            </span>
            <p className="text-slate-700 leading-relaxed font-sans text-[10px]">
              {data.notes || 'No extra cutting or custom drilling notes specified. Materials are quoted based on standard stock parameters.'}
            </p>
          </div>

          {/* Yard Rules Footer */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-8 text-[9px] text-slate-500 font-sans leading-normal print:grid-cols-2">
            <div className="space-y-1">
              <h5 className="font-bold text-slate-700 uppercase">LEMA YARD FULFILLMENT CLAUSES:</h5>
              <p>1. This material quote is compiled using standard yard dimensions and structural weight formulas.</p>
              <p>2. Final transport rates may be subject to review based on unexpected rainy terrain parameters or road closures.</p>
              <p>3. Wood profiling, double planing, and custom structural cuts can be requested during on-site order review.</p>
            </div>
            <div className="flex flex-col justify-end text-right space-y-4">
              <div className="h-10 w-44 border-b border-slate-400 ml-auto"></div>
              <p className="font-mono text-[8px] uppercase">AUTHORIZED STAMP / YARD SUPERVISOR</p>
            </div>
          </div>

        </div>

        {/* Interactive close (Hidden during printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 print:hidden flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
          >
            Close Quotation View
          </button>
        </div>

      </div>
    </div>
  );
}
