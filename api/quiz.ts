/**
 * /api/quiz — Edge Function: gera prompt de onboarding via Bedrock (Haiku)
 * Chamada apenas quando há campo livre. Template puro é calculado no frontend.
 *
 * Env vars necessárias no Vercel Dashboard (betel-landing):
 *   AWS_ACCESS_KEY_ID_LANDING
 *   AWS_SECRET_ACCESS_KEY_LANDING
 *   AWS_REGION_LANDING          (us-east-1)
 */
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

export const config = { runtime: 'edge' }

const BEDROCK_SYSTEM = `Você recebe 4 respostas brutas de um quiz sobre patrimônio pessoal. Monte um único parágrafo coerente em primeira pessoa, tom reflexivo e direto, sem jargão financeiro. Termine sempre com: "Me ajude a entender onde estou hoje e o que devo olhar primeiro dentro da minha situação." Retorne apenas o parágrafo, sem aspas, sem explicações.`

const MODEL_ID = 'global.anthropic.claude-haiku-4-5-20251001-v1:0'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const body = await req.json() as { answers: string[] }
    const { answers } = body

    if (!Array.isArray(answers) || answers.length !== 4 || answers.some(a => !a?.trim())) {
      return new Response(JSON.stringify({ error: 'answers deve ter 4 strings não vazias' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userMessage = answers
      .map((a, i) => `Resposta ${i + 1}: ${a}`)
      .join('\n')

    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION_LANDING || 'us-east-1',
      credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID_LANDING!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_LANDING!,
      },
    })

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 256,
      system: BEDROCK_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    }

    const command = new InvokeModelCommand({
      modelId:     MODEL_ID,
      body:        JSON.stringify(payload),
      contentType: 'application/json',
      accept:      'application/json',
    })

    const res    = await client.send(command)
    const data   = JSON.parse(new TextDecoder().decode(res.body))
    const prompt = data.content?.[0]?.text || ''

    return new Response(JSON.stringify({ prompt }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[/api/quiz]', err)
    return new Response(
      JSON.stringify({ error: 'Erro ao gerar prompt. Tente novamente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
