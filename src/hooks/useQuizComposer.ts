import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFileExtension, isImageFile } from '../lib/files'
import type { Question } from '../types/quiz'

export function useQuizComposer() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  const [showUploadCommand, setShowUploadCommand] = useState(false)
  const [composerNotes, setComposerNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileExt, setFileExt] = useState('FILE')
  const [hasResults] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [resultsMeta] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [showResults] = useState(false)
  const [error] = useState<string | null>(null)

  const resetFilePreview = useCallback(() => {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
  }, [])

  const removeFile = useCallback(() => {
    resetFilePreview()
    setSelectedFile(null)
    setShowUploadCommand(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [resetFilePreview])

  const showUploadMode = useCallback(() => {
    setShowUploadCommand(true)
    setComposerNotes('')
  }, [])

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      resetFilePreview()
      setSelectedFile(file)
      setShowUploadCommand(true)
      setFileExt(getFileExtension(file.name))

      if (isImageFile(file)) {
        setPreviewUrl(URL.createObjectURL(file))
      }
    },
    [resetFilePreview],
  )

  const handleMessagesScroll = useCallback(() => {
    const el = messagesRef.current
    if (!el || !hasResults) return
    setIsScrolled(el.scrollTop > 20)
  }, [hasResults])

  const handleSend = useCallback(async () => {
    if (!selectedFile) {
      alert('Please upload a file first.')
      showUploadMode()
      return
    }

    navigate('/build/new', {
      state: {
        fileName: selectedFile.name,
      },
    })
  }, [navigate, selectedFile, showUploadMode])

  const updateQuestion = useCallback((index: number, updated: Question) => {
    setQuestions((current) => current.map((q, i) => (i === index ? updated : q)))
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return {
    fileInputRef,
    messagesRef,
    showUploadCommand,
    composerNotes,
    setComposerNotes,
    selectedFile,
    previewUrl,
    fileExt,
    hasResults,
    isScrolled,
    isLoading,
    isRevealing,
    setIsRevealing,
    resultsMeta,
    questions,
    showResults,
    error,
    openFilePicker,
    showUploadMode,
    removeFile,
    handleFileSelect,
    handleMessagesScroll,
    handleSend,
    updateQuestion,
  }
}
