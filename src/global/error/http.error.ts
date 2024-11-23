class HttpError extends Error {
  public readonly httpCode: number;
  constructor(httpCode: number, message: string) {
    super(message);
    this.httpCode = httpCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
