import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET: Listar transacciones con paginación y client_name
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const clientId = searchParams.get('clientId') || undefined
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const where = {
    userId,
    ...(clientId && { clientId }),
  }

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { client: true },
      skip,
      take: pageSize,
    }),
  ])

  const enriched = transactions.map((tx) => {
    const usdt = Number(tx.usdt)
    const usd = Number(tx.usd)
    const fee = Number(tx.fee)

    const sell_price = usdt > 0 ? parseFloat((usd / usdt).toFixed(2)) : 0
    const fee_amount = (usdt * fee) / 100
    const profit =
      tx.transactionType === 'compra'
        ? parseFloat((usdt - usd - fee_amount).toFixed(2))
        : parseFloat((usd - usdt - fee_amount).toFixed(2))

    return {
      ...tx,
      sell_price,
      profit,
      client_name: tx.client?.name || null,
      paymentMethod: tx.paymentMethod,
    }
  })

  return NextResponse.json({
    results: enriched,
    count: total,
  })
}

// POST: Crear nueva transacción
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const {
      transactionType,
      usdt,
      usd,
      platform,
      fee,
      paymentMethod,
      date,
      clientId,
    } = await req.json()

    const newTx = await prisma.transaction.create({
      data: {
        transactionType,
        usdt,
        usd,
        platform,
        fee,
        paymentMethod,
        date: new Date(date),
        clientId,
        userId,
      },
    })

    return NextResponse.json(newTx, { status: 201 })
  } catch (error) {
    console.error('❌ Error al crear transacción:', error)
    return NextResponse.json({ error: 'Error al guardar transacción' }, { status: 500 })
  }
}
