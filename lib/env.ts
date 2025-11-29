import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Configuracion simplificada para Keepy Uppy
// Solo necesitamos las variables esenciales de MiniKit
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
    // Farcaster manifest (para el frame)
    NEXT_PUBLIC_FARCASTER_HEADER: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_PAYLOAD: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_SIGNATURE: z.string().optional().default(""),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: process.env.NEXT_PUBLIC_MINIKIT_PROJECT_ID,
    NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
    NEXT_PUBLIC_FARCASTER_SIGNATURE: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
  },
});
