import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vesterra Group",
  description: "Vesterra Group website and administration.",
  icons: {
    icon: "/assets/vesterra-logo.jpeg",
    shortcut: "/assets/vesterra-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
