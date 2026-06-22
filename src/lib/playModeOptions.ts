import type { LucideIcon } from 'lucide-react'
import { BookOpen, Flame, Grid3x3, Sparkles, Trophy, User, Users } from 'lucide-react'

export type PlayModeId = 'solo' | 'class'

export interface PlayModeOption {
  id: PlayModeId
  label: string
  sub: string
  hint?: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export interface GameModeOption {
  title: string
  sub: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  featured?: boolean
}

export const PLAY_MODE_OPTIONS: PlayModeOption[] = [
  {
    id: 'solo',
    label: 'Play solo',
    sub: 'Go straight to question count & types',
    hint: 'just you',
    icon: User,
    iconBg: 'bg-violet-100',
    iconColor: 'text-brand-deep',
  },
  {
    id: 'class',
    label: 'Play with your class',
    sub: 'Go straight to question count & types',
    hint: 'classroom',
    icon: Users,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-game-success',
  },
]

export const GAME_MODE_OPTIONS: GameModeOption[] = [
  {
    title: 'Arcade Blitz',
    sub: 'Quick rounds with instant feedback',
    icon: Flame,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Adventure Path',
    sub: 'Unlock chapters as you progress',
    icon: BookOpen,
    iconBg: 'bg-blue-100',
    iconColor: 'text-game-info',
  },
  {
    title: 'Boss Battle',
    sub: 'Face tougher challenges each level',
    icon: Trophy,
    iconBg: 'bg-amber-100',
    iconColor: 'text-game-fantasy',
  },
  {
    title: 'Zen Review',
    sub: 'Calm, self-paced mastery mode',
    icon: Sparkles,
    iconBg: 'bg-brand-soft',
    iconColor: 'text-brand',
    featured: true,
  },
  {
    title: 'Crossword',
    sub: 'Solve clues and fill the word grid',
    icon: Grid3x3,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
  },
]

export function isSoloPlayMode(answer?: string): boolean {
  if (!answer) return false
  const lower = answer.toLowerCase()
  return lower.includes('solo') || lower.includes('your own') || lower.includes('just you')
}

export const CROSSWORD_MODE_TITLE = 'Crossword'

export function isCrosswordGameMode(answer?: string): boolean {
  if (!answer) return false
  return answer.toLowerCase().includes('crossword')
}

export function formatGameModeAnswer(answer?: string): string {
  if (!answer) return 'your game'
  const match = GAME_MODE_OPTIONS.find(
    (mode) => answer.includes(mode.title) || answer.toLowerCase().includes(mode.title.toLowerCase()),
  )
  return match?.title ?? 'your game'
}
