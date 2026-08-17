import { Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RedisClient } from 'redis';
import { SendReminderDto } from './dto/send-reminder.dto';

@Processor('send-reminder')
export class SendReminderProcessor {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redisClient: RedisClient,
  ) {}

  async process(job: any, sendReminderDto: SendReminderDto) {
    // Send reminder logic here
    console.log(`Sending reminder for appointment ${sendReminderDto.appointmentId} to user ${sendReminderDto.userId}`);
  }
}