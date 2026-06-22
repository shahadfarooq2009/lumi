import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, Copy, Pencil, Share2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { GameItem } from '../data/games'
import { GameThumbnail } from '../thumbnails/GameThumbnails'
import {
  GenerationStepper,
  type GenerationStep,
  type StepAnimState,
} from './GenerationStepper'
import {
  GENERATION_QUESTION_COUNT,
  generateQuestionsFromFile,
  questionTypeForGameKey,
} from '../../../lib/questions'
import { mapQuizQuestionsToEdit } from '../../../lib/mapQuizQuestions'
import { fileNameToProjectTitle } from '../../../lib/files'
import type { EditQuizQuestion } from '../../../types/editQuiz'

const INITIAL_ANIM: StepAnimState = {
  greenThrough: -1,
  growingLineAfter: null,
  activeIndex: null,
  allDone: false,
}

export type ModalView = 'gameInfo' | 'upload' | null

export interface UploadedFileInfo {
  name: string
  sizeLabel: string
  ext: string
}

interface ModalContainerProps {
  view: ModalView
  game: GameItem | null
  onClose: () => void
  onPlay: () => void
  onBack: () => void
  onSaveGame: (questions: EditQuizQuestion[], projectTitle: string) => void
  onPlayGame: (questions: EditQuizQuestion[]) => void
}

export function ModalContainer({
  view,
  game,
  onClose,
  onPlay,
  onBack,
  onSaveGame,
  onPlayGame,
}: ModalContainerProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [uploadExpanded, setUploadExpanded] = useState(false)

  useEffect(() => {
    if (!view) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, view])

  useEffect(() => {
    if (view !== 'upload') setUploadExpanded(false)
  }, [view])

  if (!view || !game) return null

  const isWideModal = view === 'gameInfo' || (view === 'upload' && uploadExpanded)

  return createPortal(
    <div
      className="lumi-modal-bg fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        layout
        className={`relative w-full rounded-[28px] bg-white shadow-[0_32px_64px_-16px_rgba(27,21,48,0.28)] dark:border dark:border-[#2d2640] dark:bg-[#1a1628] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.55)] ${
          isWideModal
            ? 'max-w-[min(960px,94vw)] px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6'
            : 'max-w-[min(480px,92vw)] px-8 pb-[30px] pt-9 shadow-[0_40px_80px_-20px_rgba(124,77,255,0.4),0_0_0_1px_rgba(124,77,255,0.08)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(124,77,255,0.15)]'
        }`}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        {view === 'gameInfo' ? (
          <GameInfoModal game={game} onPlay={onPlay} onClose={onClose} />
        ) : null}

        {view === 'upload' ? (
          <UploadBuildModal
            game={game}
            onBack={onBack}
            onClose={onClose}
            onSaveGame={onSaveGame}
            onPlayGame={onPlayGame}
            onExpandedChange={setUploadExpanded}
          />
        ) : null}
      </motion.div>
    </div>,
    document.body,
  )
}

