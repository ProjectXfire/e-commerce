import axios, { type AxiosResponse } from 'axios';
import { handleError } from '@/app/shared/utils';
import { type IResponse } from '@/app/shared/interfaces';
import { type UpsertSizeDto } from '../dtos';

export async function upsertSize(id: string, payload: UpsertSizeDto): Promise<IResponse<null>> {
  try {
    let res: AxiosResponse<IResponse<null>, any> | null = null;
    if (payload.id) {
      const { value, name } = payload;
      res = await axios.patch<IResponse<null>>(`/api/${id}/sizes/${payload.id}`, {
        value,
        name
      });
    } else {
      res = await axios.post<IResponse<null>>(`/api/${id}/sizes`, payload);
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

export async function deleteSize(id: string, sizeId: string): Promise<IResponse<null>> {
  try {
    const res = await axios.delete<IResponse<null>>(`/api/${id}/sizes/${sizeId}`);
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
