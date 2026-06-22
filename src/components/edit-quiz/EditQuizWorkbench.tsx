import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { GeneratedQuestion } from '../build/Thread/buildThreadTypes'
import { useBuildThreadContext } from '../../contexts/BuildThreadContext'
import { getQuizProject, saveQuizProject, type SavedQuizProject } from '../../lib/savedProjects'
import {
  applyQuizTimeToQuestions,
  cloneQuestion,
  createBlankMcqQuestion,
  initialQuizTime,
  reorderQuestions,
  renumberQuestions,
  resolveIndexAfterMove,
  type QuizTimeOption,
} from '../../lib/editQuizQuestions'
import { mapGeneratedToEditQuestions } from '../../lib/mapEditQuizQuestions'
import { readPersistedGameMode } from '../../lib/buildSession'
import type { QuestionSettingsPatch } from './Inspector'
import type { EditQuizQuestion } from '../../types/editQuiz'
import { DeleteQuestionDialog } from './DeleteQuestionDialog'
import { EditQuizTopbar } from './EditQuizTopbar'
import { EditorCanvas } from './EditorCanvas'
import type { QuestionSavePatch } from './QuestionCard'

const DEFAULT_QUIZ_TITLE = 'Cell Biology Adventure'

interface EditQuizWorkbenchProps {
  savedProject?: SavedQuizProject
  onPlayCrossword?: (title: string, questions: EditQuizQuestion[]) => void
  embedded?: boolean
}

function resolveInitialProject(
  buildId: string | undefined,
  savedProject: SavedQuizProject | undefined,
  generatedQuestions: GeneratedQuestion[],
) {
  const fromProp = savedProject
  const fromRoute =
    buildId && buildId !== 'new' ? getQuizProject(buildId) : null
  const saved = fromProp ?? fromRoute

  if (saved) {
    return {
      questions: saved.questions,
      title: saved.title,
      projectId: saved.id,
      gameMode: saved.gameMode,
    }
  }

  return {
    questions: mapGeneratedToEditQuestions(generatedQuestions),
    title: DEFAULT_QUIZ_TITLE,
    projectId: null as string | null,
    gameMode: undefined as string | undefined,
  }
}

