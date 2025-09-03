import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { div, small } from "framer-motion/client";
import { link } from "fs";
import { twMerge } from "tailwind-merge";

const Loading = () => {
  return (
    <div className="w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 bg-white animate-spin rounded-full border-b-transparent"></div>
  );
};

const variants = cva(
  "text-white  font-semibold relative disabled:opacity-75 rounded-lg transition easeInOut",
  {
    variants: {
      variant: {
        primary: "bg-purple-600 hover:bg-purple-700",
        secondary: "bg-[rgba(9,9,49)] hover:bg-[rgba(9,9,49,0.85)] ",
        destructive: "bg-red-500 hover:bg-red-400",
        link: [],
        ghost: "bg-transparent text-[inherit] font-normal hover:bg-gray-100",
      },
      size: {
        lg: "px-6 py-3.5 text-lg",
        md: "lg:px-4 lg:py-2 px-3 py-2 text-sm ",
        sm: "p-1.5 rounded-sm text-sm",
        full: "w-full px-4 py-2 text-sm text-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = ({
  children,
  className = "",
  loading = false,
  size,
  variant,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants>) => {
  return (
    <button
      disabled={loading}
      className={twMerge(variants({ className, size, variant }))}
      {...props}
    >
      {loading && <Loading />}
      <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;
