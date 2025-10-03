"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">
              شكراً لك على طلبك!
            </h1>
            <p className="text-green-100 mt-2">
              تم استلام طلبك بنجاح وسيتم معالجته قريباً
            </p>
          </div>

          {/* Order Steps */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">تم استلام الطلب</h3>
                <p className="text-sm text-gray-600 mt-1">
                  سنقوم بمعالجة طلبك فوراً
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">تجهيز الطلب</h3>
                <p className="text-sm text-gray-600 mt-1">
                  سيتم تجهيز منتجاتك للشحن
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">الشحن والتوصيل</h3>
                <p className="text-sm text-gray-600 mt-1">
                  سيتم إرسال تحديثات الشحن إليك
                </p>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                تتبع طلبك
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                مواصلة التسوق
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}