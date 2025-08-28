"use client"
import MainNav from "@/app/components/ui/MainNav";
import { usePathname } from "next/navigation";


export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname()
  
  const hiddenPathNames = ['/create-task',]
  const shouldNotDisplay = hiddenPathNames.includes(pathName)

  return (
    <div className="bg-bg-light min-h-[100vh]">
      {!shouldNotDisplay && 
        <>
          <MainNav/>
          <div className="md:h-20"></div>
        
        </>
      }
        <main className="p-6">
            {children}
        </main>
    </div>
  );
}
