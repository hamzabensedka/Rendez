@Module {
  imports: [],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
}
export class PaymentsModule {}