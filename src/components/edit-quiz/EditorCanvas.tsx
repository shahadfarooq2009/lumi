import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  GalleryHorizontal,
  LayoutGrid,
  List,
  Plus,
} from 'lucide-react'
import type { EditQuizQuestion } from '../../types/editQuiz'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuestionReorderDrag } from '../../hooks/useQuestionReorderDrag'
import { resolveIndexAfterMove } from '../../lib/editQuizQuestions'
import { QuestionCard, type QuestionSavePatch } from './QuestionCard'
import type { QuestionSettingsPatch } from './Inspector'

const listEase = [0.22, 1, 0.36, 1] as const
const slideEase = [0.32, 0.72, 0, 1] as const
const REMOVE_DURATION_S = 0.48
const SLIDE_OUT_MS = Math.round(REMOVE_DURATION_S * 1000)
const CAROUSEL_SLIDE_OFFSET = 28
const SCROLL_NAV_MS = 460
const CAROUSEL_STAGE_MAX_CLASS = 'max-w-[1180px]'
const QUESTION_CARD_STAGE_CLASS = 'mx-auto w-full max-w-[1040px]'

type ViewMode = 'scroll' | 'carousel'
type CarouselDirection = 'prev' | 'next'

const DUPLICATE_SPLIT_MS = 620
const DUPLICATE_REVEAL_MS = 720

