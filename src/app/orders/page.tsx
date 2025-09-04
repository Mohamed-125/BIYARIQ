"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { FiPackage, FiDownload, FiBook } from "react-icons/fi";
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
};

const OrdersPage = () => {
  const { dummyProducts } = useCart();
  const [activeTab, setActiveTab] = useState<
    "all" | "physical" | "digital" | "course"
  >("all");

  const tabs = [
    { id: "all", label: "جميع الطلبات", count: dummyProducts.length },
    {
      id: "physical",
      label: "المنتجات الفعلية",
      count: dummyProducts.filter((p) => p.type === "physical").length,
    },
    {
      id: "digital",
      label: "المنتجات الرقمية",
      count: dummyProducts.filter((p) => p.type === "digital").length,
    },
    {
      id: "course",
      label: "الدورات",
      count: dummyProducts.filter((p) => p.type === "course").length,
    },
  ];

  const filteredProducts =
    activeTab === "all"
      ? dummyProducts
      : dummyProducts.filter((product) => product.type === activeTab);

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "physical":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            تم التوصيل
          </span>
        );
      case "digital":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            جاهز للتحميل
          </span>
        );
      case "course":
        return (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            مفتوح
          </span>
        );
      default:
        return null;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "physical":
        return <FiPackage className="w-6 h-6" />;
      case "digital":
        return <FiDownload className="w-6 h-6" />;
      case "course":
        return <FiBook className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-purple-800"
        variants={itemVariants}
      >
        طلباتي
      </motion.h1>

      {/* Tabs */}
      <motion.div className="flex flex-wrap gap-4 mb-8" variants={itemVariants}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeTab === tab.id
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            <span className="bg-white px-2 py-1 rounded-full text-sm">
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Orders List */}
      <motion.div className="space-y-6" variants={containerVariants}>
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            variants={itemVariants}
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="flex items-center gap-4">
                        {getStatusBadge(product.type)}
                        <span className="text-gray-600">
                          رقم الطلب: #{product.id}
                        </span>
                      </div>

                      {/* Display variants, color, and size */}
                      <div className="mt-2 flex flex-wrap gap-1.5 text-sm text-gray-600">
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-1">
                            {product.variants.map((variant, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 px-2 py-1 rounded-md"
                              >
                                {variant.name}: {variant.value}
                              </span>
                            ))}
                          </div>
                        )}
                        {product.color && (
                          <span className="inline-flex items-center gap-1 mr-2">
                            <span className="font-medium">اللون:</span>
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor:
                                    product.colorCode || product.color,
                                }}
                              ></span>
                              {product.color}
                            </span>
                          </span>
                        )}
                        {product.size && (
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium">المقاس:</span>
                            <span>{product.size}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-purple-800">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      {getIcon(product.type)}
                      <span>
                        {product.type === "physical" &&
                          "تم التوصيل في 12 مارس 2024"}
                        {product.type === "digital" && "متاح للتحميل"}
                        {product.type === "course" && "يمكنك الوصول للمحتوى"}
                      </span>
                    </div>
                    <Button
                      variant={
                        product.type === "physical" ? "secondary" : "primary"
                      }
                      className="px-6"
                    >
                      {product.type === "physical"
                        ? "تتبع الشحنة"
                        : "عرض المحتوى"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default OrdersPage;
