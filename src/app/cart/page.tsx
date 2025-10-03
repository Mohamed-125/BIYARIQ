"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Trash2, Minus, Plus } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { useEffect } from "react";
import Link from "next/link";
import Loading from "../../components/ui/Loading";

export default function CartPage() {
  const { cartItems, loading, error, removeFromCart, updateQuantity } =
    useCart();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            حدث خطأ أثناء تحميل سلة التسوق
          </h2>
          <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">سلة التسوق فارغة</h2>
          <p className="text-gray-600 mb-8">
            لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
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

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.product.priceAfterDiscount || item.product.price) * item.quantity,
    0
  );

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    console.log(itemId);
    if (newQuantity >= 1) {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-lg p-4 relative"
            >
              <Link href={`/products/${item.id}`} className="shrink-0">
                <Image
                  src={item.product.thumbnail.url}
                  alt={item.product.name.ar}
                  width={96}
                  height={96}
                  className="rounded-md object-cover"
                />
              </Link>
              <div className="flex-1">
                <Link
                  href={`/products/${item.id}`}
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  {item.product.name.ar}
                </Link>
                <p className="text-gray-600 mt-1">
                  {item.product.priceAfterDiscount || item.product.price} ريال
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 absolute top-2 left-2"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>عدد المنتجات</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span>المجموع</span>
              <span>{total} ريال</span>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link href="/checkout/payment">متابعة الشراء</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