const carouselSlideVariants = {
  enter: (direction: CarouselDirection) => ({
    opacity: 0,
    x: direction === 'next' ? CAROUSEL_SLIDE_OFFSET : -CAROUSEL_SLIDE_OFFSET,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: CarouselDirection) => ({
    opacity: 0,
    x: direction === 'next' ? -CAROUSEL_SLIDE_OFFSET : CAROUSEL_SLIDE_OFFSET,
  }),
}

const scrollSlideVariants = {
  enter: (direction: CarouselDirection) => ({
    opacity: 0,
    y: direction === 'next' ? 72 : -72,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
}

function scrollToQuestionInContainer(container: HTMLElement | null, index: number) {
  if (!container) return
  const target = container.querySelector(`[data-question-index="${index}"]`)
  if (!(target instanceof HTMLElement)) return

  const stickyNav = container.querySelector('[data-sticky-question-nav]')
  const stickyOffset =
    stickyNav instanceof HTMLElement ? stickyNav.getBoundingClientRect().height + 20 : 88

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const visibleHeight = Math.max(containerRect.height - stickyOffset, 240)
  const targetCenter =
    container.scrollTop + (targetRect.top - containerRect.top) + targetRect.height / 2
  const nextTop = Math.max(0, targetCenter - stickyOffset - visibleHeight / 2)

  container.scrollTo({ top: nextTop, behavior: 'smooth' })
}

function DuplicateSlideEffect({ variant = 'carousel' }: { variant?: 'carousel' | 'scroll' }) {
  const isScroll = variant === 'scroll'

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[20px]">
      <motion.div
        className="absolute inset-0 rounded-[20px] ring-2 ring-[#7C4DFF]/55 ring-offset-2 ring-offset-[#F8F9FC]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.6] }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
      <motion.div
        className={`absolute inset-0 ${
          isScroll
            ? 'bg-gradient-to-b from-transparent via-[#7C4DFF]/20 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#7C4DFF]/20 to-transparent'
        }`}
        initial={isScroll ? { y: '-120%' } : { x: '-120%' }}
        animate={isScroll ? { y: '220%' } : { x: '220%' }}
        transition={{ duration: 0.62, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-4 rounded-[16px] border-2 border-dashed border-[#7C4DFF]/55 bg-[#7C4DFF]/10 shadow-[0_16px_40px_-12px_rgba(124,77,255,0.35)]"
        initial={{ x: 0, y: 0, opacity: 0.75, scale: 1 }}
        animate={
          isScroll
            ? { y: '58%', opacity: 0, scale: 0.9 }
            : { x: '58%', opacity: 0, scale: 0.9 }
        }
        transition={{ duration: 0.58, ease: slideEase }}
      />
      <motion.div
        className="absolute inset-4 rounded-[16px] border-2 border-[#7C4DFF]/35 bg-white/55 backdrop-blur-[1px]"
        initial={{ x: 0, y: 0, opacity: 0.45, scale: 1 }}
        animate={
          isScroll
            ? { y: '32%', opacity: 0.15, scale: 0.96 }
            : { x: '32%', opacity: 0.15, scale: 0.96 }
        }
        transition={{ duration: 0.58, ease: slideEase, delay: 0.04 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-[#7C4DFF] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_28px_-6px_rgba(124,77,255,0.65)]"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6], scale: [0.9, 1, 1, 0.96] }}
        transition={{ duration: 0.62, ease: 'easeOut' }}
      >
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.45, repeat: 1 }}
          className="inline-flex"
        >
          <Copy size={14} strokeWidth={2.3} />
        </motion.span>
        Duplicating…
      </motion.div>
    </div>
  )
}

interface DuplicateRevealStackProps {
  source: EditQuizQuestion
  copy: EditQuizQuestion
  sourceIndex: number
  totalQuestions: number
  editingId: string | null
  showAnswers: boolean
  readOnly: boolean
  onEdit: (id: string) => void
  onCommitQuestion: (id: string, patch: QuestionSavePatch) => void
  onUpdateQuestionSettings: (id: string, patch: QuestionSettingsPatch) => void
  onDuplicate: (id: string) => void
  onRequestDelete: (id: string) => void
}

function DuplicateRevealStack({
  source,
  copy,
  sourceIndex,
  totalQuestions,
  editingId,
  showAnswers,
  readOnly,
  onEdit,
  onCommitQuestion,
  onUpdateQuestionSettings,
  onDuplicate,
  onRequestDelete,
}: DuplicateRevealStackProps) {
  return (
    <div className="relative w-full overflow-visible">
      <motion.div
        className="relative z-10 w-full"
        initial={{ scale: 1, y: 0 }}
        animate={{ scale: [1, 0.985, 0.992], y: [0, -6, 0] }}
        transition={{ duration: 0.55, ease: slideEase }}
      >
        <QuestionCard
          question={source}
          editing={editingId === source.id}
          showAnswers={showAnswers}
          readOnly={readOnly}
          showProgressBar
          prominentQuestion
          progressCurrent={sourceIndex + 1}
          progressTotal={totalQuestions}
          onEdit={() => onEdit(source.id)}
          onCommit={(patch) => onCommitQuestion(source.id, patch)}
          onUpdateSettings={(patch) => onUpdateQuestionSettings(source.id, patch)}
          onDuplicate={() => onDuplicate(source.id)}
          onRequestDelete={() => onRequestDelete(source.id)}
        />
      </motion.div>
      <motion.div
        className="relative z-20 -mt-1 w-full sm:-mt-2"
        initial={{ y: '-92%', opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: [0.9, 1.02, 1] }}
        transition={{ duration: 0.68, ease: slideEase, delay: 0.05 }}
      >
        <QuestionCard
          question={copy}
          editing={editingId === copy.id}
          showAnswers={showAnswers}
          readOnly={readOnly}
          showProgressBar
          prominentQuestion
          isDuplicateHighlight
          progressCurrent={sourceIndex + 2}
          progressTotal={totalQuestions}
          onEdit={() => onEdit(copy.id)}
          onCommit={(patch) => onCommitQuestion(copy.id, patch)}
          onUpdateSettings={(patch) => onUpdateQuestionSettings(copy.id, patch)}
          onDuplicate={() => onDuplicate(copy.id)}
          onRequestDelete={() => onRequestDelete(copy.id)}
        />
      </motion.div>
    </div>
  )
}

interface EditorCanvasProps {
  questions: EditQuizQuestion[]
  editingId: string | null
  highlightedQuestionId?: string | null
  showAnswers: boolean
  readOnly?: boolean
  removingQuestionId: string | null
  onRemoveAnimationComplete: (id: string) => void
  onEdit: (id: string) => void
  onCommitQuestion: (id: string, patch: QuestionSavePatch) => void
  onUpdateQuestionSettings: (id: string, patch: QuestionSettingsPatch) => void
  onDuplicateQuestion: (id: string) => string | null
  onRequestDelete: (id: string) => void
  onAddQuestion?: () => void
  onReorderQuestions?: (fromIndex: number, toIndex: number) => void
}

const NAV_CIRCLE =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors sm:h-12 sm:w-12'

function SlideNavActions({
  readOnly,
  onAddQuestion,
  viewMode,
  onViewModeChange,
}: {
  readOnly: boolean
  onAddQuestion?: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
      {!readOnly && onAddQuestion ? (
        <button
          type="button"
          onClick={onAddQuestion}
          title="Add question"
          aria-label="Add question"
          className={`${NAV_CIRCLE} border border-[#E6E9F0] bg-white text-[#7C4DFF] shadow-[0_2px_8px_-5px_rgba(28,24,58,0.1)] transition-colors hover:border-[#7C4DFF] hover:bg-[#7C4DFF] hover:text-white`}
        >
          <Plus size={16} strokeWidth={2.3} />
        </button>
      ) : null}
      <ViewModeToggle mode={viewMode} onChange={onViewModeChange} embedded />
    </div>
  )
}

function GridOverviewButton({
  filmstripOpen,
  onToggle,
}: {
  filmstripOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={filmstripOpen}
      title="Show all questions"
      className={`pointer-events-auto ${NAV_CIRCLE} border shadow-[0_2px_10px_-6px_rgba(124,77,255,0.2)] ${
        filmstripOpen
          ? 'border-[#7C4DFF] bg-[#7C4DFF] text-white'
          : 'border-[#E8DEFF] bg-white text-[#7C4DFF] hover:bg-[#F6F2FF]'
      }`}
    >
      <LayoutGrid size={17} strokeWidth={2.1} />
    </button>
  )
}

const NAV_WINDOW_SIZE = 10

type NavSlot =
  | { type: 'page'; index: number }
  | { type: 'ellipsis' }
  | { type: 'empty' }

function buildQuestionNavSlots(total: number, current: number): NavSlot[] {
  if (total <= NAV_WINDOW_SIZE + 1) {
    return Array.from({ length: total }, (_, index) => ({ type: 'page' as const, index }))
  }

  const last = total - 1
  let start = current - 4
  start = Math.max(0, Math.min(start, last - NAV_WINDOW_SIZE + 1))

  const pages = Array.from({ length: NAV_WINDOW_SIZE }, (_, index) => start + index)

  if (pages[NAV_WINDOW_SIZE - 1] >= last) {
    const slots: NavSlot[] = pages.map((index) => ({ type: 'page' as const, index }))
    while (slots.length < 12) {
      slots.unshift({ type: 'empty' as const })
    }
    return slots
  }

  return [
    ...pages.map((index) => ({ type: 'page' as const, index })),
    { type: 'ellipsis' as const },
    { type: 'page' as const, index: last },
  ]
}

const NAV_BADGE_SLOT = 'h-11 w-11 shrink-0 sm:h-12 sm:w-12'

function ZoomSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex w-[128px] items-center px-1">
        <span className="pointer-events-none absolute left-0 h-1.5 w-1.5 rounded-full bg-[#9B94B0]" />
        <input
          type="range"
          min={50}
          max={150}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Zoom"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E5E7EB] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[#E5E7EB] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(28,24,58,0.18)] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#E5E7EB] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(28,24,58,0.18)]"
        />
        <span className="pointer-events-none absolute right-0 h-1.5 w-1.5 rounded-full bg-[#9B94B0]" />
      </div>
      <span className="min-w-[38px] text-[12px] font-semibold tabular-nums text-[#6B6585]">
        {value}%
      </span>
    </div>
  )
}

function MiniQuestionSlideCard({
  question,
  isActive = false,
  isPlaceholder = false,
  widthClass = 'w-[104px] sm:w-[120px]',
}: {
  question?: EditQuizQuestion
  isActive?: boolean
  isPlaceholder?: boolean
  widthClass?: string
}) {
  if (isPlaceholder) {
    return (
      <div
        className={`aspect-[16/10] shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-[#C9B8FF] bg-[#F3EEFF]/60 ${widthClass}`}
        aria-hidden
      />
    )
  }

  if (!question) return null

  return (
    <div
      className={`aspect-[16/10] shrink-0 overflow-hidden rounded-lg border-2 bg-white text-left shadow-[0_4px_16px_-8px_rgba(28,24,58,0.2)] ${widthClass} ${
        isActive
          ? 'border-[#7C4DFF] ring-2 ring-[#7C4DFF]/12'
          : 'border-[#ECE7FB]'
      }`}
    >
      <div className="flex items-center gap-1 border-b border-[#F0ECFB] bg-gradient-to-b from-[#FAFAFE] to-white px-1.5 py-1">
        <span className="rounded bg-[#F0EBFF] px-1 py-0.5 text-[7px] font-bold text-[#7C4DFF]">
          {question.num}
        </span>
      </div>
      <div className="flex flex-col p-1.5">
        <p className="line-clamp-2 text-[8px] font-bold leading-snug text-[#1B1530]">
          {question.question}
        </p>
        {question.options?.length ? (
          <div className="mt-1 space-y-0.5">
            {question.options.slice(0, 1).map((opt) => (
              <div
                key={opt.letter}
                className={`truncate rounded border px-0.5 py-px text-[6px] ${
                  opt.correct
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-[#ECE7FB] bg-[#FAFAFE] text-[#9B94B0]'
                }`}
              >
                {opt.text}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function QuestionThumbnail({
  question,
  index,
  isActive,
  onClick,
}: {
  question: EditQuizQuestion
  index: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go to question ${index + 1}`}
      aria-current={isActive ? 'true' : undefined}
      className="group flex w-full flex-col items-center gap-2"
    >
      <MiniQuestionSlideCard
        question={question}
        isActive={isActive}
        widthClass="w-full"
      />
      <span className="flex items-center gap-1.5 text-[12px] font-medium tabular-nums text-[#9B94B0]">
        <GalleryHorizontal size={14} strokeWidth={2} />
        {index + 1}
      </span>
    </button>
  )
}

const navSpring = { type: 'spring' as const, stiffness: 480, damping: 34 }

function previewNavNumber(
  itemIndex: number,
  dragFromIndex: number | null,
  dropIndex: number | null,
): number {
  if (dragFromIndex == null || dropIndex == null || dropIndex === dragFromIndex) {
    return itemIndex + 1
  }
  return resolveIndexAfterMove(itemIndex, dragFromIndex, dropIndex) + 1
}

function getBadgePushX(
  itemIndex: number,
  dropIndex: number | null,
  isDragging: boolean,
  dragFromIndex: number | null,
): number {
  if (!isDragging || dropIndex == null || dropIndex === dragFromIndex) return 0
  if (itemIndex === dropIndex - 1) return -12
  if (itemIndex === dropIndex) return 12
  return 0
}

function NavBadgeLabel({ number }: { number: number }) {
  return (
    <span className="font-oswald inline-flex items-center gap-0 leading-none font-semibold">
      <span className="tabular-nums">{number}</span>
      <span>Q</span>
    </span>
  )
}

function SlideNumberBadge({
  number,
  isActive = false,
  isPlaceholder = false,
  isPreview = false,
  size = 'md',
}: {
  number?: number
  isActive?: boolean
  isPlaceholder?: boolean
  isPreview?: boolean
  size?: 'md' | 'lg'
}) {
  const sizeClass =
    size === 'lg'
      ? 'h-11 min-w-11 px-0.5 text-[13px] sm:h-12 sm:min-w-12 sm:text-[14px]'
      : 'h-9 min-w-9 px-0.5 text-[11px] sm:h-10 sm:min-w-10 sm:text-[12px]'

  const label = number != null ? `${number}Q` : ''

  if (isPlaceholder) {
    return (
      <span
        className={`shrink-0 rounded-full bg-[#E4E8EF] ${sizeClass}`}
        aria-hidden
      />
    )
  }

  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold transition-colors duration-150 ${sizeClass} ${
        isPreview
          ? 'border-2 border-dashed border-[#B388FF] bg-[#F3EEFF] text-[#7C4DFF]'
          : isActive
            ? 'bg-[#1B1530] text-white shadow-[0_4px_12px_-4px_rgba(27,21,48,0.4)]'
            : 'border border-[#E6E9F0] bg-white text-[#5C5670] shadow-[0_2px_8px_-5px_rgba(28,24,58,0.12)] hover:border-[#C9B8FF] hover:bg-[#FBF9FF] hover:text-[#1B1530] dark:border-[#2d2640] dark:bg-[#221c34] dark:text-[#c4bdd8] dark:hover:border-[#7C4DFF]/40 dark:hover:bg-[#2a2240] dark:hover:text-[#f0ecff]'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: isPreview ? 0 : -8, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.88 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center leading-none tracking-tight"
        >
          {number != null ? <NavBadgeLabel number={number} /> : null}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function SlideDragGhost({
  index,
  previewNumber,
  x,
  y,
}: {
  index: number
  previewNumber?: number
  x: number
  y: number
}) {
  return createPortal(
    <motion.div
      className="pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
      initial={{ scale: 0.92, opacity: 0.85 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={navSpring}
    >
      <span className="grid place-items-center rounded-full border-2 border-[#7C4DFF] bg-white shadow-[0_8px_24px_-6px_rgba(124,77,255,0.45)]">
        <SlideNumberBadge number={previewNumber ?? index + 1} isActive size="lg" />
      </span>
    </motion.div>,
    document.body,
  )
}

function NavInsertGap({
  slotIndex,
  isActive,
  isDragging,
  previewNumber,
}: {
  slotIndex: number
  isActive: boolean
  isDragging: boolean
  previewNumber?: number
}) {
  if (!isDragging) return null

  return (
    <motion.span
      data-drop-slot={slotIndex}
      className="relative flex h-11 shrink-0 items-center justify-center overflow-visible sm:h-12"
      initial={false}
      animate={{ width: isActive ? 56 : 0 }}
      transition={navSpring}
      aria-hidden={!isActive}
      aria-label={isActive ? `Insert before question ${slotIndex + 1}` : undefined}
    >
      {isActive ? (
        <>
          {previewNumber == null ? (
            <span className="absolute left-1/2 top-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C4DFF] shadow-[0_0_12px_rgba(124,77,255,0.45)] sm:h-11" />
          ) : null}
          {previewNumber != null ? (
            <motion.span
              className="relative z-10 opacity-70"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.75 }}
              transition={navSpring}
            >
              <SlideNumberBadge number={previewNumber} isPreview size="lg" />
            </motion.span>
          ) : null}
        </>
      ) : null}
    </motion.span>
  )
}

function SlideNumberRow({
  questions,
  currentIndex,
  highlightedQuestionId,
  readOnly,
  dragFromIndex,
  dropIndex,
  isDragging,
  navScrollAnim = null,
  onSelect,
  onDragStart,
  consumeDragClick,
  onAddQuestion,
  viewMode,
  onViewModeChange,
  pinNav = false,
}: {
  questions: EditQuizQuestion[]
  currentIndex: number
  highlightedQuestionId?: string | null
  readOnly: boolean
  dragFromIndex: number | null
  dropIndex: number | null
  isDragging: boolean
  navScrollAnim?: { from: number; to: number } | null
  onSelect: (index: number) => void
  onDragStart: (index: number, event: React.PointerEvent<HTMLButtonElement>) => void
  consumeDragClick: () => boolean
  onAddQuestion?: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  pinNav?: boolean
}) {
  const activeItemRef = useRef<HTMLButtonElement | null>(null)
  const navSlots = buildQuestionNavSlots(questions.length, currentIndex)
  const useFixedGrid = questions.length > NAV_WINDOW_SIZE + 1
  const navMotionActive = isDragging || navScrollAnim != null
  const motionFrom = isDragging ? dragFromIndex : navScrollAnim?.from ?? null
  const motionTo = isDragging ? dropIndex : navScrollAnim?.to ?? null

  useEffect(() => {
    if (!useFixedGrid) return
    activeItemRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [currentIndex, useFixedGrid])

  return (
    <div
      data-sticky-question-nav={pinNav ? '' : undefined}
      className={`mb-2 flex w-full items-center justify-center gap-3 px-4 py-1 sm:mb-2.5 sm:gap-4 ${
        pinNav
          ? 'sticky top-0 z-20 -mx-4 border-b border-[#ECE7FB]/80 bg-[#F8F9FC]/92 px-4 py-2.5 backdrop-blur-md dark:border-[#2d2640]/80 dark:bg-[#0f0d18]/92 sm:-mx-6 sm:px-6'
          : ''
      }`}
    >
      <LayoutGroup id="question-nav-row">
      <div className="flex items-center gap-2.5 sm:gap-3">
          {navSlots.map((slot, itemIndex) => {
            if (slot.type === 'empty') {
              return (
                <span
                  key={`empty-${itemIndex}`}
                  className={`${NAV_BADGE_SLOT} block`}
                  aria-hidden
                />
              )
            }

            if (slot.type === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${itemIndex}`}
                  className={`grid place-items-center text-[12px] font-bold tracking-[0.18em] text-[#B8B3C8] ${NAV_BADGE_SLOT}`}
                  aria-hidden
                >
                  ···
                </span>
              )
            }

            const item = slot.index
            const question = questions[item]
            if (!question) return null

            const prevSlot = navSlots[itemIndex - 1]
            const prevPageIndex = prevSlot?.type === 'page' ? prevSlot.index : null
            const showGapBefore =
              navMotionActive &&
              (item === 0 || (prevPageIndex != null && prevPageIndex === item - 1))
            const isGapActive =
              navMotionActive && motionTo === item && motionFrom != null && motionTo !== motionFrom
            const displayNumber = item + 1
            const isDropAdjacent =
              isDragging &&
              dropIndex != null &&
              dropIndex !== dragFromIndex &&
              (item === dropIndex - 1 || item === dropIndex)
            const isScrollLeaving =
              !isDragging && navScrollAnim != null && item === navScrollAnim.from
            const isScrollArriving =
              !isDragging && navScrollAnim != null && item === navScrollAnim.to
            const isDupHighlight = question.id === highlightedQuestionId

            return (
              <Fragment key={question.id}>
                {showGapBefore ? (
                  <NavInsertGap
                    slotIndex={item}
                    isActive={isGapActive}
                    isDragging={navMotionActive}
                    previewNumber={
                      isGapActive && motionFrom != null
                        ? isDragging
                          ? previewNavNumber(motionFrom, motionFrom, motionTo)
                          : motionTo + 1
                        : undefined
                    }
                  />
                ) : null}
                <motion.div
                  layout
                  animate={{
                    x: getBadgePushX(item, motionTo, navMotionActive, motionFrom),
                  }}
                  transition={navSpring}
                  className={`relative flex items-center ${NAV_BADGE_SLOT}`}
                >
                  <motion.button
                    type="button"
                    ref={item === currentIndex ? activeItemRef : undefined}
                    data-drop-index={item}
                    onPointerDown={(event) => {
                      if (!readOnly) onDragStart(item, event)
                    }}
                    onClick={() => {
                      if (consumeDragClick()) return
                      onSelect(item)
                    }}
                    aria-label={`Go to question ${displayNumber}Q`}
                    aria-current={item === currentIndex ? 'true' : undefined}
                    animate={
                      isDupHighlight
                        ? {
                            scale: [1, 1.14, 1],
                            boxShadow: [
                              '0 0 0 0 rgba(124,77,255,0)',
                              '0 0 0 8px rgba(124,77,255,0.22)',
                              '0 0 0 0 rgba(124,77,255,0)',
                            ],
                          }
                        : isScrollArriving
                          ? {
                              scale: [0.94, 1.1, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(124,77,255,0)',
                                '0 0 0 10px rgba(124,77,255,0.2)',
                                '0 4px 12px -4px rgba(27,21,48,0.4)',
                              ],
                            }
                          : isScrollLeaving
                            ? { scale: 0.94, opacity: 0.72 }
                            : { scale: 1, opacity: 1, boxShadow: '0 0 0 0 rgba(124,77,255,0)' }
                    }
                    transition={
                      isScrollArriving || isScrollLeaving
                        ? navSpring
                        : { duration: 0.65, ease: 'easeOut' }
                    }
                    className={`h-full w-full grid place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C4DFF] ${
                      readOnly
                        ? 'cursor-pointer'
                        : isDragging && dragFromIndex === item
                          ? 'cursor-grabbing'
                          : 'cursor-grab'
                    } ${
                      isDupHighlight ? 'ring-2 ring-[#7C4DFF]/45 ring-offset-1 ring-offset-[#F8F9FC]' : ''
                    }`}
                  >
                    {isDragging && dragFromIndex === item ? (
                      <SlideNumberBadge isPlaceholder size="lg" />
                    ) : (
                      <SlideNumberBadge
                        number={displayNumber}
                        isActive={item === currentIndex}
                        isPreview={isDropAdjacent || isScrollLeaving}
                        size="lg"
                      />
                    )}
                  </motion.button>
                </motion.div>
              </Fragment>
            )
          })}
      </div>
      </LayoutGroup>

      <span className="h-8 w-px shrink-0 bg-[#ECE8F5]" aria-hidden />

      <SlideNavActions
        readOnly={readOnly}
        onAddQuestion={onAddQuestion}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
    </div>
  )
}

function QuestionGridOverview({
  questions,
  currentIndex,
  readOnly,
  onSelect,
  onAddQuestion,
}: {
  questions: EditQuizQuestion[]
  currentIndex: number
  readOnly: boolean
  onSelect: (index: number) => void
  onAddQuestion?: () => void
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-4 pt-2">
      <div className="mx-auto w-full max-w-[1680px] px-2 sm:px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {questions.map((question, index) => (
            <QuestionThumbnail
              key={question.id}
              question={question}
              index={index}
              isActive={index === currentIndex}
              onClick={() => onSelect(index)}
            />
          ))}
          {!readOnly ? (
            <button
              type="button"
              onClick={onAddQuestion}
              className="flex w-full flex-col items-center gap-2"
              aria-label="Add question"
            >
              <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border-2 border-dashed border-[#D8D2E8] bg-[#F0F2F7] text-[#9B94B0] transition-colors hover:border-[#7C4DFF]/40 hover:bg-[#F8F5FF] hover:text-[#7C4DFF]">
                <Plus size={28} strokeWidth={2} />
              </div>
              <span className="h-5" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function CanvasToolbar({
  viewMode,
  currentIndex,
  totalQuestions,
  zoom,
  onZoomChange,
}: {
  viewMode: ViewMode
  currentIndex: number
  totalQuestions: number
  zoom: number
  onZoomChange: (value: number) => void
}) {
  return (
    <footer className="z-30 shrink-0 border-t border-[#E1E4EA] bg-[#F0F2F7] dark:border-[#2d2640] dark:bg-[#151220]">
      <div className="flex h-11 items-center justify-end gap-4 px-4 sm:h-12 sm:px-5">
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <ZoomSlider value={zoom} onChange={onZoomChange} />
          <span className="h-5 w-px bg-[#D5DAE3]" aria-hidden />
          {viewMode === 'carousel' ? (
            <span className="text-[12px] font-semibold tabular-nums text-[#4A4560]">
              {currentIndex + 1} / {totalQuestions}
            </span>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

function CarouselNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const label = direction === 'prev' ? 'Previous question' : 'Next question'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E8DEFF] bg-white text-[#7C4DFF] shadow-[0_2px_10px_-6px_rgba(124,77,255,0.22)] transition-colors hover:bg-[#F6F2FF] disabled:cursor-not-allowed disabled:border-[#ECE8F5] disabled:bg-[#FAFAFE] disabled:text-[#C4BFD6] disabled:shadow-none sm:h-12 sm:w-12"
    >
      <Icon size={20} strokeWidth={2.2} />
    </button>
  )
}

function ViewModeToggle({
  mode,
  onChange,
  embedded = false,
}: {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
  embedded?: boolean
}) {
  const standaloneBtn = 'flex h-7 w-7 items-center justify-center rounded-md transition-colors'

  if (embedded) {
    const thumbPosition = mode === 'scroll' ? 'left-1' : 'right-1'

    return (
      <div
        className="relative inline-flex h-11 w-[5.25rem] shrink-0 items-stretch rounded-full border border-[#E6E9F0] bg-[#F0F2F7] p-1 dark:border-[#2d2640] dark:bg-[#151220] sm:h-12 sm:w-[5.75rem]"
        role="group"
        aria-label="Question view mode"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1 h-9 w-9 rounded-full bg-white shadow-[0_1px_4px_rgba(28,24,58,0.12)] transition-[left,right] duration-200 ease-out dark:bg-[#2a2240] sm:h-10 sm:w-10 ${thumbPosition}`}
        />
        <button
          type="button"
          onClick={() => onChange('scroll')}
          aria-pressed={mode === 'scroll'}
          title="Scroll view"
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full transition-colors ${
            mode === 'scroll' ? 'text-[#7C4DFF]' : 'text-[#9B94B0] hover:text-[#7C4DFF]'
          }`}
        >
          <List size={15} strokeWidth={2.3} />
        </button>
        <button
          type="button"
          onClick={() => onChange('carousel')}
          aria-pressed={mode === 'carousel'}
          title="Slide view"
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full transition-colors ${
            mode === 'carousel' ? 'text-[#7C4DFF]' : 'text-[#9B94B0] hover:text-[#7C4DFF]'
          }`}
        >
          <GalleryHorizontal size={15} strokeWidth={2.3} />
        </button>
      </div>
    )
  }

  return (
    <div
      className="inline-flex shrink-0 rounded-lg bg-white/80 p-0.5 shadow-[0_0_0_1px_rgba(28,24,58,0.08)] dark:bg-[#1a1628]/90 dark:shadow-[0_0_0_1px_rgba(124,77,255,0.12)]"
      role="group"
      aria-label="Question view mode"
    >
      <button
        type="button"
        onClick={() => onChange('scroll')}
        aria-pressed={mode === 'scroll'}
        title="Scroll view"
        className={`${standaloneBtn} ${
          mode === 'scroll'
            ? 'bg-[#EDE8FF] text-[#7C4DFF]'
            : 'text-[#7A758C] hover:text-[#7C4DFF]'
        }`}
      >
        <List size={16} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        onClick={() => onChange('carousel')}
        aria-pressed={mode === 'carousel'}
        title="Slide view"
        className={`${standaloneBtn} ${
          mode === 'carousel'
            ? 'bg-[#EDE8FF] text-[#7C4DFF]'
            : 'text-[#7A758C] hover:text-[#7C4DFF]'
        }`}
      >
        <GalleryHorizontal size={16} strokeWidth={2.2} />
      </button>
    </div>
  )
}

interface QuestionSlideProps {
  question: EditQuizQuestion
  index: number
  totalQuestions: number
  editingId: string | null
  showAnswers: boolean
  readOnly: boolean
  isRemoving: boolean
  onEdit: (id: string) => void
  onCommitQuestion: (id: string, patch: QuestionSavePatch) => void
  onUpdateQuestionSettings: (id: string, patch: QuestionSettingsPatch) => void
  onDuplicateQuestion: (id: string) => void
  onRequestDelete: (id: string) => void
  isDragSource?: boolean
  isDropTarget?: boolean
  isDuplicateHighlight?: boolean
  isDuplicatingSource?: boolean
  isDuplicateReveal?: boolean
  scrollNavDirection?: CarouselDirection | null
  scrollNavTick?: number
}

function QuestionSlide({
  question,
  index,
  totalQuestions,
  editingId,
  showAnswers,
  readOnly,
  isRemoving,
  isDragSource,
  isDropTarget,
  onEdit,
  onCommitQuestion,
  onUpdateQuestionSettings,
  onDuplicateQuestion,
  onRequestDelete,
  isDuplicateHighlight = false,
  isDuplicatingSource = false,
  isDuplicateReveal = false,
  scrollNavDirection = null,
  scrollNavTick = 0,
}: QuestionSlideProps) {
  const isRevealEnter = isDuplicateReveal || isDuplicateHighlight
  const isScrollNavEnter = scrollNavDirection != null && scrollNavTick > 0

  return (
    <motion.div
      data-drop-index={index}
      layout="position"
      animate={isRemoving ? { height: 0, marginBottom: 0 } : false}
      transition={{
        layout: { duration: isDuplicateReveal ? 0.68 : REMOVE_DURATION_S, ease: listEase },
        height: { duration: REMOVE_DURATION_S, ease: listEase },
        marginBottom: { duration: REMOVE_DURATION_S, ease: listEase },
      }}
      data-question-index={index}
      className={`scroll-mt-24 ${isRemoving ? 'overflow-hidden' : 'mb-8 sm:mb-10'} ${
        isDropTarget ? 'rounded-[22px] ring-2 ring-[#7C4DFF]/35 ring-offset-2 ring-offset-[#F8F9FC]' : ''
      }`}
    >
      <motion.div
        key={
          isScrollNavEnter
            ? `scroll-nav-${question.id}-${scrollNavTick}`
            : question.id
        }
        custom={scrollNavDirection ?? 'next'}
        variants={isScrollNavEnter ? scrollSlideVariants : undefined}
        initial={
          isScrollNavEnter
            ? 'enter'
            : isRevealEnter
              ? { opacity: 0.2, y: -96, scale: 0.91 }
              : { opacity: 0, y: 12 }
        }
        animate={
          isScrollNavEnter
            ? 'center'
            : {
                opacity: isRemoving ? 0 : 1,
                y: isRemoving ? 0 : isDuplicatingSource ? [0, -8, 0] : 0,
                x: isRemoving ? '105%' : 0,
                scale: isDuplicatingSource
                  ? [1, 0.97, 0.99]
                  : isRevealEnter
                    ? [0.91, 1.02, 1]
                    : 1,
              }
        }
        transition={
          isScrollNavEnter
            ? { duration: 0.48, ease: slideEase }
            : {
                opacity: {
                  duration: isRemoving
                    ? REMOVE_DURATION_S * 0.85
                    : isRevealEnter
                      ? 0.68
                      : 0.35,
                  delay: isRemoving || isRevealEnter || isDuplicatingSource ? 0 : index * 0.04,
                },
                y: {
                  duration: isDuplicatingSource ? 0.58 : isRevealEnter ? 0.68 : 0.35,
                  delay: isRemoving || isRevealEnter || isDuplicatingSource ? 0 : index * 0.04,
                  ease: slideEase,
                },
                scale: {
                  duration: isDuplicatingSource ? 0.58 : isRevealEnter ? 0.68 : 0.35,
                  ease: slideEase,
                },
                x: { duration: REMOVE_DURATION_S, ease: slideEase },
              }
        }
        className={`relative ${QUESTION_CARD_STAGE_CLASS} rounded-[20px] ${isRemoving ? 'pointer-events-none ring-2 ring-red-400/50' : ''}`}
      >
        <QuestionCard
          question={question}
          editing={editingId === question.id}
          showAnswers={showAnswers}
          readOnly={readOnly}
          showProgressBar
          prominentQuestion
          progressCurrent={index + 1}
          progressTotal={totalQuestions}
          isDragSource={isDragSource}
          isDuplicateHighlight={isDuplicateHighlight}
          isDuplicatingSource={isDuplicatingSource}
          onEdit={() => onEdit(question.id)}
          onCommit={(patch) => onCommitQuestion(question.id, patch)}
          onUpdateSettings={(patch) => onUpdateQuestionSettings(question.id, patch)}
          onDuplicate={() => onDuplicateQuestion(question.id)}
          onRequestDelete={() => onRequestDelete(question.id)}
        />
        <AnimatePresence>
          {isDuplicatingSource ? (
            <motion.div
              key="duplicate-scroll-effect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <DuplicateSlideEffect variant="scroll" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export function EditorCanvas({
  questions,
  editingId,
  highlightedQuestionId = null,
  showAnswers,
  readOnly = false,
  removingQuestionId,
  onRemoveAnimationComplete,
  onEdit,
  onCommitQuestion,
  onUpdateQuestionSettings,
  onDuplicateQuestion,
  onRequestDelete,
  onAddQuestion,
  onReorderQuestions,
}: EditorCanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselDirection, setCarouselDirection] = useState<CarouselDirection>('next')
  const [zoom, setZoom] = useState(100)
  const [filmstripOpen, setFilmstripOpen] = useState(false)
  const [duplicatingSourceId, setDuplicatingSourceId] = useState<string | null>(null)
  const [duplicateReveal, setDuplicateReveal] = useState<{
    sourceId: string
    newId: string
  } | null>(null)
  const duplicateTimerRef = useRef<number | null>(null)
  const duplicateRevealTimerRef = useRef<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollNavTimerRef = useRef<number | null>(null)
  const isProgrammaticScrollRef = useRef(false)
  const [scrollNav, setScrollNav] = useState<{
    index: number
    direction: CarouselDirection
    tick: number
  } | null>(null)
  const [navScrollAnim, setNavScrollAnim] = useState<{ from: number; to: number } | null>(null)

  const zoomScale = zoom / 100

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      onReorderQuestions?.(fromIndex, toIndex)
      setCarouselIndex((current) => resolveIndexAfterMove(current, fromIndex, toIndex))
      setCarouselDirection(toIndex > fromIndex ? 'next' : 'prev')

      if (viewMode === 'scroll') {
        isProgrammaticScrollRef.current = true
        requestAnimationFrame(() => {
          scrollToQuestionInContainer(scrollContainerRef.current, toIndex)
        })
        window.setTimeout(() => {
          isProgrammaticScrollRef.current = false
        }, SCROLL_NAV_MS)
      }
    },
    [onReorderQuestions, viewMode],
  )

  const { beginDrag, dragFromIndex, dropIndex, dragPointer, isDragging, consumeDragClick } =
    useQuestionReorderDrag(readOnly, questions.length, handleReorder)

  const handleToggleFilmstrip = () => {
    setFilmstripOpen((open) => {
      if (!open) setViewMode('carousel')
      return !open
    })
  }

  const handleAddQuestion = () => {
    setCarouselDirection('next')
    onAddQuestion?.()
    setFilmstripOpen(false)
    setViewMode('carousel')
  }

  const handleGridSelect = (index: number) => {
    setCarouselDirection(index >= carouselIndex ? 'next' : 'prev')
    setCarouselIndex(index)
    setViewMode('carousel')
    setFilmstripOpen(false)
  }

  const handleFilmstripSelect = (index: number) => {
    if (index === carouselIndex) return
    setCarouselDirection(index > carouselIndex ? 'next' : 'prev')
    setCarouselIndex(index)
  }

  const scrollContentPad = 'pb-3 pt-8 sm:pb-4 sm:pt-10'
  const carouselContentPad = 'pb-3 pt-8 sm:pb-4 sm:pt-10'

  useEffect(() => {
    if (!removingQuestionId) return
    const id = removingQuestionId
    const timer = window.setTimeout(() => onRemoveAnimationComplete(id), SLIDE_OUT_MS + 50)
    return () => window.clearTimeout(timer)
  }, [removingQuestionId, onRemoveAnimationComplete])

  useEffect(() => {
    setCarouselIndex((index) => Math.min(index, Math.max(0, questions.length - 1)))
  }, [questions.length])

  useEffect(() => {
    if (viewMode !== 'carousel' || !editingId) return
    if (duplicateReveal || duplicatingSourceId) return
    const editIndex = questions.findIndex((q) => q.id === editingId)
    if (editIndex < 0) return
    setCarouselIndex((current) => {
      if (editIndex !== current) {
        setCarouselDirection(editIndex > current ? 'next' : 'prev')
      }
      return editIndex
    })
  }, [editingId, questions, viewMode, duplicateReveal, duplicatingSourceId])

  useEffect(() => {
    if (!highlightedQuestionId || duplicateReveal) return
    const index = questions.findIndex((q) => q.id === highlightedQuestionId)
    if (index < 0) return
    if (viewMode === 'carousel' && !filmstripOpen) return
    setFilmstripOpen(false)
  }, [highlightedQuestionId, questions, viewMode, filmstripOpen, duplicateReveal])

  useEffect(() => {
    if (!duplicateReveal) return
    const { newId } = duplicateReveal
    if (duplicateRevealTimerRef.current) window.clearTimeout(duplicateRevealTimerRef.current)
    duplicateRevealTimerRef.current = window.setTimeout(() => {
      const newIndex = questions.findIndex((q) => q.id === newId)
      if (newIndex >= 0) {
        if (viewMode === 'carousel' && !filmstripOpen) {
          setCarouselDirection('next')
          setCarouselIndex(newIndex)
        }
        if (viewMode === 'scroll') {
          scrollToQuestionInContainer(scrollContainerRef.current, newIndex)
        }
      }
      setDuplicateReveal(null)
      duplicateRevealTimerRef.current = null
    }, DUPLICATE_REVEAL_MS)
    return () => {
      if (duplicateRevealTimerRef.current) {
        window.clearTimeout(duplicateRevealTimerRef.current)
        duplicateRevealTimerRef.current = null
      }
    }
  }, [duplicateReveal, questions, viewMode, filmstripOpen])

  const carouselQuestion = questions[carouselIndex]
  const isDuplicateBusy = duplicatingSourceId != null || duplicateReveal != null
  const isDuplicatingCurrentSlide =
    duplicatingSourceId != null && carouselQuestion?.id === duplicatingSourceId
  const revealSourceQuestion = duplicateReveal
    ? questions.find((q) => q.id === duplicateReveal.sourceId)
    : null
  const revealCopyQuestion = duplicateReveal
    ? questions.find((q) => q.id === duplicateReveal.newId)
    : null
  const revealSourceIndex = duplicateReveal
    ? questions.findIndex((q) => q.id === duplicateReveal.sourceId)
    : -1
  const showCarouselRevealStack =
    duplicateReveal != null &&
    viewMode === 'carousel' &&
    !filmstripOpen &&
    revealSourceQuestion != null &&
    revealCopyQuestion != null &&
    revealSourceIndex >= 0
  const canGoPrev = carouselIndex > 0 && !isDuplicateBusy
  const canGoNext = carouselIndex < questions.length - 1 && !isDuplicateBusy

  const goPrev = useCallback(() => {
    setCarouselDirection('prev')
    setCarouselIndex((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setCarouselDirection('next')
    setCarouselIndex((i) => Math.min(questions.length - 1, i + 1))
  }, [questions.length])

  const handleScrollQuestionSelect = useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return
      if (index === carouselIndex) return
      const from = carouselIndex
      const direction: CarouselDirection = index > from ? 'next' : 'prev'
      setNavScrollAnim({ from, to: index })
      setCarouselIndex(index)
      setScrollNav({ index, direction, tick: Date.now() })
      isProgrammaticScrollRef.current = true

      requestAnimationFrame(() => {
        scrollToQuestionInContainer(scrollContainerRef.current, index)
      })

      if (scrollNavTimerRef.current) window.clearTimeout(scrollNavTimerRef.current)
      scrollNavTimerRef.current = window.setTimeout(() => {
        setScrollNav(null)
        setNavScrollAnim(null)
        isProgrammaticScrollRef.current = false
        scrollNavTimerRef.current = null
      }, SCROLL_NAV_MS)
    },
    [carouselIndex, questions.length],
  )

  useEffect(() => {
    if (viewMode !== 'scroll') return
    const container = scrollContainerRef.current
    if (!container) return

    let ticking = false
    const syncActiveFromScroll = () => {
      if (isProgrammaticScrollRef.current) return

      const slides = container.querySelectorAll<HTMLElement>('[data-question-index]')
      if (!slides.length) return

      const containerRect = container.getBoundingClientRect()
      const focusLine = containerRect.top + containerRect.height * 0.38

      let bestIndex = 0
      let bestDistance = Infinity

      slides.forEach((slide) => {
        const idx = Number(slide.dataset.questionIndex)
        if (Number.isNaN(idx)) return
        const rect = slide.getBoundingClientRect()
        const slideCenter = rect.top + rect.height / 2
        const distance = Math.abs(slideCenter - focusLine)
        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = idx
        }
      })

      setCarouselIndex((current) => (current === bestIndex ? current : bestIndex))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        syncActiveFromScroll()
        ticking = false
      })
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    syncActiveFromScroll()
    return () => container.removeEventListener('scroll', onScroll)
  }, [viewMode, questions.length])

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      return Boolean(
        target.closest(
          'input, textarea, select, [contenteditable="true"], [data-question-card][data-editing="true"]',
        ),
      )
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (isDuplicateBusy) return
      if (isTypingTarget(event.target)) return

      if (viewMode === 'carousel' && !filmstripOpen) {
        event.preventDefault()
        if (event.key === 'ArrowLeft' && carouselIndex > 0) goPrev()
        if (event.key === 'ArrowRight' && carouselIndex < questions.length - 1) goNext()
        return
      }

      if (viewMode === 'scroll') {
        event.preventDefault()
        const targetIndex =
          event.key === 'ArrowLeft' ? carouselIndex - 1 : carouselIndex + 1
        if (targetIndex < 0 || targetIndex >= questions.length) return
        handleScrollQuestionSelect(targetIndex)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    viewMode,
    filmstripOpen,
    isDuplicateBusy,
    carouselIndex,
    questions.length,
    goPrev,
    goNext,
    handleScrollQuestionSelect,
  ])

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'scroll') setFilmstripOpen(false)
  }

  const requestDuplicateSlide = useCallback(
    (sourceId: string) => {
      if (readOnly || duplicatingSourceId) return

      const sourceIndex = questions.findIndex((q) => q.id === sourceId)
      const inCarouselSlide = viewMode === 'carousel' && !filmstripOpen

      if (inCarouselSlide) {
        setCarouselDirection('next')
      }

      setDuplicatingSourceId(sourceId)

      if (viewMode === 'scroll' && sourceIndex >= 0) {
        window.setTimeout(() => {
          scrollToQuestionInContainer(scrollContainerRef.current, sourceIndex)
        }, 40)
      }

      if (duplicateTimerRef.current) window.clearTimeout(duplicateTimerRef.current)
      duplicateTimerRef.current = window.setTimeout(() => {
        const newId = onDuplicateQuestion(sourceId)
        setDuplicatingSourceId(null)
        duplicateTimerRef.current = null
        if (newId) {
          setDuplicateReveal({ sourceId, newId })
        }
      }, DUPLICATE_SPLIT_MS)
    },
    [readOnly, duplicatingSourceId, viewMode, filmstripOpen, questions, onDuplicateQuestion],
  )

  useEffect(() => {
    return () => {
      if (duplicateTimerRef.current) window.clearTimeout(duplicateTimerRef.current)
      if (duplicateRevealTimerRef.current) window.clearTimeout(duplicateRevealTimerRef.current)
      if (scrollNavTimerRef.current) window.clearTimeout(scrollNavTimerRef.current)
    }
  }, [])

  const slideNumberRowProps = {
    questions,
    currentIndex: carouselIndex,
    highlightedQuestionId,
    readOnly,
    dragFromIndex,
    dropIndex,
    isDragging,
    navScrollAnim,
    onDragStart: beginDrag,
    consumeDragClick,
    onAddQuestion: handleAddQuestion,
    viewMode,
    onViewModeChange: handleViewModeChange,
  }

  return (
    <section className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F8F9FC] dark:bg-[#0f0d18]">
      {dragPointer && dragFromIndex != null ? (
        <SlideDragGhost
          index={dragFromIndex}
          previewNumber={
            dropIndex != null
              ? previewNavNumber(dragFromIndex, dragFromIndex, dropIndex)
              : dragFromIndex + 1
          }
          x={dragPointer.x}
          y={dragPointer.y}
        />
      ) : null}
      <div
        ref={scrollContainerRef}
        className={`relative flex min-h-0 flex-1 flex-col ${
          viewMode === 'scroll' ? 'overflow-y-auto overscroll-y-contain' : 'overflow-hidden'
        }`}
      >
        <div aria-hidden className="edit-canvas-grid pointer-events-none absolute inset-0 z-0" />

        <div
          className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-none flex-col"
        >
        {viewMode === 'scroll' ? (
          <>
            <div
              className={`mx-auto w-full ${CAROUSEL_STAGE_MAX_CLASS} px-4 sm:px-6 ${scrollContentPad}`}
              style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
            >
              <SlideNumberRow
                {...slideNumberRowProps}
                pinNav
                onSelect={handleScrollQuestionSelect}
              />
              <LayoutGroup id="edit-quiz-questions">
              {questions.map((q, i) => (
                <QuestionSlide
                  key={q.id}
                  question={q}
                  index={i}
                  totalQuestions={questions.length}
                  editingId={editingId}
                showAnswers={showAnswers}
                readOnly={readOnly}
                isRemoving={removingQuestionId === q.id}
                isDragSource={dragFromIndex === i}
                isDropTarget={dropIndex === i && dragFromIndex !== i}
                onEdit={onEdit}
                onCommitQuestion={onCommitQuestion}
                onUpdateQuestionSettings={onUpdateQuestionSettings}
                onDuplicateQuestion={requestDuplicateSlide}
                onRequestDelete={onRequestDelete}
                isDuplicateHighlight={highlightedQuestionId === q.id}
                isDuplicatingSource={duplicatingSourceId === q.id}
                isDuplicateReveal={duplicateReveal?.newId === q.id}
                scrollNavDirection={
                  scrollNav?.index === i ? scrollNav.direction : null
                }
                scrollNavTick={scrollNav?.index === i ? scrollNav.tick : 0}
              />
              ))}
              </LayoutGroup>
            </div>
          </>
        ) : filmstripOpen ? (
          <>
            <div className={`mx-auto w-full ${CAROUSEL_STAGE_MAX_CLASS} px-4 sm:px-6 ${scrollContentPad}`}>
              <SlideNumberRow
                {...slideNumberRowProps}
                onSelect={handleFilmstripSelect}
              />
            </div>
            <QuestionGridOverview
              questions={questions}
              currentIndex={carouselIndex}
              readOnly={readOnly}
              onSelect={handleGridSelect}
              onAddQuestion={handleAddQuestion}
            />
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              className={`flex min-h-0 flex-1 items-start justify-center overflow-y-auto overscroll-y-contain px-4 sm:px-6 ${carouselContentPad}`}
            >
              <div className={`flex w-full ${CAROUSEL_STAGE_MAX_CLASS} flex-col gap-3 sm:gap-4`}>
                <SlideNumberRow
                  {...slideNumberRowProps}
                  onSelect={handleFilmstripSelect}
                />

                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 sm:gap-x-6">
                  <CarouselNavButton direction="prev" disabled={!canGoPrev} onClick={goPrev} />

                  <div
                    className={`relative flex ${QUESTION_CARD_STAGE_CLASS} min-w-0`}
                    style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {showCarouselRevealStack && revealSourceQuestion && revealCopyQuestion ? (
                        <motion.div
                          key={`reveal-${duplicateReveal.newId}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-full rounded-[20px]"
                        >
                          <DuplicateRevealStack
                            source={revealSourceQuestion}
                            copy={revealCopyQuestion}
                            sourceIndex={revealSourceIndex}
                            totalQuestions={questions.length}
                            editingId={editingId}
                            showAnswers={showAnswers}
                            readOnly={readOnly}
                            onEdit={onEdit}
                            onCommitQuestion={onCommitQuestion}
                            onUpdateQuestionSettings={onUpdateQuestionSettings}
                            onDuplicate={requestDuplicateSlide}
                            onRequestDelete={onRequestDelete}
                          />
                        </motion.div>
                      ) : carouselQuestion ? (
                        <motion.div
                          key={carouselQuestion.id}
                          custom={carouselDirection}
                          variants={carouselSlideVariants}
                          initial={
                            highlightedQuestionId === carouselQuestion.id && !duplicateReveal
                              ? {
                                  opacity: 0,
                                  y: -64,
                                  scale: 0.92,
                                }
                              : 'enter'
                          }
                          animate={
                            isDuplicatingCurrentSlide
                              ? {
                                  opacity: 1,
                                  x: [0, -14, 0],
                                  scale: [1, 0.96, 0.99],
                                }
                              : highlightedQuestionId === carouselQuestion.id && !duplicateReveal
                                ? {
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: [0.92, 1.02, 1],
                                    filter: 'blur(0px)',
                                  }
                                : 'center'
                          }
                          exit="exit"
                          transition={{
                            duration: isDuplicatingCurrentSlide
                              ? 0.58
                              : highlightedQuestionId === carouselQuestion.id
                                ? 0.52
                                : 0.28,
                            ease: slideEase,
                          }}
                          className="w-full rounded-[20px]"
                        >
                          <QuestionCard
                            question={carouselQuestion}
                            editing={editingId === carouselQuestion.id}
                            showAnswers={showAnswers}
                            readOnly={readOnly}
                            showProgressBar
                            prominentQuestion
                            isDragSource={dragFromIndex === carouselIndex}
                            isDuplicateHighlight={highlightedQuestionId === carouselQuestion.id}
                            isDuplicatingSource={isDuplicatingCurrentSlide}
                            progressCurrent={carouselIndex + 1}
                            progressTotal={questions.length}
                            onEdit={() => onEdit(carouselQuestion.id)}
                            onCommit={(patch) => onCommitQuestion(carouselQuestion.id, patch)}
                            onUpdateSettings={(patch) =>
                              onUpdateQuestionSettings(carouselQuestion.id, patch)
                            }
                            onDuplicate={() => requestDuplicateSlide(carouselQuestion.id)}
                            onRequestDelete={() => onRequestDelete(carouselQuestion.id)}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isDuplicatingCurrentSlide ? (
                        <motion.div
                          key="duplicate-slide-effect"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0"
                        >
                          <DuplicateSlideEffect variant="carousel" />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <CarouselNavButton direction="next" disabled={!canGoNext} onClick={goNext} />
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-14 right-4 z-40 sm:bottom-[3.75rem] sm:right-5">
        <GridOverviewButton
          filmstripOpen={filmstripOpen}
          onToggle={handleToggleFilmstrip}
        />
      </div>

      <CanvasToolbar
        viewMode={viewMode}
        currentIndex={carouselIndex}
        totalQuestions={questions.length}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </section>
  )
}
