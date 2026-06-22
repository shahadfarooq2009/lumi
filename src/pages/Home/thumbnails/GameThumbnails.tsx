const GAME_COLORS: Record<string, string> = {
  crossword:  '#8B5CF6',
  flashcard:  '#FBBF24',
  wordsearch: '#60A5FA',
  match:      '#4ADE80',
  quiz:       '#FB7185',
  math:       '#FCD34D',
  sudoku:     '#34D399',
  fillblank:  '#22D3EE',
  truefalse:  '#A78BFA',
  dragdrop:   '#FB923C',
}

interface GameThumbnailProps {
  gameKey: string
  image?: string
}

export function GameThumbnail({ gameKey, image }: GameThumbnailProps) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className="block h-full w-full object-cover"
        draggable={false}
      />
    )
  }

  const bg = GAME_COLORS[gameKey] ?? GAME_COLORS.quiz

  return (
    <div
      className="h-full w-full"
      style={{ background: bg }}
      role="img"
      aria-label={`${gameKey} game image`}
    />
  )
}
