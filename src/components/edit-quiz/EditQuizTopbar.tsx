import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Menu, Pencil, Play, Save } from 'lucide-react'
import { QUIZ_TIME_OPTIONS, type QuizTimeOption } from '../../lib/editQuizQuestions'
import { arabicFontClass } from '../../lib/arabicFont'
import { ProfileMenu } from '../layout/ProfileMenu'

interface EditQuizTopbarProps {
  title?: string
  onTitleChange?: (title: string) => void
  quizTime: QuizTimeOption
  onQuizTimeChange: (time: QuizTimeOption) => void
  onBack?: () => void
  onPlaySolo?: () => void
  playSoloDisabled?: boolean
  onSaveChanges?: () => void
  isSaving?: boolean
}

const headerEase = [0.22, 1, 0.36, 1] as const

const headerItem = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: headerEase },
  },
}

function formatTimeLabel(option: QuizTimeOption) {
  const seconds = option.replace('s', '')
  return `${seconds} seconds`
}

export function EditQuizTopbar({
  title = 'Cell Biology Adventure',
  onTitleChange,
  quizTime,
  onQuizTimeChange,
  onBack,
  onPlaySolo,
  playSoloDisabled = false,
  onSaveChanges,
  isSaving = false,
}: EditQuizTopbarProps) {
  const [timeOpen, setTimeOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const timeRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editingTitle) setDraftTitle(title)
  }, [title, editingTitle])

  useEffect(() => {
    if (!editingTitle) return
    titleInputRef.current?.focus()
    titleInputRef.current?.select()
  }, [editingTitle])

  const commitTitle = () => {
    const next = draftTitle.trim() || title
    onTitleChange?.(next)
    setDraftTitle(next)
    setEditingTitle(false)
  }

  const cancelTitleEdit = () => {
    setDraftTitle(title)
    setEditingTitle(false)
  }

  useEffect(() => {
    if (!timeOpen) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (timeRef.current && !timeRef.current.contains(target)) setTimeOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [timeOpen])

  const closeTimeMenu = () => setTimeOpen(false)

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
      }}
      className="sticky top-0 z-20 grid min-h-[60px] shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#EDE5FF] bg-white px-4 py-3 dark:border-[#2d2640] dark:bg-[#1a1628] sm:min-h-[64px] sm:px-6"
    >
      <motion.div
        variants={headerItem}
        className="flex min-w-0 items-center gap-3 justify-self-start"
      >
        <button
          type="button"
          onClick={onBack}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#6B6585] transition-colors hover:bg-[#F6F2FF] hover:text-[#1B1530]"
          title="Menu"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        <div className="flex items-center gap-2.5 font-display text-[20px] font-extrabold text-[#1B1530] sm:text-[22px]">
          <div
            className="grid h-9 w-9 place-items-center rounded-[10px] text-[14px] font-extrabold text-white shadow-[0_6px_18px_-10px_rgba(124,77,255,0.55)]"
            style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)' }}
          >
            L
          </div>
          Lumi
        </div>
      </motion.div>

      {editingTitle && onTitleChange ? (
        <motion.input
          ref={titleInputRef}
          variants={headerItem}
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commitTitle()
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              cancelTitleEdit()
            }
          }}
          aria-label="Project name"
          placeholder="Project name"
          className={arabicFontClass(
            draftTitle || title,
            'w-full max-w-[240px] justify-self-center rounded-full border border-[#7C4DFF] bg-white px-6 py-2.5 text-center font-display text-[13px] font-semibold text-[#1B1530] outline-none ring-2 ring-[#7C4DFF]/20 transition-colors placeholder:text-[#9B94B0] sm:max-w-[300px] sm:px-8 sm:text-[14px]',
          )}
        />
      ) : (
        <motion.div
          variants={headerItem}
          className="flex w-full max-w-[240px] items-center justify-center gap-1.5 justify-self-center rounded-full border border-[#E8DEFF] bg-white py-2.5 pl-5 pr-2.5 dark:border-[#2d2640] dark:bg-[#221c34] sm:max-w-[300px] sm:pl-6 sm:pr-3"
        >
          <span
            className={arabicFontClass(
              title,
              'min-w-0 truncate text-center font-display text-[13px] font-semibold text-[#6B6585] sm:text-[14px]',
            )}
            title={title}
          >
            {title || 'Project name'}
          </span>
          {onTitleChange ? (
            <button
              type="button"
              onClick={() => setEditingTitle(true)}
              aria-label="Edit project name"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#9B94B0] transition-colors hover:bg-[#F6F2FF] hover:text-[#7C4DFF]"
            >
              <Pencil size={13} strokeWidth={2.2} />
            </button>
          ) : null}
        </motion.div>
      )}

      <motion.div
        variants={headerItem}
        className="flex items-center justify-end gap-1.5 justify-self-end sm:gap-2"
      >
        <div ref={timeRef} className="relative">
          <button
            type="button"
            onClick={() => setTimeOpen((open) => !open)}
            aria-expanded={timeOpen}
            aria-haspopup="menu"
            aria-label={`Time per question: ${formatTimeLabel(quizTime)}`}
            title={`Per question · ${formatTimeLabel(quizTime)}`}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              timeOpen ? 'bg-[#F0EBFF] text-[#7C4DFF]' : 'text-[#7C4DFF] hover:bg-[#F6F2FF]'
            }`}
          >
            <Clock size={17} strokeWidth={2.2} />
          </button>

          {timeOpen ? (
            <div
              role="menu"
              aria-label="Time per question"
              className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[140px] overflow-hidden rounded-xl border border-[#EDE5FF] bg-white py-1 shadow-lg dark:border-[#2d2640] dark:bg-[#1a1628]"
            >
              {QUIZ_TIME_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={quizTime === option}
                  onClick={() => {
                    onQuizTimeChange(option)
                    closeTimeMenu()
                  }}
                  className={`flex w-full px-3 py-2 text-left text-[12px] font-semibold transition-colors hover:bg-[#FAF8FF] ${
                    quizTime === option ? 'bg-[#F0EBFF] text-[#7C4DFF]' : 'text-[#6B6585]'
                  }`}
                >
                  {formatTimeLabel(option)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onSaveChanges}
          disabled={!onSaveChanges || isSaving}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E8DEFF] px-3 text-[12px] font-semibold text-[#7C4DFF] hover:bg-[#F6F2FF] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5"
        >
          <Save size={14} strokeWidth={2.2} />
          <span>{isSaving ? 'Saving…' : 'Save'}</span>
        </button>

        <button
          type="button"
          onClick={onPlaySolo}
          disabled={playSoloDisabled || !onPlaySolo}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#7C4DFF] px-3.5 text-[12px] font-semibold text-white shadow-[0_4px_14px_-6px_rgba(124,77,255,0.5)] hover:bg-[#6A3DE8] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
        >
          <Play size={14} strokeWidth={2.2} fill="currentColor" />
          <span>Play</span>
        </button>

        <ProfileMenu size="sm" />
      </motion.div>
    </motion.header>
  )
}
