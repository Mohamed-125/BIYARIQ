"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -4,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: {
      duration: 0.2,
    },
  },
};

export function Dropdown({
  children,
  trigger,
  open,
  onOpenChange,
  align = "end",
  side = "bottom",
}: DropdownProps) {
  const [triggerRef, setTriggerRef] = React.useState<HTMLDivElement | null>(
    null
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef && !triggerRef.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange, triggerRef]);

  return (
    <div className="relative" ref={setTriggerRef}>
      <div className="cursor-pointer " onClick={() => onOpenChange(!open)}>
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className={`absolute ${
              side === "bottom" ? "top-full" : "bottom-full"
            } ${
              align === "start"
                ? "left-0"
                : align === "end"
                ? "right-0"
                : "left-1/2 -translate-x-1/2"
            } mt-2 min-w-[240px] rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function DropdownSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={` ${className}`}>{children}</div>;
}

export function DropdownSeparator() {
  return <div className="h-px bg-gray-200  " />;
}
