import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export default function RootLayout({
  children,
  sidebar,
  modal,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />

          <main style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
            {sidebar}
            <div style={{ flex: 1 }}>{children}</div>
          </main>

          {modal}

          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
