import axios, { type AxiosResponse } from 'axios';
import { handleError } from '@/app/shared/utils';
import { type IResponse } from '@/app/shared/interfaces';
import { removeImages, type IImageCloudinary } from './Images';
import { type UpsertProductDto } from '../dtos';

export async function upsertProduct(
  id: string,
  payload: UpsertProductDto
): Promise<IResponse<null>> {
  try {
    let res: AxiosResponse<IResponse<null>, any> | null = null;
    if (payload.id) {
      const { name, price, categoryId, colorId, sizeId, isArchived, isFeatured, images } = payload;
      res = await axios.patch<IResponse<null>>(`/api/${id}/products/${payload.id}`, {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images
      });
    } else {
      res = await axios.post<IResponse<null>>(`/api/${id}/products`, payload);
    }
    const { data, errorMessage, message } = res.data;
    if (errorMessage) throw new Error(errorMessage);
    return {
      errorMessage: null,
      data,
      message
    };
  } catch (error: any) {
    return {
      data: null,
      errorMessage: handleError(error),
      message: null
    };
  }
}

export async function deleteProduct(
  id: string,
  productId: string,
  images?: IImageCloudinary[]
): Promise<IResponse<null>> {
  try {
    if (images && images.length > 0) await removeImages(images);
    const res = await axios.delete<IResponse<null>>(`/api/${id}/products/${productId}`);
    const { data, errorMessage, message } = res.data;
    if (errorMessage) throw new Error(errorMessage);
    return {
      errorMessage: null,
      data,
      message
    };
  } catch (error: any) {
    return {
      data: null,
      errorMessage: handleError(error),
      message: null
    };
  }
}
