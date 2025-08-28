"use client"
import { ReactNode } from "react";
import { CreateTaskFormProvider } from "@/app/context/CreateTaskFormContext";


export default function CreateTaskLayout({ children }: { children: ReactNode }) {
  return (
    <CreateTaskFormProvider>
      <div className="">
        {children}
      </div>
    </CreateTaskFormProvider>
  );
}
