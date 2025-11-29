"use client";

import { useState, useCallback } from "react";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { parseEther } from "viem";
import { base } from "viem/chains";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";

interface BuyLivesModalProps {
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  receiverAddress: string;
}

// Precio fijo en ETH (aproximadamente $0.20)
// En produccion usarias un oracle o API para precio dinamico
const PRICE_ETH = "0.00008"; // ~$0.20 a ~$2500/ETH

export default function BuyLivesModal({
  onClose,
  onSuccess,
  receiverAddress,
}: BuyLivesModalProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  // Definir la transaccion
  const calls = [
    {
      to: receiverAddress as `0x${string}`,
      value: parseEther(PRICE_ETH),
      data: "0x" as `0x${string}`,
    },
  ];

  const handleStatus = useCallback((txStatus: LifecycleStatus) => {
    console.log("Transaction status:", txStatus);

    if (txStatus.statusName === "transactionPending") {
      setStatus("pending");
    } else if (txStatus.statusName === "success") {
      setStatus("success");
      const receipt = txStatus.statusData?.transactionReceipts?.[0];
      const hash = receipt?.transactionHash;
      if (hash) {
        setTxHash(hash);
        // Llamar onSuccess despues de un pequeno delay para mostrar el estado
        setTimeout(() => onSuccess(hash), 1500);
      }
    } else if (txStatus.statusName === "error") {
      setStatus("error");
    }
  }, [onSuccess]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Comprar Vidas</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              disabled={status === "pending"}
            >
              X
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Oferta */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Obtienes</span>
              <span className="text-2xl font-bold text-white">3 Vidas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Precio</span>
              <div className="text-right">
                <span className="text-xl font-bold text-green-400">{PRICE_ETH} ETH</span>
                <p className="text-xs text-gray-500">~$0.20 USD</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mb-6 text-sm text-gray-400">
            <p className="mb-2">Cada vida te da una oportunidad para mejorar tu mejor puntuacion del dia.</p>
            <p>Las vidas expiran a las 00:00 UTC.</p>
          </div>

          {/* Transaction Button */}
          {status === "idle" && (
            <Transaction
              chainId={base.id}
              calls={calls}
              onStatus={handleStatus}
            >
              <TransactionButton
                text="Pagar con ETH"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              />
              <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
              </TransactionStatus>
            </Transaction>
          )}

          {/* Pending state */}
          {status === "pending" && (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white">Procesando transaccion...</p>
            </div>
          )}

          {/* Success state */}
          {status === "success" && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-bold">Vidas anadidas!</p>
              <p className="text-sm text-gray-400 mt-1">Ya puedes seguir jugando</p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-white font-bold">Error en la transaccion</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 text-green-400 underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900/50">
          <p className="text-xs text-gray-500 text-center">
            Transaccion en Base (L2). Gas minimo.
          </p>
        </div>
      </div>
    </div>
  );
}
