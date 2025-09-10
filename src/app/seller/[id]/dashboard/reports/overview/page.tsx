"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Star,
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
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

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function ReportsOverviewPage() {
  const stats: StatCard[] = [
    {
      title: "إجمالي المبيعات",
      value: "15,250 ريال",
      change: 12.5,
      icon: <TrendingUp size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "عدد الطلبات",
      value: "156",
      change: 8.2,
      icon: <ShoppingBag size={24} />,
      color: "bg-green-500",
    },
    {
      title: "متوسط التقييم",
      value: "4.8",
      change: 2.1,
      icon: <Star size={24} />,
      color: "bg-yellow-500",
    },
    {
      title: "صافي الأرباح",
      value: "8,420 ريال",
      change: 15.3,
      icon: <DollarSign size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "المنتجات النشطة",
      value: "48",
      change: -3.2,
      icon: <Package size={24} />,
      color: "bg-red-500",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <h1 className="text-2xl font-bold">نظرة عامة على التقارير</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`${stat.color} p-3 rounded-full text-white`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change >= 0 ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="customers">العملاء</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>المبيعات</TableHead>
                  <TableHead>الإيرادات</TableHead>
                  <TableHead>التغيير</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>منتج 1</TableCell>
                  <TableCell>150</TableCell>
                  <TableCell>4,500 ريال</TableCell>
                  <TableCell className="text-green-600">+15%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>منتج 2</TableCell>
                  <TableCell>120</TableCell>
                  <TableCell>3,600 ريال</TableCell>
                  <TableCell className="text-red-600">-5%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="products">
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>منتج 1</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>4.5</TableCell>
                  <TableCell>نشط</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>منتج 2</TableCell>
                  <TableCell>30</TableCell>
                  <TableCell>4.2</TableCell>
                  <TableCell>نشط</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="customers">
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي المشتريات</TableHead>
                  <TableHead>آخر طلب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>عميل 1</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>3,000 ريال</TableCell>
                  <TableCell>قبل يومين</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>عميل 2</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>2,400 ريال</TableCell>
                  <TableCell>قبل 3 أيام</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}