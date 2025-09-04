"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Share2, Edit } from "lucide-react";
import Button from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import ProductCard from "@/components/Card/ProductCard";
import { SharePopup } from "@/components/SharePopup";
import { useState } from "react";
import { Facebook, Twitter, WhatsApp } from "lucide-react";
import { div } from "framer-motion/client";
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

const StorePage = () => {
  const { dummyProducts } = useCart();
  const isStoreOwner = true; // This would come from auth context in a real app
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Dummy store data
  const store = {
    name: "متجر الإبداع",
    banner: "/store-banner.jpg",
    avatar: "/store-avatar.jpg",
    rating: 4.5,
    totalSales: 1234,
    joinedDate: "2023",
  };

  const tabs = [
    { id: "all", label: "جميع المنتجات", count: dummyProducts.length },
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      {/* Banner */}
      <motion.div
        variants={itemVariants}
        style={{
          background:
            "url(https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?cs=srgb&dl=pexels-kish-1488463.jpg&fm=jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
        }}
        className="relative w-full h-36 md:h-46 "
      ></motion.div>

      <SharePopup open={isShareOpen} setOpen={setIsShareOpen} />
      <div className="flex justify-between gap-6 my-6">
        <div className="flex gap-3 items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <div className="flex items-center gap-4 text-gray-600  my-3">
              <span>انضم في {store.joinedDate}</span>
              <span>•</span>
              <span>{store.totalSales} مبيعات</span>
            </div>
            <Rating rating={store.rating} size="lg" />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex gap-2">
            <Button variant={"ghost"} className="border border-gray-200">
              <Share2 className="w-4 h-4" />
            </Button>
            {isStoreOwner && (
              <Link
                href={"/seller/" + (store?.id || "id") + "/dashboard/analytics"}
              >
                <Button variant={"ghost"} className="border border-gray-200">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <motion.div className="flex flex-wrap gap-4 mb-8" variants={itemVariants}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            <span>{tab.label}</span>
            <span className="bg-white px-2 py-1 rounded-full text-sm">
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {dummyProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StorePage;
