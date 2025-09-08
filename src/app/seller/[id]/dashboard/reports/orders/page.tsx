"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  CircleDollarSign,
  CreditCard,
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

interface OrdersByStatus {
  status: string;
  count: number;
  amount: number;
  percentage: number;
}

interface OrdersByPayment {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export default function OrdersReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const ordersByStatus: OrdersByStatus[] = [
    {
      status: "مكتملة",
      count: 120,
      amount: 24000,
      percentage: 60,
    },
    {
      status: "قيد المعالجة",
      count: 45,
      amount: 9000,
      percentage: 22.5,
    },
    {
      status: "ملغاة",
      count: 25,
      amount: 5000,
      percentage: 12.5,
    },
    {
      status: "مرتجعة",
      count: 10,
      amount: 2000,
      percentage: 5,
    },
  ];

  const ordersByPayment: OrdersByPayment[] = [
    {
      method: "بطاقة ائتمان",
      count: 80,
      amount: 16000,
      percentage: 40,
    },
    {
      method: "الدفع عند الاستلام",
      count: 60,
      amount: 12000,
      percentage: 30,
    },
    {
      method: "محفظة إلكترونية",
      count: 40,
      amount: 8000,
      percentage: 20,
    },
    {
      method: "تحويل بنكي",
      count: 20,
      amount: 4000,
      percentage: 10,
    },
  ];

  const averageOrderValue = 200; // ريال

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير الطلبات</h1>
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

      {/* متوسط قيمة الطلب */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <CircleDollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-600">متوسط قيمة الطلب</p>
                <h3 className="text-2xl font-semibold">
                  {averageOrderValue} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* الطلبات حسب الحالة */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">الطلبات حسب الحالة</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الحالة</TableHead>
              <TableHead>عدد الطلبات</TableHead>
              <TableHead>إجمالي المبيعات</TableHead>
              <TableHead>النسبة المئوية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersByStatus.map((status, index) => (
              <TableRow key={index}>
                <TableCell>{status.status}</TableCell>
                <TableCell>{status.count}</TableCell>
                <TableCell>{status.amount} ريال</TableCell>
                <TableCell>{status.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* الطلبات حسب وسيلة الدفع */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">الطلبات حسب وسيلة الدفع</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>وسيلة الدفع</TableHead>
              <TableHead>عدد الطلبات</TableHead>
              <TableHead>إجمالي المبيعات</TableHead>
              <TableHead>النسبة المئوية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersByPayment.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.count}</TableCell>
                <TableCell>{payment.amount} ريال</TableCell>
                <TableCell>{payment.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}