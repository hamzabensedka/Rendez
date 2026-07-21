import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string().required(),
  
  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  
  // Email
  EMAIL_PROVIDER: Joi.string().valid('stub', 'resend', 'smtp').default('stub'),
  RESEND_API_KEY: Joi.string().when('EMAIL_PROVIDER', {
    is: 'resend',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  EMAIL_FROM: Joi.string().default('Planity <noreply@planity.com>'),
  
  // Push Notifications
  PUSH_PROVIDER: Joi.string().valid('stub', 'expo').default('stub'),
  EXPO_ACCESS_TOKEN: Joi.string().when('PUSH_PROVIDER', {
    is: 'expo',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  
  // App
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  
  // External Services
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
});
