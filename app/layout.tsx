import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindIt — A visual memory for your things",
  description: "Photograph a space, save its location, and find your belongings with searchable object labels.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
