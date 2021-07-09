import axios from "axios";
import { createChaosInterceptor } from ".";
import nock from "nock";

describe("createChaosInterceptor", () => {
  test("basic usage", async () => {
    nock("https://axios-chaos-interceptor.com").get("/").reply(200, {
      message: "OK",
    });

    const client = axios.create();
    const errors = [
      {
        status: 429,
        body: "Too Many Requests",
        delay: 100,
        rate: 0.1,
      },
      {
        status: 500,
        body: "Internal Server Error",
        delay: 300,
        rate: 5,
      },
      {
        status: 502,
        body: "Bad Gateway",
        delay: 300,
        rate: 5,
      },
      {
        status: 503,
        body: "Service Unavailable",
        delay: 300,
        rate: 3,
      },
      {
        status: 504,
        body: "Gateway Timeout",
        delay: 1000,
        rate: 50,
      },
    ];
    const chaosInterceptor = createChaosInterceptor(errors);

    client.interceptors.response.use(chaosInterceptor);

    try {
      await client.get("https://axios-chaos-interceptor.com");
    } catch (error) {
      expect([...errors.map((e) => e.body), { message: "OK" }]).toContainEqual(
        error.response.data
      );
      expect([...errors.map((e) => e.status), 200]).toContain(
        error.response.status
      );
    }
  });

  test("default injected errors", async () => {
    nock("https://axios-chaos-interceptor.com").get("/").reply(200, {
      message: "OK",
    });

    const client = axios.create();
    const chaosInterceptor = createChaosInterceptor();
    client.interceptors.response.use(chaosInterceptor);

    try {
      await client.get("https://axios-chaos-interceptor.com");
    } catch (error) {
      expect([
        "Too Many Requests",
        "Internal Server Error",
        "Bad Gateway",
        "Service Unavailable",
        "Gateway Timeout",
        { message: "OK" },
      ]).toContainEqual(error.response.data);
      expect([429, 500, 502, 503, 504, 200]).toContain(error.response.status);
    }
  });

  test("use json errors", async () => {
    nock("https://axios-chaos-interceptor.com").get("/").reply(200, {
      message: "OK",
    });

    const client = axios.create();
    const chaosInterceptor = createChaosInterceptor([
      {
        status: 504,
        body: {
          message: "Gateway Timeout",
        },
        delay: 1000,
        rate: 50,
      },
    ]);
    client.interceptors.response.use(chaosInterceptor);

    try {
      await client.get("https://axios-chaos-interceptor.com");
    } catch (error) {
      expect([
        { message: "Gateway Timeout" },
        { message: "OK" },
      ]).toContainEqual(error.response.data);
      expect([504, 200]).toContain(error.response.status);
    }
  });
});
