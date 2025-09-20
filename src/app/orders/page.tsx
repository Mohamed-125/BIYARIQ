"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Truck, Home, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FiPackage, FiDownload, FiBook } from "react-icons/fi";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";

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
  const { dummyProducts  } = useCart();
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

  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orderStatuses = {
    physical: [
      { status: "pending", label: "قيد المعالجة", color: "yellow" },
      { status: "processing", label: "جاري التجهيز", color: "blue" },
      { status: "shipped", label: "تم الشحن", color: "indigo" },
      { status: "out_for_delivery", label: "خارج للتوصيل", color: "purple" },
      { status: "delivered", label: "تم التوصيل", color: "green" },
      { status: "cancelled", label: "ملغي", color: "red" },
      { status: "returned", label: "مرتجع", color: "gray" },
    ],
    digital: [
      { status: "pending", label: "قيد المعالجة", color: "yellow" },
      { status: "processing", label: "جاري التجهيز", color: "blue" },
      { status: "available", label: "متاح للتحميل", color: "green" },
      { status: "cancelled", label: "ملغي", color: "red" },
    ],
    course: [
      { status: "pending", label: "قيد المعالجة", color: "yellow" },
      { status: "enrolled", label: "تم التسجيل", color: "green" },
      { status: "in_progress", label: "جاري التعلم", color: "blue" },
      { status: "completed", label: "مكتمل", color: "purple" },
      { status: "cancelled", label: "ملغي", color: "red" },
    ],
  };

  const getStatusBadge = (type: string, status: string) => {
    const statusObj = orderStatuses[type as keyof typeof orderStatuses]?.find(
      (s) => s.status === status
    );
    if (!statusObj) return null;

    return (
      <span
        className={`bg-${statusObj.color}-100 text-${statusObj.color}-800 px-3 py-1 rounded-full text-sm font-medium`}
      >
        {statusObj.label}
      </span>
    );
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
                        {getStatusBadge(
                          product.type,
                          product.status || "pending"
                        )}
                        <span className="text-gray-600">
                          رقم الطلب: #{product.id}
                        </span>
                      </div>

                      {/* Display variants, color, and size */}
                      <div className="mt-2 flex flex-wrap gap-1.5 text-sm text-gray-600">
                        {product.variants?.length > 0 && (
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
                      onClick={() => {
                        if (product.type === "physical") {
                          setSelectedOrder(product);
                          setShowTrackingModal(true);
                        }
                      }}
                    >
                      {product.type === "physical"
                        ? "تتبع الشحنة"
                        : "عرض المحتوى"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tracking note */}
              {product.type === "physical" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 text-center text-sm text-gray-500"
                >
                  * يتم تحديث حالة الشحنة تلقائياً كل 30 دقيقة
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tracking Modal */}
      <Dialog open={showTrackingModal} setOpen={setShowTrackingModal}>
        <DialogContent className="relative max-w-lg w-full mx-4 shadow-xl bg-white rounded-lg">
          <button
            onClick={() => setShowTrackingModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={20} />
          </button>

          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              تتبع الشحنة
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 relative before:absolute before:content-[''] before:w-0.5 before:h-full before:bg-gray-200 before:left-5 before:top-0 rtl:before:right-5 rtl:before:left-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center relative z-10 bg-white"
            >
              <div className="absolute w-3 h-3 bg-blue-600 rounded-full left-4 rtl:right-4 rtl:left-auto"></div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium">تم استلام الطلب</h3>
                <p className="text-gray-500">12 مايو 2024، 10:30 صباحاً</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center relative z-10 bg-white"
            >
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full left-4 rtl:right-4 rtl:left-auto"></div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium">تم شحن الطلب</h3>
                <p className="text-gray-500">13 مايو 2024، 2:15 مساءً</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center relative z-10 bg-white"
            >
              <div className="absolute w-3 h-3 bg-purple-600 rounded-full left-4 rtl:right-4 rtl:left-auto"></div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium">خارج للتوصيل</h3>
                <p className="text-gray-500">14 مايو 2024، 9:00 صباحاً</p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center relative z-10 bg-white"
            >
              <div className="absolute w-3 h-3 bg-green-600 rounded-full left-4 rtl:right-4 rtl:left-auto"></div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium">تم التوصيل</h3>
                <p className="text-gray-500">14 مايو 2024، 2:30 مساءً</p>
              </div>
            </motion.div>
          </div>

          {/* Tracking info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
          >
            <h4 className="font-medium mb-2">معلومات إضافية</h4>
            <p className="text-gray-600">رقم التتبع: {selectedOrder?.id}</p>
            <p className="text-gray-600">شركة الشحن: أرامكس</p>
            <p className="text-gray-600">المندوب: أحمد محمد</p>
            <p className="text-gray-600">رقم الهاتف: 0123456789</p>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrdersPage;
