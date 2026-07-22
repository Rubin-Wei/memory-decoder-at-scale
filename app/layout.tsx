import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Memory Decoder at Scale",
  description:
    "A pretrained, parametric long-term memory that scales independently of frozen language-model backbones.",
  icons: {
    icon: `${basePath}/lumia.png`,
    shortcut: `${basePath}/lumia.png`,
  },
  openGraph: {
    title: "Memory Decoder at Scale",
    description:
      "Pretrain memory independently. Attach it to frozen language models. Scale knowledge without scaling the reasoning backbone.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Memory Decoder at Scale",
    description:
      "A pretrained, parametric long-term memory that scales independently of frozen language-model backbones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
