import Stripe from 'stripe';
import { getEnvVar } from '../config/env';

const stripeSecretKey = getEnvVar('STRIPE_SECRET_KEY');

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
});

export const STRIPE_WEBHOOK_SECRET = getEnvVar('STRIPE_WEBHOOK_SECRET');
