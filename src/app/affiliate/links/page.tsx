"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Copy, Share2, QrCode, Search } from "lucide-react";
import Input from "../../../components/ui/Input";

const links = [
  {
    id: 1,
    productName: "دورة تطوير تطبيقات الويب المتقدمة",
    url: "https://example.com/course/web-dev?ref=aff123",
    sales: 45,
    commission: "1,350 ر.س",
    image: "/images/course-1.jpg",
  },
  {
    id: 2,
    productName: "دورة تصميم واجهات المستخدم",
    url: "https://example.com/course/ui-design?ref=aff123",
    sales: 32,
    commission: "960 ر.س",
    image: "/images/course-2.jpg",
  },
];

export default function AffiliateLinks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showQR, setShowQR] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  const handleCopy = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleShare = (id: number) => {
    setShowShareModal(id);
    // Implement share functionality
  };

  const handleQRCode = (id: number) => {
    setShowQR(id);
    // Implement QR code generation
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">روابط التسويق بالعمولة</h1>
        <p className="text-gray-600">
          قم بإدارة روابط التسويق الخاصة بك وتتبع أدائها
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="ابحث عن المنتجات..."
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid gap-6">
        {links.map((link) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden">
                <Image
                  src={link.image}
                  alt={link.productName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">
                  {link.productName}
                </h3>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">المبيعات:</span> {link.sales}
                  </div>
                  <div>
                    <span className="font-medium">العمولة:</span>{" "}
                    {link.commission}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleCopy(link.url, link.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Copy size={18} />
                    {copySuccess === link.id ? "تم النسخ!" : "نسخ الرابط"}
                  </button>

                  <button
                    onClick={() => handleShare(link.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 size={18} />
                    مشاركة
                  </button>

                  <button
                    onClick={() => handleQRCode(link.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <QrCode size={18} />
                    QR Code
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">رابط التسويق:</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm flex-grow">
                  {link.url}
                </code>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generate Link Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-8 left-8"
      >
        <button className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition-colors">
          توليد رابط جديد
        </button>
      </motion.div>
    </div>
  );
}
