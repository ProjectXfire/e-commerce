import axios, { type AxiosResponse } from 'axios';
import { handleError } from '@/app/shared/utils';
import { removeImage } from './Images';
import { type IResponse } from '@/app/shared/interfaces';
import { type UpsertBillboardDto } from '../dtos';

export async function upsertBillboard(
  id: string,
  payload: UpsertBillboardDto
): Promise<IResponse<null>> {
  try {
    let res: AxiosResponse<IResponse<null>, any> | null = null;
    if (payload.id) {
      const { imageCode, imageUrl, label } = payload;
      res = await axios.patch<IResponse<null>>(`/api/${id}/billboards/${payload.id}`, {
        imageCode,
        imageUrl,
        label
      });
    } else {
      res = await axios.post<IResponse<null>>(`/api/${id}/billboards`, payload);
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

export async function deleteBillboard(
  id: string,
  billboardId: string,
  secure_url?: string,
  public_id?: string
): Promise<IResponse<null>> {
  try {
    if (secure_url && public_id) await removeImage(secure_url, public_id);
    const res = await axios.delete<IResponse<null>>(`/api/${id}/billboards/${billboardId}`);
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
