import axios, { type AxiosResponse } from 'axios';
import { type IResponse } from '@/app/shared/interfaces';
import { type UpsertColorDto } from '../dtos';

export async function upsertColor(id: string, payload: UpsertColorDto): Promise<IResponse<null>> {
  try {
    let res: AxiosResponse<IResponse<null>, any> | null = null;
    if (payload.id) {
      const { value, name } = payload;
      res = await axios.patch<IResponse<null>>(`/api/${id}/colors/${payload.id}`, {
        value,
        name
      });
    } else {
      res = await axios.post<IResponse<null>>(`/api/${id}/colors`, payload);
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
      errorMessage: error.message,
      message: null
    };
  }
}

export async function deleteColor(id: string, colorId: string): Promise<IResponse<null>> {
  try {
    const res = await axios.delete<IResponse<null>>(`/api/${id}/colors/${colorId}`);
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
      errorMessage: error.message,
      message: null
    };
  }
}
