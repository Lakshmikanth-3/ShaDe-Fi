import { NextRequest, NextResponse } from 'next/server'

// Proxy fhEVM relayer calls to Zama
const RELAYER_URL = 'https://relayer.testnet.zama.org'

// Handle POST to base /api/fhevm-proxy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[SHADE FHEVM Proxy] POST to base path')
    console.log('[SHADE FHEVM Proxy] Body:', JSON.stringify(body).slice(0, 200))
    
    const response = await fetch(RELAYER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const responseBody = await response.text()
    console.log('[SHADE FHEVM Proxy] Response:', response.status, responseBody.slice(0, 100))
    
    try {
      const json = JSON.parse(responseBody)
      return NextResponse.json(json, { status: response.status })
    } catch {
      return new NextResponse(responseBody, { status: response.status })
    }
  } catch (error) {
    console.error('[SHADE FHEVM Proxy] Error:', error)
    return NextResponse.json(
      { error: 'FHEVM proxy failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Handle GET to base /api/fhevm-proxy
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const search = url.search
    const targetUrl = `${RELAYER_URL}${search}`
    
    console.log('[SHADE FHEVM Proxy] GET to base path:', targetUrl)
    
    const response = await fetch(targetUrl, {
      method: 'GET',
    })

    const responseBody = await response.text()
    console.log('[SHADE FHEVM Proxy] Response:', response.status, responseBody.slice(0, 100))
    
    try {
      const json = JSON.parse(responseBody)
      return NextResponse.json(json, { status: response.status })
    } catch {
      return new NextResponse(responseBody, { status: response.status })
    }
  } catch (error) {
    console.error('[SHADE FHEVM Proxy] Error:', error)
    return NextResponse.json(
      { error: 'FHEVM proxy failed', details: String(error) },
      { status: 500 }
    )
  }
}

export const PUT = POST
export const DELETE = POST
export const OPTIONS = POST
