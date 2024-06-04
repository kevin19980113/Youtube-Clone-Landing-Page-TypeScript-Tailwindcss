import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(["transition-colors"], {
  variants: {
    size: {
      default: ["rounded-md", "p-2"],
      icon: [
        "rounded-full",
        "size-12",
        "flex",
        "items-center",
        "justify-center",
        "p-2.5",
      ],
    },
    variant: {
      default: [
        "hover:bg-secondary-hover",
        "bg-secondary",
        "active:bg-secondary",
      ],
      ghost: ["hover:bg-gray-100", "active:bg-secondary"],
      dark: [
        "bg-secondary-dark",
        "hover:bg-secondary-dark-hover",
        "text-secondary",
      ],
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

export function Button({
  variant,
  size,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(buttonStyles({ size, variant }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
