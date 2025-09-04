"use client";

import { motion } from "framer-motion";
import { Package, FileText } from "lucide-react";
import Link from "next/link";

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

export default function ProductsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">المنتجات</h1>
      </div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Link href="/seller/test-seller/dashboard/products/physical">
            <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <Package className="w-8 h-8 text-purple-500" />
                <div>
                  <h2 className="text-xl font-semibold">المنتجات المادية</h2>
                  <p className="text-gray-600 mt-2">إدارة المنتجات المادية الخاصة بك</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/seller/test-seller/dashboard/products/digital">
            <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-purple-500" />
                <div>
                  <h2 className="text-xl font-semibold">المنتجات الرقمية</h2>
                  <p className="text-gray-600 mt-2">إدارة المنتجات الرقمية الخاصة بك</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
