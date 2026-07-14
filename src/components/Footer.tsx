import { Phone, MapPin, Clock, Mail, ShieldCheck, Map, ArrowUpRight, Compass } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenEstimator: () => void;
}

export default function Footer({ onScrollToSection, onOpenEstimator }: FooterProps) {
  return (
    <footer className="bg-brand-green-950 text-white font-sans border-t border-brand-green-800" id="contact-footer">
      
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Col 1: About & Motto */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-lg p-1">
                <svg className="w-full h-full text-brand-green-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 15L85 75H15L50 15Z" fill="currentColor" opacity="0.15" />
                  <path d="M50 15L70 55H30L50 15Z" fill="currentColor" />
                  <path d="M35 45L60 85H10L35 45Z" fill="currentColor" className="text-brand-gold-500" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg tracking-wider text-white">LEMA TIMBER</span>
                <span className="text-[9px] text-brand-green-200 tracking-widest uppercase font-bold leading-none">A Timeless Vision</span>
              </div>
            </div>

            <p className="text-xs text-brand-green-200 leading-relaxed max-w-sm">
              LEMA Timber and Supplies is Kitengela’s premier supplier of high-yield structural steel, pressure-treated fencing eucalyptus poles, chain link wire systems, and heavy-duty water storage tanks. We deliver across Kajiado, Machakos, and Nairobi counties.
            </p>

            <div className="text-xs bg-brand-green-900 border border-brand-green-800 rounded-lg p-3 text-brand-gold-100 font-bold inline-flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-gold-500" />
              <span>BUILDING STRONGER. BUILDING TOGETHER.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold-500 border-b border-brand-green-800 pb-1">
              YARD SECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-green-200 font-medium">
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog-store')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Products Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenEstimator}
                  className="hover:text-white transition-colors text-brand-gold-100 font-semibold cursor-pointer"
                >
                  Lumber Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('brand-values')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Quality Standards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('about-lema')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Business
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Yard Contacts */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold-500 border-b border-brand-green-800 pb-1">
              YARD CONTACTS
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4.5 h-4.5 text-brand-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-brand-green-100 font-semibold leading-snug">
                  Kitengela Town Yard,<br />
                  Namanga Highway Road (Opposite Kitengela Mall),<br />
                  Kitengela, Kenya.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4.5 h-4.5 text-brand-gold-500 flex-shrink-0" />
                <a 
                  href="tel:+254729352131"
                  className="text-white hover:text-brand-gold-100 font-mono font-bold text-sm transition-colors"
                >
                  +254 729 352131
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-brand-gold-500 flex-shrink-0" />
                <a 
                  href="mailto:info@lematimber.co.ke"
                  className="text-brand-green-100 hover:text-white transition-colors"
                >
                  sales@lematimber.co.ke
                </a>
              </li>
              <li className="flex items-start gap-2 text-brand-green-200">
                <Clock className="w-4.5 h-4.5 text-brand-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Monday - Saturday:</strong>
                  <div className="text-[11px] font-mono mt-0.5">7:30 AM — 6:00 PM</div>
                  <div className="text-[10px] text-amber-500 mt-0.5">Sunday: Closed (Rest Day)</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Stylized Yard Map Widget */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold-500 border-b border-brand-green-800 pb-1">
              YARD DIRECTIONS
            </h4>
            
            {/* Visual Vector Mock Map */}
            <div className="bg-brand-green-900 border border-brand-green-800 rounded-xl p-3 space-y-2.5 relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-brand-green-200">
                  <Compass className="w-3.5 h-3.5 text-brand-gold-500 animate-spin-slow" />
                  <span>GPS: Kitengela Town</span>
                </div>
                <span className="text-[9px] bg-brand-green-800 text-brand-gold-100 px-1.5 py-0.5 rounded font-mono">Namanga Rd</span>
              </div>

              {/* Visual mini-map block */}
              <div className="h-28 bg-slate-100 rounded-lg relative overflow-hidden flex items-center justify-center p-1">
                {/* Simulated Grid Streets */}
                <div className="absolute inset-0 opacity-20 bg-emerald-950 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1c523e 2px, transparent 2px)', backgroundSize: '15px 15px' }}></div>
                
                {/* Named Roads on Canvas */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-300 transform -translate-y-1/2 text-[8px] font-bold text-slate-600 font-mono flex items-center justify-center tracking-wider shadow-inner">
                  NAMANGA ROAD (A104 HIGHWAY)
                </div>
                <div className="absolute top-0 bottom-0 left-1/3 w-3.5 bg-slate-200 text-[6px] font-bold text-slate-500 font-mono flex items-center justify-center transform rotate-12">
                  ATHI RIVER RD
                </div>

                {/* Map landmarks overlay */}
                <div className="absolute bottom-2 left-2 bg-white/90 border border-slate-300 rounded text-[7px] p-1 font-bold text-slate-700 shadow-xs">
                  Kitengela Mall
                </div>
                
                {/* LEMA Pinpoint */}
                <div className="absolute top-1/3 right-8 flex flex-col items-center z-10 animate-pulse">
                  <MapPin className="w-6 h-6 text-red-600 fill-red-600 drop-shadow-sm" />
                  <span className="bg-brand-green-800 text-white font-display text-[8px] font-black px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider border border-brand-gold-500 mt-0.5">
                    LEMA YARD
                  </span>
                </div>
              </div>

              {/* External Navigation trigger */}
              <a 
                href="https://maps.google.com/?q=-1.4800,36.9600" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 border border-brand-green-700 transition-colors shadow-sm"
              >
                <Map className="w-3 h-3 text-brand-gold-500" />
                Open in Google Maps
                <ArrowUpRight className="w-3 h-3 text-slate-300" />
              </a>

            </div>

          </div>

        </div>
      </div>

      {/* Sub-Footer Copyright bar */}
      <div className="bg-brand-green-900 py-6 border-t border-brand-green-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-green-200">
          
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} LEMA Timber and Supplies. All rights reserved.
            <span className="text-[10px] text-brand-green-300/60 block mt-0.5">Designed with absolute precision under a timeless structural vision.</span>
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] justify-center">
            <span className="border-r border-brand-green-800 pr-4">Kitengela Town Yard</span>
            <span className="border-r border-brand-green-800 pr-4">KEBS Certified Materials</span>
            <span>Tel: +254 729 352131</span>
          </div>

        </div>
      </div>

    </footer>
  );
}
