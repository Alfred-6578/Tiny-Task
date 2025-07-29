// components/ui/Button.tsx
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Tailwind merge helper

const buttonVariants = cva(
  "py-3 px-4 cursor-pointer rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 ring-blue-400",
        secondary: "border border-blue-600 text-blue-600 hover:bg-blue-50 ring-blue-400",
        accent: "bg-orange-500 text-white hover:bg-orange-600 ring-orange-300",
        success: "bg-green-600 text-white hover:bg-green-700 ring-green-400",
        error: "bg-red-600 text-white hover:bg-red-700 ring-red-400",
        ghost: "text-gray-600 hover:bg-gray-100",
        disabled: "bg-gray-200 text-gray-400 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export function Button({ className, variant, ...props }: any) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}
