"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Star,
  Package,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { h2 } from "framer-motion/client";

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

interface ProductPerformance {
  name: string;
  sku: string;
  sales: number;
  revenue: number;
  rating: number;
}

interface RatedProduct {
  name: string;
  sku: string;
  rating: number;
  reviews: number;
  lastReview: string;
}

export default function ProductsReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const topProducts: ProductPerformance[] = [
    {
      name: "سماعات لاسلكية",
      sku: "HDP-001",
      sales: 150,
      revenue: 30000,
      rating: 4.8,
    },
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      sales: 120,
      revenue: 24000,
      rating: 4.6,
    },
    {
      name: "ساعة ذكية",
      sku: "WCH-003",
      sales: 100,
      revenue: 35000,
      rating: 4.7,
    },
  ];

  const lowPerformingProducts: ProductPerformance[] = [
    {
      name: "حقيبة يد",
      sku: "BAG-001",
      sales: 5,
      revenue: 1000,
      rating: 3.5,
    },
    {
      name: "نظارة شمسية",
      sku: "SGL-002",
      sales: 8,
      revenue: 1600,
      rating: 3.8,
    },
    {
      name: "محفظة جلدية",
      sku: "WLT-003",
      sales: 10,
      revenue: 1500,
      rating: 3.2,
    },
  ];

  const ratedProducts: RatedProduct[] = [
    {
      name: "سماعات لاسلكية",
      sku: "HDP-001",
      rating: 4.8,
      reviews: 250,
      lastReview: "2024-03-15",
    },
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      rating: 4.6,
      reviews: 180,
      lastReview: "2024-03-14",
    },
    {
      name: "ساعة ذكية",
      sku: "WCH-003",
      rating: 4.7,
      reviews: 200,
      lastReview: "2024-03-13",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير المنتجات</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <Download size={16} />
          </Button>
        </div>
      </div>

      {/* فلتر التاريخ */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label>من تاريخ</Label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <Label>إلى تاريخ</Label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
          <Button className="flex items-center gap-2">
            <Calendar size={16} />
            تطبيق
          </Button>
        </div>
      </motion.div>

      {/* المنتجات الأكثر مبيعاً */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-500" size={24} />
          <h2 className="text-xl font-semibold">المنتجات الأكثر مبيعاً</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>المبيعات</TableHead>
              <TableHead>الإيرادات</TableHead>
              <TableHead>التقييم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>{product.revenue} ريال</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={16} />
                  {product.rating}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* المنتجات منخفضة المبيعات */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-red-500" size={24} />
          <h2 className="text-xl font-semibold">المنتجات منخفضة المبيعات</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>المبيعات</TableHead>
              <TableHead>الإيرادات</TableHead>
              <TableHead>التقييم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowPerformingProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>{product.revenue} ريال</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={16} />
                  {product.rating}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* المنتجات التي تم تقييمها */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="text-yellow-500" size={24} />
          <h2 className="text-xl font-semibold">المنتجات التي تم تقييمها</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead>عدد التقييمات</TableHead>
              <TableHead>آخر تقييم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={16} />
                  {product.rating}
                </TableCell>
                <TableCell>{product.reviews}</TableCell>
                <TableCell>{product.lastReview}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
