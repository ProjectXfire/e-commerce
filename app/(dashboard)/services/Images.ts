import axios from 'axios';
import { type IResponse } from '@/app/shared/interfaces';

export interface IImageCloudinary {
  secure_url: string;
  public_id: string;
}

export async function removeImage(secure_url: string, public_id: string): Promise<IResponse<any>> {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_UPLOAD}/cloudinary/delete`, {
      images: [{ secure_url, public_id }]
    });

    return {
      errorMessage: null,
      data: null,
      message: 'Successfully removed'
    };
  } catch (error: any) {
    return {
      data: null,
      errorMessage: error.message,
      message: null
    };
  }
}

export async function removeImages(images: IImageCloudinary[]): Promise<IResponse<any>> {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_UPLOAD}/cloudinary/delete`, {
      images
    });

    return {
      errorMessage: null,
      data: null,
      message: 'Images Successfully removed'
    };
  } catch (error: any) {
    return {
      data: null,
      errorMessage: error.message,
      message: null
    };
  }
}

export async function removeImageFromProduct(
  id: string,
  productId: string,
  secure_url: string,
  public_id: string
) {
  try {
    await axios.post<IResponse<null>>(`/api/${id}/products/${productId}`, {
      secure_url,
      public_id
    });
    const { errorMessage } = await removeImage(secure_url, public_id);
    if (errorMessage) throw new Error('Error on remove image from cloudinary');
    return {
      errorMessage: null,
      data: null,
      message: 'Successfully removed'
    };
  } catch (error: any) {
    return {
      data: null,
      errorMessage: error.message,
      message: null
    };
  }
}
