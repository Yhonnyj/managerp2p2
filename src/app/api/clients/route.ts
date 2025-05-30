import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET: Obtener lista de clientes del usuario autenticado
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req)
  console.log('🧾 GET userId:', userId)

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('❌ Error al obtener clientes:', error)
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 })
  }
}

// POST: Crear un nuevo cliente (100% limpio)
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req)
  console.log('🧾 POST userId:', userId)

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log('📥 Body recibido:', body)

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const country = typeof body.country === 'string' ? body.country.trim() : ''
    const address = typeof body.address === 'string' ? body.address.trim() : ''

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }

    const existing = await prisma.client.findFirst({
      where: {
        userId,
        name: { equals: name, mode: 'insensitive' },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Este cliente ya existe' }, { status: 400 })
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        country,
        address,
        userId,
      },
    })

    console.log('✅ Cliente creado:', newClient)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('❌ Error al crear cliente:', error)
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })
  }
}

// PUT: Actualizar cliente
export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req)
  const id = req.nextUrl.searchParams.get('id')
  console.log('🧾 PUT userId:', userId, '| ID:', id)

  if (!userId || !id) {
    return NextResponse.json({ error: 'Unauthorized or missing ID' }, { status: 401 })
  }

  try {
    const { name, email, phone, country, address } = await req.json()

    const duplicate = await prisma.client.findFirst({
      where: {
        userId,
        name: { equals: name, mode: 'insensitive' },
        NOT: { id },
      },
    })

    if (duplicate) {
      return NextResponse.json({ error: 'Ya existe un cliente con ese nombre' }, { status: 400 })
    }

    const updated = await prisma.client.update({
      where: { id },
      data: { name, email, phone, country, address },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('❌ Error al actualizar cliente:', error)
    return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 })
  }
}

// DELETE: Eliminar cliente
export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req)
  const id = req.nextUrl.searchParams.get('id')
  console.log('🧾 DELETE userId:', userId, '| ID:', id)

  if (!userId || !id) {
    return NextResponse.json({ error: 'Unauthorized or missing ID' }, { status: 401 })
  }

  try {
    const client = await prisma.client.findUnique({ where: { id } })
    if (!client || client.userId !== userId) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    }

    await prisma.client.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error al eliminar cliente:', error)
    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 })
  }
}
