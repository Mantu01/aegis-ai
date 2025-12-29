import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Aegis AI",
  description: "An AI to protect child from harmful content",
  icons:'https://res.cloudinary.com/dqznmhhtv/image/upload/v1766952786/aegis_yiswjc.png'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 h-screen overflow-auto">
              {children}
              <Toaster position="top-center" />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}