import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const username = req.cookies.get('uf_user')?.value ?? null
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ username })
}
