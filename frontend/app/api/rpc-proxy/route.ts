import { NextRequest, NextResponse } from 'next/server'

// Ordered list of RPC URLs to try (falls through on failure)
const RPC_URLS = [
  process.env.NEXT_PUBLIC_RPC_URL,
  process.env.NEXT_PUBLIC_RPC_URL_FALLBACK,
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://rpc.sepolia.org',
  'https://sepolia.drpc.org',
].filter(Boolean) as string[]

async function tryRpc(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000), // 8s timeout per attempt
  })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const errors: string[] = []

  for (const url of RPC_URLS) {
    try {
      console.log(`[SHADE RPC Proxy] Trying: ${url}`)
      const response = await tryRpc(url, body)
      const data = await response.json()
      console.log(`[SHADE RPC Proxy] Success via: ${url}`)
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      const msg = `${url}: ${String(error)}`
      console.warn(`[SHADE RPC Proxy] Failed: ${msg}`)
      errors.push(msg)
    }
  }

  console.error('[SHADE RPC Proxy] All RPC URLs failed:', errors)
  return NextResponse.json(
    { error: 'RPC proxy failed', details: errors.join(' | ') },
    { status: 500 }
  )
}

export const GET = POST
