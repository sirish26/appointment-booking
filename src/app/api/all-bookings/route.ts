import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Admin only' } }, { status: 403 })
  }
  const bookings = await prisma.booking.findMany({
    include: { slot: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ bookings }, { status: 200 })
}
