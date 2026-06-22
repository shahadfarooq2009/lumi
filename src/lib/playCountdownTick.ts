import { getUserSettings } from './userSettings'

const TICK_FREQUENCIES: Record<number, number> = {
  3: 392,
  2: 494,
  1: 587,
}

function createBeepWavDataUrl(frequency: number, durationMs = 200, volume = 0.45): string {
  const sampleRate = 44100
  const numSamples = Math.floor(sampleRate * (durationMs / 1000))
  const dataSize = numSamples * 2
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const attack = Math.min(1, t * 90)
    const decay = Math.exp(-t * 10)
    const sample = Math.sin(2 * Math.PI * frequency * t) * attack * decay * volume
    view.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, sample * 32767)), true)
  }

  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return `data:audio/wav;base64,${btoa(binary)}`
}

const TICK_SOUND_SRC: Record<number, string> = {
  3: createBeepWavDataUrl(TICK_FREQUENCIES[3]),
  2: createBeepWavDataUrl(TICK_FREQUENCIES[2]),
  1: createBeepWavDataUrl(TICK_FREQUENCIES[1]),
}

const UNLOCK_SOUND_SRC = createBeepWavDataUrl(220, 40, 0.01)

let unlockAudio: HTMLAudioElement | null = null
let audioUnlocked = false
const tickTemplates: Partial<Record<number, HTMLAudioElement>> = {}

function getTickTemplate(tick: number) {
  if (!tickTemplates[tick]) {
    tickTemplates[tick] = new Audio(TICK_SOUND_SRC[tick])
    tickTemplates[tick]!.preload = 'auto'
  }
  return tickTemplates[tick]!
}

export function prepareCountdownAudio() {
  if (!getUserSettings().game.soundEffects) return
  if (audioUnlocked) return

  try {
    if (!unlockAudio) {
      unlockAudio = new Audio(UNLOCK_SOUND_SRC)
      unlockAudio.preload = 'auto'
    }
    unlockAudio.currentTime = 0
    void unlockAudio.play().then(() => {
      audioUnlocked = true
    }).catch(() => {
      // Will retry on next user gesture.
    })
  } catch {
    // Audio may be unavailable in some environments.
  }
}

export function playCountdownTick(tick: number) {
  if (!getUserSettings().game.soundEffects) return

  if (!TICK_SOUND_SRC[tick]) return

  try {
    const audio = getTickTemplate(tick).cloneNode(true) as HTMLAudioElement
    audio.volume = 0.9
    void audio.play().catch(() => {
      // Browser may block until prepareCountdownAudio runs from a click.
    })
  } catch {
    // Audio may be unavailable in some environments.
  }
}
