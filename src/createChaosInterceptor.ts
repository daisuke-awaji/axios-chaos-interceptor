import { AxiosResponse } from "axios";
import { createError } from "./enhanceError";
import { defaultErrors } from "./errors";

const random = (min: number, max: number) => Math.random() * (max - min) + min;
const percent = (percent: number) => random(0, 100) <= percent;
const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));
const DEFAULT_ERROR_RATE = 90;
const DEFAULT_ERROR_MESSAGE = "Error caused by axios-chaos-interceptor";

export const createChaosInterceptor =
  (errors = defaultErrors) =>
  async (res: AxiosResponse) => {
    for (const error of errors) {
      if (percent(error.rate ?? DEFAULT_ERROR_RATE)) {
        await sleep(error.delay ?? random(10, 1000));

        throw createError({
          message: "Request failed with status code " + error.status,
          config: res.config,
          code: null,
          request: res.request,
          response: {
            ...res,
            data: error.body ?? DEFAULT_ERROR_MESSAGE,
            status: error.status,
          },
        });
      }
    }
    return res;
  };
