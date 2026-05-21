import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col" style={{ backgroundColor: '#FAFAF8', color: '#1C1917' }}>
        {children}
      </body>
    </html>
  );
}
