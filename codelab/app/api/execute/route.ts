// app/api/execute/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { executeCode } from '@/lib/judge0'

export async function POST(req: NextRequest) {
  try {
    const { code, language, stdin } = await req.json()

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 })
    }

    const result = await executeCode(code, language, stdin || '')

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Execute error:', error)
    return NextResponse.json(
      { error: 'Execution failed', message: error.message },
      { status: 500 }
    )
  }
}
