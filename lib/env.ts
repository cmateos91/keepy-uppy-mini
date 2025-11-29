import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Configuracion para Keepy Uppy con ranking y pagos
export const env = createEnv({
  server: {
    // Secreto para JWT (opcional para funcionalidades avanzadas)
    JWT_SECRET: z.string().min(1).optional().default("dev-secret-change-in-production"),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().min(1),
    NEXT_PUBLIC_APP_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("development"),
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: z.string().min(1),
    // OnchainKit API Key (opcional, mejora rate limits)
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: z.string().optional().default(""),
    // Direccion donde se reciben los pagos
    NEXT_PUBLIC_PAYMENT_RECEIVER: z.string().optional().default("0x0000000000000000000000000000000000000000"),
    // Farcaster manifest (para el frame)
    NEXT_PUBLIC_FARCASTER_HEADER: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_PAYLOAD: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_SIGNATURE: z.string().optional().default(""),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: process.env.NEXT_PUBLIC_MINIKIT_PROJECT_ID,
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
    NEXT_PUBLIC_PAYMENT_RECEIVER: process.env.NEXT_PUBLIC_PAYMENT_RECEIVER,
    NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
    NEXT_PUBLIC_FARCASTER_SIGNATURE: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
  },
});
