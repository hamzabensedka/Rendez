import { EmailTemplate } from '../templates/email-templates';

export interface EmailProvider {
  send(email: string, template: EmailTemplate): Promise<boolean>;
}

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';
