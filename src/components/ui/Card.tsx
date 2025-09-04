import * as React from "react";
import { cn } from "@/lib/utils"; // helper function لدمج الـ classNames

// 🟪 Main Card
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl  border-gray-300  border bg-white shadow-sm text-gray-900",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// 🟪 CardHeader
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 border-b", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

// 🟪 CardTitle
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// 🟪 CardContent
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

// 🟪 CardFooter
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 border-t", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export default Card;
export { CardHeader, CardTitle, CardContent, CardFooter };
