type HttpStatus = number;
type Error = {
  status: HttpStatus;
  body?: string | object;
  delay?: number;
  rate?: number;
};
export const defaultErrors: Error[] = [
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
    delay: 3000,
    rate: 10,
  },
];
