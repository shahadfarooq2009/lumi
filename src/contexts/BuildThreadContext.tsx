import { createContext, useContext, type ReactNode } from 'react'
import { useBuildThread } from '../hooks/useBuildThread'
import type { ActiveStep, HistoryItem } from '../components/build/Thread/buildThreadTypes'

type BuildThreadContextValue = ReturnType<typeof useBuildThread>

const BuildThreadContext = createContext<BuildThreadContextValue | null>(null)

interface BuildThreadProviderProps {
  fileName: string
  hasUploadedFile: boolean
  children: ReactNode
}

export function BuildThreadProvider({ fileName, hasUploadedFile, children }: BuildThreadProviderProps) {
  const value = useBuildThread(fileName, hasUploadedFile)
  return <BuildThreadContext.Provider value={value}>{children}</BuildThreadContext.Provider>
}

export function useBuildThreadContext() {
  const ctx = useContext(BuildThreadContext)
  if (!ctx) {
    throw new Error('useBuildThreadContext must be used within BuildThreadProvider')
  }
  return ctx
}

export type { ActiveStep, HistoryItem }
