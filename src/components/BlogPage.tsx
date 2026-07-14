import { useState, useMemo } from 'react';
import { Search, Calendar, Clock, ArrowLeft, BookOpen, Tag, ArrowRight, CheckCircle2, User, HelpCircle, Flame } from 'lucide-react';
import { ProductCategory } from '../types';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'Guides' | 'Materials' | 'Fencing' | 'Water Storage';
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  featured: boolean;
  content: {
    sectionTitle: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  relatedCategory?: ProductCategory | 'all';
  keyTakeaways: string[];
}

const ARTICLES: Article[] = [
  {
    id: 'treated-fencing-poles-kajiado',
    title: 'Selection Guide: Choosing the Right Treated Eucalyptus Fencing Poles in Kenya',
    excerpt: 'Everything you need to know about Creosote vs Tanalith pressure treatment levels, soil contact classes, and pole sizing for maximum life expectancy.',
    category: 'Guides',
    readTime: '6 min read',
    date: 'July 10, 2026',
    author: 'Eng. Isaac Kiarie (Senior Yard Consultant)',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    featured: true,
    relatedCategory: 'poles',
    keyTakeaways: [
      'Always request Creosote-treated poles for standard agricultural boundaries in wet soils.',
      'A planting depth of at least 2.5 to 3 feet is critical for posts higher than 7 feet.',
      'Never trim or cut a treated pole at the bottom; doing so exposes untreated raw wood to termites.'
    ],
    content: [
      {
        sectionTitle: 'Understanding Vacuum Pressure Impregnation (Tanalith vs Creosote)',
        paragraphs: [
          'In Kenya, fencing poles are primarily made from eucalyptus trees. However, untreated eucalyptus decomposes within 24 months due to aggressive termite infestations and soil moisture. To solve this, poles must undergo industrial autoclaving.',
          'Creosote treatment uses a dark, coal-tar distillate that provides maximum water resistance and repels termites and fungi. It is ideal for general perimeter fencing, boundary marking, and power line poles. Tanalith (CCA), on the other hand, is a water-borne copper-chrome-arsenate solution that gives wood a light green tint. It is cleaner to handle, odorless, and suitable for farm boundaries or school compounds where people frequently touch the fence.'
        ]
      },
      {
        sectionTitle: 'Soil Contact Classes & Longevity Indices',
        paragraphs: [
          'When purchasing poles at Lema Kitengela, ensure they are treated under the proper hazard class (usually H4 for ground contact). Proper treatment allows poles to withstand constant moisture and aggressive soil chemistry for 15 to 25 years.',
          'Low-quality suppliers often "dip-treat" poles in drums of diluted oil. This only colors the outer 1mm of the timber, leaving the core vulnerable. Standard autoclave vacuum-pressure treatment forces preservatives deep into the sapwood, ensuring absolute structural integrity throughout.'
        ]
      },
      {
        sectionTitle: 'Step-by-Step Yard Planting Protocol',
        paragraphs: [
          'To ensure your fence line stays dead-straight and does not sag over time, follow this standard installation protocol:',
          '1. Spot excavation: Dig holes at least 60-90cm deep. For high-tension wire setups, corner poles must have anchor support.'
        ],
        bullets: [
          'Ensure the pole bottom has not been cut or shaved. Cut surfaces expose untreated wood and invite immediate decay.',
          'Backfill the first 15cm of the hole with gravel or aggregates to ensure water drains away from the timber butt.',
          'Pour a high-strength lean concrete mix (Ratio 1:3:6) around the middle collar to securely lock the post in place.',
          'Slope the top concrete surface outward so rain drains away from the wooden trunk.'
        ]
      }
    ]
  },
  {
    id: 'ribbed-steel-rebars-foundations',
    title: 'Reinforcing Ribbed Steel Rebar Gauges (Y8, Y10, Y12, Y16) Explained',
    excerpt: 'How standard high-yield ribbed steel rebars prevent structural shifting in Kitengelas notorious black cotton soils.',
    category: 'Materials',
    readTime: '5 min read',
    date: 'June 28, 2026',
    author: 'Arch. Peter Mwangi',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    featured: false,
    relatedCategory: 'steel',
    keyTakeaways: [
      'Ribbed surfaces are essential as they increase bonding friction with the surrounding concrete mix.',
      'Y8 is predominantly utilized for stirrups (links) to hold main column cages.',
      'Y12 and Y16 rebars form the primary longitudinal reinforcement in heavy load-bearing structural columns.'
    ],
    content: [
      {
        sectionTitle: 'The Role of High-Yield Reinforcement in Concrete',
        paragraphs: [
          'Concrete has excellent compressive strength, meaning it can support immense downward loads. However, its tensile strength (ability to withstand stretching, bending, or lateral shifting) is extremely weak. Steel reinforcement bars (rebars) provide the necessary tensile strength, allowing structures to absorb lateral shear forces.',
          'Kitengela and the wider Kajiado county are famous for expansive black cotton soils. These soils swell massively when wet and shrink drastically when dry, causing serious ground movement. Without standard ribbed steel rebars, foundations easily crack and buildings quickly fail.'
        ]
      },
      {
        sectionTitle: 'Sizing Guidelines: Choosing the Right Gauge',
        paragraphs: [
          'Every concrete element on a project has distinct load-bearing responsibilities, requiring different rebar diameters:',
          '- Y8 (8mm Rebars): Primarily used to shape rings (stirrups) that wrap around vertical columns, resisting shear stresses and holding larger longitudinal bars in a perfect cage alignment.',
          '- Y10 (10mm Rebars): Suitable for light floor slabs, lintels over doors, and small septic tank reinforcement mesh grids.',
          '- Y12 (12mm Rebars): The standard requirement for multi-story column grids, ring beams, and foundation pad footings on light-to-medium structures.',
          '- Y16 (16mm Rebars): Vital for heavily loaded columns, cantilevers, and structural beams carrying significant spans.'
        ]
      },
      {
        sectionTitle: 'Understanding Ribs vs. Plain Smooth Bars',
        paragraphs: [
          'Always avoid plain smooth steel bars for heavy structural elements. High-yield ribbed bars are manufactured with cold-rolled deformations on the surface. These ridges mechanically lock into the concrete paste, preventing slipping under stress. Our rebars at Lema Kitengela are fully KEBS certified, ensuring consistent chemical composition, carbon ratios, and tensile yield standards.'
        ]
      }
    ]
  },
  {
    id: 'cypress-vs-mahogany-trusses',
    title: 'The Ultimate Cypress vs. Mahogany Timber Sizing & Spacing Manual',
    excerpt: 'Truss design, structural cypress load ratios, and selecting the correct fascia boards to avoid roof bowing.',
    category: 'Guides',
    readTime: '7 min read',
    date: 'June 15, 2026',
    author: 'Daniel Lema (Yard Director)',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    featured: false,
    relatedCategory: 'timber',
    keyTakeaways: [
      'Cypress is highly cost-effective, structurally stable, and lightweight, making it ideal for trusses.',
      'Mahogany and Camphor should be prioritized for exterior fascia boards and joinery to prevent decay.',
      'Standard truss spacing in Kenya should be 1.2 meters center-to-center for safety.'
    ],
    content: [
      {
        sectionTitle: 'Roof Truss Selection: Why Cypress Dominates',
        paragraphs: [
          'When designing a roof truss in Kenya, structural weight, cost, and straightness are key factors. Cypress is the standard species of choice. It is lightweight, holds nails securely, and has natural straight-grain structures that resist bowing when seasoned.',
          'Cypress is typically available in dimensions of 2"x2", 3"x2", 4"x2", and 6"x2". For typical residential roofs, 4"x2" cypress timber forms the primary rafters and tie beams, while 3"x2" or 2"x2" cypress is utilized for internal queen posts, struts, and bracing members.'
        ]
      },
      {
        sectionTitle: 'Planing and Timber Sizing Calculations',
        paragraphs: [
          'Timbers in Kenya are sold in standard lengths, usually from 12 feet up to 18 feet. When estimating timber requirements for a roof, the formula for board-feet must be utilized:',
          'Board-Feet = [Thickness (inches) × Width (inches) × Length (feet)] / 12',
          'At Lema Timber, our on-site team provides custom wood planing. Planing shaves off rough saw marks, creating clean, uniform timber surfaces. It is essential for exposed trusses, ceiling grids, and furniture making.'
        ]
      },
      {
        sectionTitle: 'Why Mahogany Wins the Fascia Battle',
        paragraphs: [
          'While cypress is great for dry internal trusses, it is vulnerable when exposed to weather. Fascia boards (the visible boards mounted on the edge of the roof eaves to hold the gutters) face constant rain and sun.',
          'For fascia, always select Mahogany or Camphor. Mahogany contains rich natural oils and high density that repels rain, preventing rot and warp. Mounting a 12"x1" or 8"x1" Mahogany fascia board guarantees a perfectly straight, beautiful eave line that lasts for decades.'
        ]
      }
    ]
  },
  {
    id: 'water-tank-base-masonry-rules',
    title: 'UV-Stabilized Plastic Water Tanks: Calculating Storage & Base Masonry Rules',
    excerpt: 'Avoid tank rupture! How to design a perfectly flat concrete plinth and select the right capacity for water security.',
    category: 'Water Storage',
    readTime: '4 min read',
    date: 'May 30, 2026',
    author: 'Eng. Caleb Kipyegon',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    featured: false,
    relatedCategory: 'tanks',
    keyTakeaways: [
      'A 10,000L tank weighs exactly 10 metric tons when full, requiring a rock-solid foundation.',
      'Dual-layer construction with a black exterior block UV rays to eliminate algae and bacteria growth.',
      'The base plinth must be smooth concrete, absolutely flat, and slightly wider than the tank.'
    ],
    content: [
      {
        sectionTitle: 'The Physics of Heavy Water Storage',
        paragraphs: [
          'Many home developers purchase a water tank, drop it on a heap of loose soil or a few wooden planks, and fill it. Within six months, the bottom of the tank splits, wasting thousands of shillings.',
          'Water has a heavy mass: 1 Liter equals exactly 1 Kilogram. That means a 5,000L tank weighs 5 tons, and a 10,000L tank weighs 10 tons. This weight creates immense downward pressure on the plastic bottom. Any pebble, protruding root, or uneven slope underneath will puncture the base of the tank.'
        ]
      },
      {
        sectionTitle: 'Base Masonry Rules for Perfect Support',
        paragraphs: [
          'To ensure your cylindrical tank survives its full 20+ year lifetime, the base plinth must be built correctly:',
          '- Rigid Concrete Slab: Construct a solid concrete slab at least 15cm (6 inches) thick, reinforced with a grid of steel bars (e.g., Y10 rebars) to distribute the massive weight.',
          '- Perfect Levelling: Use a spirit level to make sure the slab is completely flat. Slanted bases concentrate water weight on one side, causing the tank wall to buckle over time.',
          '- Zero Protrusions: The concrete finish must be smooth. Any gravel or aggregate sticking out will act like a knife-point under tons of water.',
          '- Oversized Width: The slab diameter must be at least 15cm wider than the tank diameter on all sides to prevent edge tipping.'
        ]
      },
      {
        sectionTitle: 'Dual-Layer Food-Grade Security',
        paragraphs: [
          'At LEMA Kitengela, we supply dual-layer cylindrical tanks. The black outer layer absorbs sunlight, preventing UV rays from penetrating and heating the water. This UV block stops green algae from photosynthesizing and multiplying. The inner food-grade white layer is seamless and chemically inert, ensuring stored water remains clean, odorless, and perfectly safe for domestic washing and drinking.'
        ]
      }
    ]
  },
  {
    id: 'fencing-kitengela-plots',
    title: 'Fencing Kitengela Plots: Best Practices for Chain-Link and Wire Tensioning',
    excerpt: 'Plot boundary standard spacing, corner H-bracing, and selecting wire gauges for durable yard protection.',
    category: 'Fencing',
    readTime: '5 min read',
    date: 'May 14, 2026',
    author: 'Samson Kiprotich (Master Fence Installer)',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
    featured: false,
    relatedCategory: 'fencing',
    keyTakeaways: [
      'Standard post-to-post spacing is 8 feet (2.4 meters) for robust structural support.',
      'Corner poles must have double-strut H-bracing to resist strong wire tension.',
      'Galvanized chain-link mesh prevents rusting in saline coastal or highland soils.'
    ],
    content: [
      {
        sectionTitle: 'Sizing Your Plot Fencing Boundary',
        paragraphs: [
          'Most standard plots in Kitengela are sized at 50ft by 100ft (approx. 1/8th of an acre). The total perimeter of a 50x100 plot is exactly 300 linear feet (approx. 92 meters). To fence this area securely, you need about 38 to 40 fencing posts spaced at 8-foot center-to-center intervals.',
          'Spacing posts wider than 10 feet saves money initially but causes the chain-link mesh to sag in the middle under wind loads and gravity. This makes your fence incredibly easy to breach.'
        ]
      },
      {
        sectionTitle: 'The Secret to Slack-Free Fencing: H-Bracing',
        paragraphs: [
          'A fence is only as strong as its corner posts. When you stretch galvanized line wire and pull the chain-link tight, it creates massive inward pressure on the ends of the fence line. Without support, the end poles will bow inward, causing the whole boundary to go slack.',
          'Professional installers use "H-Bracing" or "Strut-Bracing." Every corner, end, and gate post must have an additional diagonal bracing pole set at a 45-degree angle. This diagonal transfer of stress pushes down into the ground, neutralizing the wire tension and keeping the top line straight.'
        ]
      },
      {
        sectionTitle: 'Selecting Wire Gauges & Mesh Sizes',
        paragraphs: [
          'Chain-link rolls are sold by height (typically 4ft, 5ft, 6ft, or 8ft) and wire thickness (gauge). For residential boundary fencing, a 12.5 gauge or 14 gauge galvanized wire is the standard balance of affordability and durability. High-tensile line wire (typically gauge 12) is then stretched horizontally across the top, middle, and bottom of the poles to anchor the chain-link mesh.'
        ]
      }
    ]
  }
];

