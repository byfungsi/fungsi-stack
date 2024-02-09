import "@repo/ui/ui.css";

import type { Metadata } from "next";
import ReactQueryProviders from "./_providers/ReactQueryProviders";

export const metadata: Metadata = {
  title: "By Fungsi | Penyedia mikro aplikasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
