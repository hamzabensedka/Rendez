import { Processor, Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReminderEmailJob {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  @Processor('reminder-emails')
  async handle(job: Job) {
    const userId = job.data.userId;
    const user = await this.userRepository.findOne(userId);
    if (!user) return;

    await this.mailService.sendReminderEmail(user);
  }
}