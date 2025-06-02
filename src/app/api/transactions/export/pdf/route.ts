// app/api/transactions/export/pdf/route.ts
import { NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
// @ts-ignore
import PDFDocument from 'pdfkit'
// @ts-ignore
import { WritableStreamBuffer } from 'stream-buffers'
import fs from 'fs'
import path from 'path'

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

  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf')

  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    font: fs.existsSync(fontPath) ? fontPath : undefined,
  })

  const stream = new WritableStreamBuffer()
  doc.pipe(stream)

  if (!fs.existsSync(fontPath)) {
    doc.font('Times-Roman')
  }

  // Título
  doc
    .fontSize(18)
    .fillColor('#333')
    .text('Reporte de Transacciones', { align: 'center', underline: true })
    .moveDown(1.2)

  // Encabezados
  const headers = [
    'Tipo', 'USDT', 'USD', 'Fee', 'Profit', 'Cliente', 'Fecha', 'Plataforma', 'Método'
  ]

  const positions = [40, 90, 140, 190, 240, 290, 360, 430, 500]

  doc.fontSize(10).fillColor('#444')
  headers.forEach((h, i) => {
    doc.text(h, positions[i], doc.y, { continued: i !== headers.length - 1 })
  })

  doc.moveDown(0.2)
  doc.strokeColor('#999').moveTo(40, doc.y).lineTo(550, doc.y).stroke()

  // Datos
  transactions.forEach((tx) => {
    const usdt = Number(tx.usdt)
    const usd = Number(tx.usd)
    const fee = Number(tx.fee)
    const feeAmount = (usdt * fee) / 100
    const profit =
      tx.transactionType === 'compra'
        ? usdt - usd - feeAmount
        : usd - usdt - feeAmount
    const fecha = new Date(tx.date).toISOString().split('T')[0]

    const data = [
      tx.transactionType,
      usdt.toFixed(2),
      usd.toFixed(2),
      feeAmount.toFixed(2),
      profit.toFixed(2),
      tx.client?.name || '',
      fecha,
      tx.platform,
      tx.paymentMethod,
    ]

    doc.fillColor('#000')
    data.forEach((val, i) => {
      doc.text(val, positions[i], doc.y, { continued: i !== data.length - 1 })
    })
    doc.moveDown(0.5)
  })

  doc.end()
  await new Promise((resolve) => stream.on('finish', resolve))

  return new Response(stream.getContents(), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="transacciones.pdf"',
    },
  })
}
