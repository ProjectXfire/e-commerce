export interface ICategory {
  id: string;
  name: string;
  storeId: string;
  billboardId: string;
  billboardLabel?: string;
  createdAt: string | Date;
}
