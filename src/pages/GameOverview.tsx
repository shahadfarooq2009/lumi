import { useMemo, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronLeft,
  Clock,
  Download,
  FileQuestion,
  Pencil,
  Play,
  Share2,
  Star,
  Users,
  Zap,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuizProject, saveQuizProject, type SavedQuizProject } from '../lib/savedProjects'
import { mapEditQuizToFlashcardDeck } from '../games/flashcard/lib/mapEditQuizToFlashcardDeck'
import { prepareCountdownAudio } from '../games/flashcard/lib/playCountdownTick'
import { arabicFontClass } from '../lib/arabicFont'
import { GAMES } from '../games/registry/games'
import { ConvertGameModal } from './Home/components/ConvertGameModal'
import { ShareProjectModal } from './Home/components/ShareProjectModal'
import { OverviewQuestionsPanel } from './Home/components/OverviewQuestionsPanel'

const SOFT_SHADOW = 'shadow-[0_4px_18px_-6px_rgba(124,77,255,0.07)]'

interface GameData {
  title: string
  description: string
  gameType: string
  coverImage: string
  updatedAt: string
  sourceFile: string
  sourcePages: string
  questions: number
  players: number
  avgScore: number
}

function formatProjectDate(iso: string) {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
  } catch {
    return iso
  }
}

function getGameCover(gameMode?: string): string {
  const key = gameMode || 'quiz'
  const game = GAMES.find((g) => g.key === key) ?? GAMES.find((g) => g.key === 'quiz')
  return game?.image ?? '/assets/games/quiz.png'
}

function getGameTypeLabel(gameMode?: string): string {
  const key = gameMode || 'quiz'
  const game = GAMES.find((g) => g.key === key) ?? GAMES.find((g) => g.key === 'quiz')
  return game?.title ?? 'Quiz Board'
}

const DEFAULT_GAME: GameData = {
  title: 'Cell Biology Adventure',
  description:
    'Explore the amazing world of cells, discover their structures, functions, and how they divide and grow!',
  gameType: 'Quiz Time',
  coverImage: '/assets/games/quiz.png',
  updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  sourceFile: 'Biology_Chapter4_CellDivision.pdf',
  sourcePages: 'Pages 12 – 28',
  questions: 10,
  players: 48,
  avgScore: 87,
}

function projectToGameData(project: SavedQuizProject): GameData {
  return {
    title: project.title,
    description: DEFAULT_GAME.description,
    gameType: getGameTypeLabel(project.gameMode),
    coverImage: getGameCover(project.gameMode),
    updatedAt: project.updatedAt,
    sourceFile: 'Biology_Chapter4_CellDivision.pdf',
    sourcePages: 'Pages 12 – 28',
    questions: project.questionCount || DEFAULT_GAME.questions,
    players: DEFAULT_GAME.players,
    avgScore: DEFAULT_GAME.avgScore,
  }
}

function Nav({ onBack }: { onBack: () => void }) {
  return (
    <header className="relative z-10 flex w-full shrink-0 items-center justify-between px-5 py-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-3.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to My game"
          className="grid h-11 w-11 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530]"
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
        <div className="flex items-center gap-3 font-display text-[24px] font-extrabold text-[#1B1530] sm:text-[26px]">
          <div
            className="grid h-10 w-10 place-items-center rounded-[11px] text-[15px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)' }}
          >
            L
          </div>
          Lumi
        </div>
      </div>

      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #FFD3E2, #B388FF)' }}
      >
        F
      </div>
    </header>
  )
}

function HeroActionBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-[14px] font-semibold text-[#1B1530] shadow-[0_4px_16px_-6px_rgba(0,0,0,0.15)] backdrop-blur-sm transition hover:bg-white sm:px-5 sm:text-[15px]"
    >
      <Icon size={17} strokeWidth={2.2} className="text-[#7C4DFF]" />
      {label}
    </button>
  )
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: ReactNode
  label: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#F0EBFF] bg-white px-4 py-3.5 sm:gap-3.5 sm:px-5 sm:py-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3EEFF] text-[#7C4DFF] sm:h-12 sm:w-12">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-[18px] font-extrabold leading-none text-[#1B1530] sm:text-[20px]">
          {value}
        </p>
        <p className="mt-1 text-[12px] font-medium text-[#9B94B0] sm:text-[13px]">{label}</p>
      </div>
    </div>
  )
}

