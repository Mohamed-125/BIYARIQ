"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
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
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export function Dialog({ children, open, setOpen }: DialogProps) {
  // test commit
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed  inset-0 bg-black/30 backdrop-blur-sm z-50 mb-0 !ml-0"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-md  pointer-events-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DialogContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function DialogHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

export function DialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
}

export function DialogFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-6 flex justify-end gap-4 ${className}`}>{children}</div>
  );
}
