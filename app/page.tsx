import App from "@/components/App";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "Jugar Keepy Uppy",
    action: {
      type: "launch_frame",
      name: "Keepy Uppy",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#1a1a2e",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Keepy Uppy",
    description: "Manten el balon en el aire - Juego de habilidad",
    openGraph: {
      title: "Keepy Uppy",
      description: "Manten el balon en el aire - Juego de habilidad y reflejos",
      images: [`${appUrl}/images/og.png`],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