function GameInfoModal({
  game,
  onPlay,
  onClose,
}: {
  game: GameItem
  onPlay: () => void
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(game.description)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-col">
      <header className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <h2 className="m-0 font-display text-[18px] font-semibold text-[#1B1530] dark:text-[#f0ecff] sm:text-[20px]">
          Game Details
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530] dark:border-[#2d2640] dark:text-[#a8a0c0] dark:hover:bg-[#2a2240] dark:hover:text-[#f0ecff]"
        >
          <X size={18} strokeWidth={2.2} />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.05fr_0.95fr] md:gap-7">
        <div className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-[#F3F4F6] p-4 dark:border dark:border-[#2d2640] dark:bg-[#12101c] sm:min-h-[320px] sm:p-5">
          <div className="w-full max-w-[340px] overflow-hidden rounded-[16px] shadow-[0_8px_24px_-12px_rgba(27,21,48,0.15)] dark:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]">
            {game.image ? (
              <img
                src={game.image}
                alt={game.title}
                className="aspect-[4/3] w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="aspect-[4/3] w-full">
                <GameThumbnail gameKey={game.key} image={game.image} />
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#FFF4ED] px-2.5 py-1.5 text-[12px] font-semibold text-[#EA580C] dark:bg-[#3d2818] dark:text-[#FB923C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FB923C]" />
            {game.sub}
          </span>

          <h3 className="m-0 font-display text-[22px] font-bold leading-tight tracking-[-0.4px] text-[#1B1530] dark:text-[#f0ecff] sm:text-[24px]">
            {game.title}
          </h3>
          <p className="mt-2 text-[13px] text-[#9B94B0] dark:text-[#7a7394]">
            {game.sub} &nbsp;|&nbsp; ★ {game.rating} &nbsp;|&nbsp; 5 min
          </p>

          <div className="mt-5 flex min-h-0 flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#6B6585] dark:text-[#a8a0c0]">About</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#9B94B0] transition-colors hover:text-[#7C4DFF] dark:text-[#7a7394] dark:hover:text-[#B388FF]"
              >
                <Copy size={13} strokeWidth={2.2} />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="m-0 text-[14px] leading-[1.65] text-[#6B6585] dark:text-[#c4bdd8]">{game.description}</p>
            <p className="mt-2 text-[12px] text-[#9B94B0] dark:text-[#6f6888]">{game.tag}</p>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onPlay}
              className="lumi-btn-primary w-full rounded-full py-3.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-px"
            >
              Play Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadBuildModal({
  game,
  onBack,
  onClose,
  onSaveGame,
  onPlayGame,
  onExpandedChange,
}: {
  game: GameItem
  onBack: () => void
  onClose: () => void
  onSaveGame: (questions: EditQuizQuestion[], projectTitle: string) => void
  onPlayGame: (questions: EditQuizQuestion[]) => void
  onExpandedChange: (expanded: boolean) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'pick' | 'generating'>('pick')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [stepAnim, setStepAnim] = useState<StepAnimState>(INITIAL_ANIM)
  const [runId, setRunId] = useState(0)
  const [animComplete, setAnimComplete] = useState(false)
  const [genReady, setGenReady] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<EditQuizQuestion[]>([])
  const [genError, setGenError] = useState<string | null>(null)

  const completed = stepAnim.allDone
  const questionTarget = GENERATION_QUESTION_COUNT
  const projectTitle = fileName ? fileNameToProjectTitle(fileName) : game.title

  const ext = fileName?.split('.').pop()?.toUpperCase().slice(0, 4) ?? 'FILE'
  const file: UploadedFileInfo | null =
    fileName && fileSize ? { name: fileName, sizeLabel: fileSize, ext } : null

  const handleFile = (picked: File | undefined) => {
    if (!picked) return
    setUploadedFile(picked)
    setFileName(picked.name)
    setFileSize(`${(picked.size / 1024).toFixed(1)} KB · ready`)
    setGenError(null)
  }

  const startGenerating = () => {
    if (!file || !uploadedFile) return
    setPhase('generating')
    setStepAnim(INITIAL_ANIM)
    setAnimComplete(false)
    setGenReady(false)
    setGeneratedQuestions([])
    setGenError(null)
    setRunId((id) => id + 1)
    onExpandedChange(true)
  }

  const handleBack = () => {
    if (phase === 'generating' && !completed) {
      setPhase('pick')
      setStepAnim(INITIAL_ANIM)
      setAnimComplete(false)
      setGenReady(false)
      setGeneratedQuestions([])
      setGenError(null)
      onExpandedChange(false)
      return
    }
    onBack()
  }

  useEffect(() => {
    onExpandedChange(phase === 'generating')
  }, [onExpandedChange, phase])

  useEffect(() => {
    if (phase !== 'generating' || runId === 0) return

    const timers: number[] = []
    const circleMs = 400
    const lineMs = 1200
    const gapMs = 120
    const stepCount = 5
    let delay = 0

    for (let i = 0; i < stepCount; i++) {
      const stepIndex = i

      timers.push(
        window.setTimeout(() => {
          setStepAnim((prev) => ({
            ...prev,
            greenThrough: stepIndex,
            activeIndex: null,
            growingLineAfter: null,
          }))
        }, delay),
      )
      delay += circleMs + gapMs

      if (stepIndex < stepCount - 1) {
        timers.push(
          window.setTimeout(() => {
            setStepAnim((prev) => ({ ...prev, growingLineAfter: stepIndex }))
          }, delay),
        )
        delay += lineMs

        timers.push(
          window.setTimeout(() => {
            setStepAnim((prev) => ({ ...prev, growingLineAfter: null }))
          }, delay),
        )
        delay += gapMs
      }
    }

    timers.push(
      window.setTimeout(() => {
        setAnimComplete(true)
      }, delay),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [phase, runId])

  useEffect(() => {
    if (phase !== 'generating' || !uploadedFile || runId === 0) return

    let cancelled = false

    generateQuestionsFromFile({
      file: uploadedFile,
      questionCount: questionTarget,
      questionType: questionTypeForGameKey(game.key),
      notes: '',
    })
      .then((questions) => {
        if (cancelled) return
        setGeneratedQuestions(
          mapQuizQuestionsToEdit(questions, fileName ? fileNameToProjectTitle(fileName) : game.title),
        )
        setGenReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setGenError('Could not generate questions from your file. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [fileName, game.key, game.title, phase, questionTarget, runId, uploadedFile])

  useEffect(() => {
    if (!animComplete || !genReady || genError) return

    setStepAnim({
      greenThrough: 4,
      growingLineAfter: null,
      activeIndex: null,
      allDone: true,
    })
  }, [animComplete, genReady, genError])

  const steps: GenerationStep[] = useMemo(() => {
    const fileLabel = file?.name ?? 'your uploaded file'
    const liveCount = genReady
      ? generatedQuestions.length
      : stepAnim.greenThrough >= 2
        ? questionTarget
        : stepAnim.greenThrough >= 1
          ? Math.round(questionTarget * 0.55)
          : stepAnim.greenThrough >= 0
            ? Math.round(questionTarget * 0.25)
            : 0

    return [
      {
        id: '01',
        title: 'Read uploaded file',
        subtitle: file ? `${file.name} · extracting text` : 'Waiting for your file',
      },
      {
        id: '02',
        title: 'Analyze content with AI',
        subtitle:
          stepAnim.greenThrough >= 1
            ? 'Key topics and concepts identified'
            : 'AI is scanning your document',
      },
      {
        id: '03',
        title: 'Generate questions with AI',
        subtitle:
          completed || stepAnim.greenThrough >= 2
            ? `${liveCount} / ${questionTarget} questions created`
            : `Generating… ${liveCount} / ${questionTarget} questions`,
      },
      {
        id: '04',
        title: 'Review & refine questions',
        subtitle:
          stepAnim.greenThrough >= 3
            ? 'Clarity, difficulty, and duplicates checked'
            : 'AI is polishing question quality',
      },
      {
        id: '05',
        title: 'Questions ready',
        subtitle: completed
          ? `${generatedQuestions.length} questions generated from ${fileLabel}`
          : `Preparing your ${game.title} game`,
      },
    ]
  }, [stepAnim.greenThrough, completed, file, game.title, genReady, generatedQuestions.length, questionTarget])

  const title =
    phase === 'pick'
      ? 'Drop your file'
      : completed
        ? 'Your questions are ready'
        : 'Generating questions with AI…'

  return (
    <motion.div
      className="flex flex-col"
      layout
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <header className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530] dark:border-[#2d2640] dark:text-[#a8a0c0] dark:hover:bg-[#2a2240] dark:hover:text-[#f0ecff]"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <div className="min-w-0">
            <h2 className="m-0 truncate font-display text-[18px] font-semibold text-[#1B1530] dark:text-[#f0ecff] sm:text-[20px]">
              {title}
            </h2>
            {phase === 'generating' && !completed ? (
              <p className="mt-0.5 truncate text-[13px] text-[#9B94B0]">
                {file ? `From ${file.name}` : 'From your uploaded file'}
              </p>
            ) : null}
            {phase === 'pick' ? (
              <p className="mt-0.5 text-[13px] text-[#9B94B0]">
                We&apos;ll turn your file into a game in seconds
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {completed ? (
            <>
              <button
                type="button"
                aria-label="Share"
                onClick={() => {
                  const text = `Check out ${game.title} on Lumi`
                  if (navigator.share) {
                    void navigator.share({ title: game.title, text }).catch(() => undefined)
                  } else {
                    void navigator.clipboard.writeText(text).catch(() => undefined)
                  }
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530] dark:border-[#2d2640] dark:text-[#a8a0c0] dark:hover:bg-[#2a2240] dark:hover:text-[#f0ecff]"
              >
                <Share2 size={17} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                aria-label="Edit"
                onClick={() => onPlayGame(generatedQuestions)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530] dark:border-[#2d2640] dark:text-[#a8a0c0] dark:hover:bg-[#2a2240] dark:hover:text-[#f0ecff]"
              >
                <Pencil size={17} strokeWidth={2.2} />
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530] dark:border-[#2d2640] dark:text-[#a8a0c0] dark:hover:bg-[#2a2240] dark:hover:text-[#f0ecff]"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {phase === 'pick' ? (
        <motion.div
          key="pick"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            id="upload-file-input"
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          {!fileName ? (
            <label
              htmlFor="upload-file-input"
              className={`mb-5 block cursor-pointer rounded-[18px] border-2 border-dashed px-5 py-9 text-center transition-all ${
                dragging
                  ? 'scale-[1.01] border-[#7C4DFF] bg-[rgba(124,77,255,0.06)]'
                  : 'border-[rgba(124,77,255,0.3)] bg-gradient-to-b from-[rgba(124,77,255,0.04)] to-[rgba(124,77,255,0.01)] hover:border-[#7C4DFF] hover:bg-[rgba(124,77,255,0.06)]'
              }`}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                handleFile(event.dataTransfer.files?.[0])
              }}
            >
              <div className="mx-auto mb-3.5 grid h-[60px] w-[60px] place-items-center rounded-[18px] bg-gradient-to-br from-[#E9DEFF] to-[#F0E8FF] text-[#7C4DFF] shadow-[inset_0_0_0_1px_rgba(124,77,255,0.15)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[26px] w-[26px]">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <strong className="mb-1 block text-[15px] text-[#1B1530]">Drag & drop your file here</strong>
              <span className="text-[13px] text-[#6B6585]">
                or <em className="font-semibold not-italic text-[#7C4DFF] underline">browse from your device</em>
              </span>
            </label>
          ) : (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#EFEBFF] p-3.5">
              <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-gradient-to-br from-[#7C4DFF] to-[#B388FF] text-[11px] font-bold text-white">
                {ext}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-[#1B1530]">{fileName}</div>
                <div className="text-[12px] text-[#6B6585]">{fileSize}</div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={startGenerating}
            disabled={!file}
            className="lumi-btn-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            Generate Questions
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="generating"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {file ? (
            <div className="mb-6 flex items-center gap-3 rounded-[16px] border border-[#ECE7FB] bg-[#FAFAFA] px-4 py-3.5">
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold text-white"
                style={{ background: 'linear-gradient(135deg, #FF8E53, #FFB48A)' }}
              >
                {file.ext}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#1B1530]">{file.name}</p>
                <p className="text-[12px] text-[#9B94B0]">{file.sizeLabel}</p>
              </div>
            </div>
          ) : null}

          <div className="rounded-[20px] border border-[#ECE7FB] bg-white px-5 py-6 dark:border-[#2d2640] dark:bg-[#151220] sm:px-6 sm:py-7">
            <GenerationStepper steps={steps} anim={stepAnim} />
          </div>

          {genError ? (
            <div className="mt-4 text-center">
              <p className="m-0 text-[13px] font-medium text-[#DC2626]">{genError}</p>
              <button
                type="button"
                onClick={handleBack}
                className="mt-3 rounded-full bg-[#F3F4F6] px-4 py-2 text-[13px] font-semibold text-[#1B1530] transition-colors hover:bg-[#ECE7FB]"
              >
                Try again
              </button>
            </div>
          ) : null}

          {completed ? (
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => onSaveGame(generatedQuestions, projectTitle)}
                className="flex-1 rounded-full bg-[#F3F4F6] py-3.5 text-[14px] font-semibold text-[#1B1530] transition-colors hover:bg-[#ECE7FB] dark:bg-[#221c34] dark:text-[#f0ecff] dark:hover:bg-[#2a2240]"
              >
                Save Game
              </button>
              <button
                type="button"
                onClick={() => onPlayGame(generatedQuestions)}
                className="lumi-btn-primary flex-1 rounded-full py-3.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-px"
              >
                Play Game
              </button>
            </div>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  )
}
