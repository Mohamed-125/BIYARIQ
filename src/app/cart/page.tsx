"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { div } from "framer-motion/client";
import Button from "@/components/ui/Button";

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
        {/* Tabs */}
        <motion.div
          variants={parentVariants}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg p-4 mb-6 flex gap-2.5"
        >
          {["digital", "physical", "courses"].map((tab) => (
            <motion.button
              variants={childVariants}
              key={tab}
              className={`px-6 py-2 rounded-md border border-gray-300 cursor-pointer ${
                activeTab === tab
                  ? "bg-[#7b2cbf] text-white font-bold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab === "digital"
                ? "المنتجات الرقمية"
                : tab === "physical"
                ? "المنتجات المادية"
                : "الدورات التدريبية"}
            </motion.button>
          ))}
        </motion.div>
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {items.length === 0 ? (
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
                  key={activeTab}
                  variants={tabContentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <AnimatePresence>
                    {items.map((item) => (
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

                          {activeTab !== "courses" && (
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
                          {activeTab === "courses" && (
                            <div className="text-sm text-gray-500 mt-2">
                              <span>{item.duration} ساعة</span> •{" "}
                              <span>{item.lectures} محاضرة</span> •{" "}
                              <span>{item.level}</span>
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
                <Button size={"full"} className="mt-5">
                  إتمام الشراء
                </Button>
                <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]">
                  <input
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
