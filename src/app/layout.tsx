import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aroma Restaurant Menu | Luxury Dining Experience",
  description:
    "Indulge in an extraordinary culinary journey. Explore our curated menu of premium dishes and crafted beverages.",
  keywords: "luxury cafe, premium dining, hotel menu, fine dining, aroma restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-inter bg-background text-foreground min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
