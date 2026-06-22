import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

interface GenerateRequestBody {
  text?: string
  questionCount?: number
  questionType?: string
  fileName?: string
  notes?: string
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function callOpenAi(
  apiKey: string,
  body: GenerateRequestBody,
): Promise<unknown[] | null> {
  const text = body.text?.trim() ?? ''
  const count = Math.min(50, Math.max(1, body.questionCount ?? 20))
  const type = body.questionType ?? 'multiple-choice'
  const fileName = body.fileName ?? 'uploaded file'

  if (!text) return null

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You generate quiz questions strictly from provided document text. Return JSON: {"questions":[{"type":"multiple-choice"|"true-false"|"fill-blank"|"matching","question":"...","options":["..."],"answerIndex":0}]}. Every question must be answerable using only the document text.',
        },
        {
          role: 'user',
          content: `File: ${fileName}\nQuestion type: ${type}\nCount: ${count}\nNotes: ${body.notes ?? 'none'}\n\nDocument text:\n${text}`,
        },
      ],
    }),
  })

  if (!response.ok) return null

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) return null

  const parsed = JSON.parse(content) as { questions?: unknown[] }
  return Array.isArray(parsed.questions) ? parsed.questions : null
}

export function generateQuestionsApi(openAiKey?: string): Plugin {
  return {
    name: 'generate-questions-api',
    configureServer(server) {
      server.middlewares.use(async (req, res: ServerResponse, next) => {
        if (req.url !== '/api/generate-questions' || req.method !== 'POST') {
          next()
          return
        }

        try {
          const body = JSON.parse(await readBody(req)) as GenerateRequestBody

          if (!openAiKey) {
            res.statusCode = 503
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'AI key not configured' }))
            return
          }

          const questions = await callOpenAi(openAiKey, body)
          if (!questions) {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'AI generation failed' }))
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ questions }))
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Generation failed' }))
        }
      })
    },
  }
}
