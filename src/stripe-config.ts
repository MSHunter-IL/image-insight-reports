import { z } from 'zod';

export const stripeProductSchema = z.object({
  id: z.string(),
  priceId: z.string(),
  name: z.string(),
  description: z.string(),
  mode: z.enum(['payment', 'subscription']),
});

export type StripeProduct = z.infer<typeof stripeProductSchema>;

export const stripeProducts = [
  {
    id: 'prod_SIprlOXhLceCOF',
    priceId: 'price_1ROEC2QHVIvC1gNSz4Haj9dv',
    name: 'Smart Safety Reports – Free Plan',
    description: 'Free plan includes up to 10 AI-powered safety reports. Each report allows image upload, automatic analysis, editable descriptions, and export to Excel/PDF.',
    mode: 'payment',
  },
  {
    id: 'prod_SIpoSTE9mbLAqq',
    priceId: 'price_1ROE8iQHVIvC1gNSLwM7AlDd',
    name: 'Smart Safety Reports',
    description: 'Monthly subscription includes up to 50 AI-powered safety reports. Each report allows image upload, automatic analysis, editable descriptions, and export to Excel/PDF.',
    mode: 'subscription',
  },
] as const satisfies readonly StripeProduct[];