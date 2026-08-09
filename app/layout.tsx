import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akshatkadam.com"),
  title: "Akshat Kadam — Technology, Education & India–Japan",
  description:
    "Akshat Kadam is an entrepreneur, technologist, and product builder working across education, AI, and India–Japan technology.",
  openGraph: {
    title: "Akshat Kadam",
    description:
      "Entrepreneur, technologist, and product builder working across education, AI, and India–Japan technology.",
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
      <body className={`${geist.variable} ${geistMono.variable} ${sourceSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
