
export type Category = 'Men' | 'Women' | 'Kids';
export type Style = 'Modern' | 'Traditional';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  style: Style;
  price: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  description: string;
  featured?: boolean;
  reviews?: Review[];
  averageRating?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export interface StoreState {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
}
