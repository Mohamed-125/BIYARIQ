"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Package, Edit, Trash } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/Card/ProductCard";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Input from "../../../../../../components/ui/Input";

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

export default function DigitalProductsPage() {
  const { dummyProducts } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = dummyProducts.filter(
    (product) =>
      product.type === "digital" &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">المنتجات الرقمية</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Link href="/seller/test-seller/dashboard/products/add/digital">
            <Button>
              <div className="flex">
                <Plus className="w-5 h-5 ml-2" />
                إضافة منتج رقمي
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <div className="group relative">
              <ProductCard removeTopButtons={true} product={product} />
              <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                  <Link
                    href={
                      "/seller/test-seller/dashboard/products/digital/warehouses/w1/add-digital-product"
                    }
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Link>{" "}
                </button>
                <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
