import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getUserSettings, USER_SETTINGS_EVENT } from '../lib/userSettings'

export const FLASHCARD_BG_MUSIC_VIDEO_ID = 'UiHkZTeXrcA'
const DEFAULT_MUSIC_VOLUME = 32
const VOLUME_STORAGE_KEY = 'quizora:flashcard-music-volume'

function readStoredVolume() {
  const stored = sessionStorage.getItem(VOLUME_STORAGE_KEY)
  if (!stored) return DEFAULT_MUSIC_VOLUME
  const parsed = Number(stored)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : DEFAULT_MUSIC_VOLUME
}

type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  setVolume: (volume: number) => void
  destroy: () => void
}

type YTPlayerConstructor = new (
  element: HTMLElement,
  options: {
    height: string
    width: string
    videoId: string
    playerVars: Record<string, number | string>
    events: {
      onReady: (event: { target: YTPlayer }) => void
    }
  },
) => YTPlayer

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor }
    onYouTubeIframeAPIReady?: () => void
  }
}

function isSoundEnabled() {
  return getUserSettings().game.soundEffects
}

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      resolve()
    }

    if (!document.querySelector('script[data-youtube-iframe-api]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.youtubeIframeApi = 'true'
      document.head.appendChild(script)
    }
  })
}

interface FlashcardMusicContextValue {
  isMuted: boolean
  isReady: boolean
  volume: number
  setVolume: (volume: number) => void
  toggleMute: () => void
  ensurePlayback: () => void
}

const FlashcardMusicContext = createContext<FlashcardMusicContextValue | null>(null)

export function FlashcardMusicProvider({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const startedRef = useRef(false)
  const lastVolumeRef = useRef(readStoredVolume())
  const [isReady, setIsReady] = useState(false)
  const [volume, setVolumeState] = useState(readStoredVolume)
  const [isMuted, setIsMuted] = useState(() => !isSoundEnabled() || readStoredVolume() === 0)

  const applyVolume = useCallback((nextVolume: number, player = playerRef.current) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextVolume)))
    setVolumeState(clamped)
    sessionStorage.setItem(VOLUME_STORAGE_KEY, String(clamped))
    if (clamped > 0) lastVolumeRef.current = clamped

    if (!player) {
      setIsMuted(clamped === 0 || !isSoundEnabled())
      return clamped
    }

    player.setVolume(clamped)
    if (clamped === 0) {
      player.mute()
      setIsMuted(true)
    } else if (startedRef.current) {
      player.unMute()
      setIsMuted(false)
    }

    return clamped
  }, [])

  const setVolume = useCallback((nextVolume: number) => {
    applyVolume(nextVolume)
    const player = playerRef.current
    if (!player || !isSoundEnabled()) return

    if (nextVolume > 0 && !startedRef.current) {
      startedRef.current = true
      player.playVideo()
      player.unMute()
      setIsMuted(false)
      return
    }

    if (nextVolume > 0 && startedRef.current) {
      player.unMute()
      setIsMuted(false)
    }
  }, [applyVolume])

  const startPlayback = useCallback(() => {
    const player = playerRef.current
    if (!player || !isSoundEnabled()) return

    const storedVolume = readStoredVolume()
    if (storedVolume === 0) return

    const activeVolume = storedVolume > 0 ? storedVolume : DEFAULT_MUSIC_VOLUME
    applyVolume(activeVolume, player)
    player.unMute()
    player.playVideo()
    startedRef.current = true
    setIsMuted(false)
  }, [applyVolume])

  const ensurePlayback = useCallback(() => {
    startPlayback()
  }, [startPlayback])

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restore = lastVolumeRef.current > 0 ? lastVolumeRef.current : DEFAULT_MUSIC_VOLUME
      setVolume(restore)
      ensurePlayback()
      return
    }

    lastVolumeRef.current = volume > 0 ? volume : DEFAULT_MUSIC_VOLUME
    setVolume(0)
  }, [ensurePlayback, isMuted, setVolume, volume])

  useEffect(() => {
    let disposed = false
    const host = hostRef.current
    if (!host || !isSoundEnabled()) return

    void loadYouTubeIframeApi().then(() => {
      if (disposed || !hostRef.current || !window.YT?.Player) return

      playerRef.current = new window.YT.Player(hostRef.current, {
        height: '1',
        width: '1',
        videoId: FLASHCARD_BG_MUSIC_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          mute: 0,
          playlist: FLASHCARD_BG_MUSIC_VIDEO_ID,
          rel: 0,
        },
        events: {
          onReady: ({ target }) => {
            if (disposed) return
            playerRef.current = target
            const storedVolume = readStoredVolume()
            applyVolume(storedVolume, target)
            setIsReady(true)
            if (storedVolume > 0 && isSoundEnabled()) {
              startedRef.current = true
              target.unMute()
              target.playVideo()
              setIsMuted(false)
            }
          },
        },
      })
    })

    return () => {
      disposed = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    startPlayback()
  }, [isReady, startPlayback])

  useEffect(() => {
    const resumeOnInteraction = () => {
      startPlayback()
    }

    window.addEventListener('pointerdown', resumeOnInteraction)
    window.addEventListener('keydown', resumeOnInteraction)

    return () => {
      window.removeEventListener('pointerdown', resumeOnInteraction)
      window.removeEventListener('keydown', resumeOnInteraction)
    }
  }, [startPlayback])

  useEffect(() => {
    const onSettingsUpdated = () => {
      const enabled = isSoundEnabled()
      const player = playerRef.current
      if (!player) {
        setIsMuted(!enabled)
        return
      }

      if (!enabled) {
        player.pauseVideo()
        player.mute()
        setIsMuted(true)
        startedRef.current = false
        return
      }

      if (!startedRef.current) return
      player.unMute()
      player.playVideo()
      setIsMuted(false)
    }

    window.addEventListener(USER_SETTINGS_EVENT, onSettingsUpdated)
    return () => window.removeEventListener(USER_SETTINGS_EVENT, onSettingsUpdated)
  }, [])

  return (
    <FlashcardMusicContext.Provider value={{ isMuted, isReady, volume, setVolume, toggleMute, ensurePlayback }}>
      {children}
      <div
        ref={hostRef}
        className="fc-bg-music"
        aria-hidden="true"
      />
    </FlashcardMusicContext.Provider>
  )
}

export function useFlashcardMusic() {
  const context = useContext(FlashcardMusicContext)
  if (!context) {
    throw new Error('useFlashcardMusic must be used within FlashcardMusicProvider')
  }
  return context
}
