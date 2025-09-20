"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Trash2, ShoppingCart } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductCard from "../../components/Card/ProductCard";
import Loading from "../../components/ui/Loading";

export default function FavoritesPage() {
  const { favorites, loading, error, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  console.log("loading", loading);
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            حدث خطأ أثناء تحميل المفضلة
          </h2>
          <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      </div>
    );
  }

  if (!loading && !favorites.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">المفضلة فارغة</h2>
          <p className="text-gray-600 mb-8">
            لم تقم بإضافة أي منتجات إلى المفضلة بعد
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = async (productId: string) => {
    await removeFromFavorites(productId);
  };

  const handleAddToCart = async (product: any) => {
    await addToCart(product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">المفضلة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product}></ProductCard>
        ))}
      </div>
    </div>
  );
}
