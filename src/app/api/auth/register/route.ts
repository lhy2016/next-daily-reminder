import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email has been registered" }, { status: 400 })
    }

    let pswd = password as string;

    if (pswd.length < 8) {
        return NextResponse.json({error: "Password should contain at least 8 characters" }, { status: 400 })
    } 
    
    let hasSpace = /\s+/g;
    if (hasSpace.test(pswd)) {
        return NextResponse.json({error: "Password should not contain space(s)" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json({
      message: 'success',
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}