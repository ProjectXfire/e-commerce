import { IResponse } from '@/app/shared/interfaces';
import axios from 'axios';
import { IStore } from '../models';

export async function createStore(name: string): Promise<IResponse<any>> {
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
