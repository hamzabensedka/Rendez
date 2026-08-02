import { Injectable } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class PushService {
  async sendPushNotification(data: any) {
    const expo = new Expo({
      accessToken: 'YOUR_ACCESS_TOKEN'
    });

    const message = {
      to: 'EXPO_PUSH_TOKEN',
      sound: 'default',
      title: 'Notification',
      body: 'Notification sent successfully'
    };

    await expo.sendPushNotificationsAsync([message]);
  }
}