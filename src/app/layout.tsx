import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "ماجيك ستور - متجر المنتجات ودورات",
  description:
    "متجر متخصص في بيع المنتجات ودورات مثل الألعاب والبرامج والدورات التدريبية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <CartProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
