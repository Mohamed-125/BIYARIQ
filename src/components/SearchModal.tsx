"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  type: string;
  category?: string;
  price?: number;
  url: string;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    name: "سماعات بلوتوث لاسلكية",
    type: "منتج فعلي",
    category: "إلكترونيات",
    price: 199,
    url: "/products/1",
  },
  {
    id: "2",
    name: "كتاب تعلم البرمجة بلغة جافاسكريبت",
    type: "منتج رقمي",
    category: "كتب",
    price: 79,
    url: "/products/2",
  },
  {
    id: "3",
    name: "دورة تطوير تطبيقات الويب",
    type: "دورة تدريبية",
    category: "برمجة",
    price: 299,
    url: "/courses/3",
  },
];

const SearchModal: React.FC<SearchModalProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filteredResults = mockResults.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filteredResults);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional search logic if needed
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center">البحث في المتجر</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute right-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المنتجات، الدورات، والمزيد..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute left-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((result) => (
                  <Link
                    href={result.url}
                    key={result.id}
                    onClick={() => onOpenChange(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                            {result.type}
                          </span>
                          {result.price && (
                            <span className="font-semibold text-purple-600">
                              {result.price} ريال
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-right">
                          {result.name}
                        </h3>
                      </div>
                      {result.category && (
                        <p className="text-gray-500 text-sm text-right mt-1">
                          {result.category}
                        </p>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : searchQuery.length > 2 ? (
              <div className="text-center py-8 text-gray-500">
                لم يتم العثور على نتائج لـ "{searchQuery}"
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                ابدأ الكتابة للبحث عن المنتجات والدورات
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
