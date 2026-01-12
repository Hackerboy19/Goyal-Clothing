
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Silk Banarasi Saree',
    category: 'Women',
    style: 'Traditional',
    price: 12499,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A masterpiece of heritage craftsmanship. Hand-woven in pure silk with intricate silver and gold zari floral patterns.',
    featured: true,
    reviews: [
      { id: 'r1', userName: 'Priya Sharma', rating: 5, comment: 'The drape is magnificent. Truly a royal feel.', date: '2024-01-15' },
      { id: 'r12', userName: 'Meera R.', rating: 5, comment: 'Authentic Banarasi quality.', date: '2024-03-02' }
    ],
    averageRating: 5
  },
  {
    id: '2',
    name: 'Royal Ivory Sherwani',
    category: 'Men',
    style: 'Traditional',
    price: 18999,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1624371414361-e67098f98ec5?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Bespoke ivory sherwani featuring heavy zardosi embroidery. Designed for a grand wedding celebration.',
    featured: true,
    reviews: [
      { id: 'r2', userName: 'Aditya V.', rating: 4, comment: 'Excellent fitting and premium feel of the fabric.', date: '2024-02-10' }
    ],
    averageRating: 4
  },
  {
    id: '3',
    name: 'Champagne Satin Evening Gown',
    category: 'Women',
    style: 'Modern',
    price: 8999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1539008835657-9e8e81839967?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Modern minimalist silhouette in high-grade liquid satin. Features a sophisticated cowl neck and side slit.',
    featured: true,
    reviews: [
      { id: 'r3', userName: 'Sara J.', rating: 5, comment: 'Stunning fit. I felt like a star in this gown!', date: '2024-04-12' }
    ],
    averageRating: 5
  },
  {
    id: '4',
    name: 'Velvet Bandhgala Set',
    category: 'Men',
    style: 'Traditional',
    price: 14500,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800',
    description: 'Deep navy velvet Bandhgala with hand-crafted metallic buttons and a tailored finish.',
    reviews: [
      { id: 'r4', userName: 'Vikram Singh', rating: 5, comment: 'The velvet is very high quality. Very warm and rich look.', date: '2024-05-20' }
    ],
    averageRating: 5
  },
  {
    id: '5',
    name: 'Kids Festive Leheriya Set',
    category: 'Kids',
    style: 'Traditional',
    price: 3299,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
    description: 'Vibrant pink and yellow Leheriya print lehenga for the little ones. Soft cotton lining for comfort.',
    featured: true,
    reviews: [
      { id: 'r5', userName: 'Anita K.', rating: 4, comment: 'My daughter loved the bright colors. Very comfortable.', date: '2024-06-15' }
    ],
    averageRating: 4
  },
  {
    id: '6',
    name: 'Italian Wool Charcoal Suit',
    category: 'Men',
    style: 'Modern',
    price: 24999,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f6ee?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Premium Italian wool slim-fit suit. Perfect for the modern corporate boardroom or high-profile events.',
    reviews: [],
    averageRating: 0
  },
  {
    id: '7',
    name: 'Hand-Painted Floral Organza',
    category: 'Women',
    style: 'Traditional',
    price: 7499,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1610189012906-40da36248da9?auto=format&fit=crop&q=80&w=800',
    description: 'Ethereal ivory organza saree with hand-painted floral motifs and a delicate scalloped border.',
    reviews: [
      { id: 'r7', userName: 'Nina G.', rating: 5, comment: 'So light and elegant. Received many compliments.', date: '2024-07-08' }
    ],
    averageRating: 5
  },
  {
    id: '8',
    name: 'Kids Urban Denim Jacket',
    category: 'Kids',
    style: 'Modern',
    price: 2499,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1519457431-7571b028930a?auto=format&fit=crop&q=80&w=800',
    description: 'Sturdy denim jacket with modern distressed details. A versatile layer for every young trendsetter.',
    reviews: [
      { id: 'r8', userName: 'Rahul M.', rating: 4, comment: 'Good quality denim. Fits true to size.', date: '2024-08-12' }
    ],
    averageRating: 4
  },
  {
    id: '9',
    name: 'Suede Camel Overcoat',
    category: 'Men',
    style: 'Modern',
    price: 15999,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    description: 'Luxury suede overcoat in timeless camel hue. An investment piece for the winter wardrobe.',
    reviews: [],
    averageRating: 0
  },
  {
    id: '10',
    name: 'Kids Royal Kurta Set',
    category: 'Kids',
    style: 'Traditional',
    price: 1999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
    description: 'Classic silk-blend kurta with churidar. Elegant yet easy for kids to move around in.',
    reviews: [
      { id: 'r10', userName: 'Kavita L.', rating: 5, comment: 'Perfect for the Diwali pooja. My son looked adorable.', date: '2024-09-01' }
    ],
    averageRating: 5
  },
  {
    id: '11',
    name: 'Pleated Chiffon Sun Dress',
    category: 'Women',
    style: 'Modern',
    price: 4599,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    description: 'Airy pleated chiffon dress with a vibrant summer print. Ideal for resort wear and brunches.',
    reviews: [
      { id: 'r11', userName: 'Esha B.', rating: 4, comment: 'Very breezy and pretty.', date: '2024-10-15' }
    ],
    averageRating: 4
  }
];
