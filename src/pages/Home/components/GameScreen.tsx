import { useGame, type GameQuestion } from '../hooks/useGame'

interface GameScreenProps {
  onExit: () => void
  questions?: GameQuestion[]
}

function formatTimer(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function GameScreen({ onExit, questions }: GameScreenProps) {
  const game = useGame(onExit, questions)
  const progress = ((game.qIdx + (game.revealed ? 1 : 0)) / game.total) * 100

  if (game.finished) {
    return (
      <div className="lumi-game-screen fixed inset-0 z-[60] flex items-center justify-center bg-[#F7F7FF] p-6">
        <div className="relative animate-cardIn text-center">
          <div className="text-[72px]">🏆</div>
          <h2 className="m-0 mb-2 mt-2.5 font-display text-[32px] font-extrabold tracking-[-0.5px] text-[#1B1530]">
            Nice run!
          </h2>
          <p className="m-0 mb-7 text-[15px] text-[#6B6585]">
            You scored <strong className="text-[#7C4DFF]">{game.score} points</strong> and earned{' '}
            <strong className="text-[#7C4DFF]">+{Math.round(game.score / 2)} XP</strong>.
          </p>
          <button
            type="button"
            onClick={game.exit}
            className="lumi-btn-primary mx-auto max-w-[240px] rounded-[14px] px-6 py-[15px] text-[15px] font-bold text-white transition-all"
          >
            Back to Hub
          </button>
        </div>
      </div>
    )
  }

  if (!game.question) return null

  return (
    <div className="lumi-game-screen fixed inset-0 z-[60] flex flex-col bg-[#F7F7FF]">
      <header className="relative z-[1] flex flex-wrap items-center justify-between gap-2.5 px-5 py-[22px] sm:px-10">
        <button
          type="button"
          onClick={game.exit}
          className="flex items-center gap-2 rounded-full border border-[#ECE7FB] bg-white px-4 py-2 pl-3 text-[13.5px] font-semibold text-[#1B1530] shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Exit
        </button>
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] px-4 py-2 text-[13px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(255,107,107,0.5)]">
            🔥 <span>{game.streak}</span> streak
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#ECE7FB] bg-white px-3.5 py-2 text-[13px] font-bold text-[#1B1530] shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#7C4DFF] to-[#B388FF] text-[10px] text-white">
              ⏱
            </span>
            {formatTimer(game.timer)}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#ECE7FB] bg-white px-4 py-2 text-[14px] font-bold text-[#1B1530] shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]">
            <span className="text-[#FFB422]">★</span> {game.score}
          </div>
        </div>
      </header>

      <div className="relative z-[1] mb-5 px-5 sm:px-10">
        <div className="relative h-2.5 overflow-hidden rounded-full border border-[#ECE7FB] bg-white shadow-[inset_0_1px_3px_rgba(124,77,255,0.05)]">
          <div
            className="lumi-progress-fill relative h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7C4DFF, #B388FF)',
              boxShadow: '0 0 12px rgba(124,77,255,0.5)',
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[12px] font-semibold text-[#6B6585]">
          <span>
            Question <strong className="text-[#1B1530]">{game.qIdx + 1}</strong> of{' '}
            <strong className="text-[#1B1530]">{game.total}</strong>
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      <main className="relative z-[1] flex flex-1 items-center justify-center px-5 pb-12 pt-5 sm:px-10">
        <div className="animate-cardIn w-full max-w-[760px] rounded-[28px] border border-[#ECE7FB] bg-white p-7 shadow-[0_30px_70px_-25px_rgba(124,77,255,0.3),0_0_0_1px_rgba(124,77,255,0.04)] sm:p-[42px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(124,77,255,0.08)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#7C4DFF]">
            <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#7C4DFF] text-[10px] text-white">
              {game.qIdx + 1}
            </span>
            {game.question.label}
          </span>
          <h2 className="m-0 mb-[30px] mt-[18px] font-display text-[clamp(22px,4vw,28px)] font-bold leading-[1.3] tracking-[-0.4px] text-[#1B1530]">
            {game.question.q}
          </h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {game.question.a.map((answer, index) => {
              const letter = String.fromCharCode(65 + index)
              const isSelected = game.selected === index
              const isCorrect = index === game.question!.correct
              let stateClass =
                'border-2 border-[#ECE7FB] bg-white hover:-translate-y-0.5 hover:border-[#7C4DFF] hover:bg-[rgba(124,77,255,0.03)] hover:shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]'
              let keyClass = 'bg-[#EFEBFF] text-[#6B6585] group-hover:bg-gradient-to-br group-hover:from-[#7C4DFF] group-hover:to-[#9A6BFF] group-hover:text-white'

              if (game.revealed && isCorrect) {
                stateClass = 'animate-answerPop border-2 border-[#22C58B] bg-[rgba(34,197,139,0.06)]'
                keyClass = 'bg-[#22C58B] text-white'
              } else if (game.revealed && isSelected && !isCorrect) {
                stateClass = 'border-2 border-[#FF5C7A] bg-[rgba(255,92,122,0.05)]'
                keyClass = 'bg-[#FF5C7A] text-white'
              }

              return (
                <button
                  key={answer}
                  type="button"
                  disabled={game.revealed}
                  onClick={() => game.pickAnswer(index)}
                  className={`group flex items-center gap-3.5 rounded-[18px] px-5 py-[18px] text-left text-[15px] font-semibold text-[#1B1530] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C4DFF]/30 disabled:pointer-events-none disabled:opacity-60 ${stateClass}`}
                >
                  <span
                    className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] font-display text-[14px] font-extrabold transition-all ${keyClass}`}
                  >
                    {letter}
                  </span>
                  {answer}
                </button>
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#ECE7FB] pt-5">
            <button type="button" className="flex items-center gap-1.5 border-0 bg-transparent text-[13px] font-semibold text-[#6B6585] hover:text-[#7C4DFF]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.5 1 2.3v1h6v-1c0-.8.3-1.7 1-2.3A7 7 0 0 0 12 2z" />
              </svg>
              Use a hint (−10 pts)
            </button>
            <div className="flex gap-2">
              {['½', '⏭', '❄'].map((power) => (
                <div
                  key={power}
                  title={power}
                  className="grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-xl border border-[#ECE7FB] bg-[#EFEBFF] text-base transition-all hover:-translate-y-0.5 hover:bg-[#E9DEFF]"
                >
                  {power}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
