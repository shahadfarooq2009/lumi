import { BrainIllustration, SparkleAccent } from './BrainIllustration'

/** Decorative brain hero for the difficulty setup screen */
export function SetupBrainHero() {
  return (
    <div className="fc-setup__brain-wrap" aria-hidden>
      <div className="fc-setup__brain-ring">
        <BrainIllustration className="fc-setup__brain-svg" size={46} />
      </div>

      <SparkleAccent
        color="#F7C948"
        className="fc-brain-sparkle fc-brain-sparkle--setup-1"
      />
      <SparkleAccent
        color="#6ED4E8"
        className="fc-brain-sparkle fc-brain-sparkle--setup-2"
      />
      <SparkleAccent
        color="#B88AE8"
        className="fc-brain-sparkle fc-brain-sparkle--setup-3"
      />
    </div>
  )
}
