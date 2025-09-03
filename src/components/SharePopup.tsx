"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import Button from "./ui/Button";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

type ShareButton = {
  name: string;
  url: string;
  icon: React.ElementType;
};

interface SharePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SharePopup({ open, onOpenChange }: SharePopupProps) {
  const shareUrl = "https://www.example.com";
  const shareButtons = [
    {
      icon: FaFacebook,
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      icon: X,
      name: "X",
      url: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    {
      icon: FaWhatsapp,
      name: "WhatsApp",
      url: `https://wa.me/?text=${shareUrl}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>مشاركة المنتج</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {shareButtons.map((button, index) => (
            <a
              key={index}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <button.icon className="w-6 h-6" />
              <span className="text-sm">{button.name}</span>
            </a>
          ))}
        </div>

        <DialogFooter>
          <Button className="mx-auto" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
