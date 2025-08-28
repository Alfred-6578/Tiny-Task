import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ui/Toast/ToastContext";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['100','200','300','400','500','600','700','800','900']
});




export const metadata: Metadata = {
  title: "Tiny task",
  description: " A micro-task app where Nigerian students can post or accept ₦500–₦3000 short jobs like “help me print a document” or “deliver snacks to my hostel.” One account handles both roles (tasker/taskee).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
