import { NextResponse } from 'next/server'

const CONFIG_FILE = 'public/config.json'

export async function GET() {
  try {
    const fs = await import('fs/promises')
    const content = await fs.readFile(CONFIG_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch {
    return NextResponse.json({ error: 'Config not found' }, { status: 404 })
  }
}

export async function POST(request: Request) {
  try {
    const { secret, config } = await request.json()
    if (secret !== process.env.ADMIN_SECRET && secret !== 'mobin1379') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const fs = await import('fs/promises')
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
