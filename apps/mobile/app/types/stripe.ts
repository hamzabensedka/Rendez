export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  payment_method_types: string[];
}