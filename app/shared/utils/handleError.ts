export function handleError(error: any): string {
  if (error.response) {
    const resError = error.response.data;
    return resError.errorMessage;
  }
  return error.message;
}
