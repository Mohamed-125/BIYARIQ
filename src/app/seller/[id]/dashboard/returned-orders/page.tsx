"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Input from "@/components/ui/Input";

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

type ReturnStatus = "pending" | "approved" | "rejected";

interface ReturnedOrder {
  id: string;
  date: string;
  orderId: string;
  userId: string;
  userName: string;
  productName: string;
  reason: string;
  status: ReturnStatus;
}

const statusColors: Record<
  ReturnStatus,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "قيد المراجعة",
  },
  approved: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "تمت الموافقة",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "مرفوض",
  },
};

// Initial returned orders data grouped by date
const initialReturnedOrders: Record<string, ReturnedOrder[]> = {
  "2024-01-20": [
    {
      id: "RET001",
      date: "2024-01-20",
      orderId: "ORD123",
      userId: "USR456",
      userName: "أحمد محمد",
      productName: "لابتوب ماك بوك برو",
      reason: "المنتج لا يعمل بشكل صحيح",
      status: "pending",
    },
    {
      id: "RET002",
      date: "2024-01-20",
      orderId: "ORD124",
      userId: "USR457",
      userName: "سارة أحمد",
      productName: "سماعات بلوتوث",
      reason: "المنتج مختلف عن الوصف",
      status: "approved",
    },
  ],
  "2024-01-19": [
    {
      id: "RET003",
      date: "2024-01-19",
      orderId: "ORD125",
      userId: "USR458",
      userName: "محمد علي",
      productName: "ساعة ذكية",
      reason: "المنتج به عيوب تصنيع",
      status: "rejected",
    },
  ],
};

export default function ReturnedOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [returnedOrders, setReturnedOrders] = useState(initialReturnedOrders);

  const filteredOrders = Object.entries(returnedOrders)
    .filter(([date]) => !selectedDate || date === selectedDate)
    .reduce((acc, [date, orders]) => {
      const filteredDateOrders = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredDateOrders.length > 0) {
        acc[date] = filteredDateOrders;
      }
      return acc;
    }, {} as Record<string, ReturnedOrder[]>);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: ReturnStatus
  ) => {
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/returns/${orderId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // if (!response.ok) throw new Error('Failed to update return status');

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setReturnedOrders((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((date) => {
          updated[date] = updated[date].map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          );
        });
        return updated;
      });

      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      console.error("Error updating return status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">الطلبات المرتجعة</h2>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في الطلبات المرتجعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(filteredOrders).map(([date, orders]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {new Date(date).toLocaleDateString("ar", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{order.productName}</h4>
                        <p className="text-sm text-gray-500">
                          طلب #{order.orderId} | العميل: {order.userName}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          statusColors[order.status].bg
                        } ${statusColors[order.status].text}`}
                      >
                        {statusColors[order.status].label}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{order.reason}</p>
                    {order.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(order.id, "approved")
                          }
                          className="flex-1"
                        >
                          قبول الإرجاع
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(order.id, "rejected")
                          }
                          className="flex-1"
                        >
                          رفض الإرجاع
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
