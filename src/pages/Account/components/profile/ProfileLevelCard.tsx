import type { CSSProperties } from 'react'
import { Award, Star } from 'lucide-react'
import { LEVEL, PROFILE_ACHIEVEMENTS } from '../../data/accountData'
import { ProfileRoundedHex } from './ProfileRoundedHex'

const BADGE_COUNT = PROFILE_ACHIEVEMENTS.length

type SegmentKind = 'completed' | 'next' | 'future'

function segmentKind(leftUnlocked: boolean, rightUnlocked: boolean): SegmentKind {
  if (leftUnlocked && rightUnlocked) return 'completed'
  if (leftUnlocked && !rightUnlocked) return 'next'
  return 'future'
}

export function ProfileLevelCard() {
  const unlockedCount = PROFILE_ACHIEVEMENTS.filter((item) => item.unlocked).length
  const lastUnlockedIndex = PROFILE_ACHIEVEMENTS.reduce(
    (last, item, index) => (item.unlocked ? index : last),
    -1,
  )

  return (
    <section className="profile-level-card" aria-labelledby="profile-level-heading">
      <div className="profile-level-card__header">
        <div className="profile-level-card__identity">
          <ProfileRoundedHex
            size={44}
            gradient={['#c4b0ff', '#8b6dff']}
            glow="rgba(139, 109, 255, 0.5)"
            className="profile-level-hex--header"
          >
            <Star size={16} strokeWidth={2} fill="none" />
          </ProfileRoundedHex>
          <div className="profile-level-card__titles">
            <h2 id="profile-level-heading" className="profile-level-card__level">
              Level {LEVEL.level}
            </h2>
            <p className="profile-level-card__subtitle">{LEVEL.title}</p>
          </div>
        </div>
        <span className="profile-level-card__badge-pill">
          <Award size={15} strokeWidth={2.2} aria-hidden />
          {unlockedCount} / {BADGE_COUNT} badges
        </span>
      </div>

      <div className="profile-level-card__track" role="list" aria-label="Badge progress">
        {PROFILE_ACHIEVEMENTS.map((achievement, index) => {
          const { title, description, icon: Icon, accent, accentLight, unlocked } = achievement
          const isCurrent = index === lastUnlockedIndex && unlocked
          const prev = index > 0 ? PROFILE_ACHIEVEMENTS[index - 1] : null
          const kind =
            index > 0 && prev
              ? segmentKind(prev.unlocked, unlocked)
              : null

          return (
            <div key={title} className="profile-level-track__group" role="presentation">
              {index > 0 && kind && (
                <div
                  className={`profile-level-track__segment profile-level-track__segment--${kind}`}
                  style={
                    kind === 'completed' && prev
                      ? ({
                          '--seg-from': prev.accent,
                          '--seg-to': accent,
                        } as CSSProperties)
                      : undefined
                  }
                  aria-hidden
                />
              )}
              <div className="profile-level-track__node" title={`${title} — ${description}`} role="listitem">
                <ProfileRoundedHex
                  locked={!unlocked}
                  gradient={unlocked ? [accentLight, accent] : undefined}
                  glow={unlocked ? `${accent}55` : undefined}
                >
                  <Icon size={15} strokeWidth={2} aria-hidden />
                </ProfileRoundedHex>
                <span
                  className={[
                    'profile-level-track__label',
                    unlocked ? 'profile-level-track__label--unlocked' : '',
                    isCurrent ? 'profile-level-track__label--current' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={isCurrent ? ({ '--label-accent': accent } as CSSProperties) : undefined}
                >
                  {title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
