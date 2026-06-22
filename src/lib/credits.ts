import type { PlanId } from '../pages/Pricing/pricingPlans'

const STORAGE_KEY = 'quizora:credits'
export const CREDITS_UPDATED_EVENT = 'quizora:credits-updated'
export const DEFAULT_CREDITS = 240

export const PLAN_CREDIT_REWARDS: Record<PlanId, number> = {
  free: 100,
  pro: 500,
  classroom: 800,
}

export function getCredits(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null) return DEFAULT_CREDITS
    const parsed = Number.parseInt(raw, 10)
    return Number.isFinite(parsed) ? parsed : DEFAULT_CREDITS
  } catch {
    return DEFAULT_CREDITS
  }
}

export function setCredits(amount: number) {
  const next = Math.max(0, Math.round(amount))
  localStorage.setItem(STORAGE_KEY, String(next))
  window.dispatchEvent(new CustomEvent(CREDITS_UPDATED_EVENT, { detail: next }))
  return next
}

export function addCredits(amount: number) {
  return setCredits(getCredits() + amount)
}

export function addCreditsForPlan(planId: PlanId) {
  const previous = getCredits()
  const reward = PLAN_CREDIT_REWARDS[planId]
  const next = setCredits(previous + reward)
  return { previous, next, reward }
}

export function formatCredits(amount: number) {
  return amount.toLocaleString('en-US')
}
