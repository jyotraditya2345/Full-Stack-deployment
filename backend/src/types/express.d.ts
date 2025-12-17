import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export type AuthedRequest = Request & {
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export {};
