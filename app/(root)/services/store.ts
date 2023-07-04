import axios from 'axios';
import { type IResponse } from '@/app/shared/interfaces';
import { type IStore } from '@/app/core/interfaces';

export async function createStore(name: string): Promise<IResponse<IStore | null>> {
  try {
    const res = await axios.post<IResponse<IStore | null>>('/api/stores', { name });
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
