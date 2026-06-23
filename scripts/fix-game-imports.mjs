import fs from 'fs'
import path from 'path'

const srcRoot = path.resolve('src')
const gamesRoot = path.join(srcRoot, 'games')

function walk(dir, fn) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, fn)
    else if (/\.(tsx?|css)$/.test(ent.name)) fn(p)
  }
}

function replaceInFile(file, replacements) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) fs.writeFileSync(file, content)
}

walk(path.join(gamesRoot, 'flashcard'), (file) => {
  const rel = path.relative(path.join(gamesRoot, 'flashcard'), file).replace(/\\/g, '/')
  const reps = []
  if (rel.startsWith('components/')) {
    reps.push(
      ['../../types/flashcard', '../types/flashcard'],
      ['../../hooks/', '../hooks/'],
      ['../../contexts/FlashcardMusicContext', '../context/FlashcardMusicContext'],
      ['../../lib/playCountdownTick', '../lib/playCountdownTick'],
    )
  }
  if (rel.startsWith('lib/')) {
    reps.push(
      ["from './userSettings'", "from '../../../lib/userSettings'"],
      ['../types/editQuiz', '../../../types/editQuiz'],
    )
  }
  if (rel === 'FlashcardGamePage.tsx') {
    reps.push(
      ['../components/flashcard/', './components/'],
      ['../contexts/FlashcardMusicContext', './context/FlashcardMusicContext'],
      ['../data/scienceDeck', './data/scienceDeck'],
      ['../hooks/useFlashcardDeck', './hooks/useFlashcardDeck'],
      ['../hooks/useGameStartCountdown', './hooks/useGameStartCountdown'],
      ['../types/flashcard', './types/flashcard'],
      ['../styles/flashcard-game.css', './styles/flashcard-game.css'],
    )
  }
  replaceInFile(file, reps)
})

walk(path.join(gamesRoot, 'crossword'), (file) => {
  const rel = path.relative(path.join(gamesRoot, 'crossword'), file).replace(/\\/g, '/')
  const reps = []
  if (rel.startsWith('components/')) {
    reps.push(
      ['../../data/cellBiologyPuzzle', '../data/cellBiologyPuzzle'],
      ['../../hooks/useCrossword', '../hooks/useCrossword'],
      ['../../lib/buildCrosswordFromQuestions', '../lib/buildCrosswordFromQuestions'],
      ['../../lib/crosswordTileStyle', '../lib/crosswordTileStyle'],
      ['../../lib/crosswordGrid', '../lib/crosswordGrid'],
      ['../../lib/crosswordLayout', '../lib/crosswordLayout'],
      ['../../types/crossword', '../types/crossword'],
      ['../../../lib/crosswordTileStyle', '../../lib/crosswordTileStyle'],
      ['../../../types/crossword', '../../types/crossword'],
      ['../../../types/editQuiz', '../../../types/editQuiz'],
    )
  }
  if (rel === 'CrosswordPage.tsx') {
    reps.push(
      ['../components/crossword/CrosswordGame', './components/CrosswordGame'],
      ['../lib/savedProjects', '../../lib/savedProjects'],
    )
  }
  if (rel.startsWith('lib/') || rel.startsWith('data/') || rel.startsWith('hooks/')) {
    reps.push(['../types/editQuiz', '../../../types/editQuiz'])
  }
  replaceInFile(file, reps)
})

const navFile = path.join(gamesRoot, 'registry/navigateToGame.ts')
replaceInFile(navFile, [
  ["from '../types/editQuiz'", "from '../../types/editQuiz'"],
  ["from './mapEditQuizToFlashcardDeck'", "from '../flashcard/lib/mapEditQuizToFlashcardDeck'"],
  ["from './playCountdownTick'", "from '../flashcard/lib/playCountdownTick'"],
])

const quizLib = path.join(gamesRoot, 'quiz/lib/mapProjectToGameQuestions.ts')
if (fs.existsSync(quizLib)) {
  replaceInFile(quizLib, [['../types/editQuiz', '../../../types/editQuiz']])
}

console.log('done')
