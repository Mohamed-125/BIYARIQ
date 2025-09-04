"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { div } from "framer-motion/client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Input from "@/components/ui/Input";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -100,
  },
};

const tabContentVariants = {
  enter: { opacity: 0, x: 10 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "digital" | "physical" | "courses"
  >("digital");

  const {
    digitalItems,
    physicalItems,
    courseItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    addToWishlist,
    saveForLater,
  } = useCart();

  const items =
    activeTab === "digital"
      ? digitalItems
      : activeTab === "physical"
      ? physicalItems
      : courseItems;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  const parentVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    initial: {
      y: -20,
      opacity: 0,
      transition: {
        ease: "easeOut",
      },
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
      },
    },
  };

  // Combine all product categories
  const allItems = [...digitalItems, ...physicalItems, ...courseItems];

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mb-8 bg-[hsl(259.09_96.49%_77.65%_/_13%)] h-[200px] flex flex-col justify-center items-center rounded-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 z-[-1] bg-[url('/_next/static/media/breadcrumb-gradient-bg.9ef1bda5.png')] bg-no-repeat bg-center bg-cover"></div>
        <h2 className="text-4xl font-bold text-[#0a0a1a] ">سلة التسوق</h2>
      </motion.div>

      {/* Container */}
      <div className="max-w-[1200px] mx-auto p-8 fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {allItems.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-12 text-[#0a0a1a] text-lg"
                >
                  لا توجد منتجات في السلة
                </motion.div>
              ) : (
                <motion.div
                  key="all-products"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <AnimatePresence>
                    {allItems.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        layout
                        className="relative bg-white rounded-lg p-6 mb-4 border border-[rgba(0,0,0,0.1)] flex items-start gap-6 transition-all duration-300 hover:shadow-md"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-4">
                            <p className="text-[#7b2cbf] font-bold">
                              {formatPrice(item.price)}
                            </p>
                            {item.originalPrice && (
                              <p className="text-gray-400 line-through">
                                {formatPrice(item.originalPrice)}
                              </p>
                            )}
                          </div>

                          {/* Display variants, color, and size */}
                          <div className="mt-2 flex flex-wrap gap-1.5 text-sm text-gray-600">
                            {item.variants && item.variants.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-1">
                                {item.variants.map((variant, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-gray-100 px-2 py-1 rounded-md"
                                  >
                                    {variant.name}: {variant.value}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.color && (
                              <span className="inline-flex items-center gap-1 mr-2">
                                <span className="font-medium">اللون:</span>
                                <span className="flex items-center gap-1">
                                  <span
                                    className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                    style={{
                                      backgroundColor:
                                        item.colorCode || item.color,
                                    }}
                                  ></span>
                                  {item.color}
                                </span>
                              </span>
                            )}
                            {item.size && (
                              <span className="inline-flex items-center gap-1">
                                <span className="font-medium">المقاس:</span>
                                <span>{item.size}</span>
                              </span>
                            )}
                          </div>

                          {/* Only show quantity controls for non-course products */}
                          {"duration" in item ? (
                            <div className="text-sm text-gray-500 mt-2">
                              <span>{item.duration} ساعة</span> •{" "}
                              <span>{item.lectures} محاضرة</span> •{" "}
                              <span>{item.level}</span>
                            </div>
                          ) : (
                            <div className="flex mt-4 items-center gap-1 mb-2">
                              <Button
                                variant={"ghost"}
                                size="small"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    (item.quantity || 1) - 1
                                  )
                                }
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="px-2 font-medium">
                                {item.quantity || 1}
                              </span>
                              <Button
                                variant={"ghost"}
                                size="small"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    (item.quantity || 1) + 1
                                  )
                                }
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            className="text-red-500 hover:text-red-600 text-sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            إزالة
                          </button>
                          <button
                            className="text-[#7b2cbf] hover:opacity-80 text-sm"
                            onClick={() => saveForLater(item.id)}
                          >
                            حفظ لوقت لاحق
                          </button>
                          <button
                            className="text-[#7b2cbf] hover:opacity-80 text-sm"
                            onClick={() => addToWishlist(item.id)}
                          >
                            إضافة إلى قائمة الرغبات
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* Summary */}
          {items.length > 0 && (
            <div className="sticky top-4">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{
                  y: -20,
                  opacity: 0,
                }}
                transition={{
                  ease: "easeOut",
                }}
                className="bg-white rounded-lg border border-[rgba(0,0,0,0.1)] p-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعر الأصلي:</span>
                    <span className="text-gray-600">
                      {formatPrice(totalPrice * 1.2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الخصم:</span>
                    <span className="text-red-500">
                      - {formatPrice(totalPrice * 0.2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="font-bold">المجموع:</span>
                    <span className="font-bold text-xl text-[#7b2cbf]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
                <Link href={"checkout"}>
                  <Button size={"full"} className="mt-5">
                    إتمام الشراء
                  </Button>
                </Link>
                <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]">
                  <Input
                    type="text"
                    placeholder="أدخل رمز القسيمة"
                    className="w-full p-2 border border-[rgba(0,0,0,0.1)] rounded-lg mb-2 text-right"
                  />
                  <Button className="mt-3">تطبيق القسيمة</Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
