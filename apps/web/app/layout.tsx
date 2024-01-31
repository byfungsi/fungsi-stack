// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

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
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ReactQueryProviders>
          <MantineProvider>
            <Notifications position="top-right" zIndex={1000} />
            {children}
          </MantineProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
