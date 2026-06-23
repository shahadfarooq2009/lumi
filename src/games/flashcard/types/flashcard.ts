export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Flashcard {
  id: string
  question: string
  answer: string
  keyIdea?: string
  topicIcon?: 'leaf' | 'atom' | 'flask'
  tag?: string
}

export interface Deck {
  id: string
  subject: string
  title: string
  cards: Flashcard[]
  difficulty: Difficulty
}
