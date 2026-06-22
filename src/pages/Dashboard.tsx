import { useState } from 'react'
import {
  Home, Compass, Trophy, BarChart2, Star, Zap,
  TrendingUp, Map, Bookmark, Clock, Rocket, Search,
  Bell, ChevronDown, Menu, Check, ChevronRight, Flame,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_PRIMARY = [
  { id: 'home',         label: 'Home',        Icon: Home },
  { id: 'explore',      label: 'Explore',     Icon: Compass },
  { id: 'challenges',   label: 'Challenges',  Icon: Trophy },
  { id: 'leaderboard',  label: 'Leaderboard', Icon: BarChart2 },
  { id: 'achievements', label: 'Achievements',Icon: Star },
  { id: 'tutor',        label: 'AI Tutor',    Icon: Zap },
]

const NAV_LEARNING = [
  { id: 'progress', label: 'My Progress',     Icon: TrendingUp },
  { id: 'skillmap',  label: 'Skill Map',      Icon: Map },
  { id: 'saved',    label: 'Saved Games',     Icon: Bookmark },
  { id: 'recent',   label: 'Recently Played', Icon: Clock },
]

const GAMES = [
  { key: 'crossword', title: 'Crossword',       category: 'Vocabulary',        rating: 4.8, color: '#7C3AED', image: '/assets/games/crossword.png' },
  { key: 'flashcard', title: 'Flashcard Master', category: 'Vocabulary',        rating: 4.7, color: '#D97706', image: '/assets/games/flashcard.png' },
  { key: 'wordsearch',title: 'Word Search',      category: 'Vocabulary',        rating: 4.6, color: '#2563EB', image: '/assets/games/wordsearch.png' },
  { key: 'match',     title: 'Match Pairs',      category: 'Memory',            rating: 4.7, color: '#16A34A', image: '/assets/games/match.png' },
  { key: 'quiz',      title: 'Quiz Time',        category: 'General Knowledge', rating: 4.8, color: '#DC2626', image: '/assets/games/quiz.png' },
  { key: 'math',      title: 'Math Puzzle',      category: 'Mathematics',       rating: 4.8, color: '#2563EB', image: '/assets/games/math.png' },
  { key: 'sudoku',    title: 'Sudoku',           category: 'Logic',             rating: 4.7, color: '#16A34A', image: '/assets/games/sudoku.png' },
  { key: 'fillblank', title: 'Fill in the Blank',category: 'Grammar',           rating: 4.6, color: '#7C3AED', image: '/assets/games/fillblank.png' },
  { key: 'truefalse', title: 'True or False',    category: 'Science',           rating: 4.6, color: '#0D9488', image: '/assets/games/truefalse.png' },
  { key: 'dragdrop',  title: 'Drag & Drop',      category: 'Science',           rating: 4.7, color: '#EA580C', image: '/assets/games/dragdrop.png' },
]

const CATEGORIES = [
  { id: 'all',      label: '🎮 All Games' },
  { id: 'math',     label: '🧮 Math' },
  { id: 'science',  label: '🔬 Science' },
  { id: 'language', label: '🌍 Language' },
  { id: 'history',  label: '📖 History' },
  { id: 'logic',    label: '🧩 Logic' },
]

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar() {
  const [active, setActive] = useState('home')

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-[#ECE7FB] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
        >
          <Rocket size={18} />
        </div>
        <span className="font-display text-[18px] font-bold text-[#1B1530]">MindQuest</span>
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col px-3">
        {NAV_PRIMARY.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors ${
                isActive
                  ? 'bg-[#7C4DFF] text-white'
                  : 'text-[#1B1530] hover:bg-[#F0EBFF]'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-white' : 'text-[#6B6585]'} />
              {label}
            </button>
          )
        })}

        {/* My Learning */}
        <p className="mb-2 mt-6 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6B6585]">
          My Learning
        </p>
        {NAV_LEARNING.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors ${
              active === id ? 'bg-[#7C4DFF] text-white' : 'text-[#1B1530] hover:bg-[#F0EBFF]'
            }`}
          >
            <Icon size={17} className={active === id ? 'text-white' : 'text-[#6B6585]'} />
            {label}
          </button>
        ))}
      </nav>

      {/* Pro upgrade card */}
      <div className="mx-4 mt-6 rounded-2xl bg-[#F0EBFF] p-4">
        <p className="font-display text-[14px] font-bold text-[#1B1530]">
          Upgrade to <span className="text-[#7C3AED]">MindQuest Pro</span>
        </p>
        <ul className="mt-2 space-y-1.5">
          {['Unlimited games', 'AI-powered insights', 'Personalized learning'].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[12px] text-[#6B6585]">
              <Check size={13} className="text-[#7C3AED]" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 w-full rounded-xl py-2.5 text-[13px] font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
        >
          Upgrade Now
        </button>
      </div>

      {/* Daily Challenge card */}
      <div className="mx-4 mb-6 mt-4 rounded-2xl border border-[#ECE7FB] bg-white p-4">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-yellow-500" fill="currentColor" />
          <span className="text-[13px] font-bold text-[#1B1530]">Daily Challenge</span>
        </div>
        <p className="mt-1 text-[12px] text-[#6B6585]">Complete today's challenge</p>
        <p className="mt-0.5 text-[11px] font-semibold text-[#7C3AED]">Win 50 stars</p>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
            <span className="text-[#6B6585]">Progress</span>
            <span className="text-[#7C3AED]">75%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#ECE7FB]">
            <div className="h-full w-[75%] rounded-full bg-[#7C3AED]" />
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <header className="flex items-center gap-4 py-4">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6B6585] transition-colors hover:bg-[#F0EBFF] lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative max-w-2xl flex-1">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6585]" />
        <input
          type="search"
          placeholder="Search games, topics or skills..."
          className="h-11 w-full rounded-xl border border-[#ECE7FB] bg-white pl-11 pr-14 text-[13px] text-[#1B1530] outline-none transition-all placeholder:text-[#6B6585] focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10"
        />
        <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-lg bg-[#F7F7FB] px-2 py-0.5 text-[10px] font-bold text-[#6B6585] sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Stars */}
        <div className="hidden items-center gap-2 rounded-xl border border-[#ECE7FB] bg-white px-4 py-2 shadow-[0_8px_24px_-12px_rgba(124,77,255,0.18)] sm:flex">
          <Star size={15} className="text-yellow-500" fill="currentColor" />
          <div>
            <div className="text-[12px] font-bold text-[#1B1530]">2,450</div>
            <div className="text-[10px] text-[#6B6585]">Stars</div>
          </div>
        </div>

        {/* Streak */}
        <div className="hidden items-center gap-2 rounded-xl border border-[#ECE7FB] bg-white px-4 py-2 shadow-[0_8px_24px_-12px_rgba(124,77,255,0.18)] sm:flex">
          <Flame size={15} className="text-orange-500" />
          <div>
            <div className="text-[12px] font-bold text-[#1B1530]">12</div>
            <div className="text-[10px] text-[#6B6585]">Day Streak</div>
          </div>
        </div>

        {/* Bell */}
        <div className="relative">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ECE7FB] bg-white text-[#6B6585] shadow-[0_8px_24px_-12px_rgba(124,77,255,0.18)] transition-colors hover:text-[#1B1530]"
          >
            <Bell size={18} />
          </button>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </div>

        {/* User */}
        <div className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#ECE7FB] bg-white px-3 py-2 shadow-[0_8px_24px_-12px_rgba(124,77,255,0.18)] transition-all hover:border-[#7C3AED]/30">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <div className="text-[12px] font-bold text-[#1B1530]">Alex Johnson</div>
            <div className="text-[10px] text-[#6B6585]">Level 8</div>
          </div>
          <ChevronDown size={14} className="hidden text-[#6B6585] sm:block" />
        </div>
      </div>
    </header>
  )
}

// ─── HeroBanner ──────────────────────────────────────────────────────────────

function HeroBanner({
  categoryIndex,
  onCategoryChange,
}: {
  categoryIndex: number
  onCategoryChange: (i: number) => void
}) {
  return (
    <section
      className="mb-8 overflow-hidden rounded-3xl p-10"
      style={{ background: 'linear-gradient(135deg, #EFE9FF 0%, #E8DEFF 50%, #DDD0FF 100%)' }}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_240px]">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#7C3AED]">
            ✨ AI-Powered Learning
          </p>
          <h1 className="font-display text-[clamp(28px,3.5vw,46px)] font-bold leading-[1.1] text-[#1B1530]">
            Learn Through{' '}
            <span className="text-[#7C3AED]">Adventure</span>
          </h1>
          <p className="mt-3 max-w-[380px] text-[14px] leading-relaxed text-[#6B6585]">
            Discover amazing games that make learning fun. Play, learn, and level up your skills!
          </p>

          {/* Category pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => {
              const active = categoryIndex === i
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(i)}
                  className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-all ${
                    active
                      ? 'bg-[#7C4DFF] text-white shadow-[0_4px_14px_-4px_rgba(124,77,255,0.5)]'
                      : 'border border-[#ECE7FB] bg-white text-[#1B1530] hover:border-[#7C3AED]/30 hover:text-[#7C3AED]'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
            <button
              type="button"
              className="rounded-full border border-[#ECE7FB] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#6B6585] transition-colors hover:border-[#7C3AED]/30 hover:text-[#7C3AED]"
            >
              ··· More
            </button>
          </div>
        </div>

        {/* Center — mascot placeholder */}
        <div className="hidden items-center justify-center lg:flex">
          {/* TODO: replace with actual robot/mascot illustration */}
          <div
            className="flex h-44 w-44 items-center justify-center rounded-full text-6xl"
            style={{ background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)' }}
          >
            🤖
          </div>
        </div>

        {/* Right — AI Tutor card */}
        <div
          className="flex w-full flex-col justify-between rounded-2xl p-5 text-white lg:w-60"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' }}
        >
          <div>
            <p className="font-display text-[16px] font-bold">AI Tutor</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-violet-200">
              Your personal learning companion
            </p>
          </div>
          {/* TODO: small mascot illustration here */}
          <div className="my-4 flex items-center justify-center text-4xl">🎓</div>
          <button
            type="button"
            className="w-full rounded-xl bg-white py-2.5 text-[13px] font-bold text-[#7C3AED] transition-all hover:bg-violet-50"
          >
            Chat Now →
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── GameCard ─────────────────────────────────────────────────────────────────

function GameCard({ title, category, rating, color, image }: {
  title: string
  category: string
  rating: number
  color: string
  image?: string
}) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgba(124,77,255,0.18)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(124,77,255,0.25)]">
      {/* Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden" style={{ backgroundColor: color }}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain"
            draggable={false}
          />
        ) : (
          /* TODO: replace with illustration */
          <div className="flex h-full w-full items-center justify-center px-3 text-center">
            <span className="font-display text-[22px] font-extrabold leading-tight text-white drop-shadow-md">
              {title.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-[#1B1530]">{title}</p>
          <p className="mt-0.5 truncate text-[11px] text-[#6B6585]">{category}</p>
        </div>
        <div className="ml-2 flex shrink-0 items-center gap-0.5 text-[12px] font-semibold text-[#6B6585]">
          <Star size={11} className="text-yellow-500" fill="currentColor" />
          {rating}
        </div>
      </div>
    </div>
  )
}

// ─── PopularGames ─────────────────────────────────────────────────────────────

function PopularGames() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-[20px] font-bold text-[#1B1530]">
          🎮 Popular Games
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 text-[13px] font-semibold text-[#7C3AED] transition-colors hover:text-[#5B21B6]"
        >
          View All Games
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {GAMES.map((game) => (
          <GameCard
            key={game.key}
            title={game.title}
            category={game.category}
            rating={game.rating}
            color={game.color}
            image={game.image}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Dashboard (root) ─────────────────────────────────────────────────────────

export function Dashboard() {
  const [categoryIndex, setCategoryIndex] = useState(0)

  return (
    <div className="flex min-h-screen bg-[#F7F7FB] font-body">
      {/* Sidebar — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col px-6 py-6 sm:px-8">
        <TopBar />
        <HeroBanner categoryIndex={categoryIndex} onCategoryChange={setCategoryIndex} />
        <PopularGames />
      </main>
    </div>
  )
}
