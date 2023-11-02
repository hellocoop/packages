// auth.d.ts

import { Auth } from './lib/auth'

export {}

declare global {
  namespace Express {
    interface Request {
      auth?: Auth;
      getAuth(): Promise<Auth>;
    }
    interface Response {
      clearAuth();
    }
  }
}