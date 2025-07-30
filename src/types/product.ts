export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Brand {
  _id: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
  __v: number;
}

export interface Supplier {
  _id: string;
  name: string;
  contact: string;
  address: string;
  slug: string;
  __v: number;
}

export interface Variant {
  _id: string;
  name: string;
  price: number;
  stock: number;
  slug: string;
  description: string;
  image: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  brand: Brand;
  supplier: Supplier;
  variants: Variant[];
  barcode: string;
  images: string[];
  barcodeImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
