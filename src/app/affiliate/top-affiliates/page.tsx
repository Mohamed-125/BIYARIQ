"use client";

import Card from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Trophy, ShoppingBag, Wallet } from "lucide-react";

const affiliates = [
  {
    rank: 1,
    name: "أحمد محمد",
    orders: 456,
    earnings: "45,600 ر.س",
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "سارة أحمد",
    orders: 389,
    earnings: "38,900 ر.س",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "محمد علي",
    orders: 345,
    earnings: "34,500 ر.س",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "فاطمة حسن",
    orders: 312,
    earnings: "31,200 ر.س",
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: "عمر خالد",
    orders: 298,
    earnings: "29,800 ر.س",
    isCurrentUser: true,
  },
];

const stats = [
  {
    title: "ترتيبك الحالي",
    value: "#5",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "عدد طلباتك",
    value: "298",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "مجموع أرباحك",
    value: "29,800 ر.س",
    icon: Wallet,
    color: "bg-green-100 text-green-600",
  },
];

export default function TopAffiliatesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">ترتيب المسوقين</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الترتيب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المسوق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد الطلبات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مجموع الأرباح
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affiliates.map((affiliate) => (
                <motion.tr
                  key={affiliate.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={affiliate.isCurrentUser ? "bg-blue-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`text-lg font-semibold ${
                          affiliate.rank <= 3
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }`}
                      >
                        #{affiliate.rank}
                      </span>
                      {affiliate.rank <= 3 && (
                        <Trophy className="w-5 h-5 text-yellow-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {affiliate.name}
                      {affiliate.isCurrentUser && (
                        <span className="mr-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          أنت
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {affiliate.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {affiliate.earnings}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
