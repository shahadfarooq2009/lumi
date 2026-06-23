import { getUserSettings } from '../../../lib/userSettings'

const CORRECT_SOUND_SRC = '/assets/sounds/correct-bonus.wav'

let correctAudio: HTMLAudioElement | null = null

function getCorrectAudio() {
  if (!correctAudio) {
    correctAudio = new Audio(CORRECT_SOUND_SRC)
    correctAudio.preload = 'auto'
  }
  return correctAudio
}

export function playCorrectSound() {
  if (!getUserSettings().game.soundEffects) return

  try {
    const audio = getCorrectAudio()
    audio.currentTime = 0
    void audio.play()
  } catch {
    // Audio may be unavailable in some environments.
  }
}
