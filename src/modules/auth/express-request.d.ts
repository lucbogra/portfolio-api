import 'express';

declare module 'express' {
  interface Request {
    user?: {
      sub: string;
      username: string;
      iat?: number;
      exp?: number;
    };
  }
}