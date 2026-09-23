import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import CartModal from "@/features/cart/components/CartModal";

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

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} ${notoSansEthiopic.variable} font-inter bg-background text-foreground min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <NextAuthProvider>
              <CartProvider>
                {children}
                <CartModal />
              </CartProvider>
            </NextAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
