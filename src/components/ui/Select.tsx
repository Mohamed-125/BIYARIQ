"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  placeholder = "اختر...",
  children,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<{
    value: string;
    label: string;
  } | null>(value ? { value, label: value } : null);

  const handleSelect = (val: string, label: string) => {
    setSelected({ value: val, label });
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <div className={`relative ${className || ""}`}>
      <SelectTrigger onClick={() => setOpen(!open)}>
        <SelectValue placeholder={placeholder} value={selected} />
        <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
      </SelectTrigger>

      {open && (
        <SelectContent>
          {React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
              onSelect: (val: string) =>
                handleSelect(val, child.props.children),
              selected: child.props.value === selected?.value,
            })
          )}
        </SelectContent>
      )}
    </div>
  );
}

export function SelectTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {children}
    </button>
  );
}

export function SelectValue({
  placeholder,
  value,
}: {
  placeholder?: string;
  value?: { value: string; label: string } | null;
}) {
  return (
    <span className="truncate">{value?.label ? value.label : placeholder}</span>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
      <ul className="max-h-60 overflow-auto">{children}</ul>
    </div>
  );
}

export function SelectItem({
  value,
  children,
  onSelect,
  selected,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (val: string) => void;
  selected?: boolean;
}) {
  return (
    <li
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
        selected ? "bg-purple-100 text-purple-700 font-medium" : ""
      }`}
      onClick={() => onSelect?.(value)}
    >
      {children}
    </li>
  );
}
