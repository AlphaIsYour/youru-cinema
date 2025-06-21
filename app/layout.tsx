// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <-- IMPORT NAVBAR

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youru Cinema",
  description: "Website nonton anime modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Navbar /> {/* <-- LETAKKAN NAVBAR DI SINI */}
        <main>{children}</main> {/* <-- Bungkus children dengan <main> */}
        {/* Nanti kita bisa tambahkan Footer di sini */}
      </body>
    </html>
  );
}
