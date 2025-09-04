"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Package, XCircle, CheckCircle } from "lucide-react";
import Input from "../../../components/ui/Input";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  paid: { bg: "bg-blue-100", text: "text-blue-800" },
  shipped: { bg: "bg-purple-100", text: "text-purple-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "قيد التنفيذ",
  paid: "تم الدفع",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const orders = [
  {
    id: "#12345",
    product: "دورة تطوير تطبيقات الويب المتقدمة",
    buyer: "أحمد محمد",
    status: "delivered" as OrderStatus,
    date: "2024-01-15",
    commission: "150 ر.س",
  },
  {
    id: "#12346",
    product: "دورة تصميم واجهات المستخدم",
    buyer: "سارة خالد",
    status: "shipped" as OrderStatus,
    date: "2024-01-14",
    commission: "120 ر.س",
  },
  {
    id: "#12347",
    product: "دورة التسويق الرقمي",
    buyer: "محمد علي",
    status: "paid" as OrderStatus,
    date: "2024-01-13",
    commission: "90 ر.س",
  },
];

const stats = [
  {
    title: "إجمالي الطلبات",
    value: "156",
    icon: Package,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "الطلبات المكتملة",
    value: "142",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "الطلبات الملغية",
    value: "14",
    icon: XCircle,
    color: "bg-red-100 text-red-600",
  },
];

export default function AffiliateOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">الطلبات</h1>
        <p className="text-gray-600">تتبع طلبات عملائك وعمولاتك</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="ابحث عن المنتجات..."
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
            >
              <option value="all">جميع الحالات</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  رقم الطلب
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  المنتج
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  المشتري
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  الحالة
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  التاريخ
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  العمولة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{order.id}</td>
                  <td className="py-4 px-6">{order.product}</td>
                  <td className="py-4 px-6">{order.buyer}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        statusColors[order.status].bg
                      } ${statusColors[order.status].text}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="py-4 px-6">{order.date}</td>
                  <td className="py-4 px-6">{order.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
