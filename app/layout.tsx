import React, { Suspense } from "react";
import { Outfit } from "next/font/google";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/src/components/common/loader";
import { metadata } from "./metadata";
import { CssBaseline } from "@mui/material";
import { imageUrls } from "@/src/utils/constant";
import AuthLifecycleInit from "@/src/components/common/AuthLifecycleInit";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const ReduxProvider = dynamic(() => import("@/src/providers/reduxProvider"), {
  ssr: false,
});

const I18nProvider = dynamic(() => import("@/src/providers/i18nProvider"), {
  ssr: false,
});

const ThemeProvider = dynamic(() => import("@/src/providers/themeProvider"), {
  ssr: false,
});

const GlobalAlert = dynamic(
  () => import("@/src/components/common/globalAlert"),
  {
    ssr: false,
  },
);

const SpeechProvider = dynamic(() => import("@/src/providers/speechProvider"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={imageUrls.favicon} />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={outfit.className}>
        <AuthLifecycleInit />
        <div id="zoom-wrapper">
          <div
            id="main-content"
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <I18nProvider>
              <ReduxProvider>
                <ThemeProvider>
                  <CssBaseline />
                  <SpeechProvider>
                    <Suspense fallback={<LoadingSpinner center />}>
                      {children}
                      <GlobalAlert />
                    </Suspense>
                  </SpeechProvider>
                </ThemeProvider>
              </ReduxProvider>
            </I18nProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

export { metadata };