interface BlogPageProps {
  onBackToHome: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenEstimator: () => void;
}

export default function BlogPage({ onBackToHome, onSelectCategory, onOpenEstimator }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchesTag = selectedTag === 'All' || art.category === selectedTag;
      const matchesSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.some((sec) => sec.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTag && matchesSearch;
    });
  }, [selectedTag, searchQuery]);

  const featuredArticle = useMemo(() => {
    return ARTICLES.find((art) => art.featured) || ARTICLES[0];
  }, []);

  return (
    <div className="bg-[#FAF9F4] min-h-screen pb-16 font-sans">
      
      {/* Blog Header/Hero banner */}
      <div className="bg-brand-green-800 text-white py-8 relative overflow-hidden border-b border-brand-green-700">
        <div className="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none timber-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <button 
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-brand-gold-100 hover:text-white font-bold mb-4 bg-brand-green-700/50 hover:bg-brand-green-700 px-3 py-1.5 rounded-lg border border-brand-green-600 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store Home
            </button>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Articles & <span className="text-brand-gold-500">Construction Blog</span>
            </h1>
            <p className="text-brand-green-100 text-sm mt-2 max-w-xl font-light">
              Expert guides, lumber calculations, site prep strategies, and fencing manual tutorials written specifically for Kenyan builders.
            </p>
          </div>
          <div className="bg-brand-green-900/60 border border-brand-green-700 rounded-xl p-4 max-w-xs text-xs space-y-1.5">
            <span className="text-brand-gold-500 font-bold tracking-wider uppercase block">Need Material Pricing?</span>
            <p className="text-brand-green-200">Our real-time Lumber Board-Feet Calculator integrates live pricing directly based on yard dimensions.</p>
            <button 
              onClick={onOpenEstimator}
              className="text-white hover:text-brand-gold-500 font-bold flex items-center gap-1 cursor-pointer pt-1"
            >
              Launch Estimator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {activeArticle ? (
        /* ARTICLE DETAILED READ VIEW */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <button
            onClick={() => setActiveArticle(null)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 hover:text-brand-gold-600 mb-6 cursor-pointer bg-brand-green-100/50 hover:bg-brand-green-100 px-3.5 py-2 rounded-lg border border-brand-green-200/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles List
          </button>

          <article className="bg-white rounded-3xl border border-brand-green-200/50 shadow-xl overflow-hidden">
            
            {/* Lead Image & Info overlay */}
            <div className="relative h-64 sm:h-96 bg-brand-green-950">
              <img 
                src={activeArticle.imageUrl} 
                alt={activeArticle.title} 
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-brand-gold-500 text-brand-green-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
                  {activeArticle.title}
                </h2>
              </div>
            </div>

            {/* Author Meta Bar */}
            <div className="bg-[#FAF8F3]/80 px-6 sm:px-8 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="bg-brand-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{activeArticle.author}</p>
                  <p className="text-[10px]">KEBS Registered Consultant</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {activeArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeArticle.readTime}
                </span>
              </div>
            </div>

            {/* Main Rich text body */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Introduction/Excerpt Callout */}
              <p className="text-slate-600 font-sans italic text-base leading-relaxed border-l-4 border-brand-gold-500 pl-4 py-1">
                "{activeArticle.excerpt}"
              </p>

              {/* Main Contents mapping */}
              <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                {activeArticle.content.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-brand-green-950 border-b border-brand-green-100 pb-2">
                      {section.sectionTitle}
                    </h3>
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-600 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="list-none space-y-2.5 pl-1.5 pt-2">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-normal">
                            <span className="text-brand-gold-500 font-bold shrink-0 mt-0.5">✔</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="bg-brand-green-50/70 border border-brand-green-200/60 rounded-2xl p-6 space-y-4">
                <h4 className="font-display font-bold text-base text-brand-green-950 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-brand-gold-500" />
                  KEY BUILDING TAKEAWAYS
                </h4>
                <div className="grid grid-cols-1 gap-3 text-xs sm:text-sm text-slate-600">
                  {activeArticle.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA to catalog */}
              {activeArticle.relatedCategory && (
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-brand-green-950">Ready to buy the required materials?</h4>
                    <p className="text-xs text-slate-500">We keep high stocks of all certified timber, poles, steel and tanks mentioned in this article.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {activeArticle.relatedCategory === 'timber' && (
                      <button
                        onClick={onOpenEstimator}
                        className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-950 font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Calculate Board-Feet
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (activeArticle.relatedCategory) {
                          onSelectCategory(activeArticle.relatedCategory === 'all' ? 'all' : activeArticle.relatedCategory);
                        }
                        onBackToHome();
                        setTimeout(() => {
                          const catSec = document.getElementById('catalog-store');
                          if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="bg-brand-green-800 hover:bg-brand-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                    >
                      Browse Material Catalog
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </article>

          {/* More Articles List */}
          <div className="mt-12 space-y-6">
            <h3 className="font-display font-extrabold text-xl text-brand-green-950">More Building Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ARTICLES.filter((art) => art.id !== activeArticle.id).map((art) => (
                <div 
                  key={art.id} 
                  onClick={() => {
                    setActiveArticle(art);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-slate-200/75 hover:border-brand-green-300 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                >
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-20 h-20 object-cover rounded-xl shrink-0 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-brand-gold-600 uppercase tracking-wider block">
                      {art.category}
                    </span>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 group-hover:text-brand-green-800 line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {art.date} · {art.readTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* ARTICLES MAIN GRID VIEWER */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Quick Filters + Search bar */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 rounded-2xl border border-brand-green-200/50 shadow-xs">
            
            <div className="flex flex-wrap gap-1 bg-brand-green-50 p-1 rounded-xl border border-brand-green-100/50">
              {['All', 'Guides', 'Materials', 'Fencing', 'Water Storage'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    selectedTag === tag
                      ? 'bg-brand-green-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles on timber, rebar, spacing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-3 border border-slate-200 rounded-xl focus:border-brand-green-700 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-800"
              />
            </div>

          </div>

          {/* Featured Article Banner Card */}
          {filteredArticles.length > 0 && selectedTag === 'All' && !searchQuery && (
            <div 
              onClick={() => {
                setActiveArticle(featuredArticle);
                window.scrollTo({ top: 0 });
              }}
              className="bg-white rounded-3xl border border-brand-green-200/40 overflow-hidden shadow-md hover:shadow-xl hover:border-brand-green-300 transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
            >
              <div className="lg:col-span-6 relative h-64 lg:h-auto min-h-[280px] bg-brand-green-950">
                <img 
                  src={featuredArticle.imageUrl} 
                  alt={featuredArticle.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-brand-gold-500 text-brand-green-950 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Featured Article
                </span>
              </div>
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{featuredArticle.category}</span>
                  <span>·</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-green-950 group-hover:text-brand-green-800 leading-tight">
                  {featuredArticle.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="bg-brand-green-100 text-brand-green-900 rounded-full w-6 h-6 flex items-center justify-center font-bold font-display text-[10px]">
                      L
                    </div>
                    <span className="text-slate-600 font-semibold">{featuredArticle.author}</span>
                  </div>
                  <span className="text-brand-green-800 text-xs font-bold group-hover:text-brand-gold-600 flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main List Grid */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl bg-white p-6">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-500 text-sm font-semibold">No articles match your search parameters.</p>
              <button
                onClick={() => {
                  setSelectedTag('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => {
                    setActiveArticle(art);
                    window.scrollTo({ top: 0 });
                  }}
                  className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-xs hover:shadow-lg hover:border-brand-green-200 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative h-48 bg-brand-green-950">
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-brand-green-900/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-green-700/60">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>{art.date}</span>
                        <span>·</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-brand-green-800 line-clamp-2 leading-tight">
                        {art.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-normal line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-600 line-clamp-1">{art.author.split(' (')[0]}</span>
                      <span className="text-brand-green-800 font-bold group-hover:text-brand-gold-600 flex items-center gap-0.5 shrink-0">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
