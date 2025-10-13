import { cn } from "@/lib/utils";
import "./globals.css";
import { FIranYekan } from "@/config/fonts";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Providers from "@/providers/providers";

export const metadata: Metadata = {
  title: {
    template: "%s | آذرملک",
    default: "آذرملک",
  },
  description: "آذرملک",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className="light !scroll-smooth"
      suppressHydrationWarning>
      <body
        className={cn(
          "light relative mx-0 min-h-dvh overflow-x-hidden !scroll-smooth bg-white font-normal !text-text",
          FIranYekan.className,
          FIranYekan.variable,
        )}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
