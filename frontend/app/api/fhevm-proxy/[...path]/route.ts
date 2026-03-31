import { NextRequest, NextResponse } from 'next/server'

// Proxy all fhEVM relayer calls to Zama
const RELAYER_URL = 'https://relayer.testnet.zama.org'

// Handle all HTTP methods
async function proxyRequest(request: NextRequest) {
  try {
    // Get the path from the URL
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/fhevm-proxy', '')
    const targetUrl = `${RELAYER_URL}${path}${url.search}`
    
    console.log(`[SHADE FHEVM Proxy] ${request.method} ${targetUrl}`)
    console.log(`[SHADE FHEVM Proxy] Original path: ${url.pathname}`)

    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      if (key !== 'host' && key !== 'content-length') {
        headers[key] = value
      }
    })

    let body = null
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text()
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
    })

    console.log(`[SHADE FHEVM Proxy] Response: ${response.status}`)

    const responseBody = await response.text()
    
    // Try to parse as JSON, fallback to text
    try {
      const json = JSON.parse(responseBody)
      return NextResponse.json(json, { status: response.status })
    } catch {
      return new NextResponse(responseBody, { 
        status: response.status,
        headers: { 'Content-Type': 'text/plain' }
      })
    }
  } catch (error) {
    console.error('[SHADE FHEVM Proxy] Error:', error)
    return NextResponse.json(
      { error: 'FHEVM proxy failed', details: String(error) },
      { status: 500 }
    )
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const DELETE = proxyRequest
export const OPTIONS = proxyRequest
