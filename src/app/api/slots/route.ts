import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const START_HOUR = 9, END_HOUR = 17, SLOT_MIN = 30 // UTC

function genSlots(from: Date, to: Date) {
  const out: { startTime: Date; endTime: Date }[] = []
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()))
  while (d <= to) {
    for (let h = START_HOUR; h < END_HOUR; h++) {
      for (let m = 0; m < 60; m += SLOT_MIN) {
        const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m))
        const end = new Date(start.getTime() + SLOT_MIN * 60000)
        out.push({ startTime: start, endTime: end })
      }
    }
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const now = new Date()
  const from = url.searchParams.get('from') ? new Date(url.searchParams.get('from')!) : now
  let to = url.searchParams.get('to') ? new Date(url.searchParams.get('to')!) : new Date(now.getTime() + 6*24*60*60*1000)
  to.setUTCHours(23, 59, 59, 999);

  // idempotent materialize
  const gen = genSlots(from, to)
  await prisma.slot.createMany({ data: gen, skipDuplicates: true })

  const slots = await prisma.slot.findMany({ where: { startTime: { gte: from, lte: to }, isBooked: false }, orderBy: { startTime: 'asc' } })
  return NextResponse.json({ slots }, { status: 200 })
}
