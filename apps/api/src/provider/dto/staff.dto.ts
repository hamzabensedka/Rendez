export class StaffDto {
  id: number;
  name: string;
  email: string;
  constructor(partial: Partial<StaffDto>) {
    Object.assign(this, partial);
  }
}
