import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OBSYDIAN CLOTHING",
  description: "Luxury Streetwear Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#27272a',
              color: '#f3f4f6',
              border: '1px solid #7c3aed'
            }
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
