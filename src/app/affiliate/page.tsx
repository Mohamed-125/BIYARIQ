"use client";

import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, Clock, ShoppingBag, Trophy, Users, Target } from "lucide-react";

const data = [
  { name: "يناير", earnings: 4000 },
  { name: "فبراير", earnings: 3000 },
  { name: "مارس", earnings: 2000 },
  { name: "أبريل", earnings: 2780 },
  { name: "مايو", earnings: 1890 },
  { name: "يونيو", earnings: 2390 },
];

const stats = [
  {
    title: "العمولات الحالية",
    value: "12,500 ر.س",
    icon: Wallet,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "الطلبات المسوقة",
    value: "156",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "ترتيبك بين المسوقين",
    value: "#5",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "عدد الزيارات",
    value: "2,845",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "نسبة التحويل",
    value: "24%",
    icon: Target,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "الطلبات المؤكدة",
    value: "89",
    icon: ShoppingBag,
    color: "bg-indigo-100 text-indigo-600",
  },
];

const topProducts = [
  {
    name: "دورة تطوير تطبيقات الويب المتقدمة",
    sales: 150,
    earnings: "4,500 ر.س",
  },
  {
    name: "دورة تصميم واجهات المستخدم",
    sales: 120,
    earnings: "3,600 ر.س",
  },
  {
    name: "دورة التسويق الرقمي",
    sales: 90,
    earnings: "2,700 ر.س",
  },
];

export default function AffiliateDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        لوحة تحكم المسوق
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={24} />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-gray-600">{stat.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
      >
        <h2 className="text-xl font-bold mb-6">الأرباح على مدار الوقت</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold mb-6">المنتجات الأكثر مبيعاً</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">اسم المنتج</th>
                <th className="text-right py-3 px-4">المبيعات</th>
                <th className="text-right py-3 px-4">الأرباح</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.sales}</td>
                  <td className="py-3 px-4">{product.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}