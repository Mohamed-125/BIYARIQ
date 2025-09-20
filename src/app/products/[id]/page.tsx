"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Rating from "@/components/ui/Rating";
import { SharePopup } from "@/components/SharePopup";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface LocalizedText {
  ar: string;
  en: string;
}

interface ProductImage {
  url: string;
  public_id: string;
  _id: string;
}

interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  priceAfterDiscount?: number;
  thumbnail: { url: string; public_id: string };
  images: ProductImage[];
  type: "physical" | "digital" | "course";
  category?: {
    name: LocalizedText;
  };
  subcategory?: {
    name: LocalizedText;
  };
  ratingAverage?: number;
  ratingQuantity?: number;
  stock?: number;
  colors?: string[];
  size?: string[];
  vendor?: {
    username: string;
    role: string;
    photo?: string | null;
  };
}

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    checkCartStatus();
    checkFavoriteStatus();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { product } = await apiFetch(`/products/${id}`);
      setProduct(product);

      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.size?.length) setSelectedSize(product.size[0]);
    } catch (err) {
      setError("فشل تحميل المنتج");
    } finally {
      setLoading(false);
    }
  };

  const checkCartStatus = async () => {
    try {
      if (user) {
        const response = await apiFetch("/cart");
        setIsInCart(response.items.some((item: any) => item.product.id === id));
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setIsInCart(localCart.some((item: any) => item.productId === id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      if (user) {
        const response = await apiFetch("/favorites");
        setIsFavorite(
          response.favorites.some((item: any) => item.product.id === id)
        );
      } else {
        const localFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        setIsFavorite(localFavorites.includes(id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (user) {
        await apiFetch("/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: id,
            quantity,
            color: selectedColor,
            size: selectedSize,
          }),
        });
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!localCart.some((item: any) => item.productId === id)) {
          localCart.push({
            productId: id,
            quantity,
            color: selectedColor,
            size: selectedSize,
          });
          localStorage.setItem("cart", JSON.stringify(localCart));
        }
      }
      setIsInCart(true);
      toast.success("تمت الإضافة إلى السلة");
    } catch {
      toast.error("فشل إضافة المنتج إلى السلة");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (user) {
        if (isFavorite) {
          await apiFetch(`/favorites/${id}`, { method: "DELETE" });
        } else {
          await apiFetch("/favorites", {
            method: "POST",
            body: JSON.stringify({ productId: id }),
          });
        }
      } else {
        const localFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        if (isFavorite) {
          const updated = localFavorites.filter(
            (favId: string) => favId !== id
          );
          localStorage.setItem("favorites", JSON.stringify(updated));
        } else {
          if (!localFavorites.includes(id)) {
            localFavorites.push(id);
            localStorage.setItem("favorites", JSON.stringify(localFavorites));
          }
        }
      }
      setIsFavorite(!isFavorite);
    } catch {
      toast.error("فشل تحديث المفضلة");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-500 py-8">{error || "خطأ"}</div>
    );
  }

  const discount =
    product.priceAfterDiscount && product.price
      ? Math.round(
          ((product.price - product.priceAfterDiscount) / product.price) * 100
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Swiper
            spaceBetween={10}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Pagination, Thumbs]}
            className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
          >
            {[product.thumbnail, ...product.images].map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={typeof image === "string" ? image : image.url}
                  alt={product.name.ar}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={0}
            slidesPerView={4}
            width={350}
            watchSlidesProgress
            modules={[Navigation, Thumbs]}
            className="thumbs-swiper"
          >
            {[product.thumbnail, ...product.images].map((image, index) => (
              <SwiperSlide key={index} className="!h-fit">
                <img
                  src={typeof image === "string" ? image : image.url}
                  alt={`thumb-${index}`}
                  className="object-cover cursor-pointer w-[75px] rounded-xl aspect-square"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 mt-0 lg:mt-10"
        >
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name.ar}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600"
                } hover:scale-110 transition-all`}
              >
                <Heart size={24} className={isFavorite ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => setShowSharePopup(true)}
                className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
              >
                <Share2 />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Rating rating={product.ratingAverage || 0} />
            <span className="text-gray-500">
              ({product.ratingQuantity || 0} تقييم)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#7b2cbf]">
                {product.priceAfterDiscount || product.price} ﷼
              </span>
              {discount > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  {product.price} ﷼
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                خصم {discount}%
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="space-y-2">
              <label className="font-medium">الألوان:</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-purple-500"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.size?.length > 0 && (
            <div className="space-y-2">
              <label className="font-medium">المقاسات:</label>
              <div className="flex gap-2">
                {product.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2 py-4 border-y border-gray-200">
            <label className="font-medium text-gray-600">الكمية</label>
            <div className="flex items-center gap">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-purple-500 text-lg font-bold"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-purple-500 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isInCart || (product.stock || 0) === 0}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-colors ${
              isInCart
                ? "bg-green-500 text-white"
                : "bg-[#7b2cbf] text-white hover:bg-[#6a24a6]"
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isInCart ? "تمت الإضافة للسلة" : "إضافة إلى السلة"}
          </button>
        </motion.div>
      </div>

      {/* Vendor Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
        <div className="flex items-center gap-4">
          <img
            src={product.vendor?.photo || "/default-avatar.png"}
            alt={product.vendor?.username}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {product.vendor?.username}
            </h2>
            <p className="text-lg text-gray-600 mt-1">
              {product.vendor?.role === "admin" ? "متجر موثق ✅" : "بائع"}
            </p>
          </div>
        </div>
      </div>
      {/* Share Popup */}
      <SharePopup open={showSharePopup} setOpen={setShowSharePopup} />
    </div>
  );
}
