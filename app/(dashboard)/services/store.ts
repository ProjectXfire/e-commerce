import axios from 'axios';
import { type IResponse } from '@/app/shared/interfaces';

export async function updateStore(id: string, name: string): Promise<IResponse<null>> {
  try {
    const res = await axios.patch<IResponse<null>>(`/api/stores/${id}`, { name });
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

export async function deleteStore(id: string): Promise<IResponse<null>> {
  try {
    const res = await axios.delete<IResponse<null>>(`/api/stores/${id}`);
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
