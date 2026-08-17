export class SendAppointmentReminderDto {
  userId: number;
  businessId: number;
  appointmentId: number;

  constructor(userId: number, businessId: number, appointmentId: number) {
    this.userId = userId;
    this.businessId = businessId;
    this.appointmentId = appointmentId;
  }
}
