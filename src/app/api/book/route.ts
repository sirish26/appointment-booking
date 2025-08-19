import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { z } from 'zod'

const bookSchema = z.object({
  slotId: z.string().uuid(),
})

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Login required' } }, { status: 401 })
  try {
    const { slotId } = bookSchema.parse(await req.json())

    await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({ where: { id: slotId } })

      if (!slot) {
        return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Slot not found' } }, { status: 404 })
      }

      if (slot.isBooked) {
        return NextResponse.json({ error: { code: 'SLOT_TAKEN', message: 'This slot is already booked' } }, { status: 409 })
      }

      await tx.slot.update({ where: { id: slotId }, data: { isBooked: true } })
      const booking = await tx.booking.create({ data: { userId: user.sub, slotId } })
      return NextResponse.json({ booking }, { status: 201 })
    })
    return NextResponse.json({ message: "Booking successful" }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } }, { status: 500 })
  }
}
