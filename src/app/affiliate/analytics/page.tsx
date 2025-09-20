"use client";

import   Card   from "@/components/ui/Card";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Users, ShoppingBag, Target, Wallet, TrendingUp } from "lucide-react";

const visitData = [
  { name: "يناير", visits: 1200 },
  { name: "فبراير", visits: 1900 },
  { name: "مارس", visits: 1500 },
  { name: "أبريل", visits: 2400 },
  { name: "مايو", visits: 2100 },
  { name: "يونيو", visits: 3100 },
];

const productData = [
  { name: "منتج 1", orders: 45, commission: 2500 },
  { name: "منتج 2", orders: 32, commission: 1800 },
  { name: "منتج 3", orders: 28, commission: 1500 },
  { name: "منتج 4", orders: 25, commission: 1200 },
  { name: "منتج 5", orders: 20, commission: 900 },
];

const stats = [
  {
    title: "عدد الزيارات",
    value: "12,845",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "الطلبات المؤكدة",
    value: "245",
    icon: ShoppingBag,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "نسبة التحويل",
    value: "18.5%",
    icon: Target,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "إجمالي العمولات",
    value: "15,600 ر.س",
    icon: Wallet,
    color: "bg-yellow-100 text-yellow-600",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">الإحصائيات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">تحليل الزيارات</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">أداء المنتجات</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#4F46E5" />
                <Bar dataKey="commission" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}