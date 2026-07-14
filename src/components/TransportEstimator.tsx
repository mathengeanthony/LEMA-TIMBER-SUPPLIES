import { useState, useMemo } from 'react';
import { Truck, Navigation, Info, Scale, Clock, ShieldAlert, Check, HelpCircle } from 'lucide-react';
import { PrintData } from './PrintArea';

interface TransportEstimatorProps {
  onClose?: () => void;
  onDownloadPDF?: (data: PrintData) => void;
}

const REGIONAL_ZONES = [
  { name: 'Kitengela Town (Yard Perimeter)', distanceKm: 3, time: 'Same Day Delivery', desc: 'Immediate delivery within Kitengela business zone.' },
  { name: 'Yukos / Acacia Estate / Chuna', distanceKm: 9, time: 'Same Day Delivery', desc: 'Kitengela outskirts and residential housing estates.' },
  { name: 'Athi River / Devki / Daystar Junction', distanceKm: 14, time: 'Same Day / Next Day', desc: 'Industrial zone and immediate neighboring towns.' },
  { name: 'Syokimau / Mlolongo / Gateway Mall', distanceKm: 23, time: 'Next Day Delivery', desc: 'Nairobi-Mombasa Highway corridor.' },
  { name: 'Isinya Town (Namanga Highway)', distanceKm: 28, time: 'Same Day / Next Day', desc: 'Southern corridor along Namanga Road.' },
  { name: 'Nairobi Industrial Area / CBD', distanceKm: 33, time: '1 - 2 Business Days', desc: 'Major commercial distribution nodes.' },
  { name: 'Nairobi Westlands / Karen / Lavington', distanceKm: 44, time: '1 - 2 Business Days', desc: 'High-density residential construction sites.' },
  { name: 'Kajiado Town', distanceKm: 52, time: '1 - 2 Business Days', desc: 'Kajiado County county headquarters.' },
  { name: 'Machakos Town', distanceKm: 65, time: '2 Business Days', desc: 'Eastern region construction zone.' }
];

const VEHICLES = [
  {
    id: 'pickup',
    name: 'Pickup Truck (1.5 Ton)',
    capacityText: 'Up to 1,500 kg',
    basePrice: 1500,
    perKmRate: 120,
    icon: '🛻',
    bestFor: 'Treated fencing posts, light chainlink rolls, small timber loads under 12ft, and light accessories.'
  },
  {
    id: 'canter',
    name: 'Canter Lorry (4 Ton)',
    capacityText: 'Up to 4,000 kg',
    basePrice: 3500,
    perKmRate: 180,
    icon: '🚚',
    bestFor: 'Reinforcing steel rebars, structural water tanks up to 5,000L, and standard timber loads (12ft - 16ft).'
  },
  {
    id: 'flatbed',
    name: 'Heavy Flatbed (10 Ton)',
    capacityText: 'Up to 10,000 kg',
    basePrice: 6500,
    perKmRate: 250,
    icon: '🚛',
    bestFor: 'Long structural timbers (above 16ft), large bulky rebar bundles, multiple water tanks, and full site material drops.'
  }
];

