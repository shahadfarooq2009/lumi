import { useCallback, useRef } from 'react'
import { Camera, Pencil, Settings, Sparkles } from 'lucide-react'
import { PROFILE_META, USER } from '../../data/accountData'

export function ProfileUserCard({
  onOpenSettings,
}: {
  onOpenSettings?: () => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const moveSpotlight = useCallback((x: number, y: number, visible: boolean) => {
    const card = cardRef.current
    const track = trackRef.current
    if (!card || !track) return

    track.style.transform = `translate3d(${x}px, ${y}px, 0)`
    card.style.setProperty('--spot-opacity', visible ? '1' : '0')
  }, [])

  const handlePointerEnter = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    moveSpotlight(event.clientX - rect.left, event.clientY - rect.top, true)
  }, [moveSpotlight])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    moveSpotlight(event.clientX - rect.left, event.clientY - rect.top, true)
  }, [moveSpotlight])

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--spot-opacity', '0')
  }, [])

  return (
    <section
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="profile-user-card pricing-tier-pro relative overflow-hidden rounded-[28px] px-6 py-7 sm:px-7 sm:py-8"
    >
      <div className="profile-user-card__spotlight" aria-hidden>
        <div ref={trackRef} className="profile-user-card__spotlight-track">
          <span className="profile-user-card__spotlight-blob profile-user-card__spotlight-blob--a" />
          <span className="profile-user-card__spotlight-blob profile-user-card__spotlight-blob--b" />
          <span className="profile-user-card__spotlight-blob profile-user-card__spotlight-blob--c" />
        </div>
      </div>
      <div className="pricing-tier-pro__grid overflow-hidden rounded-[28px]" aria-hidden />
      <div className="pricing-tier-pro__shine overflow-hidden rounded-[28px]" aria-hidden />

      <div className="profile-user-card__actions">
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="profile-user-card__settings pricing-tier-cta-primary pricing-tier-cta-primary--featured"
          >
            <Settings size={17} strokeWidth={2.2} />
          </button>
        )}

        <button
          type="button"
          className="profile-user-card__edit pricing-tier-cta-primary pricing-tier-cta-primary--featured"
        >
          <Pencil size={14} strokeWidth={2.2} />
          Edit Profile
        </button>
      </div>

      <div className="profile-user-card__body relative z-[1]">
        <div className="profile-user-card__avatar-wrap">
          <div className="profile-user-card__avatar">
            {USER.avatarUrl ? (
              <img src={USER.avatarUrl} alt={USER.name} />
            ) : (
              USER.initials
            )}
          </div>
          <button type="button" aria-label="Change photo" className="profile-user-card__camera">
            <Camera size={14} strokeWidth={2.2} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="profile-user-card__name-row">
            <h2 className="profile-user-card__name">{USER.name}</h2>
            <Sparkles size={16} className="profile-user-card__sparkle" strokeWidth={2.2} />
          </div>
          <p className="profile-user-card__handle">{USER.handle}</p>
          <p className="profile-user-card__bio">{USER.bio}</p>

          <div className="profile-user-card__meta">
            {PROFILE_META.map(({ label, icon: Icon }) => (
              <span key={label} className="profile-user-card__meta-item">
                <Icon size={14} strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
