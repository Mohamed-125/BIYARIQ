"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  RotateCcw,
  Package,
  AlertCircle,
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

interface ReturnedOrder {
  orderId: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  reason: string;
}

interface MostReturnedProduct {
  name: string;
  sku: string;
  returns: number;
  returnRate: number;
  totalSales: number;
}

interface ReturnReason {
  reason: string;
  count: number;
  percentage: number;
}

export default function ReturnsReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const returnedOrders: ReturnedOrder[] = [
    {
      orderId: "ORD-001",
      date: "2024-03-15",
      customer: "أحمد محمد",
      amount: 500,
      status: "مكتمل",
      reason: "مقاس غير مناسب",
    },
    {
      orderId: "ORD-002",
      date: "2024-03-14",
      customer: "سارة أحمد",
      amount: 750,
      status: "قيد المعالجة",
      reason: "منتج معيب",
    },
    {
      orderId: "ORD-003",
      date: "2024-03-13",
      customer: "محمد علي",
      amount: 300,
      status: "مكتمل",
      reason: "لون مختلف",
    },
  ];

  const mostReturnedProducts: MostReturnedProduct[] = [
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      returns: 15,
      returnRate: 12.5,
      totalSales: 120,
    },
    {
      name: "قميص قطني",
      sku: "SHT-003",
      returns: 10,
      returnRate: 8.3,
      totalSales: 120,
    },
    {
      name: "بنطلون جينز",
      sku: "PNT-001",
      returns: 8,
      returnRate: 6.7,
      totalSales: 120,
    },
  ];

  const returnReasons: ReturnReason[] = [
    {
      reason: "مقاس غير مناسب",
      count: 25,
      percentage: 35.7,
    },
    {
      reason: "منتج معيب",
      count: 15,
      percentage: 21.4,
    },
    {
      reason: "لون مختلف",
      count: 12,
      percentage: 17.1,
    },
    {
      reason: "وصف غير دقيق",
      count: 10,
      percentage: 14.3,
    },
    {
      reason: "تأخر التوصيل",
      count: 8,
      percentage: 11.5,
    },
  ];

  const returnStats = {
    totalReturns: 70,
    totalAmount: 14000,
    returnRate: 8.5,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير المرتجعات</h1>
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

      {/* إحصائيات المرتجعات */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-full text-white">
                <RotateCcw size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي المرتجعات</p>
                <h3 className="text-2xl font-semibold">
                  {returnStats.totalReturns}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <Package size={24} />
              </div>
              <div>
                <p className="text-gray-600">قيمة المرتجعات</p>
                <h3 className="text-2xl font-semibold">
                  {returnStats.totalAmount} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-gray-600">نسبة المرتجعات</p>
                <h3 className="text-2xl font-semibold">
                  {returnStats.returnRate}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* الطلبات المرتجعة */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">الطلبات المرتجعة</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>سبب الإرجاع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnedOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.amount} ريال</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* المنتجات الأكثر إرجاعاً */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">المنتجات الأكثر إرجاعاً</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>رمز المنتج</TableHead>
              <TableHead>عدد المرتجعات</TableHead>
              <TableHead>نسبة الإرجاع</TableHead>
              <TableHead>إجمالي المبيعات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mostReturnedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.returns}</TableCell>
                <TableCell>{product.returnRate}%</TableCell>
                <TableCell>{product.totalSales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* أسباب الإرجاع */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">أسباب الإرجاع</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>السبب</TableHead>
              <TableHead>عدد الحالات</TableHead>
              <TableHead>النسبة المئوية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnReasons.map((reason, index) => (
              <TableRow key={index}>
                <TableCell>{reason.reason}</TableCell>
                <TableCell>{reason.count}</TableCell>
                <TableCell>{reason.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}