export default function TransportEstimator({ onClose, onDownloadPDF }: TransportEstimatorProps) {
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
  const [customDistance, setCustomDistance] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('canter');

  const activeDistance = useMemo(() => {
    if (customDistance !== null) return customDistance;
    return REGIONAL_ZONES[selectedZoneIdx].distanceKm;
  }, [customDistance, selectedZoneIdx]);

  const activeZoneName = useMemo(() => {
    if (customDistance !== null) return `Custom Site Zone (${customDistance} km)`;
    return REGIONAL_ZONES[selectedZoneIdx].name;
  }, [customDistance, selectedZoneIdx]);

  const activeTime = useMemo(() => {
    if (customDistance !== null) {
      if (customDistance <= 15) return 'Same Day Delivery';
      if (customDistance <= 40) return 'Next Day Delivery';
      return '1 - 2 Business Days';
    }
    return REGIONAL_ZONES[selectedZoneIdx].time;
  }, [customDistance, selectedZoneIdx]);

  const calculations = useMemo(() => {
    return VEHICLES.map(vehicle => {
      // Yard rules: free delivery in Kitengela town (distance < 5km) for orders above KES 40,000.
      // Else, delivery cost is basePrice + (distance * perKmRate)
      const distanceFactor = Math.max(0, activeDistance - 3); // first 3km covered in base or subsidized
      const rawCost = vehicle.basePrice + (distanceFactor * vehicle.perKmRate);
      
      // Round to nearest 100 KES for neatness
      const roundedCost = Math.round(rawCost / 100) * 100;

      return {
        ...vehicle,
        totalCost: roundedCost,
        baseHaulage: vehicle.basePrice,
        perKmCharge: distanceFactor * vehicle.perKmRate
      };
    });
  }, [activeDistance]);

  const activeCalculation = useMemo(() => {
    return calculations.find(c => c.id === selectedVehicleId) || calculations[1];
  }, [calculations, selectedVehicleId]);

  return (
    <div className="natural-card overflow-hidden font-sans border-2 border-brand-green-200" id="delivery-transport-estimator">
      
      {/* Banner Header */}
      <div className="bg-brand-green-800 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green-700 rounded-lg">
            <Truck className="w-6 h-6 text-brand-gold-500" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight uppercase">
              LEMA YARD TRANSPORT CALCULATOR
            </h3>
            <p className="text-xs text-brand-green-200">
              Calculate shipping logistics & flatbed haulage rates across Kajiado, Machakos, and Nairobi Counties.
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-brand-green-200 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-brand-green-700 cursor-pointer"
          >
            Close ×
          </button>
        )}
      </div>

      {/* Content Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Options */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Choose Site Location */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                Step 1: Choose Construction Site Location
              </label>
              
              <button
                type="button"
                onClick={() => {
                  if (customDistance === null) {
                    setCustomDistance(20);
                  } else {
                    setCustomDistance(null);
                  }
                }}
                className="text-[11px] text-brand-green-800 font-bold hover:underline cursor-pointer"
              >
                {customDistance === null ? 'Enter Custom Distance (Km)' : 'Use Location Presets'}
              </button>
            </div>

            {customDistance === null ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REGIONAL_ZONES.map((zone, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedZoneIdx(idx)}
                    className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col justify-between h-20 cursor-pointer ${
                      selectedZoneIdx === idx
                        ? 'border-brand-green-700 bg-brand-green-100 shadow-sm'
                        : 'border-brand-green-200 bg-brand-green-100/30 hover:bg-brand-green-100/60 hover:border-brand-green-300'
                    }`}
                  >
                    <span className="font-bold text-brand-green-900 truncate block w-full">
                      {zone.name.split(' (')[0]}
                    </span>
                    <span className="font-mono text-[10px] text-brand-green-700 font-bold block mt-1">
                      {zone.distanceKm} Kilometers
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF8F3]/60 rounded-2xl p-4 border border-brand-green-200/50 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Custom Distance from Kitengela Yard</span>
                  <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                    {customDistance} Km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  step="1"
                  value={customDistance}
                  onChange={(e) => setCustomDistance(parseInt(e.target.value))}
                  className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>1 km (Kitengela Town)</span>
                  <span>30 km (Athi River outskirts)</span>
                  <span>60 km (Kajiado/Nairobi)</span>
                  <span>120 km (Deep haulage)</span>
                </div>
              </div>
            )}
            
            <p className="text-[11px] text-slate-500 italic">
              *All estimations are calculated from LEMA's distribution yard along Namanga Road in Kitengela.
            </p>
          </div>

          {/* Section 2: Choose Vehicle Profile */}
          <div className="space-y-3 pt-4 border-t border-brand-green-200/50">
            <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
              Step 2: Select Delivery Vehicle Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {calculations.map(vehicle => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`p-3.5 text-left rounded-xl border transition-all text-xs flex flex-col justify-between h-28 cursor-pointer ${
                    selectedVehicleId === vehicle.id
                      ? 'border-brand-green-700 bg-brand-green-100 shadow-sm'
                      : 'border-brand-green-200 bg-white hover:bg-slate-50 hover:border-brand-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl">{vehicle.icon}</span>
                    <span className={`w-3 h-3 rounded-full ${selectedVehicleId === vehicle.id ? 'bg-brand-green-700' : 'bg-slate-200'}`} />
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-brand-green-950 block">{vehicle.name}</span>
                    <span className="text-[10px] text-slate-500 block">Cap: {vehicle.capacityText}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Spec info card */}
            <div className="bg-brand-green-100/40 border border-brand-green-200/50 rounded-xl p-3.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-brand-green-800 font-semibold">{activeCalculation.name}: </strong> 
                {activeCalculation.bestFor}
              </div>
            </div>
          </div>

          {/* Road Accessibility Checklist */}
          <div className="space-y-2 pt-4 border-t border-brand-green-200/50">
            <span className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
              Delivery Site Feasibility Checklist
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Road has overhead powerline clearance (3.5m+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Navigable terrain for high-payload trucks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Allocated on-site unloading area</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Direct site receiver phone provided</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Output Pane */}
        <div className="lg:col-span-5 bg-brand-green-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-500/5 rotate-45 transform translate-x-12 -translate-y-12 pointer-events-none" />

          <div>
            <span className="text-[10px] font-bold text-brand-gold-500 tracking-wider uppercase block">
              HAULAGE ESTIMATION OUTCOME
            </span>
            <h4 className="font-display font-bold text-xl mb-4 border-b border-brand-green-800 pb-2 flex justify-between items-baseline">
              <span>{activeZoneName}</span>
            </h4>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex justify-between">
                <span className="text-brand-green-200">Delivery Distance:</span>
                <span className="font-bold font-mono text-right">{activeDistance} Km</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-green-200">Selected Vehicle:</span>
                <span className="font-bold text-right">{activeCalculation.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-green-200">Haulage Cap Limit:</span>
                <span className="font-bold text-right text-brand-gold-100">{activeCalculation.capacityText}</span>
              </div>

              <div className="h-px bg-brand-green-800 my-2" />

              {/* Fee Breakdown */}
              <div className="space-y-2 bg-brand-green-950/40 p-3 rounded-lg border border-brand-green-800/50">
                <div className="flex justify-between text-[11px] text-brand-green-200">
                  <span>Base Yard Loading Fee:</span>
                  <span className="font-mono">KES {activeCalculation.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-brand-green-200">
                  <span>Out-of-Yard Mileage Charge:</span>
                  <span className="font-mono">KES {activeCalculation.perKmCharge.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1.5 text-brand-green-200">
                  <Clock className="w-3.5 h-3.5 text-brand-gold-500" />
                  <span>Estimated Time:</span>
                </div>
                <span className="font-bold text-white">{activeTime}</span>
              </div>
            </div>
          </div>

          {/* Final Cost Display */}
          <div className="pt-6 border-t border-brand-green-800 mt-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-brand-green-200">
                TOTAL TRANSPORT FEE:
              </span>
              <div className="text-right">
                <span className="text-[10px] text-brand-gold-100 font-bold mr-1">KES</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {activeCalculation.totalCost.toLocaleString()}
                </span>
                <p className="text-[9px] text-brand-green-200 italic mt-1">
                  *Flatbed/canter rates are subject to slight changes during heavy rainy seasons.
                </p>
              </div>
            </div>

            {activeDistance > 80 && (
              <div className="bg-amber-500/20 text-brand-gold-100 text-[10px] p-2.5 rounded border border-brand-gold-700/50 flex items-start gap-1.5 leading-snug">
                <ShieldAlert className="w-4 h-4 text-brand-gold-500 flex-shrink-0 mt-0.5" />
                <span>
                  High distance haulage detected. Please contact our yard logistics supervisor directly on +254 729 352131 to confirm access viability.
                </span>
              </div>
            )}

            {onDownloadPDF && (
              <button
                type="button"
                onClick={() => {
                  onDownloadPDF({
                    title: 'TRANSPORT HAULAGE QUOTE',
                    quoteNo: `LEMA-TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    deliveryType: 'delivery',
                    deliveryLocation: customDistance !== null ? `Custom Zone (${customDistance} km)` : REGIONAL_ZONES[selectedZoneIdx].name,
                    deliveryCost: activeCalculation.totalCost,
                    subtotal: 0,
                    total: activeCalculation.totalCost,
                    notes: `Transport estimation utilizing ${activeCalculation.name} over a distance of ${activeDistance} km to ${activeZoneName}. Estimated transit window: ${activeTime}.`,
                    items: [
                      {
                        name: `Haulage Delivery service (${activeCalculation.name})`,
                        descriptionText: `Logistics transport to ${activeZoneName} (${activeDistance} km)`,
                        quantity: 1,
                        unitPrice: activeCalculation.totalCost,
                        totalPrice: activeCalculation.totalCost,
                      }
                    ]
                  });
                }}
                className="w-full bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-black py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer hover:scale-[1.01]"
              >
                📥 DOWNLOAD QUOTATION PDF
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
