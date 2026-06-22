import { addCredits } from './credits'

const COUNT_KEY = 'quizora:correct-answers'
const CLAIMED_KEY = 'quizora:streak-milestones-claimed'
export const STREAK_PROGRESS_EVENT = 'quizora:streak-progress-updated'

export const STREAK_MILESTONES = [
  { at: 50, credits: 150 },
  { at: 100, credits: 250 },
  { at: 200, credits: 400 },
  { at: 350, credits: 600 },
  { at: 500, credits: 900 },
  { at: 750, credits: 1200 },
  { at: 1000, credits: 2000 },
] as const

export const STREAK_MAX = STREAK_MILESTONES[STREAK_MILESTONES.length - 1].at

function readClaimed(): number[] {
  try {
    const raw = localStorage.getItem(CLAIMED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as number[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeClaimed(values: number[]) {
  localStorage.setItem(CLAIMED_KEY, JSON.stringify(values))
}

export function getCorrectAnswerCount(): number {
  try {
    const raw = localStorage.getItem(COUNT_KEY)
    if (raw == null) return 0
    const parsed = Number.parseInt(raw, 10)
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
  } catch {
    return 0
  }
}

function claimNewMilestones(count: number) {
  const claimed = readClaimed()
  let totalReward = 0
  const nextClaimed = [...claimed]

  for (const milestone of STREAK_MILESTONES) {
    if (count >= milestone.at && !claimed.includes(milestone.at)) {
      nextClaimed.push(milestone.at)
      totalReward += milestone.credits
    }
  }

  if (totalReward > 0) {
    writeClaimed(nextClaimed)
    addCredits(totalReward)
  }
}

export function recordCorrectAnswer(): number {
  const next = getCorrectAnswerCount() + 1
  localStorage.setItem(COUNT_KEY, String(next))
  claimNewMilestones(next)
  window.dispatchEvent(new CustomEvent(STREAK_PROGRESS_EVENT, { detail: next }))
  return next
}

export function isMilestoneClaimed(at: number): boolean {
  return readClaimed().includes(at)
}

export function getStreakProgressPercent(count = getCorrectAnswerCount()): number {
  return Math.min(100, (count / STREAK_MAX) * 100)
}
