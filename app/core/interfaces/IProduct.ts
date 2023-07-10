export interface IProduct {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  storeId: string;
  categoryId: string;
  sizeId: string;
  colorId: string;
  createdAt: string | Date;
  category?: string;
  color?: string;
  size?: string;
  images?: IImage[];
}

export interface IImage {
  id: string;
  url: string;
  code: string;
  productId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
