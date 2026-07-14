export type ProductCategory = 'timber' | 'steel' | 'poles' | 'fencing' | 'tanks';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number; // In KES
  unit: string; // "per board foot", "per meter", "per piece", "per 18m roll", "per tank" etc
  description: string;
  specs: string[];
  imageUrl: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Contact for Availability';
  options?: {
    name: string;
    values: string[];
    priceModifiers?: number[]; // matching indices with values
  }[];
}

export interface CartItem {
  cartId: string; // Unique ID (e.g., product_id + chosen_options_hash)
  productId: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  descriptionText: string; // detailed configuration label (e.g., "Size: 4\"x2\", Length: 12ft, Cypress")
  customCalculations?: {
    boardFeet?: number;
    weightKg?: number;
  };
}

export interface OrderInquiry {
  id: string; // LEMA-XXXX (Invoice ID)
  timestamp: string;
  customerName: string;
  phone: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryLocation: string;
  deliveryCost: number;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'Pending Quote' | 'Approved' | 'Delivered';
  notes?: string;
}

export interface LumberInput {
  woodType: string;
  thickness: number; // inches
  width: number; // inches
  length: number; // feet
  quantity: number;
}