export function EditQuizWorkbench({
  savedProject,
  onPlayCrossword,
  embedded = false,
}: EditQuizWorkbenchProps) {
  const navigate = useNavigate()
  const { id: buildId } = useParams()
  const { generatedQuestions, answers } = useBuildThreadContext()

  const initial = resolveInitialProject(buildId, savedProject, generatedQuestions)

  const [questions, setQuestions] = useState<EditQuizQuestion[]>(() =>
    applyQuizTimeToQuestions(initial.questions, initialQuizTime(initial.questions)),
  )
  const [quizTitle, setQuizTitle] = useState(initial.title)
  const [quizTime, setQuizTime] = useState<QuizTimeOption>(() =>
    initialQuizTime(initial.questions),
  )

  const [editingId, setEditingId] = useState<string | null>(null)
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null)
  const highlightTimerRef = useRef<number | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [removingQuestionId, setRemovingQuestionId] = useState<string | null>(null)
  const deleteTargetIdRef = useRef<string | null>(null)
  const lastSyncedGeneratedLen = useRef(0)
  const savedProjectIdRef = useRef<string | null>(initial.projectId)
  const [isSaving, setIsSaving] = useState(false)
  const [showAnswers] = useState(true)
  const [gameMode, setGameMode] = useState<string | undefined>(
    () => initial.gameMode ?? answers.game_mode ?? readPersistedGameMode(),
  )

  useEffect(() => {
    const mode = answers.game_mode ?? readPersistedGameMode()
    if (mode) setGameMode(mode)
  }, [answers.game_mode])

  useEffect(() => {
    const fromRoute =
      buildId && buildId !== 'new' ? getQuizProject(buildId) : null
    const saved = savedProject ?? fromRoute

    if (saved) {
      const time = initialQuizTime(saved.questions)
      setQuizTime(time)
      setQuestions(applyQuizTimeToQuestions(saved.questions, time))
      setQuizTitle(saved.title)
      setGameMode(saved.gameMode ?? answers.game_mode)
      savedProjectIdRef.current = saved.id
      setEditingId(null)
      setPendingDeleteId(null)
      setRemovingQuestionId(null)
      deleteTargetIdRef.current = null
      return
    }

    if (generatedQuestions.length === 0) {
      lastSyncedGeneratedLen.current = 0
      return
    }

    if (lastSyncedGeneratedLen.current !== generatedQuestions.length) {
      const mapped = mapGeneratedToEditQuestions(generatedQuestions)
      const time = initialQuizTime(mapped)
      setQuizTime(time)
      setQuestions(applyQuizTimeToQuestions(mapped, time))
      setQuizTitle(DEFAULT_QUIZ_TITLE)
      setEditingId(null)
      setPendingDeleteId(null)
      setRemovingQuestionId(null)
      deleteTargetIdRef.current = null
      lastSyncedGeneratedLen.current = generatedQuestions.length
    }
  }, [buildId, generatedQuestions, savedProject])

  const handleCommitQuestion = useCallback((id: string, patch: QuestionSavePatch) => {
    setQuestions((current) =>
      current.map((q) =>
        q.id === id
          ? {
              ...q,
              ...patch,
              question: patch.question.trim(),
              status: 'ready',
            }
          : q,
      ),
    )
  }, [])

  useEffect(() => {
    if (!editingId) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-question-card]')) return
      setEditingId(null)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [editingId])

  const handleAddQuestion = useCallback(() => {
    const tag = questions[questions.length - 1]?.tag ?? 'Cell structure'
    const next = renumberQuestions([...questions, createBlankMcqQuestion(quizTime, tag)])
    const addedId = next[next.length - 1]?.id
    setQuestions(next)
    if (addedId) setEditingId(addedId)
  }, [questions, quizTime])

  const handleReorderQuestions = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return
      setQuestions((current) => {
        const editingIndex = editingId ? current.findIndex((q) => q.id === editingId) : -1
        const reordered = reorderQuestions(current, fromIndex, toIndex)
        const newEditingIndex = resolveIndexAfterMove(editingIndex, fromIndex, toIndex)
        if (newEditingIndex >= 0) {
          setEditingId(reordered[newEditingIndex]!.id)
        }
        return reordered
      })
    },
    [editingId],
  )

  const handleDuplicateQuestion = useCallback((id: string) => {
    let newId: string | null = null
    setQuestions((current) => {
      const index = current.findIndex((q) => q.id === id)
      if (index === -1) return current
      const copy = cloneQuestion(current[index]!)
      newId = copy.id
      return renumberQuestions([...current.slice(0, index + 1), copy, ...current.slice(index + 1)])
    })
    if (newId) {
      setHighlightedQuestionId(newId)
      setEditingId(newId)
      if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current)
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedQuestionId((current) => (current === newId ? null : current))
        highlightTimerRef.current = null
      }, 2400)
    }
    return newId
  }, [])

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current)
    }
  }, [])

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((current) => renumberQuestions(current.filter((q) => q.id !== id)))
    setEditingId((current) => (current === id ? null : current))
  }, [])

  const handleUpdateQuestionSettings = useCallback((id: string, patch: QuestionSettingsPatch) => {
    const { time: _time, ...rest } = patch
    if (Object.keys(rest).length === 0) return
    setQuestions((current) =>
      current.map((q) => (q.id === id ? { ...q, ...rest } : q)),
    )
  }, [])

  const handleQuizTimeChange = useCallback((time: QuizTimeOption) => {
    setQuizTime(time)
    setQuestions((current) => applyQuizTimeToQuestions(current, time))
  }, [])

  const openDeleteDialog = useCallback((id: string) => {
    deleteTargetIdRef.current = id
    setPendingDeleteId(id)
  }, [])

  const confirmDeleteQuestion = useCallback(() => {
    const id = deleteTargetIdRef.current ?? pendingDeleteId
    if (!id) return
    deleteTargetIdRef.current = null
    setPendingDeleteId(null)
    setEditingId((current) => (current === id ? null : current))
    setRemovingQuestionId(id)
  }, [pendingDeleteId])

  const handleRemoveAnimationComplete = useCallback(
    (id: string) => {
      setRemovingQuestionId((current) => {
        if (current !== id) return current
        handleDeleteQuestion(id)
        return null
      })
    },
    [handleDeleteQuestion],
  )

  const cancelDeleteDialog = useCallback(() => {
    deleteTargetIdRef.current = null
    setPendingDeleteId(null)
  }, [])

  const handleSaveChanges = useCallback(() => {
    if (questions.length === 0) return

    setIsSaving(true)
    setEditingId(null)

    const projectId =
      savedProjectIdRef.current ??
      (buildId && buildId !== 'new' ? buildId : `proj-${Date.now()}`)
    savedProjectIdRef.current = projectId

    const mode = gameMode ?? answers.game_mode
    if (mode) setGameMode(mode)

    saveQuizProject({
      id: projectId,
      title: quizTitle,
      questions: applyQuizTimeToQuestions(questions, quizTime),
      gameMode: mode,
    })

    if (!embedded) {
      navigate('/mygame', { replace: false })
    }
    setIsSaving(false)
  }, [answers.game_mode, buildId, embedded, gameMode, navigate, questions, quizTime, quizTitle])

  const handlePlaySolo = useCallback(() => {
    if (!onPlayCrossword) return
    onPlayCrossword(quizTitle, applyQuizTimeToQuestions(questions, quizTime))
  }, [onPlayCrossword, questions, quizTime, quizTitle])

  const handleBack = useCallback(() => {
    navigate('/mygame')
  }, [navigate])

  const pendingDeleteQuestion =
    pendingDeleteId != null ? (questions.find((q) => q.id === pendingDeleteId) ?? null) : null

  if (questions.length === 0) return null

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F8F9FC] dark:bg-[#0f0d18]">
      {!embedded ? (
        <EditQuizTopbar
          title={quizTitle}
          onTitleChange={setQuizTitle}
          quizTime={quizTime}
          onQuizTimeChange={handleQuizTimeChange}
          onBack={handleBack}
          onPlaySolo={onPlayCrossword ? handlePlaySolo : undefined}
          playSoloDisabled={!onPlayCrossword}
          onSaveChanges={handleSaveChanges}
          isSaving={isSaving}
        />
      ) : null}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="sync">
          {pendingDeleteQuestion ? (
            <DeleteQuestionDialog
              key={pendingDeleteQuestion.id}
              questionNum={pendingDeleteQuestion.num}
              onCancel={cancelDeleteDialog}
              onConfirm={confirmDeleteQuestion}
            />
          ) : null}
        </AnimatePresence>
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <EditorCanvas
            questions={questions}
            editingId={editingId}
            highlightedQuestionId={highlightedQuestionId}
            showAnswers={showAnswers}
            removingQuestionId={removingQuestionId}
            onRemoveAnimationComplete={handleRemoveAnimationComplete}
            onEdit={setEditingId}
            onCommitQuestion={handleCommitQuestion}
            onUpdateQuestionSettings={handleUpdateQuestionSettings}
            onDuplicateQuestion={handleDuplicateQuestion}
            onRequestDelete={openDeleteDialog}
            onAddQuestion={handleAddQuestion}
            onReorderQuestions={handleReorderQuestions}
          />
        </div>
      </div>
    </div>
  )
}
