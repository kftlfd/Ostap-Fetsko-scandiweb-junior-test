export type Category = 'DVD' | 'Furniture' | 'Book';

export type Product = {
  id: number;
  sku: string;
  name: string;
  price: number;
  type: Category;
  size?: number;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
};
