"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/Card/ProductCard";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { apiFetch } from "../../lib/apiFetch";
import { useInView } from "react-intersection-observer";
import Loading from "../../components/ui/Loading";
import { Suspense } from "react";

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

const ProductsPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 20,
    totalProducts: 0,
    totalPages: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    handleFilterChange("search", searchValue);
  };
  const abortControllerRef = useRef<AbortController | null>(null);

  const buildQuery = () => {
    const params = searchParams.toString();
    return params ? `?${params}` : "";
  };

  const fetchProducts = async (page = 1, isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      }
      setError(null);

      if (page > pagination.totalPages) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const query = buildQuery();
      const pageQuery = query ? `${query}&page=${page}` : `?page=${page}`;
      const response = await apiFetch(`/products${pageQuery}`, {
        signal: controller.signal,
        cache: "no-store",
      });

      setPagination(response.paginate);
      setHasMore(page < response.paginate?.totalPages);

      if (isNewSearch) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
      if (isNewSearch) setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchParams]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = pagination.currentPage + 1;
      if (nextPage <= pagination.totalPages) {
        fetchProducts(nextPage);
      }
    }
  }, [inView, hasMore, loading, pagination]);

  const handleFilterChange = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "" || value === 0) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    const query = Array.from(params.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    const finalUrl = `/products${query ? "?" + query : ""}`;
    router.push(decodeURIComponent(finalUrl), { scroll: false });
  };

  const clearFilters = () => {
    router.push("/products", { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="ابحث عن المنتجات..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 text-right"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          الفلاتر
        </Button>
      </div>

      {/* الفلاتر الجانبية */}
      {showFilters && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">الفلاتر</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> مسح الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* نطاق السعر */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نطاق السعر
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  defaultValue={searchParams.get("min") || ""}
                  onChange={(e) =>
                    handleFilterChange("min", parseInt(e.target.value) || "")
                  }
                  placeholder="الأدنى"
                  className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-purple-500 text-right"
                />
                <span>-</span>
                <input
                  type="number"
                  defaultValue={searchParams.get("max") || ""}
                  onChange={(e) =>
                    handleFilterChange("max", parseInt(e.target.value) || "")
                  }
                  placeholder="الأقصى"
                  className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-purple-500 text-right"
                />
              </div>
            </div>

            {/* التصنيف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <select
                defaultValue={searchParams.get("category") || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">كل التصنيفات</option>
                <option value="books">كتب</option>
                <option value="courses">دورات</option>
                <option value="digital">منتجات رقمية</option>
              </select>
            </div>

            {/* التصنيف الفرعي */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف الفرعي
              </label>
              <select
                defaultValue={searchParams.get("subcategory") || ""}
                onChange={(e) =>
                  handleFilterChange("subcategory", e.target.value)
                }
                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">كل التصنيفات الفرعية</option>
                {/* يضاف بناءً على التصنيف المختار */}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* حالة التحميل */}
      {loading && <Loading />}

      {/* حالة الخطأ */}
      {error && (
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
          <Button
            onClick={() => setError(null)}
            variant="outline"
            className="mt-4"
          >
            حاول مجددًا
          </Button>
        </div>
      )}

      {/* حالة عدم وجود بيانات */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد منتجات مطابقة لبحثك.</p>
        </div>
      )}

      {/* الشبكة الخاصة بالمنتجات */}
      {!loading && !error && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
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
  );
};

const ProductsPage = () => {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
};

export default ProductsPage;