function GameOverviewCard({
  game,
  projectId,
  gameMode,
  onEdit,
  onConvert,
  onShare,
}: {
  game: GameData
  projectId?: string
  gameMode?: string
  onEdit: () => void
  onConvert: () => void
  onShare: () => void
}) {
  const navigate = useNavigate()

  return (
    <section className={`overflow-hidden rounded-[24px] bg-white ${SOFT_SHADOW}`}>
      <div className="p-4 sm:p-6">
        <div className="game-overview-hero relative min-h-[260px] w-full overflow-hidden rounded-[24px] sm:min-h-[300px] lg:min-h-[320px] sm:rounded-[28px]">
          <img
            src={game.coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-[75%_center]"
            draggable={false}
          />
          <div className="game-overview-hero__overlay" aria-hidden />
          <div className="game-overview-hero__grid" aria-hidden />

          <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-5 sm:top-5">
            <HeroActionBtn icon={Pencil} label="Edit" onClick={onEdit} />
            <HeroActionBtn icon={Share2} label="Share" onClick={onShare} />
          </div>

          <div className="relative z-10 flex min-h-[260px] max-w-[58%] flex-col justify-center px-7 py-10 sm:min-h-[300px] sm:max-w-[52%] sm:px-10 sm:py-12 lg:min-h-[320px]">
            <h1
              className={arabicFontClass(
                game.title,
                'm-0 font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-[34px] lg:text-[38px]',
              )}
            >
              {game.title}
            </h1>
            <p className="mt-4 text-[15px] font-medium leading-[1.55] text-white/90 sm:text-[17px] lg:text-[18px]">
              {game.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:gap-4 sm:p-6">
        <StatItem icon={Star} value={`${game.avgScore}%`} label="Score" />
        <StatItem icon={Users} value={game.players} label="Players" />
        <StatItem icon={FileQuestion} value={game.questions} label="Questions" />
        <StatItem icon={Clock} value={formatProjectDate(game.updatedAt)} label="Updated" />
      </div>

      <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 sm:gap-4 sm:px-6 sm:pb-6">
        <button
          type="button"
          onClick={() => {
            if (gameMode === 'flashcard') {
              prepareCountdownAudio()
            }
            if (projectId) navigate(`/game/${projectId}/play`)
          }}
          className="lumi-btn-primary flex items-center justify-center gap-2.5 rounded-2xl py-4 text-[16px] font-bold text-white sm:py-[18px] sm:text-[17px]"
        >
          <Play size={20} fill="currentColor" strokeWidth={0} />
          Play Game
        </button>
        <button
          type="button"
          onClick={onConvert}
          className="flex items-center justify-center gap-2.5 rounded-full bg-[#F8F5FF] py-4 text-[16px] font-semibold text-[#7C4DFF] sm:py-[18px] sm:text-[17px]"
        >
          <Zap size={19} strokeWidth={2.2} />
          Generate New Game
        </button>
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <p className="mb-2.5 text-[13px] font-semibold text-[#9B94B0] sm:text-[14px]">Source Material</p>
        <div className="flex items-center gap-4 rounded-2xl border border-[#ECE7FB] bg-[#FAFAFE] px-4 py-4 sm:px-5 sm:py-4.5">
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)' }}
          >
            PDF
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-[#1B1530] sm:text-[16px]">{game.sourceFile}</p>
            <p className="text-[13px] text-[#9B94B0] sm:text-[14px]">PDF Document · {game.sourcePages}</p>
          </div>
          <button
            type="button"
            aria-label="Download source file"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#E8DEFF] text-[#7C4DFF] hover:bg-[#F0EBFF]"
          >
            <Download size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  )
}

function QuestionsSection({ projectId }: { projectId?: string }) {
  return (
    <section className={`flex flex-col overflow-hidden rounded-[24px] bg-white ${SOFT_SHADOW}`}>
      <OverviewQuestionsPanel projectId={projectId} />
    </section>
  )
}

export function GameOverview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const [convertOpen, setConvertOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const project = useMemo(() => {
    void refreshKey
    return id ? getQuizProject(id) : null
  }, [id, refreshKey])

  const game = useMemo(
    () => (project ? projectToGameData(project) : DEFAULT_GAME),
    [project],
  )

  const handleEdit = () => {
    if (id) navigate(`/build/${id}`)
  }

  const handleShare = () => {
    setShareOpen(true)
  }

  const shareUrl =
    typeof window !== 'undefined' && id
      ? `${window.location.origin}/game/${id}/overview`
      : ''

  const persistConvertedGame = (gameKey: string) => {
    if (!id || !project) return false
    saveQuizProject({
      id,
      title: project.title,
      questions: project.questions,
      gameMode: gameKey,
    })
    setRefreshKey((key) => key + 1)
    return true
  }

  const handleConvertSave = (gameKey: string) => {
    if (!project) return
    saveQuizProject({
      title: project.title,
      questions: project.questions,
      gameMode: gameKey,
    })
    setConvertOpen(false)
    navigate('/mygame')
  }

  const handleConvertPlay = (gameKey: string) => {
    if (!persistConvertedGame(gameKey)) return
    setConvertOpen(false)
    if (gameKey === 'flashcard' && project) {
      prepareCountdownAudio()
      const deck = mapEditQuizToFlashcardDeck(project.questions, project.title)
      navigate('/play/flashcard', { state: { deck } })
      return
    }
    navigate(`/game/${id}/play`)
  }

  return (
    <div className="relative min-h-dvh font-body text-[#1B1530]">
      <div className="pointer-events-none fixed inset-0 bg-[#F4F5F8]" aria-hidden />

      <Nav onBack={() => navigate('/mygame')} />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pb-12 sm:px-8">
        <main className="flex flex-col gap-5 sm:gap-6">
          <GameOverviewCard
            game={game}
            projectId={id}
            gameMode={project?.gameMode}
            onEdit={handleEdit}
            onConvert={() => setConvertOpen(true)}
            onShare={handleShare}
          />
          <QuestionsSection projectId={id} />
        </main>
      </div>

      {convertOpen ? (
        <ConvertGameModal
          currentKey={project?.gameMode ?? 'quiz'}
          onSave={handleConvertSave}
          onPlay={handleConvertPlay}
          onClose={() => setConvertOpen(false)}
        />
      ) : null}

      {shareOpen ? (
        <ShareProjectModal
          projectTitle={game.title}
          shareUrl={shareUrl}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </div>
  )
}
