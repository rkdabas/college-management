import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "JIMS ERP Portal - Admin Portal",
  description: "Advanced Enterprise Resource Planning Portal for Educational Institutions - Student Management, Faculty Management, Academic Planning, and more",
  keywords: "ERP, College Management, Student Management, Academic Portal, Educational Institution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
