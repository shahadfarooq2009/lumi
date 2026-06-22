export type PlanId = 'free' | 'pro' | 'classroom'
export type BillingPeriod = 'monthly' | 'yearly'

export interface CheckoutFeature {
  text: string
}

export interface PricingPlan {
  id: PlanId
  name: string
  priceMonthly: number
  priceYearly: number
  trialDays?: number
  promotionLabel?: string
  checkoutTitle: string
  checkoutFeatures: CheckoutFeature[]
}

export const PRICING_PLANS: Record<PlanId, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    checkoutTitle: 'Get started with Free',
    checkoutFeatures: [
      { text: 'Cancel anytime' },
      { text: '3 projects per month' },
      { text: 'Files up to 10 pages' },
      { text: 'Access to 4 game modes' },
      { text: 'Basic AI question generation' },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 12,
    priceYearly: 9,
    trialDays: 7,
    promotionLabel: 'Promotion (100% off for 7 days)',
    checkoutTitle: 'Start your free Pro trial',
    checkoutFeatures: [
      { text: 'Cancel anytime' },
      { text: "We'll remind you before your trial ends" },
      { text: 'Unlimited projects' },
      { text: 'All 8 game modes' },
      { text: 'Advanced AI · GPT-grade quality' },
    ],
  },
  classroom: {
    id: 'classroom',
    name: 'Classroom',
    priceMonthly: 29,
    priceYearly: 23,
    checkoutTitle: 'Start your Classroom plan',
    checkoutFeatures: [
      { text: 'Cancel anytime' },
      { text: '30 student seats included' },
      { text: 'Class leaderboards & analytics' },
      { text: 'Live multiplayer sessions' },
      { text: 'Google Classroom integration' },
    ],
  },
}

export function parsePlanId(value: string | null): PlanId {
  if (value === 'pro' || value === 'classroom' || value === 'free') return value
  return 'pro'
}

export function parseBillingPeriod(value: string | null): BillingPeriod {
  return value === 'yearly' ? 'yearly' : 'monthly'
}

export function getPlanPrice(plan: PricingPlan, period: BillingPeriod): number {
  return period === 'yearly' ? plan.priceYearly : plan.priceMonthly
}
