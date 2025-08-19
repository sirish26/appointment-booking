import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'

const RegisterZ = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) })

export async function POST(req: Request) {
  try {
    const { name, email, password } = RegisterZ.parse(await req.json())
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: { code: 'EMAIL_TAKEN', message: 'Email already registered' } }, { status: 409 })
    await prisma.user.create({ data: { name, email, password, role: 'PATIENT' } })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: e.message } }, { status: 400 })
  }
}
