import type { Metadata } from "next";
import "./globals.css";
import AuthSync from "@/app/components/AuthSync";

export const metadata: Metadata = {
  title: "Solura Travel · India & Nepal",
  description: "Luxury curated journeys through India and Nepal. Flights, stays, guides, visas — all handled. You walk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <AuthSync />
        {children}
      </body>
    </html>
  );
}
