import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = "https://rubin-wei.github.io/memory-decoder-at-scale/";
const previewImage = `${siteUrl}og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "A fixed base model connected to a rotating wheel of swappable memories.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Decoder at Scale",
    description:
      "A pretrained, parametric long-term memory that scales independently of frozen language-model backbones.",
    images: [previewImage],
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
