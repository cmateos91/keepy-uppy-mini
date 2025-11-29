import { env } from "@/lib/env";

/**
 * Get the farcaster manifest for the frame, generate yours from Warpcast Mobile
 *  On your phone to Settings > Developer > Domains > insert website hostname > Generate domain manifest
 * @returns The farcaster manifest for the frame
 */
export async function getFarcasterManifest() {
  let frameName = "Keepy Uppy";
  let noindex = false;
  const appUrl = env.NEXT_PUBLIC_URL;

  if (appUrl.includes("localhost")) {
    frameName += " Local";
    noindex = true;
  } else if (appUrl.includes("ngrok")) {
    frameName += " NGROK";
    noindex = true;
  } else if (appUrl.includes("https://dev.")) {
    frameName += " Dev";
    noindex = true;
  }

  return {
    accountAssociation: {
      header: env.NEXT_PUBLIC_FARCASTER_HEADER,
      payload: env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      signature: env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
    },
    frame: {
      version: "1",
      name: frameName,
      iconUrl: `${appUrl}/images/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/images/feed.png`,
      buttonTitle: "Jugar",
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#1a1a2e",
      webhookUrl: `${appUrl}/api/webhook`,
      // Metadata
      subtitle: "Manten el balon en el aire",
      description: "Juego de habilidad y reflejos. Toca el balon para mantenerlo en el aire el mayor tiempo posible. Compite con tus amigos!",
      primaryCategory: "games",
      tags: ["game", "arcade", "football", "keepy-uppy", "casual"],
      tagline: "Cuantos toques puedes hacer?",
      ogTitle: "Keepy Uppy - Juego de Habilidad",
      ogDescription: "Manten el balon en el aire. Juego de habilidad y reflejos para Base App.",
      screenshotUrls: [
        `${appUrl}/images/screenshot1.png`,
      ],
      heroImageUrl: `${appUrl}/images/hero.png`,
      ogImageUrl: `${appUrl}/images/og.png`,
      noindex: noindex,
    },
  };
}
