export type Category = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Brand = {
  _id: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
  __v: number;
};

export type Supplier = {
  _id: string;
  name: string;
  contact: string;
  address: string;
  slug: string;
  __v: number;
};

export type Variant = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  slug: string;
  description: string;
  image: string;
  __v: number;
};

export type Product = {
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
};
