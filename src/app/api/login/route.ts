import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'
import { signAuth } from '@/lib/auth'

const LoginZ = z.object({ email: z.string().email(), password: z.string().min(8) })

export async function POST(req: Request) {
  try {
    const { email, password } = LoginZ.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email } })
    console.log("User from DB:", user);
    if (!user) return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }, { status: 401 })
    console.log("Plaintext password:", password);
    console.log("Hashed password from DB:", user.password);
    const ok = password === user.password
    console.log("bcrypt.compare result:", ok);
    if (!ok) return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }, { status: 401 })
        await signAuth({ sub: user.id, role: user.role as "PATIENT" | "ADMIN", email: user.email });
    return NextResponse.json({ token: 'cookie', role: user.role }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: e.message } }, { status: 400 })
  }
}
