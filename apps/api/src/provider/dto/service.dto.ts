export class ServiceDto {
  id: number;
  name: string;
  price: number;
  duration: number;
  constructor(partial: Partial<ServiceDto>) {
    Object.assign(this, partial);
  }
}
