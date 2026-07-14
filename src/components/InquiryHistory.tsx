import { History, FileText, Printer, Trash2, Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import { OrderInquiry } from '../types';

interface InquiryHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderInquiry[];
  onDeleteOrder: (orderId: string) => void;
  onViewInvoice: (order: OrderInquiry) => void;
}

export default function InquiryHistory({
  isOpen,
  onClose,
  orders,
  onDeleteOrder,
  onViewInvoice,
}: InquiryHistoryProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans animate-fadeIn" role="dialog" aria-modal="true" id="history-modal-overlay">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-brand-green-950/75 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Main Panel */}
      <div className="flex items-center justify-center min-h-screen p-4 text-center z-10 relative">
        <div className="bg-white rounded-2xl max-w-2xl w-full text-left shadow-2xl border border-slate-200 overflow-hidden transition-all my-8 flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="bg-brand-green-800 text-white p-5 flex items-center justify-between border-b border-brand-green-700">
            <div className="flex items-center gap-3">
              <History className="w-5.5 h-5.5 text-brand-gold-500" />
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg tracking-tight">
                  MY ORDER QUOTATIONS & INVOICES
                </h3>
                <p className="text-xs text-brand-green-200">
                  Track and review previous estimations submitted to LEMA yard
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-brand-green-200 hover:text-white hover:bg-brand-green-700 p-1.5 rounded-lg text-sm font-semibold cursor-pointer"
            >
              Close ×
            </button>
          </div>

          {/* List contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 stroke-1" />
                <h4 className="font-bold text-slate-800 text-sm">No Quotations Found</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  You haven't submitted any order inquiries or generated invoices yet. Browse our hardware catalog and customize timber sizes to generate your first quote.
                </p>
                <button
                  onClick={onClose}
                  className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Start Building Estimation
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                  Logged Invoices ({orders.length})
                </p>
                {orders.map((order) => {
                  const totalItems = order.items.reduce((acc, it) => acc + it.quantity, 0);
                  return (
                    <div
                      key={order.id}
                      className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all"
                      id={`history-order-${order.id}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {order.id}
                          </span>
                          <span className="text-[10px] bg-brand-green-100 text-brand-green-800 px-2 py-0.5 rounded font-bold font-sans">
                            {order.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{order.timestamp.split(',')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[120px]">{order.deliveryLocation}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Order size: <strong className="text-slate-700">{totalItems} products</strong> ({order.items.length} unique lines)
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
                        {/* Financial representation */}
                        <div className="text-left sm:text-right">
                          <span className="text-[9px] text-slate-400 font-bold block leading-none">ESTIMATED TOTAL</span>
                          <span className="font-mono text-sm font-black text-brand-green-950">
                            KES {order.total.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Reprint invoice */}
                          <button
                            onClick={() => onViewInvoice(order)}
                            className="bg-brand-green-800 hover:bg-brand-green-700 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title="View and reprint quotation invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-brand-gold-500" />
                            <span>Open Quote</span>
                          </button>

                          {/* Delete local history order */}
                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete invoice record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold px-6 py-2 rounded-lg text-xs cursor-pointer"
            >
              Back to Store
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
