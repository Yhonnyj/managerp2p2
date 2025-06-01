import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const tipo = searchParams.get("tipo") || "mes";
  const mes = parseInt(searchParams.get("mes") || "");
  const anio = parseInt(searchParams.get("anio") || "");

  let dateFilter: { gte: Date; lte?: Date };

  if (tipo === "semana") {
    const fechaInicio = subDays(new Date(), 7);
    dateFilter = { gte: fechaInicio };
  } else {
    if (!mes || !anio) {
      return NextResponse.json({ error: "Mes y año requeridos" }, { status: 400 });
    }
    const fechaInicio = startOfMonth(new Date(anio, mes - 1));
    const fechaFin = endOfMonth(fechaInicio);
    dateFilter = { gte: fechaInicio, lte: fechaFin };
  }

  const transacciones = await prisma.transaction.findMany({
    where: { userId, date: dateFilter },
  });

  const total = transacciones.length;
  const ganancia = transacciones.reduce((acc, t) => acc + Number(t.fee), 0);

  const compras = transacciones.filter(t => t.transactionType === "compra");
  const ventas = transacciones.filter(t => t.transactionType === "venta");

  const resumen = {
    transacciones_totales: total,
    ganancia,
    compras: {
      usdt: compras.reduce((acc, t) => acc + Number(t.usdt), 0),
      usd: compras.reduce((acc, t) => acc + Number(t.usd), 0),
    },
    ventas: {
      usdt: ventas.reduce((acc, t) => acc + Number(t.usdt), 0),
      usd: ventas.reduce((acc, t) => acc + Number(t.usd), 0),
    },
  };

  const plataformas = await prisma.transaction.groupBy({
    by: ["platform"],
    where: { userId, date: dateFilter },
    _count: { id: true },
  });

  const metodos_pago = await prisma.transaction.groupBy({
    by: ["paymentMethod"],
    where: { userId, date: dateFilter },
    _count: { id: true },
  });

  const tipos_transaccion = [
    { name: "Compras", value: compras.length },
    { name: "Ventas", value: ventas.length },
  ];

  const operaciones_mensuales = await prisma.transaction.groupBy({
    by: ["date"],
    where: { userId },
    _count: { id: true },
    orderBy: { date: "asc" },
  });

  const opMensualesData = operaciones_mensuales.map(m => {
    const fecha = new Date(m.date);
    const label = `${(fecha.getMonth() + 1).toString().padStart(2, "0")}-${fecha.getFullYear()}`;
    return { name: label, value: m._count.id };
  });

  return NextResponse.json({
    resumen,
    plataformas: plataformas.map(p => ({
      name: p.platform ?? "Sin plataforma",
      value: p._count.id,
    })),
    metodos_pago: metodos_pago.map(m => ({
      name: m.paymentMethod ?? "Sin método",
      value: m._count.id,
    })),
    tipos_transaccion,
    operaciones_mensuales: opMensualesData,
  });
}
