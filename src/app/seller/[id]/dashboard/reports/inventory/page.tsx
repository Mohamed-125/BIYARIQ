"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  Package,
  AlertTriangle,
  Archive,
  TrendingDown,
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

interface InventoryProduct {
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  warehouse: string;
  lastUpdated: string;
}

interface LowStockProduct {
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  daysUntilStockout: number;
}

export default function InventoryReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const inventoryProducts: InventoryProduct[] = [
    {
      name: "سماعات لاسلكية",
      sku: "HDP-001",
      quantity: 50,
      minQuantity: 20,
      warehouse: "المستودع الرئيسي",
      lastUpdated: "2024-03-15",
    },
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      quantity: 15,
      minQuantity: 25,
      warehouse: "المستودع الرئيسي",
      lastUpdated: "2024-03-14",
    },
    {
      name: "ساعة ذكية",
      sku: "WCH-003",
      quantity: 30,
      minQuantity: 15,
      warehouse: "المستودع الفرعي",
      lastUpdated: "2024-03-13",
    },
  ];

  const lowStockProducts: LowStockProduct[] = [
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      quantity: 15,
      minQuantity: 25,
      daysUntilStockout: 5,
    },
    {
      name: "قميص قطني",
      sku: "SHT-003",
      quantity: 8,
      minQuantity: 20,
      daysUntilStockout: 3,
    },
    {
      name: "حقيبة ظهر",
      sku: "BAG-001",
      quantity: 12,
      minQuantity: 15,
      daysUntilStockout: 7,
    },
  ];

  const inventoryStats = {
    totalProducts: 150,
    lowStockProducts: 12,
    outOfStockProducts: 5,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير المخزون</h1>
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

      {/* إحصائيات المخزون */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <Package size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي المنتجات</p>
                <h3 className="text-2xl font-semibold">
                  {inventoryStats.totalProducts}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-gray-600">منتجات منخفضة المخزون</p>
                <h3 className="text-2xl font-semibold">
                  {inventoryStats.lowStockProducts}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-full text-white">
                <Archive size={24} />
              </div>
              <div>
                <p className="text-gray-600">منتجات نفذت من المخزون</p>
                <h3 className="text-2xl font-semibold">
                  {inventoryStats.outOfStockProducts}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* حالة المخزون */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">حالة المخزون</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>رمز المنتج</TableHead>
              <TableHead>الكمية المتوفرة</TableHead>
              <TableHead>الحد الأدنى</TableHead>
              <TableHead>المستودع</TableHead>
              <TableHead>آخر تحديث</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell
                  className={`font-semibold ${product.quantity < product.minQuantity ? "text-red-500" : "text-green-500"}`}
                >
                  {product.quantity}
                </TableCell>
                <TableCell>{product.minQuantity}</TableCell>
                <TableCell>{product.warehouse}</TableCell>
                <TableCell>{product.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* تنبيهات المخزون المنخفض */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-red-500" size={24} />
          <h2 className="text-xl font-semibold">تنبيهات المخزون المنخفض</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>رمز المنتج</TableHead>
              <TableHead>الكمية المتوفرة</TableHead>
              <TableHead>الحد الأدنى</TableHead>
              <TableHead>الأيام المتبقية للنفاد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell className="text-red-500 font-semibold">
                  {product.quantity}
                </TableCell>
                <TableCell>{product.minQuantity}</TableCell>
                <TableCell
                  className={`font-semibold ${product.daysUntilStockout <= 5 ? "text-red-500" : "text-yellow-500"}`}
                >
                  {product.daysUntilStockout} أيام
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}