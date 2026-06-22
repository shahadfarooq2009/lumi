import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Play, Save, X } from 'lucide-react'
import { GAMES } from '../data/games'
import { GameThumbnail } from '../thumbnails/GameThumbnails'

interface ConvertGameModalProps {
  currentKey: string
  onClose: () => void
  variant?: 'convert' | 'create'
  onSave?: (gameKey: string) => void
  onPlay?: (gameKey: string) => void
  onUse?: (gameKey: string) => void
}

export function ConvertGameModal({
  currentKey,
  onClose,
  variant = 'convert',
  onSave,
  onPlay,
  onUse,
}: ConvertGameModalProps) {
  const [pickedKey, setPickedKey] = useState<string | null>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const pickedGame = pickedKey ? GAMES.find((g) => g.key === pickedKey) : null

  return createPortal(
    <div
      className="lumi-modal-bg fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="convert-game-title"
        className="relative flex max-h-[min(90vh,780px)] w-full max-w-[min(920px,96vw)] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_32px_64px_-16px_rgba(27,21,48,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#F0ECFB] px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <h2
              id="convert-game-title"
              className="m-0 font-display text-[18px] font-extrabold tracking-tight text-[#1B1530] sm:text-[22px]"
            >
              Pick a game format
            </h2>
            <p className="mt-1 text-[12px] text-[#6B6585] sm:text-[13px]">
              {variant === 'create'
                ? pickedGame
                  ? `Selected: ${pickedGame.title}`
                  : 'Choose how students will play your quiz'
                : pickedGame
                  ? `Selected: ${pickedGame.title} — save or play now`
                  : 'Same questions — choose how students will play'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530]"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {GAMES.map((game) => {
              const isCurrent = game.key === currentKey
              const isPicked = game.key === pickedKey
              const isDimmed = pickedKey !== null && !isPicked
              return (
                <button
                  key={game.key}
                  type="button"
                  onClick={() => setPickedKey((prev) => (prev === game.key ? null : game.key))}
                  className={`group relative box-border flex w-full flex-col overflow-hidden rounded-[18px] border-2 border-solid text-left transition-all duration-300 ${
                    isPicked
                      ? 'border-[#7C4DFF] bg-[#FAF8FF]'
                      : isDimmed
                        ? 'border-[#E8E6F0] bg-[#F7F7FA] opacity-60 grayscale hover:opacity-75'
                        : 'border-[#E8DEFF] bg-white hover:border-[#D4C4FF]'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F6F2FF]">
                    <GameThumbnail gameKey={game.key} image={game.image} />
                    {isCurrent ? (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#6B6585] shadow-sm">
                        Current
                      </span>
                    ) : null}
                    {isPicked ? (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-lumi-primary text-white shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>
                  <div className="px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <p
                      className={`truncate text-[12px] font-bold sm:text-[14px] ${
                        isDimmed ? 'text-[#A8A3BD]' : 'text-[#1B1530]'
                      }`}
                    >
                      {game.title}
                    </p>
                    <p
                      className={`mt-0.5 line-clamp-2 text-[10px] leading-snug sm:text-[11px] ${
                        isDimmed ? 'text-[#C4C0D4]' : 'text-[#9B94B0]'
                      }`}
                    >
                      {game.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <footer className="shrink-0 border-t border-[#ECE7FB] bg-white px-4 py-4 sm:px-6 sm:py-5">
          {variant === 'create' ? (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex flex-1 items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 py-3.5 text-[14px] font-bold text-[#6B6585] transition-all hover:bg-[#F9FAFB] hover:text-[#1B1530]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!pickedKey}
                onClick={() => pickedKey && onUse?.(pickedKey)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[14px] font-bold transition-all ${
                  pickedKey
                    ? 'lumi-btn-primary text-white'
                    : 'cursor-not-allowed bg-[#E8E6F0] text-[#A8A3BD]'
                }`}
              >
                <Play size={17} fill="currentColor" strokeWidth={0} />
                Use game
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                disabled={!pickedKey}
                onClick={() => pickedKey && onSave?.(pickedKey)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[14px] font-bold transition-all ${
                  pickedKey
                    ? 'bg-[#F6F2FF] text-lumi-primary hover:-translate-y-px hover:bg-[#EDE5FF]'
                    : 'cursor-not-allowed bg-[#F0EFF5] text-[#A8A3BD]'
                }`}
              >
                <Save size={17} strokeWidth={2.2} />
                Save
              </button>
              <button
                type="button"
                disabled={!pickedKey}
                onClick={() => pickedKey && onPlay?.(pickedKey)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[14px] font-bold transition-all ${
                  pickedKey
                    ? 'lumi-btn-primary text-white'
                    : 'cursor-not-allowed bg-[#E8E6F0] text-[#A8A3BD]'
                }`}
              >
                <Play size={17} fill="currentColor" strokeWidth={0} />
                Play Game
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  )
}
