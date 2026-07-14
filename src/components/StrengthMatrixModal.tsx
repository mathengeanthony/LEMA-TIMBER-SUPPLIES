import { X, Shield, Award, Droplets, Hammer, Trees, Sparkles } from 'lucide-react';

interface StrengthMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StrengthMatrixModal({ isOpen, onClose }: StrengthMatrixModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans p-4 flex items-center justify-center bg-brand-green-950/75 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl max-w-3xl w-full text-left shadow-2xl border border-slate-100 overflow-hidden z-10 my-8">
        
        {/* Header Block */}
        <div className="bg-brand-green-800 text-white p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-brand-gold-500/15 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-green-700 rounded-xl">
                <Award className="w-6 h-6 text-brand-gold-500" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight uppercase">
                  WOOD GRADING & STRENGTH MATRIX
                </h3>
                <p className="text-xs text-brand-green-200">
                  Engineering specifications & structural load comparisons: Cypress vs. Mahogany
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
        </div>

        {/* Matrix Comparison Table */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          
          <div className="bg-amber-50/50 border border-brand-green-200/40 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-brand-green-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-brand-green-900 font-bold block mb-1">Kenyan Standard Sizing Note:</strong>
              When planning structural framing, Cypress is the primary high-strength choice for structural roof trusses due to its elasticity and load distribution, whereas Mahogany is ideal for architectural finishing, entry gates, and high-load load-bearing beams requiring premium moisture immunity.
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-green-50 border-b border-slate-200 text-brand-green-900 font-bold">
                  <th className="p-3.5 uppercase tracking-wider text-[10px] w-1/3">Physical Property</th>
                  <th className="p-3.5 border-l border-slate-200 text-brand-green-800 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-bold">
                      <Trees className="w-4 h-4 text-emerald-600" />
                      CYPRESS (Softwood)
                    </div>
                    <span className="text-[9px] text-slate-500 font-normal">Premium Structural Timber</span>
                  </th>
                  <th className="p-3.5 border-l border-slate-200 text-brand-gold-700 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      MAHOGANY (Hardwood)
                    </div>
                    <span className="text-[9px] text-slate-500 font-normal">Luxury Architectural Wood</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                
                {/* 1. Fiber Density */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div>Fiber Density</div>
                    <div className="text-[10px] text-slate-400 font-normal">Dry wood mass per cubic volume</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono">
                    <span className="font-bold text-slate-900">~510 kg/m³</span>
                    <div className="text-[9px] text-slate-500">Lightweight, low truss loading</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono">
                    <span className="font-bold text-slate-900">~750 kg/m³</span>
                    <div className="text-[9px] text-slate-500">Heavyweight, massive structural load</div>
                  </td>
                </tr>

                {/* 2. Bending Strength */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div className="flex items-center gap-1">
                      <Hammer className="w-3.5 h-3.5 text-slate-500" />
                      Bending Strength (MoR)
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">Modulus of Rupture (fiber failure limit)</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono text-emerald-700 font-bold bg-emerald-50/20">
                    <span>82 MPa</span>
                    <div className="text-[9px] text-emerald-600/80 font-normal">High elastic recovery</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono text-amber-700 font-bold bg-amber-50/10">
                    <span>110 MPa</span>
                    <div className="text-[9px] text-amber-600/80 font-normal">Extreme stiffness & resistance</div>
                  </td>
                </tr>

                {/* 3. Compression Strength */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div>Compression Parallel to Grain</div>
                    <div className="text-[10px] text-slate-400 font-normal">Resistance to crushing loads (vertical struts)</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono">
                    <span>41 MPa</span>
                    <div className="text-[9px] text-slate-500">Perfect for roofing struts</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono">
                    <span>58 MPa</span>
                    <div className="text-[9px] text-slate-500">Best for columns and beams</div>
                  </td>
                </tr>

                {/* 4. Moisture Profile */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-slate-500" />
                      Standard Moisture Content
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">After proper yard curing / kiln drying</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono">
                    <span>12% – 15%</span>
                    <div className="text-[9px] text-slate-500">Minimal shrinkage under sun</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-mono">
                    <span>8% – 12%</span>
                    <div className="text-[9px] text-slate-500">Superbly dry, high dimensional stability</div>
                  </td>
                </tr>

                {/* 5. Termite & Rot Immunity */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div>Natural Rot & Pest Resistance</div>
                    <div className="text-[10px] text-slate-400 font-normal">Resiliency to Kenyan outdoor pests</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">Moderate-High</span>
                    <div className="text-[9px] text-slate-500 mt-1">Needs treatment in wet areas</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">Exceptional</span>
                    <div className="text-[9px] text-slate-500 mt-1">Natural oils repel termites</div>
                  </td>
                </tr>

                {/* 6. Primary Ideal Uses */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div>Recommended Structural Uses</div>
                    <div className="text-[10px] text-slate-400 font-normal">Best Kenyan architectural applications</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center text-[11px] leading-relaxed">
                    <strong className="text-slate-800 block">Structural Roofing</strong>
                    <p className="text-slate-500 mt-0.5 text-[10px]">Roof trusses, wall studs, purlins, rafter timbers, and ceiling brands.</p>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center text-[11px] leading-relaxed">
                    <strong className="text-slate-800 block">Joinery & Finishings</strong>
                    <p className="text-slate-500 mt-0.5 text-[10px]">Entrance doors, heavy window frames, external fascia board, luxury dining tabletops, cabinetry.</p>
                  </td>
                </tr>

                {/* 7. Cost Coefficient */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div>Cost Comparison Profile</div>
                    <div className="text-[10px] text-slate-400 font-normal">Market rate comparison ratio</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-bold text-emerald-800 bg-emerald-50/10">
                    <span>Standard Base Rate</span>
                    <div className="text-[9px] text-slate-500 font-normal">Highly economical for framing</div>
                  </td>
                  <td className="p-3.5 border-l border-slate-200 text-center font-bold text-brand-gold-700 bg-brand-gold-100/10">
                    <span>~2.1x Cypress Price</span>
                    <div className="text-[9px] text-slate-500 font-normal">Premium investment for longevity</div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-brand-green-100 bg-[#FAF8F3]/60 rounded-2xl p-4">
              <h4 className="font-bold text-brand-green-900 text-xs uppercase mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Why builders prefer Cypress
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Cypress possesses an exceptional strength-to-weight ratio. It does not exert massive vertical load on brick masonry, making it perfect for sprawling rafters, ceiling framing, and trusses. It is also easy to nail and shape on-site.
              </p>
            </div>

            <div className="border border-brand-green-100 bg-[#FAF8F3]/60 rounded-2xl p-4">
              <h4 className="font-bold text-brand-green-900 text-xs uppercase mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Why builders prefer Mahogany
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Mahogany is completely immune to dry-wood termite attacks and moisture dampness. It does not twist, bow, or warp even when exposed to outdoor rains on external fascia boundaries. Perfect for heritage fittings.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
}
