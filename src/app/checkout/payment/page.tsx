"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Clock } from "lucide-react";
import Input from "../../../components/ui/Input";
import { div } from "framer-motion/client";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/payments/create", {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: "ALL", // Request all available payment methods
        }),
      });

      if (response.checkoutId) {
        // Remove any old scripts
        const existingScript = document.querySelector(
          "script[src*='paymentWidgets.js']"
        );
        if (existingScript) {
          existingScript.remove();
        }

        const configScript = document.createElement("script");
        configScript.type = "text/javascript";
        configScript.innerHTML = `
          var wpwlOptions = {
            paymentTarget: "_self",
            style: "plain",
            locale: "ar",
            applePay: {
              merchantCapabilities: ["supports3DS"],
              supportedNetworks: ["mada", "visa", "masterCard"]
            },
            onReady: function() {
              document.getElementsByClassName("wpwl-form")[0].style.display = "block";
            },
            onBeforeSubmitCard: function() {
              return true;
            },
            onAfterSubmit: function() {
              document.getElementsByClassName("wpwl-form")[0].style.display = "none";
            },
            brandDetection: true,
            brandDetectionPriority: ["MADA", "VISA", "MASTER"],
            onDetectBrand: function(brands) {
              console.log("Detected brands:", brands);
            },
            iframeStyles: {
              'card-number-placeholder': {
                'color': '#666666',
                'font-size': '14px'
              },
              'cvv-placeholder': {
                'color': '#666666',
                'font-size': '14px'
              }
            }
          };
        `;
        document.body.appendChild(configScript);

      const script = document.createElement("script");
      script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${response.checkoutId}`;
      script.async = true;
      document.body.appendChild(script);

      // Create form for payment submission
      const form = document.createElement("form");
      form.setAttribute("class", "paymentWidgets");
      form.setAttribute("data-brands", "VISA MASTER MADA APPLEPAY");
      
      // Create container for payment widget
      const container = document.createElement("div");
      container.id = "payment-widget-container";
      container.appendChild(form);
      
      // Clear any existing payment containers
      const existingContainer = document.getElementById("payment-widget-container");
      if (existingContainer) {
        existingContainer.remove();
      }
      
      // Add container to the page
      document.getElementById("payment-section")?.appendChild(container);

      return () => {
        script.remove();
        configScript.remove();
        container.remove();
      };
    } else {
      toast.error("حدث خطأ أثناء تجهيز عملية الدفع");
    }
  } catch (error) {
    toast.error("حدث خطأ أثناء معالجة الدفع");
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Section */}
        <div className="md:col-span-2 space-y-6">
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold mb-8"
          >
            الدفع
          </motion.h1>

          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              {["/payment/mada.webp", "/payment/visa.webp", "/payment/mastercard.png", "/payment/apple_pay.webp"].map((img, index) => (
                <div key={index} className="relative w-16 h-10">
                  <Image
                    src={img}
                    alt="Payment Method"
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Payment Widget Section */}
            <div
              id="payment-section"
              className="min-h-[300px] flex items-center justify-center"
            >
              {loading && (
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تحميل نموذج الدفع...</span>
                </div>
              )}
            </div>
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

            <p className="text-center text-sm text-gray-500 mt-4">
              بإتمام عملية الدفع، أنت توافق على
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
