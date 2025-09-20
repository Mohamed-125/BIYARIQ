"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectItem } from "@/components/ui/Select";
import { Search, Plus, Link as LinkIcon } from "lucide-react";

// نموذج بيانات المنتجات
const products = [
  {
    id: 1,
    name: "منتج 1",
    image: "/products/product1.jpg",
    price: 199,
    commission: 20,
    description: "وصف المنتج الأول",
    category: "الفئة الأولى",
  },
  {
    id: 2,
    name: "منتج 2",
    image: "/products/product2.jpg",
    price: 299,
    commission: 30,
    description: "وصف المنتج الثاني",
    category: "الفئة الثانية",
  },
  // يمكن إضافة المزيد من المنتجات هنا
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const createMarketingLink = async (productId: number) => {
    try {
      const response = await fetch("/api/affiliate/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("فشل إنشاء رابط التسويق");
      }

      // يمكن إضافة إشعار نجاح هنا
      // يمكن التوجيه إلى صفحة الروابط
    } catch (error) {
      console.error("خطأ في إنشاء رابط التسويق:", error);
      // يمكن إضافة إشعار خطأ هنا
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">المنتجات المتاحة للتسويق</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative md:w-64">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="البحث في المنتجات..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          placeholder="تصفية حسب الفئة"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectItem value="all">جميع الفئات</SelectItem>
          <SelectItem value="category1">الفئة الأولى</SelectItem>
          <SelectItem value="category2">الفئة الثانية</SelectItem>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span>السعر: {product.price} ريال</span>
                  <span className="text-green-600">
                    العمولة: {product.commission} ريال
                  </span>
                </div>
                <Button
                  onClick={() => createMarketingLink(product.id)}
                  className="w-full"
                >
                  <LinkIcon className="w-4 h-4 ml-2" />
                  إنشاء رابط تسويقي
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}