"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

interface LocalizedText {
  ar: string;
  en: string;
}

interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  type: "physical" | "digital" | "course";
  category?: {
    name: LocalizedText;
  };
  rating?: number;
  ratingCount?: number;
  stock?: number;
}

interface PaginationData {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

interface SearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchModal = ({ open, setOpen }: SearchModalProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 20,
    totalProducts: 0,
    totalPages: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResults = async (page = 1, isNewSearch = false) => {
    if (!query.trim()) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    try {
      if (isNewSearch) {
        setLoading(true);
      }
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const data = await apiFetch(
        `/products?search=${encodeURIComponent(query)}&page=${page}`,
        {
          signal: abortControllerRef.current.signal,
          cache: "no-store",
        }
      );

      setPagination(data.paginate);
      setHasMore(page < data.paginate.totalPages);

      if (isNewSearch) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
      if (isNewSearch) setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      fetchResults(1, true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchResults(pagination.currentPage + 1);
    }
  }, [inView, hasMore, loading]);

  const handleViewAll = () => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent className="max-w-3xl h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <button
            onClick={handleSearch}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ابحث عن المنتجات..."
            className="flex-1 outline-none text-lg"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setProducts([]);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* حالة التحميل */}
          {loading && products.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* حالة الخطأ */}
          {error && (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
            </div>
          )}

          {/* حالة عدم وجود نتائج */}
          {!loading && !error && query && products.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              لا توجد نتائج مطابقة لبحثك
            </div>
          )}

          {/* عرض النتائج */}
          {products.length > 0 && (
            <div className="divide-y">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name.ar}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name.ar}</h3>
                    <p className="text-gray-600 text-sm line-clamp-1">
                      {product.description.ar}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-purple-600">
                        {product.price} ريال
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice} ريال
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={ref} className="h-10 w-full">
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* زر عرض كل النتائج */}
        {products.length > 0 && (
          <div className="p-4 border-t">
            <button
              onClick={handleViewAll}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              عرض كل النتائج
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
