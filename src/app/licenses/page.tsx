"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiKey,
  FiCheck,
  FiCopy,
  FiAlertCircle,
  FiHelpCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

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

interface License {
  id: string;
  productName: string;
  licenseKey: string;
  status: "active" | "inactive" | "expired";
  activationDate: string;
  expiryDate: string;
  instructions: string;
}

const mockLicenses: License[] = [
  {
    id: "1",
    productName: "برنامج تحرير الفيديو",
    licenseKey: "XXXX-YYYY-ZZZZ-WWWW",
    status: "active",
    activationDate: "2024-01-01",
    expiryDate: "2025-01-01",
    instructions:
      "1. قم بفتح البرنامج\n2. انتقل إلى الإعدادات\n3. اختر 'تفعيل المنتج'\n4. أدخل مفتاح الترخيص\n5. اضغط على 'تفعيل'",
  },
  {
    id: "2",
    productName: "برنامج تصميم الجرافيك",
    licenseKey: "AAAA-BBBB-CCCC-DDDD",
    status: "inactive",
    activationDate: "2024-01-15",
    expiryDate: "2024-07-15",
    instructions:
      "1. قم بتحميل البرنامج\n2. ثبت البرنامج على جهازك\n3. عند بدء التشغيل الأول، أدخل مفتاح الترخيص\n4. اتبع التعليمات على الشاشة",
  },
];

export default function LicensesPage() {
  const [expandedInstructions, setExpandedInstructions] = useState<
    string | null
  >(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("تم نسخ مفتاح الترخيص");
    } catch (err) {
      toast.error("فشل نسخ مفتاح الترخيص");
    }
  };

  const getStatusColor = (status: License["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "inactive":
        return "text-yellow-600 bg-yellow-50";
      case "expired":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: License["status"]) => {
    switch (status) {
      case "active":
        return "مفعل";
      case "inactive":
        return "غير مفعل";
      case "expired":
        return "منتهي";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">تراخيصي</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <FiKey className="w-5 h-5" />
          <span>عدد التراخيص: {mockLicenses.length}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {mockLicenses.map((license) => (
          <motion.div
            key={license.id}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">
                    {license.productName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      license.status
                    )}`}
                  >
                    {getStatusText(license.status)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 rounded-lg p-3 font-mono text-sm">
                    {license.licenseKey}
                  </div>
                  <button
                    onClick={() => copyToClipboard(license.licenseKey)}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <FiCopy className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">تاريخ التفعيل:</span>{" "}
                    {new Date(license.activationDate).toLocaleDateString("ar")}
                  </div>
                  <div>
                    <span className="font-medium">تاريخ الانتهاء:</span>{" "}
                    {new Date(license.expiryDate).toLocaleDateString("ar")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    setExpandedInstructions(
                      expandedInstructions === license.id ? null : license.id
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FiHelpCircle className="w-4 h-4" />
                  <span>تعليمات التفعيل</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedInstructions === license.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium mb-2">خطوات التفعيل:</h4>
                    <div className="space-y-2 text-gray-600">
                      {license.instructions.split("\n").map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
