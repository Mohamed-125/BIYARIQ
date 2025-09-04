"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Clock } from "lucide-react";
import Input from "../../components/ui/Input";
import { div } from "framer-motion/client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
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

const paymentMethods = [
  {
    id: "credit_card",
    name: "بطاقة ائتمان",
    icon: CreditCard,
    images: [
      "/payment/visa.webp",
      "/payment/mastercard.png",
      "/payment/mada.webp",
    ],
  },
  {
    id: "digital_wallet",
    name: "محفظة رقمية",
    icon: Wallet,
    images: [
      "/payment/apple_pay.webp",
      "/payment/google_pay.webp",
      "/payment/stc_pay.webp",
    ],
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePayment = () => {};

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="md:col-span-2 space-y-6">
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold mb-8"
          >
            اختر طريقة الدفع
          </motion.h1>

          <motion.div variants={itemVariants} className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer ${
                  selectedMethod === method.id
                    ? "border-purple-600"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <method.icon
                      size={24}
                      className={
                        selectedMethod === method.id
                          ? "text-purple-600"
                          : "text-gray-400"
                      }
                    />
                    <span className="font-medium">{method.name}</span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "border-purple-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {method.images.map((img, index) => (
                    <div key={index} className="relative w-16 h-10">
                      <Image
                        src={img}
                        alt={method.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
                {method.id === "credit_card" &&
                  selectedMethod === "credit_card" && (
                    <div className="mt-6 space-y-4">
                      <Input
                        type="text"
                        placeholder="رقم البطاقة"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="تاريخ الانتهاء (MM/YY)"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Input
                          type="text"
                          placeholder="CVV"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  )}

                {method.id === "digital_wallet" &&
                  selectedMethod === "digital_wallet" && (
                    <div className="mt-6 space-y-4">
                      <Input
                        type="text"
                        placeholder="بريد المحفظة أو رقم الهاتف"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="font-medium mb-2">تطوير تطبيقات الويب المتقدمة</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span>15 ساعة</span>
              </div>

              {/* Display variants, color, and size */}
              <div className="mt-2 flex flex-wrap gap-1.5 text-sm text-gray-600">
                {/* Example of variants display - in a real app, this would come from the cart/order data */}
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                    النسخة: الكاملة
                  </span>
                </div>

                {/* Example of color display */}
                <span className="inline-flex items-center gap-1 mr-2">
                  <span className="font-medium">اللون:</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: "#3B82F6" }}
                    ></span>
                    أزرق
                  </span>
                </span>

                {/* Example of size display */}
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium">المقاس:</span>
                  <span>متوسط</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">سعر الدورة</span>
                <span>299 ر.س</span>
              </div>
              <div className="flex items-center justify-between text-green-600">
                <span>خصم</span>
                <span>-100 ر.س</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg pt-3 border-t border-gray-200">
                <span>الإجمالي</span>
                <span>199 ر.س</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod}
              className={`w-full px-6 py-3 rounded-xl text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                selectedMethod
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              إتمام الدفع
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              بالضغط على إتمام الدفع، أنت توافق على
              <a
                href="/terms-conditions"
                className="text-purple-600 hover:underline mx-1"
              >
                الشروط والأحكام
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
