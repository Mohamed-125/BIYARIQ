"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
    },
  },
};

const WishlistPage = () => {
  const { dummyProducts, addToCart } = useCart();
  const [wishlist, setWishlist] = useState(dummyProducts.slice(0, 5)); // Using first 5 products as dummy wishlist

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const moveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-purple-800 mb-4">
          قائمة الرغبات
        </h1>
        <p className="text-gray-600">
          {wishlist.length} منتجات في قائمة رغباتك
        </p>
      </motion.div>

      <AnimatePresence>
        {wishlist.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              قائمة رغباتك فارغة
            </h2>
            <p className="text-gray-500">
              اكتشف منتجاتنا وأضف ما يعجبك إلى قائمة رغباتك
            </p>
            <Button className="mt-6">تصفح المنتجات</Button>
          </motion.div>
        ) : (
          <motion.div className="grid gap-6" variants={containerVariants}>
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                variants={itemVariants}
                layout
                exit="exit"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                product.type === "physical"
                                  ? "bg-green-100 text-green-800"
                                  : product.type === "digital"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {product.type === "physical"
                                ? "منتج فعلي"
                                : product.type === "digital"
                                ? "منتج رقمي"
                                : "دورة تدريبية"}
                            </span>
                            {product.rating && (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <span className="text-sm text-gray-600">
                                  {product.rating}
                                </span>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating)
                                        ? "fill-current"
                                        : "fill-gray-300"
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-bold text-purple-800">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => moveToCart(product)}
                            className="flex items-center gap-2"
                          >
                            <div className="flex gap-2">
                              <FiShoppingCart className="w-4 h-4" />
                              إضافة للسلة
                            </div>
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => removeFromWishlist(product.id)}
                            className="flex items-center gap-2"
                          >
                            <div className="flex gap-2">
                              <FiTrash2 className="w-4 h-4" />
                              إزالة
                            </div>
                          </Button>
                        </div>
                        {product.type === "physical" && product.stock && (
                          <span
                            className={`text-sm ${
                              product.stock > 10
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}
                          >
                            {product.stock > 10
                              ? "متوفر في المخزون"
                              : `باقي ${product.stock} قطع فقط`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WishlistPage;
