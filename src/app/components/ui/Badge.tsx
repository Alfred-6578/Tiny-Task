
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-white border-transparent",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        outline: "text-primary border-none bg-gray-100 text-gray-400",
        success: "bg-green-100 text-green-700 border-green-200",
        danger: "bg-red-100 text-red-700 border-red-200",
        muted: "bg-muted text-muted-foreground border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
