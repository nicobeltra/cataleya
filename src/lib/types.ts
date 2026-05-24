export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  order: number;
  protected?: boolean;
  active?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  category_id: string;
  category?: Category;
  images: string[];
  sizes: string[];
  badge: 'new' | 'sale' | null;
  featured: boolean;
  active: boolean;
  created_at: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  eyebrow: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string;
  active: boolean;
  order: number;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  active: boolean;
  updated_at: string;
};

export type SiteConfig = {
  [key: string]: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};
