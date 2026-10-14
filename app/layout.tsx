import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "TicketSwap — resell event tickets at IE",
  description:
    "TicketSwap helps IE students resell event tickets they can't use so they don't lose their money.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f1b4d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main">{children}</main>
        <footer className="footer">
          <p>TicketSwap · Made by IE students, for IE students.</p>
        </footer>
      </body>
    </html>
  );
}
