interface AiAvatarProps {
  size?: 'md' | 'lg'
}

export function AiAvatar({ size = 'md' }: AiAvatarProps) {
  const box = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'

  return (
    <div
      className={`relative ${box} shrink-0 rounded-full border border-brand-soft/80 bg-white p-0.5 shadow-[0_6px_18px_-6px_rgba(124,58,237,0.45)]`}
    >
      <img
        src="/assets/quizora-mascot.png"
        alt="Quizora"
        className="h-full w-full rounded-full object-cover [transform:scale(1.32)]"
      />
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-game-success shadow-[0_0_6px_rgba(16,185,129,0.55)]" />
    </div>
  )
}
