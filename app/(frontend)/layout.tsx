import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Footer from "./_components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rdominguezg.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Raquel Domínguez - Entrenamiento Personalizado',
    template: '%s | Raquel Domínguez',
  },
  description: 'Transforma tu cuerpo y mente con entrenamiento personalizado. Servicio de fitness online y presencial.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Raquel Domínguez - Entrenamiento Personalizado',
    title: 'Raquel Domínguez - Entrenamiento Personalizado',
    description: 'Transforma tu cuerpo y mente con entrenamiento personalizado. Servicio de fitness online y presencial.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rdomingezg',
    title: 'Raquel Domínguez - Entrenamiento Personalizado',
    description: 'Transforma tu cuerpo y mente con entrenamiento personalizado. Servicio de fitness online y presencial.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} antialiased bg-white dark:bg-black flex flex-col min-h-screen`}
      >
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
