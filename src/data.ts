import { Product } from './types';

export const WOOD_TYPES = [
  { name: 'Cypress (Softwood - Premium Structural)', pricePerBoardFoot: 180, weightPerBoardFootKg: 0.65, description: 'Excellent resistance to warping, ideal for roof trusses, purlins, and general framing.' },
  { name: 'Pine (Softwood - Economical Structural)', pricePerBoardFoot: 145, weightPerBoardFootKg: 0.58, description: 'Lightweight and budget-friendly. Excellent for ceiling brands, temporary structures, and formwork.' },
  { name: 'Mahogany (Hardwood - Finishing)', pricePerBoardFoot: 380, weightPerBoardFootKg: 0.85, description: 'Gorgeous grain, heavy, and extremely durable. Perfect for doors, furniture, fascia boards, and luxury paneling.' },
  { name: 'Blue Gum / Eucalyptus (Hardwood - High Load)', pricePerBoardFoot: 160, weightPerBoardFootKg: 0.95, description: 'Very heavy and strong, high structural strength. Ideal for heavy load beams and columns.' }
];

export const STANDARD_SIZES = [
  { label: '2" x 2" (Rafters / Ceilings)', thickness: 2, width: 2 },
  { label: '3" x 2" (Purlins)', thickness: 3, width: 2 },
  { label: '4" x 2" (Roof Trusses / Framing)', thickness: 4, width: 2 },
  { label: '6" x 2" (Beams / Joists)', thickness: 6, width: 2 },
  { label: '8" x 2" (Heavy Joists)', thickness: 8, width: 2 },
  { label: '6" x 1" (Fascia Boards / Paneling)', thickness: 1, width: 6 },
  { label: '8" x 1" (Fascia Boards / Shelving)', thickness: 1, width: 8 },
  { label: '12" x 1" (Wide Planks)', thickness: 1, width: 12 }
];

export const KENYAN_TOWNS = [
  { name: 'Kitengela Town', cost: 0, time: 'Same day (Free Pickup / Low cost delivery)' },
  { name: 'Athi River', cost: 1500, time: 'Same day or next day' },
  { name: 'Syokimau', cost: 2500, time: '1-2 business days' },
  { name: 'Isinya', cost: 2000, time: 'Same day or next day' },
  { name: 'Kajiado Town', cost: 4000, time: '1-2 business days' },
  { name: 'Nairobi CBD & Eastlands', cost: 3500, time: '1-2 business days' },
  { name: 'Nairobi Westlands / Karen', cost: 4500, time: '1-2 business days' },
  { name: 'Machakos Town', cost: 5000, time: '2 business days' }
];

