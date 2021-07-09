# axios-chaos-interceptor

<p align="center">
  <img src="https://raw.githubusercontent.com/daisuke-awaji/axios-chaos-interceptor/main/media/axios-chaos-interceptor.png" width="300" alt="axios-chaos-interceptor logo" />
</p>

<p align="center">axios-chaos-interceptor inject random errors into the response of axios.</p>

## Features

🌪 Randomize axios response <br>
⏱ Delay axios response

## Usage

### Basic Usage

Use chaosInterceptor

```ts
const client = axios.create();
const chaosInterceptor = createChaosInterceptor();
client.interceptors.response.use(chaosInterceptor);
```

then

```ts
try {
  await axios.get("http://api.github.com/");
} catch (error) {
  // may happen AxiosError with random
  console.log(error.status);
  console.log(error.data);
}
```

Possible `error.status` is one of following

- 429
- 500
- 502
- 503
- 504

Possible `error.data` is one of following

- "Too Many Requests"
- "Internal Server Error"
- "Bad Gateway"
- "Service Unavailable"
- "Gateway Timeout"

### Params

Specify the response that will result in an error

```ts
const client = axios.create();
const chaosInterceptor = createChaosInterceptor([
  {
    status: 500,
    body: {
      message: "Internal Server Error",
    },
    delay: 500, // delay response (ms)
    rate: 10, // possibilities (%)
  },
  {
    status: 504,
    body: {
      message: "Gateway Timeout",
    },
    delay: 100000,
    rate: 20,
  },
]);
client.interceptors.response.use(chaosInterceptor);
```

Possible `error.status` is one of following

- 500
- 504

Possible `error.data` is one of following

- `{ message: "Internal Server Error" }`
- `{ message: "Gateway Timeout" }`
