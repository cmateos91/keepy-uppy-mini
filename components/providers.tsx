"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";
import { env } from "@/lib/env";
import { initPolyfills } from "@/lib/polyfills";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import dynamic from "next/dynamic";
import { base } from "viem/chains";

// Inicializar polyfills antes que nada
initPolyfills();

// Eruda solo en desarrollo
const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const isDev = env.NEXT_PUBLIC_APP_ENV === "development";

  const content = (
    <MiniKitProvider
      projectId={env.NEXT_PUBLIC_MINIKIT_PROJECT_ID}
      notificationProxyUrl="/api/notification"
      chain={base}
    >
      <MiniAppProvider>{children}</MiniAppProvider>
    </MiniKitProvider>
  );

  // Solo usar Eruda en desarrollo
  if (isDev) {
    return <ErudaProvider>{content}</ErudaProvider>;
  }

  return content;
}