export const PRODUCTS: Product[] = [
  // --- STEEL BARS ---
  {
    id: 'steel-rebar-y8',
    name: 'High-Yield Steel Rebar Y8 (8mm)',
    category: 'steel',
    basePrice: 650,
    unit: 'per 12m bar',
    description: 'High-strength deformed reinforcing steel bar conforming to BS 4449. Used primarily for stirrups (links) in beams, columns, and light slab reinforcements.',
    specs: ['Diameter: 8mm', 'Length: Standard 12 Meters', 'Grade: 500N/mm²', 'Highly weldable and bendable'],
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock'
  },
  {
    id: 'steel-rebar-y10',
    name: 'High-Yield Steel Rebar Y10 (10mm)',
    category: 'steel',
    basePrice: 1050,
    unit: 'per 12m bar',
    description: 'Medium-weight structural reinforcing steel rebar. Essential for residential suspended slabs, lintels, and foundation beams.',
    specs: ['Diameter: 10mm', 'Length: Standard 12 Meters', 'Ribbed profile for maximum concrete bonding', 'Grade: 500N/mm²'],
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock'
  },
  {
    id: 'steel-rebar-y12',
    name: 'High-Yield Steel Rebar Y12 (12mm)',
    category: 'steel',
    basePrice: 1480,
    unit: 'per 12m bar',
    description: 'Heavy structural ribbed reinforcing rebar. The standard choice for columns, primary beam reinforcement, and multi-story foundations.',
    specs: ['Diameter: 12mm', 'Length: Standard 12 Meters', 'Conforms to KEBS and British Standards', 'High tensile strength'],
    imageUrl: 'https://images.unsplash.com/photo-1513828583848-6b2a04c29a9a?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock'
  },
  {
    id: 'steel-rebar-y16',
    name: 'High-Yield Steel Rebar Y16 (16mm)',
    category: 'steel',
    basePrice: 2650,
    unit: 'per 12m bar',
    description: 'Super-strength structural rebar for heavy engineering projects, commercial structures, columns, and retaining walls with extreme load profiles.',
    specs: ['Diameter: 16mm', 'Length: Standard 12 Meters', 'Grade: 500N/mm² Ribbed', 'Tested for maximum yield strength'],
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock'
  },
  {
    id: 'steel-binding-wire',
    name: 'G.I. Binding Wire (25kg Roll)',
    category: 'steel',
    basePrice: 3800,
    unit: 'per 25kg roll',
    description: 'Soft annealed galvanized iron binding wire. Highly flexible and easy to tie, perfect for securing reinforcing bars before concrete casting.',
    specs: ['Weight: 25 Kilograms', 'Gauge: 16 SWG', 'Soft annealed for manual tying ease', 'Rust resistant coating'],
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Pack Size',
        values: ['25kg Full Roll', '5kg Mini Coil', '1kg Budget Roll'],
        priceModifiers: [0, -2900, -3600]
      }
    ]
  },

  // --- TIMBER POLES ---
  {
    id: 'poles-treated-4inch',
    name: 'Treated Timber Fencing Pole (4" Diameter)',
    category: 'poles',
    basePrice: 850,
    unit: 'per pole',
    description: 'Pressure-treated eucalyptus timber poles. Impregnated with Creosote / Tanalith-C to prevent termites, decay, and environmental rot. Perfect for standard farm and home fencing.',
    specs: ['Diameter: 3.5" to 4.5"', 'Treated to H4 Hazard Class (Soil Contact)', 'Straight eucalyptus timber', 'Expected lifespan: 15+ years'],
    imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Length',
        values: ['8 Feet', '10 Feet', '12 Feet'],
        priceModifiers: [0, 250, 500]
      }
    ]
  },
  {
    id: 'poles-treated-5inch',
    name: 'Treated Timber Pole (5" Diameter)',
    category: 'poles',
    basePrice: 1250,
    unit: 'per pole',
    description: 'Heavy-duty pressure-treated poles. Suitable for corner posts, gate supports, solar panel racking, and light agricultural structures.',
    specs: ['Diameter: 4.5" to 5.5"', 'Creosote or Tanalith-C treated', 'High density wood fiber', 'Resistant to damp soils and insects'],
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-76d74022fa36?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Length',
        values: ['10 Feet', '12 Feet', '15 Feet'],
        priceModifiers: [0, 350, 800]
      }
    ]
  },
  {
    id: 'poles-treated-6inch',
    name: 'Treated Power & Construction Pole (6" Diameter)',
    category: 'poles',
    basePrice: 2200,
    unit: 'per pole',
    description: 'Heavy structural-grade eucalyptus poles. Used in outdoor building constructions, heavy-duty security boundaries, and power distribution linkages.',
    specs: ['Diameter: 5.5" to 6.5"', 'Full industrial autoclave treatment', 'Exceptional load-bearing capacity', 'Capped tops to prevent water penetration'],
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Length',
        values: ['12 Feet', '15 Feet', '18 Feet'],
        priceModifiers: [0, 850, 1800]
      }
    ]
  },

  // --- CHAIN LINK FENCING ---
  {
    id: 'fencing-chainlink-g12',
    name: 'Heavy Duty Galvanized Chain Link Fence (Gauge 12.5)',
    category: 'fencing',
    basePrice: 4800,
    unit: 'per 18m roll',
    description: 'Thick, rust-resistant galvanized iron wire woven into a durable chain link mesh. Perfect for high-security commercial plots, warehouses, and farm protection in humid areas.',
    specs: ['Mesh Size: 50mm x 50mm', 'Wire Gauge: 12.5 G (Thick & rigid)', 'Roll Length: 18 Meters (60 Feet)', 'Hot-dipped galvanized coating'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Height',
        values: ['4 Feet (48")', '5 Feet (60")', '6 Feet (72")', '8 Feet (96")'],
        priceModifiers: [0, 1100, 2100, 4100]
      }
    ]
  },
  {
    id: 'fencing-chainlink-g14',
    name: 'Standard Galvanized Chain Link Fence (Gauge 14)',
    category: 'fencing',
    basePrice: 3500,
    unit: 'per 18m roll',
    description: 'Highly economical yet sturdy chain link fencing. Widely used for home boundary markers, school parameters, and poultry/livestock enclosures.',
    specs: ['Mesh Size: 60mm x 60mm', 'Wire Gauge: 14 G (Flexible & resilient)', 'Roll Length: 18 Meters (60 Feet)', 'Electro-galvanized rust resistance'],
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600', // Alternative wire focus
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Height',
        values: ['4 Feet (48")', '5 Feet (60")', '6 Feet (72")', '8 Feet (96")'],
        priceModifiers: [0, 800, 1600, 3100]
      }
    ]
  },

  // --- TIMBER ---
  {
    id: 'timber-cypress-standard',
    name: 'Premium Cypress Structural Timber (Sawn)',
    category: 'timber',
    basePrice: 75,
    unit: 'per linear foot',
    description: 'Genuine high-grade Cypress timber sourced from sustainable plantations. Air-dried and straight-cut. The ultimate standard for roofing rafters, purlins, wall studs, and joists in Kenya.',
    specs: ['Species: Cupressus lusitanica', 'Moisture: Sawn, air-seasoned', 'Termite-resistant natural resins', 'Easy to drill, nail, and profile'],
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Dimensions',
        values: ['2" x 2" (Rafters)', '3" x 2" (Purlins)', '4" x 2" (Trusses)', '6" x 2" (Beams)', '8" x 2" (Heavy beams)', '6" x 1" (Fascia/Plank)', '8" x 1" (Fascia/Plank)'],
        priceModifiers: [0, 25, 45, 90, 160, 35, 55] // Base is 2x2 at KES 75
      },
      {
        name: 'Length',
        values: ['10 Feet', '12 Feet', '14 Feet', '16 Feet', '18 Feet'],
        priceModifiers: [0, 15, 30, 45, 60] // per-item base length offset multiplier
      }
    ]
  },
  {
    id: 'timber-mahogany-fascia',
    name: 'African Mahogany Premium Fascia Board (Planed)',
    category: 'timber',
    basePrice: 280,
    unit: 'per linear foot',
    description: 'Exquisite hardwood fascia board, planed smooth on all four sides (Waney-free). Mahogany is naturally immune to water damage and rot, making it the most elite aesthetic choice for fascia eaves, cabinet trims, and high-end outdoor joinery.',
    specs: ['Species: Khaya anthotheca (Mahogany)', 'Finish: Planed (S4S) - ready for varnish', 'Highly aesthetic reddish-brown wood grain', 'Extreme rot and insect resistance'],
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Dimensions',
        values: ['6" x 1"', '8" x 1"', '10" x 1"', '12" x 1"'],
        priceModifiers: [0, 80, 160, 250]
      },
      {
        name: 'Length',
        values: ['12 Feet', '14 Feet', '16 Feet'],
        priceModifiers: [0, 40, 80]
      }
    ]
  },

  // --- WATER TANKS ---
  {
    id: 'tanks-cylindrical-black',
    name: 'LEMA Heavy Duty Cylindrical Water Storage Tank',
    category: 'tanks',
    basePrice: 5200,
    unit: 'per tank',
    description: 'Premium food-grade polyethylene water storage tank. Double-layered with UV-stabilized outer black skin to prevent algae growth and a food-safe white interior. Engineered with integrated hoisting lugs and pre-plumbed inlet/outlet brass inserts.',
    specs: ['Material: LLDPE Food-Grade', 'Double Layer: UV-Black & Algae-Proof White', 'Complies with KEBS standards', '10-Year Manufacturer Warranty'],
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'In Stock',
    options: [
      {
        name: 'Capacity',
        values: ['500 Liters', '1,000 Liters', '2,300 Liters', '5,000 Liters', '10,000 Liters'],
        priceModifiers: [0, 4300, 12800, 31800, 64800] // Base is 500L at KES 5,200 (10,000L ends up at KES 70,000)
      }
    ]
  }
];
