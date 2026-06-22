import type { EditQuizQuestion } from '../types/editQuiz'

export interface SavedQuizProject {
  id: string
  title: string
  updatedAt: string
  questionCount: number
  questions: EditQuizQuestion[]
  gameMode?: string
  archived?: boolean
  trashed?: boolean
}

const STORAGE_KEY = 'quizora:saved-projects'

function readAll(): SavedQuizProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedQuizProject[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(projects: SavedQuizProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function listQuizProjects(): SavedQuizProject[] {
  return readAll()
    .filter((project) => !project.archived && !project.trashed)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function listArchivedQuizProjects(): SavedQuizProject[] {
  return readAll()
    .filter((project) => project.archived && !project.trashed)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function listTrashedQuizProjects(): SavedQuizProject[] {
  return readAll()
    .filter((project) => project.trashed)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getQuizProject(id: string): SavedQuizProject | null {
  return readAll().find((p) => p.id === id) ?? null
}

export function archiveQuizProject(id: string): void {
  writeAll(
    readAll().map((project) =>
      project.id === id ? { ...project, archived: true, trashed: false } : project,
    ),
  )
}

export function trashQuizProjects(ids: string[]): void {
  const idSet = new Set(ids)
  writeAll(
    readAll().map((project) =>
      idSet.has(project.id) ? { ...project, trashed: true, archived: false } : project,
    ),
  )
}

export function restoreQuizProjectsFromTrash(ids: string[]): void {
  const idSet = new Set(ids)
  writeAll(
    readAll().map((project) =>
      idSet.has(project.id) ? { ...project, trashed: false, archived: true } : project,
    ),
  )
}

export function restoreQuizProject(id: string): void {
  restoreQuizProjects([id])
}

export function restoreQuizProjects(ids: string[]): void {
  const idSet = new Set(ids)
  writeAll(
    readAll().map((project) =>
      idSet.has(project.id) ? { ...project, archived: false } : project,
    ),
  )
}

export function deleteQuizProjects(ids: string[]): void {
  const idSet = new Set(ids)
  writeAll(readAll().filter((project) => !idSet.has(project.id)))
}

export function mergeQuizProjects(projects: SavedQuizProject[]): void {
  const byId = new Map(readAll().map((project) => [project.id, project]))
  for (const project of projects) {
    byId.set(project.id, project)
  }
  writeAll([...byId.values()])
}

export function saveQuizProject(input: {
  id?: string
  title: string
  questions: EditQuizQuestion[]
  gameMode?: string
}): SavedQuizProject {
  const projects = readAll()
  const id = input.id ?? `proj-${Date.now()}`
  const entry: SavedQuizProject = {
    id,
    title: input.title.trim() || 'Untitled quiz',
    updatedAt: new Date().toISOString(),
    questionCount: input.questions.length,
    questions: input.questions,
    gameMode: input.gameMode,
  }
  writeAll([entry, ...projects.filter((p) => p.id !== id)])
  return entry
}
