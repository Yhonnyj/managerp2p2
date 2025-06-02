import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based
  const currentYear = now.getFullYear();

  // 🔸 RESUMEN DEL MES ACTUAL
  const transaccionesMes = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: new Date(currentYear, currentMonth, 1),
        lt: new Date(currentYear, currentMonth + 1, 1),
      },
    },
    select: {
      transactionType: true,
      usdt: true,
      usd: true,
      fee: true,
    },
  });

  let compras = 0;
  let ventas = 0;
  let ganancia = 0;

  for (const tx of transaccionesMes) {
    const usdt = Number(tx.usdt);
    const usd = Number(tx.usd);
    const fee = Number(tx.fee);
    const fee_amount = (usdt * fee) / 100;

    if (tx.transactionType === 'compra') {
      compras++;
      ganancia += usdt - usd - fee_amount;
    } else if (tx.transactionType === 'venta') {
      ventas++;
      ganancia += usd - usdt - fee_amount;
    }
  }

  const summary = {
    transacciones_totales: transaccionesMes.length,
    compras,
    ventas,
    ganancia: parseFloat(ganancia.toFixed(2)),
  };

  // 🔸 OPERACIONES POR MES
  const operacionesPorMes = await prisma.transaction.groupBy({
    by: ['date'],
    where: { userId },
    _count: true,
  });

  const monthlyOperations = Array(12).fill(0);
  operacionesPorMes.forEach(({ date, _count }) => {
    const mes = new Date(date).getMonth();
    monthlyOperations[mes] += _count;
  });

  // 🔸 NUEVOS CLIENTES POR MES
  const clientesPorMes = await prisma.client.groupBy({
    by: ['createdAt'],
    where: { userId },
    _count: true,
  });

  const monthlyClients = Array(12).fill(0);
  clientesPorMes.forEach(({ createdAt, _count }) => {
    const mes = new Date(createdAt).getMonth();
    monthlyClients[mes] += _count;
  });

  // 🔸 TOP CLIENTES
  const topClientesRaw = await prisma.transaction.groupBy({
  by: ['clientId'],
  where: { userId },
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } },
  take: 20,
});

const topClients = await Promise.all(
  topClientesRaw.map(async ({ clientId, _count }) => {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    return {
      client_id: clientId,
      client: client?.name || 'N/A',
      total: _count.id,
    };
  })
);


  // 🔸 ÚLTIMAS TRANSACCIONES
  const latestTransactionsRaw = await prisma.transaction.findMany({
    where: { userId },
    include: { client: true },
    orderBy: { date: 'desc' },
    take: 20,
  });

  const latestTransactions = latestTransactionsRaw.map((tx) => {
    const usdt = Number(tx.usdt);
    const usd = Number(tx.usd);
    const fee = Number(tx.fee);
    const fee_amount = (usdt * fee) / 100;

    const profit =
      tx.transactionType === 'compra'
        ? parseFloat((usdt - usd - fee_amount).toFixed(2))
        : parseFloat((usd - usdt - fee_amount).toFixed(2));

    return {
      id: tx.id,
      client_id: tx.clientId,
      client_name: tx.client?.name || '-',
      usd,
      usdt,
      fee,
      profit,
      platform: tx.platform || '-',
      payment_method: tx.paymentMethod || 'N/A',
      transaction_type: tx.transactionType,
      date: tx.date.toISOString().split('T')[0],
    };
  });

  return NextResponse.json({
    summary,
    monthlyOperations,
    monthlyClients,
    topClients,
    latestTransactions,
  });
}
