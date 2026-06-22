export interface GameItem {
  key: string
  title: string
  sub: string
  rating: string
  tag: string
  description: string
  /** Drop your game tile image path here, e.g. '/assets/games/crossword.png' */
  image?: string
}

export const GAMES: GameItem[] = [
  {
    key: 'crossword',
    title: 'Crossword',
    sub: 'Vocabulary',
    rating: '4.8',
    tag: 'VOCABULARY · AI POWERED',
    description: 'Solve clue-based word puzzles built from your study material.',
    image: '/assets/games/crossword.png',
  },
  {
    key: 'flashcard',
    title: 'Flashcard Master',
    sub: 'Vocabulary',
    rating: '4.7',
    tag: 'VOCABULARY · AI POWERED',
    description: 'Flip through smart flashcards that adapt to what you miss.',
    image: '/assets/games/flashcard.png',
  },
  {
    key: 'wordsearch',
    title: 'Word Search',
    sub: 'Vocabulary',
    rating: '4.6',
    tag: 'VOCABULARY · AI POWERED',
    description: 'Find hidden terms in a grid generated from your notes.',
    image: '/assets/games/wordsearch.png',
  },
  {
    key: 'match',
    title: 'Match Pairs',
    sub: 'Memory',
    rating: '4.7',
    tag: 'MEMORY · AI POWERED',
    description: 'Connect terms to definitions in a fast memory challenge.',
    image: '/assets/games/match.png',
  },
  {
    key: 'quiz',
    title: 'Quiz Time',
    sub: 'General Knowledge',
    rating: '4.8',
    tag: 'GENERAL · AI POWERED',
    description: 'Classic multiple-choice rounds with instant feedback.',
    image: '/assets/games/quiz.png',
  },
  {
    key: 'math',
    title: 'Math Puzzle',
    sub: 'Mathematics',
    rating: '4.8',
    tag: 'MATHEMATICS · AI POWERED',
    description: 'Crack number puzzles pulled from your uploaded content.',
    image: '/assets/games/math.png',
  },
  {
    key: 'sudoku',
    title: 'Sudoku',
    sub: 'Logic',
    rating: '4.7',
    tag: 'LOGIC · AI POWERED',
    description: 'Logic grids that train pattern recognition and focus.',
    image: '/assets/games/sudoku.png',
  },
  {
    key: 'fillblank',
    title: 'Fill in the Blank',
    sub: 'Grammar',
    rating: '4.6',
    tag: 'GRAMMAR · AI POWERED',
    description: 'Complete sentences using key terms from your file.',
    image: '/assets/games/fillblank.png',
  },
  {
    key: 'truefalse',
    title: 'True or False',
    sub: 'Science',
    rating: '4.6',
    tag: 'SCIENCE · AI POWERED',
    description: 'Quick true/false rounds to test core concepts.',
    image: '/assets/games/truefalse.png',
  },
  {
    key: 'dragdrop',
    title: 'Drag & Drop',
    sub: 'Science',
    rating: '4.7',
    tag: 'SCIENCE · AI POWERED',
    description: 'Sort and label concepts with drag-and-drop tiles.',
    image: '/assets/games/dragdrop.png',
  },
]

export const CATEGORIES = [
  { id: 'all',      label: '🎮 All Games' },
  { id: 'math',     label: '🧮 Math' },
  { id: 'science',  label: '🔬 Science' },
  { id: 'language', label: '🌍 Language' },
  { id: 'history',  label: '📖 History' },
  { id: 'logic',    label: '🧩 Logic' },
] as const

export function filterGamesByCategory(categoryId: string): GameItem[] {
  if (categoryId === 'all') return GAMES
  const map: Record<string, string[]> = {
    math: ['math', 'sudoku'],
    science: ['truefalse', 'dragdrop'],
    language: ['crossword', 'flashcard', 'wordsearch', 'fillblank'],
    history: ['quiz'],
    logic: ['sudoku', 'match', 'crossword'],
  }
  const keys = map[categoryId] ?? []
  return GAMES.filter((game) => keys.includes(game.key))
}
