import { Request } from 'express';

export interface StripeRawBodyRequest extends Request {
  rawBody: Buffer;
}
