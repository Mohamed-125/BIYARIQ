"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import Rating from "../ui/Rating";
import { useState } from "react";

type ProductType = "physical" | "digital" | "course";

interface BaseProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  type: ProductType;
  rating?: number;
}

interface PhysicalProduct extends BaseProduct {
  type: "physical";
  stock?: number;
  weight?: number;
  dimensions?: string;
}

interface DigitalProduct extends BaseProduct {
  type: "digital";
  fileSize?: string;
  format?: string;
  downloadLink?: string;
  licenseKey?: string;
}

interface CourseProduct extends BaseProduct {
  type: "course";
  duration?: number;
  lectures?: number;
  level?: string;
  instructor?: string;
}

type Product = PhysicalProduct | DigitalProduct | CourseProduct;

interface ProductCardProps {
  product: Product;
  removeTopButtons: boolean;
}

const defaultImage =
  "https://m.media-amazon.com/images/I/515gK1s2tSL._MCnd_AC_.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  removeTopButtons = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log("Added to cart:", product.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Add to favorites logic here
    console.log("Toggled favorite:", product.id, !isFavorite);
  };

  const renderProductDetails = () => {
    switch (product.type) {
      case "physical":
        return (
          <div className="text-gray-600 text-sm">
            {product.stock && <p>المخزون المتوفر: {product.stock}</p>}
            {product.dimensions && <p>الأبعاد: {product.dimensions}</p>}
          </div>
        );
      case "digital":
        return (
          <div className="text-gray-600 text-sm">
            {product.fileSize && <p>حجم الملف: {product.fileSize}</p>}
            {product.format && <p>الصيغة: {product.format}</p>}
          </div>
        );
      case "course":
        return (
          <div className="text-gray-600 text-sm">
            {product.duration && <p>المدة: {product.duration} ساعة</p>}
            {product.level && <p>المستوى: {product.level}</p>}
            {product.instructor && <p>المدرب: {product.instructor}</p>}
          </div>
        );
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      variants={fadeInUp}
    >
      <div className="relative">
        {removeTopButtons ? null : (
          <div className="absolute top-4 left-4 z-10 flex  gap-2">
            <motion.button
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center group hover:bg-purple-600 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              aria-label="إضافة إلى السلة"
            >
              <ShoppingCart className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
            </motion.button>

            <motion.button
              className={`w-10 h-10 rounded-full ${
                isFavorite ? "bg-pink-500" : "bg-white"
              } shadow-lg flex items-center justify-center group hover:bg-pink-500 transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              aria-label="إضافة إلى المفضلة"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "text-white fill-current" : "text-pink-500"
                } group-hover:text-white transition-colors duration-300`}
              />
            </motion.button>
          </div>
        )}

        <div className="h-64">
          {
            // product.image
            false ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <img
                src={defaultImage}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            )
          }
        </div>

        {product.type === "course" && (
          <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            دورة تدريبية
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-2">
        <Rating rating={product.rating as number} />

        <h3 className="text-xl font-semibold text-right truncate">
          {product.name}
        </h3>

        {renderProductDetails()}

        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <Link href={`/products/${product.id}`}>
              <Button variant={"secondary"} size={"md"}>
                عرض التفاصيل
              </Button>
            </Link>{" "}
            <div>
              {product.originalPrice && (
                <p className="text-gray-400 line-through text-sm">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <p className="text-purple-600 font-bold text-xl">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
