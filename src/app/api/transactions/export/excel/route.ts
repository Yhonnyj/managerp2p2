// app/api/transactions/export/excel/route.ts
import { NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const isFull = searchParams.get('todo') === '1'
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const where = {
    userId,
    ...(isFull
      ? {}
      : {
          date: {
            gte: start ? new Date(start) : undefined,
            lte: end ? new Date(end) : undefined,
          },
        }),
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { client: true },
    orderBy: { date: 'desc' },
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Transacciones')

  sheet.columns = [
    { header: 'Tipo', key: 'tipo', width: 10 },
    { header: 'Sell Price', key: 'sellPrice', width: 15 },
    { header: 'USDT', key: 'usdt', width: 10 },
    { header: 'USD', key: 'usd', width: 10 },
    { header: 'Fee', key: 'fee', width: 10 },
    { header: 'Profit', key: 'profit', width: 12 },
    { header: 'Cliente', key: 'cliente', width: 20 },
    { header: 'Fecha', key: 'fecha', width: 15 },
    { header: 'Plataforma', key: 'plataforma', width: 15 },
    { header: 'Método de Pago', key: 'metodoPago', width: 18 },
  ]

  transactions.forEach((tx) => {
    const usdt = Number(tx.usdt)
    const usd = Number(tx.usd)
    const fee = Number(tx.fee)
    const feeAmount = (usdt * fee) / 100
    const profit =
      tx.transactionType === 'compra'
        ? usdt - usd - feeAmount
        : usd - usdt - feeAmount
    const sellPrice =
      tx.transactionType === 'compra'
        ? usdt > 0 ? usd / usdt : 0
        : usdt > 0 ? usd / usdt : 0

    sheet.addRow({
      tipo: tx.transactionType,
      sellPrice: sellPrice.toFixed(2),
      usdt,
      usd,
      fee: feeAmount.toFixed(2),
      profit: profit.toFixed(2),
      cliente: tx.client?.name || '',
      fecha: tx.date.toISOString().split('T')[0],
      plataforma: tx.platform,
      metodoPago: tx.paymentMethod,
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="transacciones.xlsx"',
    },
  })
}
