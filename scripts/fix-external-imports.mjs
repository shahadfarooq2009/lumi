import fs from 'fs'
import path from 'path'

const srcRoot = path.resolve('src')

const replacements = [
  ["from '../lib/navigateToGeneratedGame'", "from '../games/registry/navigateToGame'"],
  ["from '../../lib/navigateToGeneratedGame'", "from '../../games/registry/navigateToGame'"],
  ["from './lib/navigateToGeneratedGame'", "from './games/registry/navigateToGame'"],
  ["from '../lib/mapEditQuizToFlashcardDeck'", "from '../games/flashcard/lib/mapEditQuizToFlashcardDeck'"],
  ["from '../../lib/mapEditQuizToFlashcardDeck'", "from '../../games/flashcard/lib/mapEditQuizToFlashcardDeck'"],
  ["from '../lib/playCountdownTick'", "from '../games/flashcard/lib/playCountdownTick'"],
  ["from '../../lib/playCountdownTick'", "from '../../games/flashcard/lib/playCountdownTick'"],
  ["from '../lib/mapProjectToGameQuestions'", "from '../games/quiz/lib/mapProjectToGameQuestions'"],
  ["from '../../lib/mapProjectToGameQuestions'", "from '../../games/quiz/lib/mapProjectToGameQuestions'"],
  ["from './Home/components/GameScreen'", "from '../games/quiz/components/GameScreen'"],
  ["from './components/GameScreen'", "from '../../games/quiz/components/GameScreen'"],
  ["from './Home/data/games'", "from '../games/registry/games'"],
  ["from './data/games'", "from '../../games/registry/games'"],
  ["from '../../crossword/CrosswordGame'", "from '../../../games/crossword/components/CrosswordGame'"],
  ["import('../../crossword/CrosswordGame')", "import('../../../games/crossword/components/CrosswordGame')"],
]

function walk(dir, fn) {
  if (dir.includes(`${path.sep}games${path.sep}`)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, fn)
    else if (/\.(tsx?)$/.test(ent.name)) fn(p)
  }
}

walk(srcRoot, (file) => {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(file, content)
    console.log('updated', path.relative(srcRoot, file))
  }
})

console.log('external import fixes done')
