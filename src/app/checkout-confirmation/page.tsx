"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function CheckoutConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourcePath = searchParams.get("resourcePath");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (resourcePath) {
      processPayment();
    } else {
      setStatus("error");
      setMessage("معلومات الدفع غير صحيحة");
    }
  }, [resourcePath]);

  const processPayment = async () => {
    try {
      const response = await apiFetch("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ resourcePath }),
      });

      if (response.success) {
        setStatus("success");
        setMessage("تم الدفع بنجاح");
        
        // Store order details in localStorage if available
        if (response.orderId) {
          localStorage.setItem("lastOrderId", response.orderId);
        }
        
        // Clear cart immediately
        localStorage.removeItem("cart");
        
        // Redirect to thank you page after showing success message
        setTimeout(() => {
          router.replace("/thank-you");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(response.message || "فشلت عملية الدفع");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setStatus("error");
      setMessage("حدث خطأ أثناء معالجة الدفع");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center">
          {status === "loading" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                جاري معالجة الدفع
              </h2>
              <p className="mt-2 text-gray-600">
                يرجى الانتظار حتى تكتمل العملية...
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                تم الدفع بنجاح
              </h2>
              <p className="mt-2 text-gray-600">
                سيتم تحويلك إلى صفحة التأكيد خلال لحظات...
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                فشلت عملية الدفع
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <button
                onClick={() => router.push("/checkout/payment")}
                className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                المحاولة مرة أخرى
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}