import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Backend URL where FastAPI server runs
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)
    
    const res = await fetch(`${BACKEND_URL}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeoutId)
    
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({ status: 'online', details: data }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      })
    }
    return NextResponse.json({ status: 'offline' }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch {
    return NextResponse.json({ status: 'offline' }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({
        success: false,
        error_type: 'NO_FILE_UPLOADED',
        message: 'No image file was received in the request.',
      }, { status: 400 })
    }

    // Forward to FastAPI Champion Inference Engine
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45s for PennyLane + Dual-CNN + Grad-CAM

      const backendRes = await fetch(`${BACKEND_URL}/api/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      let result: Record<string, unknown> = {}
      try {
        result = await backendRes.json()
      } catch {
        const text = await backendRes.text()
        return NextResponse.json({
          success: false,
          error_type: 'BACKEND_PARSE_ERROR',
          message: text || `Backend returned status ${backendRes.status}`,
        }, { status: backendRes.status })
      }

      return NextResponse.json(result, { status: backendRes.ok ? 200 : backendRes.status })
    } catch (fetchErr: unknown) {
      const isAbort = fetchErr instanceof Error && fetchErr.name === 'AbortError'
      return NextResponse.json({
        success: false,
        error_type: isAbort ? 'TIMEOUT' : 'BACKEND_OFFLINE',
        message: isAbort
          ? 'Deep learning & quantum inference timed out after 45 seconds.'
          : 'QAI-OLI Python Inference Backend is offline (http://127.0.0.1:8000). Please start the backend service.',
      }, { status: 503 })
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    )
  }
}
