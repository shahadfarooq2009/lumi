import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useFlashcardMusic } from '../../contexts/FlashcardMusicContext'
import { IconGlassButton } from './IconGlassButton'

export function Utility() {
  const { isMuted, volume, setVolume, toggleMute, ensurePlayback } = useFlashcardMusic()
  const [isOpen, setIsOpen] = useState(false)
  const controlRef = useRef<HTMLDivElement>(null)
  const displayVolume = isMuted ? 0 : volume

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen])

  const handleTogglePanel = () => {
    setIsOpen((open) => {
      const nextOpen = !open
      if (nextOpen) ensurePlayback()
      return nextOpen
    })
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value))
  }

  return (
    <div className="fc-utility">
      <div className="fc-volume-control" ref={controlRef}>
        <IconGlassButton
          icon={isMuted || volume === 0 ? VolumeX : Volume2}
          size="sm"
          ariaLabel="Open volume controls"
          onClick={handleTogglePanel}
        />

        {isOpen ? (
          <div className="fc-volume-popover" role="dialog" aria-label="Background music volume">
            <div className="fc-volume-popover__slider-wrap">
              <div className="fc-volume-popover__track" aria-hidden="true">
                <div className="fc-volume-popover__fill" style={{ height: `${displayVolume}%` }} />
              </div>
              <input
                type="range"
                className="fc-volume-popover__slider"
                min={0}
                max={100}
                step={1}
                value={displayVolume}
                onChange={handleVolumeChange}
                aria-orientation="vertical"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={displayVolume}
                aria-label="Volume level"
              />
            </div>

            <button
              type="button"
              className="fc-volume-popover__mute"
              aria-label={isMuted || displayVolume === 0 ? 'Unmute background music' : 'Mute background music'}
              onClick={toggleMute}
            >
              {isMuted || displayVolume === 0 ? <VolumeX size={17} strokeWidth={2.2} /> : <Volume2 size={17} strokeWidth={2.2} />}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
