export class BusinessDto {
  id: number;
  name: string;
  address: string;
  constructor(partial: Partial<BusinessDto>) {
    Object.assign(this, partial);
  }
}
