// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { createTheme, ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import type { Metadata } from "next";
import ReactQueryProviders from "./_providers/ReactQueryProviders";

export const metadata: Metadata = {
  title: "By Fungsi | Penyedia mikro aplikasi",
};

const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: [
      "#a5c1d3",
      "#8fb2c8",
      "#78a3bc",
      "#6293b1",
      "#4b84a6",
      "#35749b",
      "#1e6590",
      "#1b5b82",
      "#185173",
      "#154765",
      "#123d56",
      "#0f3348",
      "#0c283a",
    ],
  },
});

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
          <MantineProvider theme={theme}>
            <Notifications position="top-right" zIndex={1000} />
            {children}
          </MantineProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
