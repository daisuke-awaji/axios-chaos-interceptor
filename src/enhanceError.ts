import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const enhanceError = <T>(
  error: any,
  config: AxiosRequestConfig,
  code: string | null,
  request: any,
  response: AxiosResponse<T>
) => {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
    };
  };
  return error;
};

type CreateErrorParams<T> = {
  message: string;
  config: AxiosRequestConfig;
  code: string | null;
  request: any;
  response: AxiosResponse<T>;
};

export const createError = <T>(param: CreateErrorParams<T>): AxiosError => {
  const { message, config, code, request, response } = param;
  var error = new Error(message);
  return enhanceError<T>(error, config, code, request, response);
};
