import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Login required' } }, { status: 401 })
  const bookings = await prisma.booking.findMany({ where: { userId: user.sub }, include: { slot: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ bookings }, { status: 200 })
}
