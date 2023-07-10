export interface UpsertProductDto {
  id?: string;
  name: string;
  price: number;
  categoryId: string;
  sizeId: string;
  colorId: string;
  isFeatured: boolean;
  isArchived: boolean;
  images: IImageDto[];
}

interface IImageDto {
  id?: string;
  code: string;
  url: string;
}
