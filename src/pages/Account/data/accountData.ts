import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  Clock,
  Flame,
  Gamepad2,
  GraduationCap,
  MapPin,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react'

export const USER = {
  name: 'Shahad',
  handle: '@shahad',
  email: 'shahad@email.com',
  initials: 'S',
  plan: 'Free Plan',
  memberSince: 'May 2024',
  joinedLabel: 'Joined May 2024',
  bio: 'Learning is more fun when you play! ✨',
  location: 'Iraq',
  occupation: 'Student',
  avatarUrl: '/assets/quizora-mascot.png',
}

export const LEVEL = {
  level: 8,
  title: 'Rising Star',
  currentXp: 1250,
  nextXp: 2000,
}

export const PROFILE_STATS = [
  { label: 'Games Created', value: '24', icon: Gamepad2, tone: 'purple' as const },
  { label: 'Games Played', value: '186', icon: Sparkles, tone: 'green' as const },
  { label: 'Average Score', value: '92%', icon: Trophy, tone: 'orange' as const },
  { label: 'Time Spent', value: '38h', icon: Clock, tone: 'purple' as const },
  { label: 'Day Streak', value: '12', icon: Flame, tone: 'orange' as const },
]

export type ProfileProject = {
  id: string
  title: string
  type: string
  meta: string
  bestScore: number
  gradient: string
}

export const PROFILE_PROJECTS: ProfileProject[] = [
  {
    id: '1',
    title: 'Biology: Cell Basics',
    type: 'Quiz',
    meta: '15 Questions',
    bestScore: 92,
    gradient: 'linear-gradient(135deg, #7C4DFF 0%, #B388FF 100%)',
  },
  {
    id: '2',
    title: 'History: WWI Timeline',
    type: 'Flashcards',
    meta: '32 Cards',
    bestScore: 88,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
  },
  {
    id: '3',
    title: 'Spanish Vocab',
    type: 'Match Pairs',
    meta: '24 Pairs',
    bestScore: 95,
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
  },
]

export type ProfileActivity = {
  id: string
  text: string
  time: string
  tone: 'purple' | 'green' | 'orange' | 'blue'
  icon: LucideIcon
}

export const PROFILE_ACTIVITIES: ProfileActivity[] = [
  {
    id: '1',
    text: 'You played a Quiz game',
    time: '2 hours ago',
    tone: 'purple',
    icon: Gamepad2,
  },
  {
    id: '2',
    text: 'You earned the "Streak Master" badge',
    time: 'Yesterday',
    tone: 'orange',
    icon: Flame,
  },
  {
    id: '3',
    text: 'Biology Quiz score improved to 92%',
    time: '2 days ago',
    tone: 'green',
    icon: Trophy,
  },
]

export type ProfileAchievement = {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  accent: string
  accentLight: string
  unlocked: boolean
  frame: 'gold' | 'silver'
}

export const PROFILE_ACHIEVEMENTS: ProfileAchievement[] = [
  {
    title: 'First Steps',
    description: 'Played your first game',
    icon: Star,
    gradient: 'from-[#7C4DFF] to-[#9A6BFF]',
    accent: '#8a70ff',
    accentLight: '#a78bfa',
    unlocked: true,
    frame: 'gold',
  },
  {
    title: 'Quiz Whiz',
    description: '10 quizzes completed',
    icon: Trophy,
    gradient: 'from-[#3B82F6] to-[#60A5FA]',
    accent: '#4cafff',
    accentLight: '#7ec8ff',
    unlocked: true,
    frame: 'silver',
  },
  {
    title: 'On Fire',
    description: '7-day streak',
    icon: Flame,
    gradient: 'from-[#14B8A6] to-[#2DD4BF]',
    accent: '#14b8a6',
    accentLight: '#2dd4bf',
    unlocked: false,
    frame: 'gold',
  },
  {
    title: 'Perfect Score',
    description: '100% on any game',
    icon: Star,
    gradient: 'from-[#F97316] to-[#FB923C]',
    accent: '#f97316',
    accentLight: '#fb923c',
    unlocked: false,
    frame: 'silver',
  },
  {
    title: 'Top Creator',
    description: '5 games published',
    icon: Sparkles,
    gradient: 'from-[#EC4899] to-[#F472B6]',
    accent: '#ec4899',
    accentLight: '#f472b6',
    unlocked: false,
    frame: 'gold',
  },
]

export type LearningChartPoint = {
  month: string
  value: number
  tooltipDate: string
}

export const LEARNING_CHART = {
  title: 'Learning Progress',
  totalValue: 1247,
  totalSuffix: 'pts',
  growthDelta: 22.3,
  growthPercent: 12.2,
  periodLabel: 'Last 12 months',
  yTicks: [0, 25, 50, 75, 100] as const,
  points: [
    { month: 'Jan', value: 38, tooltipDate: '31 Jan 2025, 8:12 pm' },
    { month: 'Feb', value: 44, tooltipDate: '28 Feb 2025, 6:40 pm' },
    { month: 'Mar', value: 41, tooltipDate: '31 Mar 2025, 9:05 pm' },
    { month: 'Apr', value: 52, tooltipDate: '30 Apr 2025, 7:18 pm' },
    { month: 'May', value: 49, tooltipDate: '31 May 2025, 5:55 pm' },
    { month: 'Jun', value: 58, tooltipDate: '30 Jun 2025, 8:30 pm' },
    { month: 'Jul', value: 64, tooltipDate: '24 Jul 2025, 9:23 pm' },
    { month: 'Aug', value: 61, tooltipDate: '31 Aug 2025, 4:10 pm' },
    { month: 'Sep', value: 71, tooltipDate: '30 Sep 2025, 6:48 pm' },
    { month: 'Oct', value: 78, tooltipDate: '31 Oct 2025, 7:22 pm' },
    { month: 'Nov', value: 85, tooltipDate: '30 Nov 2025, 8:01 pm' },
    { month: 'Dec', value: 92, tooltipDate: '7 Dec 2025, 3:15 pm' },
  ] satisfies LearningChartPoint[],
}

/** @deprecated use PROFILE_STATS */
export const HEADER_STATS = [
  { label: 'Projects', value: '12', icon: 'folder' as const },
  { label: 'Games Played', value: '28', icon: 'gamepad' as const },
  { label: 'Shared Games', value: '7', icon: 'share' as const },
  { label: 'Favorites', value: '15', icon: 'heart' as const },
]

export const ACTIVITY_STATS = [
  { label: 'Games Created', value: '8', trend: '+14% from last month', icon: Sparkles },
  { label: 'Games Played', value: '16', trend: '+22% from last month', icon: Gamepad2 },
  { label: 'Total Plays', value: '142', trend: '+8% from last month', icon: Sparkles },
]

export const CHART_POINTS = [12, 18, 14, 26, 22, 34, 28, 38, 32, 44, 40, 48]

export type Achievement = ProfileAchievement & { date?: string }

export const ACHIEVEMENTS = PROFILE_ACHIEVEMENTS.map((item, index) => ({
  ...item,
  date: ['Jan 12, 2024', 'Feb 3, 2024', 'Feb 18, 2024', 'Mar 1, 2024', 'Mar 10, 2024'][index],
}))

export const PROJECT_GRADIENTS = PROFILE_PROJECTS.map((p) => p.gradient)

export const PROFILE_META = [
  { label: USER.location, icon: MapPin },
  { label: USER.occupation, icon: GraduationCap },
  { label: USER.joinedLabel, icon: Calendar },
]
