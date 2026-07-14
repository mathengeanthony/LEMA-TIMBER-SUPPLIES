import { useState, useMemo } from 'react';
import { Calculator, ShoppingCart, Info, RotateCcw, ShieldAlert, Check, Layers, Grid, Construction, ShieldCheck, Award } from 'lucide-react';
import { CartItem } from '../types';
import { WOOD_TYPES, STANDARD_SIZES } from '../data';
import StrengthMatrixModal from './StrengthMatrixModal';
import { PrintData } from './PrintArea';

interface LumberCalculatorProps {
  onAddToCart: (item: Omit<CartItem, 'cartId' | 'totalPrice'>) => void;
  onClose?: () => void;
  onDownloadPDF?: (data: PrintData) => void;
  initialTab?: 'timber' | 'poles' | 'fencing' | 'steel';
}

export default function LumberCalculator({ onAddToCart, onClose, onDownloadPDF, initialTab }: LumberCalculatorProps) {
  const [selectedTab, setSelectedTab] = useState<'timber' | 'poles' | 'fencing' | 'steel'>(initialTab || 'timber');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isStrengthMatrixOpen, setIsStrengthMatrixOpen] = useState(false);

  const scrollToId = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 120);
  };

  // ==========================================
  // TAB 1: TIMBER & FASCIA STATE & LOGIC
  // ==========================================
  const [selectedWoodIdx, setSelectedWoodIdx] = useState(0);
  const [isCustomDimensions, setIsCustomDimensions] = useState(false);
  const [standardSizeIdx, setStandardSizeIdx] = useState(2); // 4" x 2" (Roof Trusses)
  const [customThickness, setCustomThickness] = useState(2);
  const [customWidth, setCustomWidth] = useState(4);
  const [customLength, setCustomLength] = useState(12);
  const [quantity, setQuantity] = useState(10);

  const wood = WOOD_TYPES[selectedWoodIdx];
  
  const dimensions = useMemo(() => {
    if (!isCustomDimensions) {
      const size = STANDARD_SIZES[standardSizeIdx];
      return {
        thickness: size.thickness,
        width: size.width,
        label: size.label.split(' (')[0],
      };
    } else {
      return {
        thickness: customThickness,
        width: customWidth,
        label: `${customThickness}" x ${customWidth}"`,
      };
    }
  }, [isCustomDimensions, standardSizeIdx, customThickness, customWidth]);

  const length = isCustomDimensions ? customLength : 12;

  const boardFeetSingle = useMemo(() => {
    return (dimensions.thickness * dimensions.width * length) / 12;
  }, [dimensions, length]);

  const totalBoardFeet = useMemo(() => {
    return boardFeetSingle * quantity;
  }, [boardFeetSingle, quantity]);

  const totalWeightKg = useMemo(() => {
    return totalBoardFeet * wood.weightPerBoardFootKg;
  }, [totalBoardFeet, wood]);

  const calculatedUnitPrice = useMemo(() => {
    return Math.round(boardFeetSingle * wood.pricePerBoardFoot);
  }, [boardFeetSingle, wood]);

  const calculatedTotalPrice = useMemo(() => {
    return calculatedUnitPrice * quantity;
  }, [calculatedUnitPrice, quantity]);

  const handleResetTimber = () => {
    setSelectedWoodIdx(0);
    setIsCustomDimensions(false);
    setStandardSizeIdx(2);
    setCustomThickness(2);
    setCustomWidth(4);
    setCustomLength(12);
    setQuantity(10);
    setFeedbackMsg('');
  };

  const handleAddTimberToCart = () => {
    const label = `${dimensions.label} @ ${length}ft [${wood.name.split(' (')[0]}]`;
    onAddToCart({
      productId: `custom-timber-${wood.name.split(' ')[0].toLowerCase()}-${dimensions.thickness}x${dimensions.width}x${length}`,
      name: `Custom Sized Timber Beam`,
      category: 'timber',
      unitPrice: calculatedUnitPrice,
      quantity: quantity,
      descriptionText: `${label} (Calculated Board Feet: ${totalBoardFeet.toFixed(1)} BF)`,
      customCalculations: {
        boardFeet: totalBoardFeet,
        weightKg: totalWeightKg
      }
    });
    setFeedbackMsg('Successfully added Timber items to your cart!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // ==========================================
  // TAB 2: TREATED FENCING POLES STATE & LOGIC
  // ==========================================
  const [polePerimeter, setPolePerimeter] = useState(150); // meters
  const [poleSpacing, setPoleSpacing] = useState(3.0); // meters spacing (3m is Kenyan standard)
  const [selectedPoleType, setSelectedPoleType] = useState<'4inch' | '5inch' | '6inch'>('4inch');
  const [selectedPoleLength, setSelectedPoleLength] = useState(10); // 10 feet
  const [poleCorners, setPoleCorners] = useState(4);

  const poleDetails = useMemo(() => {
    if (selectedPoleType === '4inch') {
      return {
        name: 'Treated Fencing Pole (4" Dia)',
        id: 'poles-treated-4inch',
        basePrice: 850,
        lengths: [8, 10, 12],
        modifiers: { 8: 0, 10: 250, 12: 500 },
        weightPerFt: 3.5
      };
    } else if (selectedPoleType === '5inch') {
      return {
        name: 'Treated Support Pole (5" Dia)',
        id: 'poles-treated-5inch',
        basePrice: 1250,
        lengths: [10, 12, 15],
        modifiers: { 10: 0, 12: 350, 15: 800 },
        weightPerFt: 5.0
      };
    } else {
      return {
        name: 'Treated Construction Pole (6" Dia)',
        id: 'poles-treated-6inch',
        basePrice: 2200,
        lengths: [12, 15, 18],
        modifiers: { 12: 0, 15: 850, 18: 1800 },
        weightPerFt: 7.5
      };
    }
  }, [selectedPoleType]);

  const activePoleLength = useMemo(() => {
    if (poleDetails.lengths.includes(selectedPoleLength)) {
      return selectedPoleLength;
    }
    return poleDetails.lengths[0];
  }, [poleDetails, selectedPoleLength]);

  const calculatedPolesCount = useMemo(() => {
    const linePoles = Math.ceil(polePerimeter / poleSpacing);
    return linePoles + poleCorners;
  }, [polePerimeter, poleSpacing, poleCorners]);

  const poleUnitPrice = useMemo(() => {
    const modifier = (poleDetails.modifiers as any)[activePoleLength] || 0;
    return poleDetails.basePrice + modifier;
  }, [poleDetails, activePoleLength]);

  const poleTotalPrice = useMemo(() => {
    return calculatedPolesCount * poleUnitPrice;
  }, [calculatedPolesCount, poleUnitPrice]);

  const poleTotalWeightKg = useMemo(() => {
    return calculatedPolesCount * (poleDetails.weightPerFt * activePoleLength);
  }, [calculatedPolesCount, poleDetails, activePoleLength]);

  const handleResetPoles = () => {
    setPolePerimeter(150);
    setPoleSpacing(3.0);
    setSelectedPoleType('4inch');
    setSelectedPoleLength(10);
    setPoleCorners(4);
    setFeedbackMsg('');
  };

  const handleAddPolesToCart = () => {
    const label = `${activePoleLength}ft Treated Eucalyptus Pole (${selectedPoleType.replace('inch', '"')})`;
    onAddToCart({
      productId: `${poleDetails.id}-${activePoleLength}ft`,
      name: `Treated Timber Fencing Pole`,
      category: 'poles',
      unitPrice: poleUnitPrice,
      quantity: calculatedPolesCount,
      descriptionText: `${label} - Spacing: ${poleSpacing}m, Corners included: ${poleCorners}, Perimeter: ${polePerimeter}m`,
      customCalculations: {
        weightKg: poleTotalWeightKg
      }
    });
    setFeedbackMsg('Successfully added Treated Poles to your cart!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // ==========================================
  // TAB 3: CHAINLINK MESH STATE & LOGIC
  // ==========================================
  const [fencingPerimeter, setFencingPerimeter] = useState(150); // meters
  const [selectedGauge, setSelectedGauge] = useState<'g12' | 'g14'>('g12');
  const [selectedHeightFt, setSelectedHeightFt] = useState(6); // 4, 5, 6, 8 ft

  const chainlinkDetails = useMemo(() => {
    if (selectedGauge === 'g12') {
      return {
        name: 'Heavy Duty Galvanized Chainlink (G12.5)',
        id: 'fencing-chainlink-g12',
        basePrice: 4800,
        heightModifiers: { 4: 0, 5: 1100, 6: 2100, 8: 4100 },
        weights: { 4: 40, 5: 50, 6: 60, 8: 80 }
      };
    } else {
      return {
        name: 'Standard Galvanized Chainlink (G14)',
        id: 'fencing-chainlink-g14',
        basePrice: 3500,
        heightModifiers: { 4: 0, 5: 800, 6: 1600, 8: 3100 },
        weights: { 4: 25, 5: 32, 6: 38, 8: 50 }
      };
    }
  }, [selectedGauge]);

  const calculatedRollsCount = useMemo(() => {
    // 1 roll is standard 18 meters
    return Math.ceil(fencingPerimeter / 18);
  }, [fencingPerimeter]);

  const chainlinkUnitPrice = useMemo(() => {
    const modifier = (chainlinkDetails.heightModifiers as any)[selectedHeightFt] || 0;
    return chainlinkDetails.basePrice + modifier;
  }, [chainlinkDetails, selectedHeightFt]);

  const chainlinkTotalPrice = useMemo(() => {
    return calculatedRollsCount * chainlinkUnitPrice;
  }, [calculatedRollsCount, chainlinkUnitPrice]);

  const chainlinkTotalWeightKg = useMemo(() => {
    const unitWeight = (chainlinkDetails.weights as any)[selectedHeightFt] || 35;
    return calculatedRollsCount * unitWeight;
  }, [calculatedRollsCount, chainlinkDetails, selectedHeightFt]);

  const handleResetChainlink = () => {
    setFencingPerimeter(150);
    setSelectedGauge('g12');
    setSelectedHeightFt(6);
    setFeedbackMsg('');
  };

  const handleAddChainlinkToCart = () => {
    const label = `${chainlinkDetails.name} [Height: ${selectedHeightFt}ft]`;
    onAddToCart({
      productId: `${chainlinkDetails.id}-${selectedHeightFt}ft`,
      name: `Galvanized Chainlink Roll`,
      category: 'fencing',
      unitPrice: chainlinkUnitPrice,
      quantity: calculatedRollsCount,
      descriptionText: `${label} - ${calculatedRollsCount} rolls of 18m covering ${fencingPerimeter}m total distance`,
      customCalculations: {
        weightKg: chainlinkTotalWeightKg
      }
    });
    setFeedbackMsg('Successfully added Chainlink rolls to your cart!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // ==========================================
  // TAB 4: REINFORCING STEEL BARS STATE & LOGIC
  // ==========================================
  const [steelMode, setSteelMode] = useState<'direct' | 'cage'>('direct');
  const [selectedSteelGauge, setSelectedSteelGauge] = useState<'y8' | 'y10' | 'y12' | 'y16'>('y12');
  const [steelPiecesCount, setSteelPiecesCount] = useState(50);

  // Cage estimator inputs
  const [cageLength, setCageLength] = useState(12); // meters
  const [cageLongRebarCount, setCageLongRebarCount] = useState(4); // 4 or 6 bars
  const [cageMainGauge, setCageMainGauge] = useState<'y10' | 'y12' | 'y16'>('y12');
  const [stirrupSpacingCm, setStirrupSpacingCm] = useState(15);
  const [beamWidthCm, setBeamWidthCm] = useState(20);
  const [beamDepthCm, setBeamDepthCm] = useState(20);
  const [includeBindingWire, setIncludeBindingWire] = useState(true);

  const steelGauges = {
    y8: { name: 'Steel Rebar Y8 (8mm)', id: 'steel-rebar-y8', price: 650, weightPer12m: 4.74 },
    y10: { name: 'Steel Rebar Y10 (10mm)', id: 'steel-rebar-y10', price: 1050, weightPer12m: 7.4 },
    y12: { name: 'Steel Rebar Y12 (12mm)', id: 'steel-rebar-y12', price: 1480, weightPer12m: 10.66 },
    y16: { name: 'Steel Rebar Y16 (16mm)', id: 'steel-rebar-y16', price: 2650, weightPer12m: 18.96 },
  };

  const steelCalculations = useMemo(() => {
    if (steelMode === 'direct') {
      const activeGauge = steelGauges[selectedSteelGauge];
      const totalPrice = steelPiecesCount * activeGauge.price;
      const totalWeightKg = steelPiecesCount * activeGauge.weightPer12m;
      return {
        mainPieces: steelPiecesCount,
        mainPrice: activeGauge.price,
        mainTotal: totalPrice,
        stirrupPieces: 0,
        stirrupPrice: 0,
        stirrupTotal: 0,
        bindingWireRolls: 0,
        bindingWirePrice: 3800,
        bindingWireTotal: 0,
        totalCost: totalPrice,
        totalWeight: totalWeightKg,
        description: `${steelPiecesCount} pcs of Y${selectedSteelGauge.toUpperCase()} (12m standard bars)`
      };
    } else {
      // Structural column or beam cage
      const activeMainGauge = steelGauges[cageMainGauge];
      // Total main rebar length with overlap safety margins (5%)
      const totalMainLength = cageLength * cageLongRebarCount * 1.05;
      const mainPiecesNeeded = Math.ceil(totalMainLength / 12);
      const mainTotalCost = mainPiecesNeeded * activeMainGauge.price;

      // Stirrups (Y8 steel standard)
      const stirrupPerimeterM = ((2 * (beamWidthCm + beamDepthCm)) + 10) / 100; // 10cm hooks added
      const stirrupCount = Math.ceil((cageLength * 100) / stirrupSpacingCm);
      const totalStirrupLength = stirrupCount * stirrupPerimeterM;
      const stirrupPiecesNeeded = Math.ceil(totalStirrupLength / 12);
      const stirrupTotalCost = stirrupPiecesNeeded * steelGauges.y8.price;

      // Weight
      const mainWeight = mainPiecesNeeded * activeMainGauge.weightPer12m;
      const stirrupWeight = stirrupPiecesNeeded * steelGauges.y8.weightPer12m;
      const totalSteelWeight = mainWeight + stirrupWeight;

      // Binding wire
      const bindingWireNeededKg = totalSteelWeight * 0.02;
      const bindingWireRolls = includeBindingWire ? Math.max(1, Math.round(bindingWireNeededKg / 25)) : 0;
      const bindingWireTotalCost = bindingWireRolls * 3800;

      const totalCost = mainTotalCost + stirrupTotalCost + bindingWireTotalCost;

      return {
        mainPieces: mainPiecesNeeded,
        mainPrice: activeMainGauge.price,
        mainTotal: mainTotalCost,
        stirrupPieces: stirrupPiecesNeeded,
        stirrupPrice: steelGauges.y8.price,
        stirrupTotal: stirrupTotalCost,
        bindingWireRolls,
        bindingWirePrice: 3800,
        bindingWireTotal: bindingWireTotalCost,
        totalCost,
        totalWeight: totalSteelWeight + (bindingWireRolls * 25),
        description: `Custom Column Cage (${cageLength}m long, ${beamWidthCm}x${beamDepthCm}cm): ${mainPiecesNeeded}x Y${cageMainGauge.toUpperCase()} main bars + ${stirrupPiecesNeeded}x Y8 stirrups @ ${stirrupSpacingCm}cm centers`
      };
    }
  }, [steelMode, selectedSteelGauge, steelPiecesCount, cageLength, cageLongRebarCount, cageMainGauge, stirrupSpacingCm, beamWidthCm, beamDepthCm, includeBindingWire]);

  const handleResetSteel = () => {
    setSteelMode('direct');
    setSelectedSteelGauge('y12');
    setSteelPiecesCount(50);
    setCageLength(12);
    setCageLongRebarCount(4);
    setCageMainGauge('y12');
    setStirrupSpacingCm(15);
    setBeamWidthCm(20);
    setBeamDepthCm(20);
    setIncludeBindingWire(true);
    setFeedbackMsg('');
  };

  const handleAddSteelToCart = () => {
    if (steelMode === 'direct') {
      const activeGauge = steelGauges[selectedSteelGauge];
      onAddToCart({
        productId: activeGauge.id,
        name: activeGauge.name,
        category: 'steel',
        unitPrice: activeGauge.price,
        quantity: steelPiecesCount,
        descriptionText: `Direct steel order: ${steelPiecesCount} standard 12m rebars`,
        customCalculations: {
          weightKg: steelCalculations.totalWeight
        }
      });
    } else {
      // Cage bundle
      onAddToCart({
        productId: `custom-steel-cage-${cageMainGauge}-${cageLength}m`,
        name: `Custom Structural Reinforcing Column/Beam Cage Set`,
        category: 'steel',
        unitPrice: steelCalculations.totalCost,
        quantity: 1,
        descriptionText: steelCalculations.description + ` (Binding wire included: ${steelCalculations.bindingWireRolls} x 25kg rolls)`,
        customCalculations: {
          weightKg: steelCalculations.totalWeight
        }
      });
    }
    setFeedbackMsg('Successfully added Steel items to your cart!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Tabs structure
  const tabs = [
    { id: 'timber', label: 'Timber & Fascia', icon: '🪵' },
    { id: 'poles', label: 'Fencing Poles', icon: '🌲' },
    { id: 'fencing', label: 'Chainlink Mesh', icon: '🕸️' },
    { id: 'steel', label: 'Steel Rebars', icon: '🏗️' }
  ];

  return (
    <div className="natural-card overflow-hidden font-sans border-2 border-brand-green-200" id="timber-estimator-block">
      
      {/* Primary Header Banner */}
      <div className="bg-brand-green-800 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green-700 rounded-lg">
            <Calculator className="w-6 h-6 text-brand-gold-500" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight uppercase">
              LEMA YARD MATERIAL CALCULATORS
            </h3>
            <p className="text-xs text-brand-green-200">
              Calculate dimensions, check delivery weight, and estimate project budgets with standard Kenyan specifications.
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

      {/* Segmented Tab Bar */}
      <div className="flex flex-wrap border-b border-brand-green-200 bg-brand-green-100/50 p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedTab(tab.id as any);
              setFeedbackMsg('');
            }}
            className={`flex-1 min-w-[120px] text-center py-3.5 px-2 text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 border-transparent cursor-pointer ${
              selectedTab === tab.id
                ? 'border-brand-green-800 text-brand-green-800 bg-white font-extrabold shadow-xs'
                : 'text-slate-500 hover:text-brand-green-800 hover:bg-white/50'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Specific Calculator Input Configuration */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {selectedTab === 'timber' && (
            <>
              {/* Step 1: Select Wood Type */}
              <div id="timber-step-1" className="space-y-3 pt-1">
                <div className="flex justify-between items-center border-l-4 border-brand-green-700 pl-3">
                  <label className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider block">
                    Step 1: Select Timber Wood Species
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsStrengthMatrixOpen(true)}
                    className="text-[11px] text-brand-green-700 font-bold hover:text-brand-green-900 flex items-center gap-1 cursor-pointer bg-brand-green-100/60 px-2.5 py-1 rounded-lg border border-brand-green-200 transition-all hover:bg-brand-green-100"
                  >
                    <Award className="w-3.5 h-3.5 text-brand-gold-500" />
                    Cypress vs Mahogany Grade Matrix
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {WOOD_TYPES.map((type, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedWoodIdx(idx);
                        scrollToId('timber-step-2');
                      }}
                      className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col justify-between h-24 cursor-pointer ${
                        selectedWoodIdx === idx
                          ? 'border-brand-green-700 bg-brand-green-100 shadow-sm'
                          : 'border-brand-green-200 bg-brand-green-100/30 hover:bg-brand-green-100/60 hover:border-brand-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-brand-green-900 leading-tight">
                          {type.name.split(' (')[0]}
                        </span>
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedWoodIdx === idx ? 'bg-brand-green-600' : 'bg-slate-300'}`} />
                      </div>
                      <div className="mt-1 flex items-baseline justify-between w-full">
                        <span className="text-[10px] text-brand-green-600 font-medium">
                          KES {type.pricePerBoardFoot}/BF
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          ~{(type.weightPerBoardFootKg * 424).toFixed(0)} kg/m³
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Spec info panel */}
                <div className="bg-brand-green-100/40 border border-brand-green-200/50 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-brand-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-brand-green-800 font-semibold">{wood.name}:</strong> {wood.description}
                  </p>
                </div>
              </div>

              {/* Step 2: Choose Sizing Type */}
              <div id="timber-step-2" className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-brand-green-200 pb-2 border-l-4 border-brand-green-700 pl-3">
                  <label className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider block">
                    Step 2: Define Timber Sizing
                  </label>
                  
                  {/* Toggle Custom vs Standard */}
                  <div className="flex bg-brand-green-100 p-0.5 rounded-lg border border-brand-green-200">
                    <button
                      onClick={() => {
                        setIsCustomDimensions(false);
                        scrollToId('timber-step-2');
                      }}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        !isCustomDimensions ? 'bg-white text-brand-green-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Standard Sizes
                    </button>
                    <button
                      onClick={() => {
                        setIsCustomDimensions(true);
                        scrollToId('timber-step-2');
                      }}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        isCustomDimensions ? 'bg-white text-brand-green-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Custom Sizing
                    </button>
                  </div>
                </div>

                {!isCustomDimensions ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STANDARD_SIZES.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setStandardSizeIdx(idx);
                            scrollToId('timber-step-3');
                          }}
                          className={`p-2.5 text-center rounded-lg border transition-all text-xs font-semibold cursor-pointer ${
                            standardSizeIdx === idx
                              ? 'bg-brand-green-800 text-white border-brand-green-800 shadow-sm'
                              : 'bg-white text-brand-green-900 border-brand-green-200 hover:bg-brand-green-100'
                          }`}
                        >
                          <div className="font-mono text-sm">{size.label.split(' (')[0]}</div>
                          <div className={`text-[9px] mt-0.5 ${standardSizeIdx === idx ? 'text-brand-gold-100' : 'text-slate-500'}`}>
                            {size.label.includes('(') ? size.label.split('(')[1].replace(')', '') : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-500 text-right italic">
                      *Standard architectural timber in Kenya is supplied at a standard 12ft length.
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FAF8F3]/60 rounded-2xl p-4 border border-brand-green-200/50 space-y-4">
                    {/* Custom Thickness */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">Thickness (Inches)</span>
                        <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                          {customThickness}" ({Math.round(customThickness * 25.4)}mm)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={customThickness}
                        onChange={(e) => {
                          setCustomThickness(parseFloat(e.target.value));
                        }}
                        onMouseUp={() => scrollToId('timber-step-3')}
                        onTouchEnd={() => scrollToId('timber-step-3')}
                        className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>1"</span>
                        <span>2"</span>
                        <span>4"</span>
                        <span>6"</span>
                        <span>8"</span>
                      </div>
                    </div>

                    {/* Custom Width */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">Width (Inches)</span>
                        <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                          {customWidth}" ({Math.round(customWidth * 25.4)}mm)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={customWidth}
                        onChange={(e) => {
                          setCustomWidth(parseInt(e.target.value));
                        }}
                        onMouseUp={() => scrollToId('timber-step-3')}
                        onTouchEnd={() => scrollToId('timber-step-3')}
                        className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>1"</span>
                        <span>3"</span>
                        <span>6"</span>
                        <span>9"</span>
                        <span>12"</span>
                      </div>
                    </div>

                    {/* Custom Length */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">Length (Feet)</span>
                        <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                          {customLength}ft ({Math.round(customLength * 0.3048).toFixed(1)}m)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="24"
                        step="2"
                        value={customLength}
                        onChange={(e) => {
                          setCustomLength(parseInt(e.target.value));
                        }}
                        onMouseUp={() => scrollToId('timber-step-3')}
                        onTouchEnd={() => scrollToId('timber-step-3')}
                        className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>4ft</span>
                        <span>8ft</span>
                        <span>12ft</span>
                        <span>16ft</span>
                        <span>20ft</span>
                        <span>24ft</span>
                      </div>
                    </div>

                    {customLength > 18 && (
                      <div className="bg-amber-50 text-amber-800 text-[10px] p-2.5 rounded border border-amber-200 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Timber above 18ft length requires specialized flatbed transport. Please contact our yard for logistics planning.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 3: Quantity */}
              <div id="timber-step-3" className="space-y-2 pt-2 pb-4">
                <label className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider block border-l-4 border-brand-green-700 pl-3">
                  Step 3: Quantity (Number of pieces)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-brand-green-100 border border-brand-green-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 5));
                        scrollToId('btn-calculator-add-cart');
                      }}
                      className="px-4 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1));
                        scrollToId('btn-calculator-add-cart');
                      }}
                      className="px-3 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                    >
                      -1
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                        scrollToId('btn-calculator-add-cart');
                      }}
                      className="w-16 text-center font-mono font-bold text-brand-green-950 bg-white border-x border-brand-green-200 py-2.5 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity(quantity + 1);
                        scrollToId('btn-calculator-add-cart');
                      }}
                      className="px-3 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity(quantity + 5);
                        scrollToId('btn-calculator-add-cart');
                      }}
                      className="px-4 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                    >
                      +5
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetTimber}
                    className="flex items-center gap-1.5 text-xs text-brand-green-700 hover:text-brand-green-900 transition-colors p-2 rounded hover:bg-brand-green-100 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Defaults
                  </button>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'poles' && (
            <>
              {/* Step 1: Select Pole Diameter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                  Step 1: Select Treated Pole Specification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '4inch', label: '4" Fencing Pole', desc: 'Farm / Home Boundary' },
                    { id: '5inch', label: '5" Support Pole', desc: 'Corners & Gates' },
                    { id: '6inch', label: '6" Structural Pole', desc: 'Heavy Construction' }
                  ].map((pType) => (
                    <button
                      key={pType.id}
                      onClick={() => {
                        setSelectedPoleType(pType.id as any);
                        const lengthsForType = pType.id === '4inch' ? [8, 10, 12] : pType.id === '5inch' ? [10, 12, 15] : [12, 15, 18];
                        setSelectedPoleLength(lengthsForType[1]); // select middle length as default
                      }}
                      className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col justify-between h-24 cursor-pointer ${
                        selectedPoleType === pType.id
                          ? 'border-brand-green-700 bg-brand-green-100 shadow-sm'
                          : 'border-brand-green-200 bg-brand-green-100/30 hover:bg-brand-green-100/60 hover:border-brand-green-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-brand-green-900">{pType.label}</div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{pType.desc}</div>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full self-end ${selectedPoleType === pType.id ? 'bg-brand-green-600' : 'bg-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Height / Length */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                  Step 2: Select Pole Height / Length
                </label>
                <div className="flex gap-2">
                  {poleDetails.lengths.map((len) => {
                    const extraCost = (poleDetails.modifiers as any)[len] || 0;
                    return (
                      <button
                        key={len}
                        onClick={() => setSelectedPoleLength(len)}
                        className={`flex-1 p-3 text-center rounded-lg border transition-all text-xs font-bold cursor-pointer ${
                          activePoleLength === len
                            ? 'bg-brand-green-800 text-white border-brand-green-800 shadow-xs'
                            : 'bg-white text-brand-green-900 border-brand-green-200 hover:bg-brand-green-100'
                        }`}
                      >
                        <div className="text-base font-mono">{len} Feet</div>
                        <div className="text-[10px] font-normal opacity-80">
                          {extraCost === 0 ? 'Base Price' : `+ KES ${extraCost}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Perimeter & Spacing */}
              <div className="bg-[#FAF8F3]/60 rounded-2xl p-4 border border-brand-green-200/50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fence Distance Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Fence Perimeter</span>
                      <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                        {polePerimeter} Meters
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={polePerimeter}
                      onChange={(e) => setPolePerimeter(parseInt(e.target.value))}
                      className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>10m</span>
                      <span>250m</span>
                      <span>500m</span>
                      <span>1000m</span>
                    </div>
                  </div>

                  {/* Pole Spacing Select */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Inter-Pole Spacing</span>
                      <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                        {poleSpacing.toFixed(1)}m ({Math.round(poleSpacing * 3.281)}ft)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {[2.5, 3.0, 3.5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPoleSpacing(val)}
                          className={`py-1.5 px-2 text-center text-xs font-semibold rounded border transition-all cursor-pointer ${
                            poleSpacing === val
                              ? 'bg-brand-green-800 text-white border-brand-green-800'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {val.toFixed(1)}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-green-200/50">
                  {/* Corner/Gate posts selection */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 block">Corners & Gate Supports (+1 pole each)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPoleCorners(Math.max(0, poleCorners - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-brand-green-100 text-brand-green-800 font-bold rounded-lg hover:bg-brand-green-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-sm">{poleCorners} Corners</span>
                      <button
                        type="button"
                        onClick={() => setPoleCorners(poleCorners + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-brand-green-100 text-brand-green-800 font-bold rounded-lg hover:bg-brand-green-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <button
                      type="button"
                      onClick={handleResetPoles}
                      className="flex items-center gap-1.5 text-xs text-brand-green-700 hover:text-brand-green-900 transition-colors p-2 rounded hover:bg-brand-green-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Defaults
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'fencing' && (
            <>
              {/* Step 1: Select Chainlink Gauge */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                  Step 1: Select Chainlink Wire Gauge
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'g12', label: 'Heavy Duty Gauge 12.5', desc: 'Thick wire, ultimate security & farms' },
                    { id: 'g14', label: 'Standard Gauge 14', desc: 'Economical, residential boundary' }
                  ].map((gauge) => (
                    <button
                      key={gauge.id}
                      onClick={() => setSelectedGauge(gauge.id as any)}
                      className={`p-3.5 text-left rounded-xl border transition-all text-xs flex flex-col justify-between h-24 cursor-pointer ${
                        selectedGauge === gauge.id
                          ? 'border-brand-green-700 bg-brand-green-100 shadow-sm'
                          : 'border-brand-green-200 bg-brand-green-100/30 hover:bg-brand-green-100/60 hover:border-brand-green-300'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-bold text-brand-green-900">{gauge.label}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedGauge === gauge.id ? 'bg-brand-green-600' : 'bg-slate-300'}`} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">{gauge.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Height */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                  Step 2: Select Chainlink Mesh Height
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[4, 5, 6, 8].map((ht) => {
                    const extraCost = (chainlinkDetails.heightModifiers as any)[ht] || 0;
                    return (
                      <button
                        key={ht}
                        onClick={() => setSelectedHeightFt(ht)}
                        className={`p-3 text-center rounded-lg border transition-all text-xs font-bold cursor-pointer ${
                          selectedHeightFt === ht
                            ? 'bg-brand-green-800 text-white border-brand-green-800 shadow-xs'
                            : 'bg-white text-brand-green-900 border-brand-green-200 hover:bg-brand-green-100'
                        }`}
                      >
                        <div className="text-base font-mono">{ht}ft</div>
                        <div className="text-[10px] font-normal opacity-85">
                          {extraCost === 0 ? 'Base' : `+ KES ${extraCost}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Perimeter Distance */}
              <div className="bg-[#FAF8F3]/60 rounded-2xl p-4 border border-brand-green-200/50 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Fencing Boundary Length</span>
                    <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                      {fencingPerimeter} Meters
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={fencingPerimeter}
                    onChange={(e) => setFencingPerimeter(parseInt(e.target.value))}
                    className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>10m</span>
                    <span>250m</span>
                    <span>500m</span>
                    <span>1000m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-brand-green-200/50">
                  <p className="text-[10px] text-brand-green-700 italic">
                    * 1 roll covers exactly 18 meters (60ft) of boundary length. Extra is auto-rounded to full rolls.
                  </p>

                  <button
                    type="button"
                    onClick={handleResetChainlink}
                    className="flex items-center gap-1.5 text-xs text-brand-green-700 hover:text-brand-green-900 transition-colors p-2 rounded hover:bg-brand-green-100 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Defaults
                  </button>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'steel' && (
            <>
              {/* Step 1: Select Estimating Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">
                  Step 1: Select Steel Calculation Mode
                </label>
                <div className="grid grid-cols-2 gap-3 bg-brand-green-100 p-1 rounded-xl border border-brand-green-200">
                  <button
                    onClick={() => setSteelMode('direct')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      steelMode === 'direct' ? 'bg-white text-brand-green-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Direct pieces count
                  </button>
                  <button
                    onClick={() => setSteelMode('cage')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      steelMode === 'cage' ? 'bg-white text-brand-green-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Structural Column/Beam Cage
                  </button>
                </div>
              </div>

              {steelMode === 'direct' ? (
                <>
                  {/* Direct pieces mode inputs */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">Select Steel Bar Size (Diameter)</span>
                    <div className="grid grid-cols-4 gap-2">
                      {['y8', 'y10', 'y12', 'y16'].map((sz) => {
                        const barInfo = (steelGauges as any)[sz];
                        return (
                          <button
                            key={sz}
                            onClick={() => setSelectedSteelGauge(sz as any)}
                            className={`p-2.5 text-center rounded-lg border transition-all text-xs font-bold cursor-pointer ${
                              selectedSteelGauge === sz
                                ? 'bg-brand-green-800 text-white border-brand-green-800 shadow-xs'
                                : 'bg-white text-brand-green-900 border-brand-green-200 hover:bg-brand-green-100'
                            }`}
                          >
                            <div className="text-base font-mono uppercase">{sz}</div>
                            <div className="text-[10px] font-normal opacity-85">KES {barInfo.price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-brand-green-200/50">
                    <span className="text-xs font-bold text-brand-green-900 uppercase tracking-wider block">Quantity (12-meter standard bars)</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-brand-green-100 border border-brand-green-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setSteelPiecesCount(Math.max(1, steelPiecesCount - 10))}
                          className="px-4 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => setSteelPiecesCount(Math.max(1, steelPiecesCount - 1))}
                          className="px-3 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                        >
                          -1
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={steelPiecesCount}
                          onChange={(e) => setSteelPiecesCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center font-mono font-bold text-brand-green-950 bg-white border-x border-brand-green-200 py-2.5 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setSteelPiecesCount(steelPiecesCount + 1)}
                          className="px-3 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => setSteelPiecesCount(steelPiecesCount + 10)}
                          className="px-4 py-2.5 text-brand-green-800 hover:bg-brand-green-200/50 font-bold font-mono transition-all cursor-pointer"
                        >
                          +10
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetSteel}
                        className="flex items-center gap-1.5 text-xs text-brand-green-700 hover:text-brand-green-900 transition-colors p-2 rounded hover:bg-brand-green-100 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Defaults
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Cage column/beam mode inputs */}
                  <div className="bg-[#FAF8F3]/60 rounded-2xl p-4 border border-brand-green-200/50 space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Cage Length slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700">Cage Length (Meters)</span>
                          <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-2 py-0.5 rounded">
                            {cageLength}m ({Math.round(cageLength * 3.281)}ft)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          step="1"
                          value={cageLength}
                          onChange={(e) => setCageLength(parseInt(e.target.value))}
                          className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                          <span>1m</span>
                          <span>25m</span>
                          <span>50m</span>
                          <span>100m</span>
                        </div>
                      </div>

                      {/* Main Bar Select */}
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-700 block">Longitudinal Bars Size</span>
                        <div className="grid grid-cols-3 gap-1 pt-1">
                          {['y10', 'y12', 'y16'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setCageMainGauge(g as any)}
                              className={`py-1.5 text-center text-xs font-bold rounded border transition-all uppercase cursor-pointer ${
                                cageMainGauge === g
                                  ? 'bg-brand-green-800 text-white border-brand-green-800'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-brand-green-200/50">
                      
                      {/* Long bar count */}
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-700 block">Main Rebars Count</span>
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          {[4, 6].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setCageLongRebarCount(count)}
                              className={`py-1.5 text-center text-xs font-bold rounded border transition-all cursor-pointer ${
                                cageLongRebarCount === count
                                  ? 'bg-brand-green-800 text-white border-brand-green-800'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {count} Bars
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stirrup spacing */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700">Stirrup Spacing</span>
                          <span className="font-mono bg-brand-green-100 text-brand-green-900 font-bold px-1.5 py-0.5 rounded">
                            {stirrupSpacingCm}cm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="30"
                          step="5"
                          value={stirrupSpacingCm}
                          onChange={(e) => setStirrupSpacingCm(parseInt(e.target.value))}
                          className="w-full accent-brand-green-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                          <span>10cm</span>
                          <span>20cm</span>
                          <span>30cm</span>
                        </div>
                      </div>

                      {/* Beam sizing width/depth */}
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-700 block">Cross-Section</span>
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          <select
                            value={`${beamWidthCm}x${beamDepthCm}`}
                            onChange={(e) => {
                              const [w, d] = e.target.value.split('x').map(Number);
                              setBeamWidthCm(w);
                              setBeamDepthCm(d);
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-green-700"
                          >
                            <option value="20x20">20×20 cm</option>
                            <option value="20x30">20×30 cm</option>
                            <option value="25x25">25×25 cm</option>
                            <option value="30x30">30×30 cm</option>
                          </select>
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium select-none">
                            <input
                              type="checkbox"
                              checked={includeBindingWire}
                              onChange={(e) => setIncludeBindingWire(e.target.checked)}
                              className="accent-brand-green-700 w-3.5 h-3.5"
                            />
                            Add Wire
                          </label>
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-brand-green-200/50">
                      <span className="text-[10px] text-brand-green-700 font-medium">
                        *Estimates include a 5% safety margin for splicing overlaps and stirrup hook bends.
                      </span>

                      <button
                        type="button"
                        onClick={handleResetSteel}
                        className="flex items-center gap-1.5 text-xs text-brand-green-700 hover:text-brand-green-900 transition-colors p-2 rounded hover:bg-brand-green-100 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Defaults
                      </button>
                    </div>

                  </div>
                </>
              )}
            </>
          )}

        </div>

        {/* Right Side: Calculation outputs & reactive graphics */}
        <div className="lg:col-span-5 bg-brand-green-900 text-white rounded-xl p-6 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-500/5 rotate-45 transform translate-x-12 -translate-y-12 pointer-events-none"></div>

          <div>
            <span className="text-[10px] font-bold text-brand-gold-500 tracking-wider uppercase block">
              ESTIMATION SUMMARY
            </span>

            {selectedTab === 'timber' && (
              <>
                <h4 className="font-display font-bold text-xl mb-4 border-b border-brand-green-800 pb-2 flex justify-between items-baseline">
                  <span>{wood.name.split(' ')[0]} timber</span>
                  <span className="font-mono text-sm text-brand-green-200 lowercase">
                    @{wood.pricePerBoardFoot} KES/BF
                  </span>
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Specified Dimensions:</span>
                    <span className="font-bold font-mono text-right">
                      {dimensions.thickness}" × {dimensions.width}" × {length}ft
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Total Quantity:</span>
                    <span className="font-bold font-mono text-right">{quantity} pieces</span>
                  </div>

                  <div className="h-px bg-brand-green-800 my-2"></div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Total Volume:</span>
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-brand-gold-100">{totalBoardFeet.toFixed(1)}</span>
                      <span className="text-[10px] ml-1 font-semibold text-brand-green-200">BF</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Est. Total Weight:</span>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-brand-green-100">~{totalWeightKg.toFixed(0)} KG</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="mt-6 bg-brand-green-950 rounded-lg p-3 border border-brand-green-800/80 flex flex-col items-center justify-center h-28 relative">
                  <span className="absolute top-1 right-2 text-[8px] font-mono text-brand-green-400">Reactive Visual Model</span>
                  <svg className="w-48 h-20 text-brand-gold-500" viewBox="0 0 200 80" fill="none">
                    <g transform="translate(10, 10)">
                      <polygon 
                        points={`0,40 0,${40 - (dimensions.thickness * 4)} ${dimensions.width * 5},${40 - (dimensions.thickness * 4)} ${dimensions.width * 5},40`} 
                        fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"
                      />
                      <polygon 
                        points={`0,${40 - (dimensions.thickness * 4)} ${110 + (length * 1.5)},${15 - (dimensions.thickness * 2)} ${110 + (length * 1.5) + (dimensions.width * 5)},${15 - (dimensions.thickness * 2)} ${dimensions.width * 5},${40 - (dimensions.thickness * 4)}`} 
                        fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5"
                      />
                      <polygon 
                        points={`${dimensions.width * 5},40 ${dimensions.width * 5},${40 - (dimensions.thickness * 4)} ${110 + (length * 1.5) + (dimensions.width * 5)},${15 - (dimensions.thickness * 2)} ${110 + (length * 1.5) + (dimensions.width * 5)},${15 - (dimensions.thickness * 2) + (dimensions.thickness * 4)}`} 
                        fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.5"
                      />
                      <text x="2" y="47" fill="#E47F25" fontSize="8" fontFamily="monospace" fontWeight="bold">T: {dimensions.thickness}"</text>
                      <text x={dimensions.width * 2} y="15" fill="#f0f7f4" fontSize="8" fontFamily="monospace">W: {dimensions.width}"</text>
                      <text x="70" y="38" fill="#f0f7f4" fontSize="8" fontFamily="monospace">Length: {length}ft</text>
                    </g>
                  </svg>
                </div>
              </>
            )}

            {selectedTab === 'poles' && (
              <>
                <h4 className="font-display font-bold text-xl mb-4 border-b border-brand-green-800 pb-2 flex justify-between items-baseline">
                  <span>{poleDetails.name}</span>
                  <span className="font-mono text-sm text-brand-green-200">
                    KES {poleUnitPrice}/pole
                  </span>
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Total Fence Perimeter:</span>
                    <span className="font-bold font-mono">{polePerimeter} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Specified Spacing:</span>
                    <span className="font-bold font-mono">{poleSpacing.toFixed(1)}m spacing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Selected Pole Height:</span>
                    <span className="font-bold font-mono">{activePoleLength}ft treated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Extra Corner Posts:</span>
                    <span className="font-bold font-mono">+{poleCorners} poles</span>
                  </div>

                  <div className="h-px bg-brand-green-800 my-2"></div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Total Poles Required:</span>
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-brand-gold-100">{calculatedPolesCount}</span>
                      <span className="text-[10px] ml-1 font-semibold text-brand-green-200">PCS</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Est. Total Weight:</span>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-brand-green-100">~{poleTotalWeightKg.toFixed(0)} KG</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="mt-6 bg-brand-green-950 rounded-lg p-3 border border-brand-green-800/80 flex flex-col items-center justify-center h-28 relative">
                  <span className="absolute top-1 right-2 text-[8px] font-mono text-brand-green-400">Reactive Visual Model</span>
                  <svg className="w-48 h-20 text-brand-gold-500" viewBox="0 0 200 80" fill="none">
                    {/* Render fence posts */}
                    <g transform="translate(10, 10)">
                      <line x1="10" y1="50" x2="170" y2="50" stroke="#FAF9F4" strokeWidth="2" strokeDasharray="3 3" opacity="0.3" />
                      {/* 4 poles */}
                      {[10, 60, 110, 160].map((x, i) => (
                        <g key={i}>
                          <rect x={x} y="15" width="6" height="35" fill="#E47F25" rx="1.5" />
                          <line x1={x + 3} y1="15" x2={x + 3} y2="8" stroke="#135E34" strokeWidth="1" />
                          <circle cx={x + 3} cy="8" r="1.5" fill="#135E34" />
                        </g>
                      ))}
                      {/* Wire horizontal links representing chainlink */}
                      <line x1="13" y1="22" x2="163" y2="22" stroke="#FAF9F4" strokeWidth="1" opacity="0.5" />
                      <line x1="13" y1="35" x2="163" y2="35" stroke="#FAF9F4" strokeWidth="1" opacity="0.5" />
                      <line x1="13" y1="48" x2="163" y2="48" stroke="#FAF9F4" strokeWidth="1" opacity="0.5" />
                      
                      <text x="5" y="65" fill="#FAF9F4" fontSize="7" fontFamily="monospace">Spacing: {poleSpacing}m</text>
                      <text x="110" y="65" fill="#E47F25" fontSize="7" fontFamily="monospace">Poles: {calculatedPolesCount} pcs</text>
                    </g>
                  </svg>
                </div>
              </>
            )}

            {selectedTab === 'fencing' && (
              <>
                <h4 className="font-display font-bold text-xl mb-4 border-b border-brand-green-800 pb-2 flex justify-between items-baseline">
                  <span>{chainlinkDetails.name}</span>
                  <span className="font-mono text-sm text-brand-green-200">
                    KES {chainlinkUnitPrice}/roll
                  </span>
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Boundary Distance:</span>
                    <span className="font-bold font-mono">{fencingPerimeter} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Specified Height:</span>
                    <span className="font-bold font-mono">{selectedHeightFt} Feet tall</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-green-200">Wire Strength / Gauge:</span>
                    <span className="font-bold font-mono">{selectedGauge === 'g12' ? 'Gauge 12.5 (Heavy)' : 'Gauge 14 (Standard)'}</span>
                  </div>

                  <div className="h-px bg-brand-green-800 my-2"></div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Rolls Needed (18m standard):</span>
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-brand-gold-100">{calculatedRollsCount}</span>
                      <span className="text-[10px] ml-1 font-semibold text-brand-green-200">ROLLS</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Est. Total Weight:</span>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-brand-green-100">~{chainlinkTotalWeightKg} KG</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="mt-6 bg-brand-green-950 rounded-lg p-3 border border-brand-green-800/80 flex flex-col items-center justify-center h-28 relative">
                  <span className="absolute top-1 right-2 text-[8px] font-mono text-brand-green-400">Reactive Visual Model</span>
                  <svg className="w-48 h-20 text-brand-gold-500" viewBox="0 0 200 80" fill="none">
                    <g transform="translate(10, 10)">
                      <rect x="5" y="10" width="170" height="40" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                      {/* Diagonal weave simulation */}
                      <path d="M 5,10 L 45,50 M 25,10 L 65,50 M 45,10 L 85,50 M 65,10 L 105,50 M 85,10 L 125,50 M 105,10 L 145,50 M 125,10 L 165,50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      <path d="M 45,10 L 5,50 M 65,10 L 25,50 M 85,10 L 45,50 M 105,10 L 65,50 M 125,10 L 85,50 M 145,10 L 105,50 M 165,10 L 125,50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      
                      <text x="5" y="62" fill="#FAF9F4" fontSize="8" fontFamily="monospace">Mesh Height: {selectedHeightFt}ft</text>
                      <text x="110" y="62" fill="#E47F25" fontSize="8" fontFamily="monospace">{calculatedRollsCount} rolls (18m ea)</text>
                    </g>
                  </svg>
                </div>
              </>
            )}

            {selectedTab === 'steel' && (
              <>
                <h4 className="font-display font-bold text-xl mb-4 border-b border-brand-green-800 pb-2 flex justify-between items-baseline">
                  <span>{steelMode === 'direct' ? steelGauges[selectedSteelGauge].name : 'Column/Beam Cage Set'}</span>
                  <span className="font-mono text-sm text-brand-green-200">
                    {steelMode === 'direct' ? `KES ${steelGauges[selectedSteelGauge].price}/bar` : 'Optimized specs'}
                  </span>
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  {steelMode === 'direct' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Steel Bar size:</span>
                        <span className="font-bold font-mono uppercase">{selectedSteelGauge} (8m - 16mm)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Bar lengths:</span>
                        <span className="font-bold font-mono">12 Meters / 40ft standard</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Pieces ordered:</span>
                        <span className="font-bold font-mono">{steelPiecesCount} bars</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Cage Length & Section:</span>
                        <span className="font-bold font-mono">{cageLength}m ({beamWidthCm}x{beamDepthCm}cm)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Main Bars (12m pieces):</span>
                        <span className="font-bold font-mono text-right">{steelCalculations.mainPieces} pcs of Y{cageMainGauge.toUpperCase()} (@ KES {steelCalculations.mainPrice})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Y8 Link Stirrups:</span>
                        <span className="font-bold font-mono text-right">{steelCalculations.stirrupPieces} pcs of Y8 (@ KES {steelCalculations.stirrupPrice})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-green-200">Binding Wire:</span>
                        <span className="font-bold font-mono text-right">
                          {steelCalculations.bindingWireRolls > 0 ? `${steelCalculations.bindingWireRolls} roll(s) (25kg)` : 'Not included'}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="h-px bg-brand-green-800 my-2"></div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-green-200">Total Steel Weight:</span>
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-brand-gold-100">~{steelCalculations.totalWeight.toFixed(1)}</span>
                      <span className="text-[10px] ml-1 font-semibold text-brand-green-200">KG</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="mt-6 bg-brand-green-950 rounded-lg p-3 border border-brand-green-800/80 flex flex-col items-center justify-center h-28 relative">
                  <span className="absolute top-1 right-2 text-[8px] font-mono text-brand-green-400">Reactive Visual Model</span>
                  <svg className="w-48 h-20 text-brand-gold-500" viewBox="0 0 200 80" fill="none">
                    <g transform="translate(10, 10)">
                      {/* Draw longitudinal steel bars */}
                      <line x1="5" y1="20" x2="165" y2="20" stroke="#E47F25" strokeWidth="2.5" />
                      <line x1="5" y1="40" x2="165" y2="40" stroke="#E47F25" strokeWidth="2.5" opacity="0.9" />
                      {/* For 4 or 6 bars, draw a third background bar */}
                      <line x1="12" y1="30" x2="172" y2="30" stroke="#FAF9F4" strokeWidth="1.5" opacity="0.3" />

                      {/* Draw links / stirrups */}
                      {steelMode === 'cage' ? (
                        [15, 35, 55, 75, 95, 115, 135, 155].map((x, i) => (
                          <rect key={i} x={x} y="15" width="6" height="30" stroke="#FAF9F4" strokeWidth="1.5" fill="none" opacity="0.75" />
                        ))
                      ) : (
                        [40, 80, 120].map((x, i) => (
                          <rect key={i} x={x} y="15" width="4" height="30" stroke="#FAF9F4" strokeWidth="1" fill="none" opacity="0.4" />
                        ))
                      )}

                      <text x="5" y="62" fill="#FAF9F4" fontSize="8" fontFamily="monospace">
                        {steelMode === 'direct' ? `Bars: ${steelPiecesCount} pcs` : `Main: Y${cageMainGauge.toUpperCase()} / Stirrups: Y8`}
                      </text>
                    </g>
                  </svg>
                </div>
              </>
            )}

          </div>

          {/* Pricing display & action triggers */}
          <div className="pt-6 border-t border-brand-green-800 mt-6 space-y-4">
            
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-brand-green-200">
                ESTIMATED COST:
              </span>
              <div className="text-right">
                <span className="text-[10px] text-brand-gold-100 font-bold mr-1">KES</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {selectedTab === 'timber' && calculatedTotalPrice.toLocaleString()}
                  {selectedTab === 'poles' && poleTotalPrice.toLocaleString()}
                  {selectedTab === 'fencing' && chainlinkTotalPrice.toLocaleString()}
                  {selectedTab === 'steel' && steelCalculations.totalCost.toLocaleString()}
                </span>
                <p className="text-[10px] text-brand-green-200">
                  {selectedTab === 'timber' && `(approx KES ${calculatedUnitPrice.toLocaleString()} each)`}
                  {selectedTab === 'poles' && `(KES ${poleUnitPrice.toLocaleString()} each)`}
                  {selectedTab === 'fencing' && `(KES ${chainlinkUnitPrice.toLocaleString()} per roll)`}
                  {selectedTab === 'steel' && (steelMode === 'direct' ? `(KES ${steelGauges[selectedSteelGauge].price} per bar)` : 'Custom bundled structural cage')}
                </p>
              </div>
            </div>

            {feedbackMsg && (
              <div className="bg-emerald-600 text-white font-sans text-center text-xs py-2 px-3 rounded-lg border border-emerald-500 animate-fadeIn">
                {feedbackMsg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedTab === 'timber') handleAddTimberToCart();
                  if (selectedTab === 'poles') handleAddPolesToCart();
                  if (selectedTab === 'fencing') handleAddChainlinkToCart();
                  if (selectedTab === 'steel') handleAddSteelToCart();
                }}
                className="flex-1 bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                id="btn-calculator-add-cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {selectedTab === 'timber' ? 'Add Estimated Timber to Cart' :
                 selectedTab === 'poles' ? 'Add Estimated Poles to Cart' :
                 selectedTab === 'fencing' ? 'Add Estimated Fencing to Cart' :
                 'Add Estimated Steel to Cart'}
              </button>
            </div>

            {onDownloadPDF && (
              <button
                type="button"
                onClick={() => {
                  if (selectedTab === 'timber') {
                    onDownloadPDF({
                      title: 'TIMBER MATERIAL ESTIMATE QUOTE',
                      quoteNo: `LEMA-TB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      deliveryType: 'pickup',
                      deliveryLocation: '',
                      deliveryCost: 0,
                      subtotal: calculatedTotalPrice,
                      total: calculatedTotalPrice,
                      notes: `Custom estimated structural lumber: ${wood.name} (${dimensions.label} @ ${length}ft). Sawn lumber volume: ${totalBoardFeet.toFixed(1)} Board Feet. Estimated total mass: ~${totalWeightKg.toFixed(1)} KG. Handled by LEMA central transport yards.`,
                      items: [
                        {
                          name: `Sawn Lumber: ${wood.name}`,
                          descriptionText: `${dimensions.label} x ${length}ft standard structural wood beams`,
                          quantity: quantity,
                          unitPrice: calculatedUnitPrice,
                          totalPrice: calculatedTotalPrice,
                        }
                      ]
                    });
                  } else if (selectedTab === 'poles') {
                    onDownloadPDF({
                      title: 'TREATED FENCING POLES QUOTE',
                      quoteNo: `LEMA-PL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      deliveryType: 'pickup',
                      deliveryLocation: '',
                      deliveryCost: 0,
                      subtotal: poleTotalPrice,
                      total: poleTotalPrice,
                      notes: `Treated fencing poles estimate for site perimeter of ${polePerimeter}m (standard spacing: ${poleSpacing}m, corner reinforcement posts: ${poleCorners}). Estimated total load mass: ~${poleTotalWeightKg.toFixed(1)} KG.`,
                      items: [
                        {
                          name: poleDetails.name,
                          descriptionText: `${activePoleLength}ft length treated Eucalyptus fencing poles`,
                          quantity: calculatedPolesCount,
                          unitPrice: poleUnitPrice,
                          totalPrice: poleTotalPrice,
                        }
                      ]
                    });
                  } else if (selectedTab === 'fencing') {
                    onDownloadPDF({
                      title: 'GALVANIZED FENCING MESH QUOTE',
                      quoteNo: `LEMA-FN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      deliveryType: 'pickup',
                      deliveryLocation: '',
                      deliveryCost: 0,
                      subtotal: chainlinkTotalPrice,
                      total: chainlinkTotalPrice,
                      notes: `Galvanized chain-link fence roll estimate for perimeter of ${fencingPerimeter}m. Standard rolls are 18 meters (60ft) in length. Estimated mass: ~${chainlinkTotalWeightKg.toFixed(1)} KG.`,
                      items: [
                        {
                          name: chainlinkDetails.name,
                          descriptionText: `Height: ${selectedHeightFt}ft x standard roll length: 18 meters`,
                          quantity: calculatedRollsCount,
                          unitPrice: chainlinkUnitPrice,
                          totalPrice: chainlinkTotalPrice,
                        }
                      ]
                    });
                  } else if (selectedTab === 'steel') {
                    onDownloadPDF({
                      title: 'REINFORCEMENT STEEL QUOTE',
                      quoteNo: `LEMA-ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      deliveryType: 'pickup',
                      deliveryLocation: '',
                      deliveryCost: 0,
                      subtotal: steelCalculations.totalCost,
                      total: steelCalculations.totalCost,
                      notes: `KEBS compliant High-yield Grade 500N Ribbed reinforcement steel bars. Mode: ${steelMode === 'direct' ? 'Direct count' : 'Column/Beam Cage Bundle'}. Estimated total rebar mass: ~${steelCalculations.totalWeight.toFixed(1)} KG.`,
                      items: steelMode === 'direct' ? [
                        {
                          name: `High-Yield Steel ${selectedSteelGauge.toUpperCase()}`,
                          descriptionText: `Diameter: ${selectedSteelGauge.toUpperCase()} x length: 12 meters standard structural reinforcement bars`,
                          quantity: steelPiecesCount,
                          unitPrice: steelGauges[selectedSteelGauge].price,
                          totalPrice: steelCalculations.totalCost,
                        }
                      ] : [
                        {
                          name: `Cage Bundle: Main Reinforcement Y${cageMainGauge.toUpperCase()}`,
                          descriptionText: `Quantity: ${steelCalculations.mainPieces} pieces of Y${cageMainGauge.toUpperCase()} (12m)`,
                          quantity: steelCalculations.mainPieces,
                          unitPrice: Math.round(steelCalculations.mainPrice / steelCalculations.mainPieces),
                          totalPrice: steelCalculations.mainPrice,
                        },
                        {
                          name: `Cage Bundle: Stirrup Link Rings Y8`,
                          descriptionText: `Quantity: ${steelCalculations.stirrupPieces} pieces of Y8 links`,
                          quantity: steelCalculations.stirrupPieces,
                          unitPrice: Math.round(steelCalculations.stirrupPrice / steelCalculations.stirrupPieces),
                          totalPrice: steelCalculations.stirrupPrice,
                        },
                        ...(steelCalculations.bindingWireRolls > 0 ? [{
                          name: `Cage Bundle: Splicing Binding Wire (25kg Roll)`,
                          descriptionText: `Quantity: ${steelCalculations.bindingWireRolls} roll(s) of binding wire`,
                          quantity: steelCalculations.bindingWireRolls,
                          unitPrice: 5500,
                          totalPrice: steelCalculations.bindingWireRolls * 5500,
                        }] : [])
                      ]
                    });
                  }
                }}
                className="w-full bg-transparent hover:bg-brand-green-800 border border-brand-green-600 text-brand-green-100 hover:text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                📥 DOWNLOAD ESTIMATE QUOTATION PDF
              </button>
            )}

            <p className="text-[10px] text-brand-green-300 text-center leading-normal">
              {selectedTab === 'timber' && "*Calculations represent sawn-timber volumes. Planing (profiling) board-faces reduces final dimensions by ~0.25 inches."}
              {selectedTab === 'poles' && "*Treated eucalyptus poles lifespans exceed 15+ years under standard Kenyan soil conditions."}
              {selectedTab === 'fencing' && "*Galvanized chainlink is woven using premium rust-resistant wire perfect for coastal or humid highland fencing."}
              {selectedTab === 'steel' && "*Steel rebars are structural Grade 500N ribbed bars fully tested and compliant with KEBS standard KS EAS 18-1."}
            </p>

          </div>

        </div>

      </div>

      <StrengthMatrixModal
        isOpen={isStrengthMatrixOpen}
        onClose={() => setIsStrengthMatrixOpen(false)}
      />

    </div>
  );
}
