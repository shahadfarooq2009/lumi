import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateQuestionsApi } from './vite-plugins/generateQuestionsApi'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), generateQuestionsApi(env.OPENAI_API_KEY)],
    server: {
      port: 5174,
      strictPort: true,
    },
    preview: {
      port: 5174,
      strictPort: true,
    },
    appType: 'spa',
  }
})
