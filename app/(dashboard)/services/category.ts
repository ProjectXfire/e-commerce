import axios, { type AxiosResponse } from 'axios';
import { type IResponse } from '@/app/shared/interfaces';
import { type UpsertCategoryDto } from '../dtos';
import { handleError } from '@/app/shared/utils';

export async function upsertCategory(
  id: string,
  payload: UpsertCategoryDto
): Promise<IResponse<null>> {
  try {
    let res: AxiosResponse<IResponse<null>, any> | null = null;
    if (payload.id) {
      const { billboardId, name } = payload;
      res = await axios.patch<IResponse<null>>(`/api/${id}/categories/${payload.id}`, {
        billboardId,
        name
      });
    } else {
      res = await axios.post<IResponse<null>>(`/api/${id}/categories`, payload);
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

export async function deleteCategory(id: string, categoryId: string): Promise<IResponse<null>> {
  try {
    const res = await axios.delete<IResponse<null>>(`/api/${id}/categories/${categoryId}`);
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
