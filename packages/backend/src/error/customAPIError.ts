
export class CustomAPIError extends Error {
  public statusCode: number;

  constructor(message:string, status:number) {
    super(message);
    this.statusCode = status;
  }
}

export const createCustomError = (message:string, status:number)=>{
  return new CustomAPIError(message, status);
};

