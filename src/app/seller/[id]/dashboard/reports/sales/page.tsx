"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Category,
  Package,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
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

interface SalesByDate {
  date: string;
  amount: number;
  orders: number;
}

interface SalesByCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface SalesByProduct {
  product: string;
  sku: string;
  quantity: number;
  amount: number;
}

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const salesByDate: SalesByDate[] = [
    { date: "2024-03-15", amount: 2500, orders: 12 },
    { date: "2024-03-14", amount: 1800, orders: 8 },
    { date: "2024-03-13", amount: 3200, orders: 15 },
  ];

  const salesByCategory: SalesByCategory[] = [
    { category: "الإلكترونيات", amount: 15000, percentage: 40 },
    { category: "الملابس", amount: 12000, percentage: 32 },
    { category: "الأحذية", amount: 8000, percentage: 21 },
    { category: "الإكسسوارات", amount: 2500, percentage: 7 },
  ];

  const salesByProduct: SalesByProduct[] = [
    {
      product: "سماعات لاسلكية",
      sku: "HDP-001",
      quantity: 25,
      amount: 5000,
    },
    {
      product: "حذاء رياضي",
      sku: "SHO-002",
      quantity: 18,
      amount: 3600,
    },
    {
      product: "قميص قطني",
      sku: "SHT-003",
      quantity: 30,
      amount: 2400,
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
        <h1 className="text-2xl font-bold">تقارير المبيعات</h1>
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

      {/* المبيعات حسب التاريخ */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">المبيعات حسب التاريخ</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>عدد الطلبات</TableHead>
              <TableHead>إجمالي المبيعات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesByDate.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.orders}</TableCell>
                <TableCell>{sale.amount} ريال</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* المبيعات حسب الفئة */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">المبيعات حسب الفئة</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الفئة</TableHead>
              <TableHead>إجمالي المبيعات</TableHead>
              <TableHead>النسبة المئوية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesByCategory.map((category, index) => (
              <TableRow key={index}>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.amount} ريال</TableCell>
                <TableCell>{category.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* المبيعات حسب المنتج */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">المبيعات حسب المنتج</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>الكمية المباعة</TableHead>
              <TableHead>إجمالي المبيعات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesByProduct.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.product}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.amount} ريال</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
