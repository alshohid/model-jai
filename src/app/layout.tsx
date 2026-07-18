import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { RouteProvider } from "@/shared/providers/route/RouteProvider";

import LenisProvider from "@/shared/providers/LenisProvider";
import StoreProvider from "@/redux/StoreProvider";
import AuthProvider from "@/redux/features/auth/AuthProvider";
import { Toaster } from "sonner";
import LiveStatusProvider from "@/shared/providers/LiveStatusProvider";
import NotificationProvider from "@/shared/providers/NotificationProvider";
import ChunkErrorReloader from "@/shared/components/ChunkErrorReloader";
import { rootMetadata } from "@/shared/seo/metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="custom-scroll">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased `}
      >
        <ChunkErrorReloader />
        <StoreProvider>
          <AuthProvider>
            <LenisProvider>
              <NotificationProvider>
                <LiveStatusProvider>
                  <RouteProvider>
                    <Toaster position="top-right" />
                    {children}
                  </RouteProvider>
                </LiveStatusProvider>
              </NotificationProvider>
            </LenisProvider>
          </AuthProvider>
        </StoreProvider>
        {/* <TwScreenSize/> */}
      </body>
    </html>
  );
}
