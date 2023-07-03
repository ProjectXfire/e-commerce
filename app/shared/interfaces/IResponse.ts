export interface IResponse<T> {
  errorMessage: string | null;
  message: string | null;
  data: T;
}
