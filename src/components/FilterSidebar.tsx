"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import Input from "@/components/ui/Input";

interface FilterOption {
  value: string | number;
  label: string;
}

interface Filter {
  id: string;
  type: "checkbox" | "range" | "rating";
  label: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filter[];
  selectedFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  selectedFilters,
  onFilterChange,
}) => {
  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const renderFilter = (filter: Filter) => {
    switch (filter.type) {
      case "checkbox":
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
              >
                <Input
                  type="checkbox"
                  checked={
                    selectedFilters[filter.id]?.includes(option.value) || false
                  }
                  onChange={(e) => {
                    const currentValues = selectedFilters[filter.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: any) => v !== option.value);
                    onFilterChange(filter.id, newValues);
                  }}
                  className="form-checkbox ml-3 h-5 w-5 text-[#7b2cbf] rounded border-gray-300 focus:ring-[#7b2cbf] transition-colors"
                />
                <span className="text-gray-700 group-hover:text-[#7b2cbf] transition-colors ">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "range":
        return (
          <div className="space-y-2">
            <Input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={selectedFilters[filter.id] || filter.min}
              onChange={(e) =>
                onFilterChange(filter.id, parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7b2cbf]"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {filter.min}
                {filter.unit}
              </span>
              <span>
                {selectedFilters[filter.id] || filter.min}
                {filter.unit}
              </span>
              <span>
                {filter.max}
                {filter.unit}
              </span>
            </div>
          </div>
        );

      case "rating":
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
              >
                <Input
                  type="radio"
                  name={filter.id}
                  value={option.value}
                  checked={selectedFilters[filter.id] === option.value}
                  onChange={(e) =>
                    onFilterChange(filter.id, parseInt(e.target.value))
                  }
                  className="form-radio h-5 w-5 text-[#7b2cbf] border-gray-300 focus:ring-[#7b2cbf]"
                />
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={`${
                        index < option.value
                          ? "text-yellow-400"
                          : `text-gray-300 ${index === 4 ? "ml-3" : ""}`
                      }`}
                    />
                  ))}
                  <span className="text-gray-700 group-hover:text-[#7b2cbf] transition-colors">
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">الفلترة</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {filters.map((filter) => (
                  <motion.div
                    key={filter.id}
                    variants={itemVariants}
                    className="space-y-3"
                  >
                    <h3 className="font-medium text-gray-900">
                      {filter.label}
                    </h3>
                    {renderFilter(filter)}
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Reset all filters
                    filters.forEach((filter) =>
                      onFilterChange(filter.id, null)
                    );
                  }}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
