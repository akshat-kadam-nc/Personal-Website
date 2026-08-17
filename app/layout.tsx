import type { Metadata } from "next";
import { DM_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akshatkadam.com"),
  title: "Akshat Kadam — Personal Archive",
  description:
    "Akshat Kadam is an entrepreneur, technologist, and product builder working across education, AI, software, and new ventures.",
  openGraph: {
    title: "Akshat Kadam",
    description:
      "Entrepreneur, technologist, and product builder working across education, AI, software, and new ventures.",
    url: "/",
    siteName: "Akshat Kadam",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
