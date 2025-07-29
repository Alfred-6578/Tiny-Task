"use client"
import MainNav from "@/app/components/ui/MainNav";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bg-light min-h-[100vh]">
        <MainNav/>
        <main className="p-6">
            {children}
        </main>
    </div>
  );
}
