import { NextRequest, NextResponse } from "next/server";
import { addLives, getUserStats, canPlay } from "@/lib/kv";

// Direccion donde se reciben los pagos (tu wallet)
const PAYMENT_RECEIVER = process.env.PAYMENT_RECEIVER_ADDRESS || "0x0000000000000000000000000000000000000000";

// Precio en USD (aproximado)
const LIVES_PRICE_USD = 0.20;
const LIVES_PER_PURCHASE = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, txHash } = body;

    if (!fid) {
      return NextResponse.json(
        { error: "fid is required" },
        { status: 400 }
      );
    }

    // En produccion, aqui verificarias el txHash en la blockchain
    // Para simplificar, confiamos en que el frontend solo llama
    // despues de una transaccion exitosa
    //
    // TODO: Implementar verificacion real:
    // 1. Verificar que txHash existe en Base
    // 2. Verificar que el monto es correcto
    // 3. Verificar que el receptor es PAYMENT_RECEIVER
    // 4. Verificar que no se ha usado antes (replay protection)

    if (txHash) {
      console.log(`[Lives] Payment received - FID: ${fid}, TxHash: ${txHash}`);
    }

    // Añadir vidas
    const newLives = await addLives(fid, LIVES_PER_PURCHASE);

    // Obtener stats actualizados
    const stats = await getUserStats(fid);
    const playStatus = await canPlay(fid);

    return NextResponse.json({
      success: true,
      livesAdded: LIVES_PER_PURCHASE,
      totalLives: newLives,
      stats,
      canPlay: playStatus.canPlay,
      playReason: playStatus.reason,
    });
  } catch (error) {
    console.error("Error adding lives:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Endpoint para obtener info de precio
export async function GET() {
  return NextResponse.json({
    priceUsd: LIVES_PRICE_USD,
    livesPerPurchase: LIVES_PER_PURCHASE,
    receiverAddress: PAYMENT_RECEIVER,
  });
}
