import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Award, Construction, Truck, Users, MapPin, Phone, Ruler } from 'lucide-react';

interface HeroProps {
  onOpenEstimator: () => void;
  onExploreProducts: () => void;
}

export default function Hero({ onOpenEstimator, onExploreProducts }: HeroProps) {
  const [activeIconIdx, setActiveIconIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIconIdx((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const renderActiveIcon = () => {
    const iconClass = "w-7 h-7 text-brand-green-950 transition-all duration-300 transform scale-110";
    switch (activeIconIdx) {
      case 0:
        return <Calculator className={iconClass} />;
      case 1:
        return <Ruler className={iconClass} />;
      case 2:
        return <Truck className={iconClass} />;
      default:
        return <Calculator className={iconClass} />;
    }
  };

  const highlights = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-gold-500" />,
      title: 'QUALITY ASSURED',
      desc: 'Top-tier structural materials complying with national standards.',
    },
    {
      icon: <Award className="w-8 h-8 text-brand-gold-500" />,
      title: 'STRONG & DURABLE',
      desc: 'Selected and treated wood & steel built for lifetime endurance.',
    },
    {
      icon: <Construction className="w-8 h-8 text-brand-gold-500" />,
      title: 'BUILT FOR EVERY PROJECT',
      desc: 'Catering to large commercial developments & home repairs alike.',
    },
    {
      icon: <Truck className="w-8 h-8 text-brand-gold-500" />,
      title: 'RELIABLE SUPPLY',
      desc: 'Massive yard inventory based in Kitengela Town, zero delays.',
    },
  ];

  return (
    <section className="relative overflow-hidden font-sans bg-brand-green-900 text-white" id="hero-home">
      
      {/* Decorative wood rings/forest abstract backdrop overlay */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none timber-pattern"></div>
      
      {/* Dynamic diagonal accent line */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-gold-500/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Primary Brand Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-brand-green-800 border border-brand-green-700 rounded-full px-4 py-1.5 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-500 animate-ping"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-green-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-gold-500" />
                Kitengela Town, Kenya
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                LEMA <br />
                <span className="text-brand-gold-500">TIMBER & SUPPLIES</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-brand-gold-500"></div>
                <p className="text-sm font-semibold tracking-[0.25em] text-brand-green-200 uppercase">
                  A Timeless Vision
                </p>
                <div className="h-0.5 w-12 bg-brand-gold-500"></div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-brand-green-100 font-light leading-relaxed max-w-xl">
              We supply the finest selection of premium-grade Cypress & Mahogany structural timbers, high-yield steel bars (Y8-Y16), treated fencing poles, chain-link wire fences, and heavy-duty water tanks in Kitengela and surrounding regions.
            </p>

            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
                <button
                  onClick={onExploreProducts}
                  className="bg-brand-gold-500 hover:bg-brand-gold-600 active:bg-brand-gold-700 text-brand-green-950 font-black px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-base cursor-pointer shrink-0"
                  id="hero-btn-catalog"
                >
                  Browse Online Store
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Standalone large animated icon box, aligned perfectly next to the button */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-brand-gold-400 shrink-0 select-none transition-all hover:scale-105 duration-300">
                    {renderActiveIcon()}
                  </div>
                  <button
                    onClick={onOpenEstimator}
                    className="flex-1 bg-brand-green-800 hover:bg-brand-green-700 text-white font-black px-5 py-4 sm:py-4.5 rounded-xl border border-brand-green-600 hover:border-brand-gold-500/50 shadow-md transition-all text-[11px] sm:text-xs md:text-sm tracking-wider leading-snug cursor-pointer text-left flex items-center justify-between group min-w-0"
                    id="hero-btn-calculator"
                  >
                    <span>
                      TIMBER & MATERIALS SIZE, PRICE AND DELIVERY COST CALCULATOR
                    </span>
                    <ArrowRight className="w-4.5 h-4.5 ml-2.5 text-brand-gold-500 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>

              {/* High-visibility Call to Action (CTA) box below the buttons */}
              <div className="bg-brand-green-800/60 backdrop-blur-md border border-brand-green-700 rounded-2xl p-4 shadow-lg flex items-start sm:items-center gap-4 max-w-3xl animate-fadeIn">
                <div className="text-2xl shrink-0 p-2.5 bg-brand-green-900 border border-brand-green-700/60 rounded-xl text-brand-gold-500 select-none font-mono">
                  📋
                </div>
                <div className="space-y-1">
                  <h4 className="text-brand-gold-500 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                    GET ACCURATE QUOTATIONS AND DELIVERY COSTS IN 4 EASY STEPS
                  </h4>
                  <p className="text-xs text-brand-green-100 font-bold tracking-wide leading-relaxed uppercase">
                    DOWNLOAD QUOTATION PDF OR PROCEED TO CHECK OUT
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Hotline Snippet */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-brand-green-200 border-t border-brand-green-800 max-w-xl">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold-500" />
                <span>Hotline: <strong className="font-mono text-white text-sm">+254 729 352131</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold-500" />
                <span>Yard: <strong className="text-white text-sm">Kitengela Town (Along Namanga Rd)</strong></span>
              </div>
            </div>

          </div>

          {/* Right Image/Mockup Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-green-800 bg-brand-green-950 p-1 group">
              
              {/* Graphic Title Overlay mimicking the image */}
              <div className="absolute top-4 left-4 z-20 bg-brand-green-900/90 backdrop-blur-sm border border-brand-green-700 text-white rounded-lg p-3 shadow-md max-w-xs">
                <div className="text-[10px] text-brand-gold-500 uppercase font-bold tracking-widest">ONE-STOP YARD</div>
                <div className="text-base font-display font-bold leading-tight">LEMA Kitengela Base</div>
                <div className="text-[11px] text-brand-green-200 mt-1">Visit our physical yard along Namanga Road for wholesale profiling and cutting services.</div>
              </div>

              {/* Timber Yard Visual Block */}
              <div className="relative h-96 sm:h-[420px] rounded-xl overflow-hidden bg-brand-green-900">
                <img 
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800" 
                  alt="Lema Timber Yard in Kitengela" 
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950 via-transparent to-brand-green-950/40"></div>
              </div>

              {/* Bottom Slogan Ribbon */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-brand-gold-500 text-brand-green-950 text-center py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md">
                "BUILDING STRONGER. BUILDING TOGETHER."
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white text-brand-green-950 py-6 border-y border-brand-green-100" id="brand-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-green-900">
              WHY CHOOSE LEMA TIMBER & SUPPLIES?
            </h2>
            <p className="text-sm text-brand-green-600 mt-2 max-w-xl mx-auto">
              We stand by our commitment to quality, durability, and reliable construction deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-brand-green-50 border border-brand-green-100 rounded-xl p-5 text-center flex flex-col items-center space-y-3 transition-all hover:shadow-md hover:border-brand-green-200/80 group"
                id={`value-badge-${idx}`}
              >
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-display font-extrabold text-[11px] sm:text-xs tracking-wider text-brand-green-900 uppercase">
                  {item.title}
                </h3>
                <p className="text-[11px] text-brand-green-700 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stats Ribbon mimicking bottom green bar of image */}
          <div className="mt-6 bg-brand-green-800 text-white rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-brand-green-700">
            <div className="flex flex-col text-center md:text-left space-y-1">
              <span className="text-brand-gold-500 font-display font-extrabold text-sm tracking-widest uppercase">
                ONE-STOP SHOP
              </span>
              <h4 className="text-lg sm:text-xl font-bold">
                TIMBER, HARDWARE, STEEL & WATER HARVESTING SOLUTIONS!
              </h4>
            </div>
            <div className="h-px w-full md:w-px md:h-12 bg-brand-green-700"></div>
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <span className="text-xs text-brand-green-200">Call/WhatsApp Sales Inquiry</span>
              <a 
                href="https://wa.me/254729352131"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xl sm:text-2xl font-black text-brand-gold-100 hover:text-white transition-colors"
              >
                +254 729 352131
              </a>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
