"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Package, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

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

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "shipping"
  | "delivered"
  | "cancelled";

interface Order {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: OrderStatus;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const statusColors: Record<
  OrderStatus,
  { bg: string; text: string; label: string; icon: any }
> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "قيد الانتظار",
    icon: AlertCircle,
  },
  confirmed: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "تم التأكيد",
    icon: Package,
  },
  processing: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "قيد المعالجة",
    icon: Package,
  },
  ready: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    label: "جاهز للشحن",
    icon: Package,
  },
  shipping: {
    bg: "bg-cyan-100",
    text: "text-cyan-800",
    label: "قيد الشحن",
    icon: Package,
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "تم التوصيل",
    icon: Package,
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "ملغي",
    icon: AlertCircle,
  },
};

// Status flow defines valid next statuses for each current status
const statusFlow: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["ready", "cancelled"],
  ready: ["shipping", "cancelled"],
  shipping: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

// Initial orders data grouped by date
const initialOrders: Record<string, Order[]> = {
  "2024-01-20": [
    {
      id: "ORD001",
      date: "2024-01-20",
      customer: "أحمد محمد",
      total: 2999,
      status: "delivered",
      items: [{ name: "لابتوب ماك بوك برو", quantity: 1, price: 2999 }],
    },
    {
      id: "ORD002",
      date: "2024-01-20",
      customer: "سارة خالد",
      total: 749,
      status: "shipping",
      items: [{ name: "سماعات بلوتوث", quantity: 1, price: 749 }],
    },
  ],
  "2024-01-19": [
    {
      id: "ORD003",
      date: "2024-01-19",
      customer: "محمد علي",
      total: 4999,
      status: "processing",
      items: [{ name: "آيفون 15", quantity: 1, price: 4999 }],
    },
  ],
  "2024-01-18": [
    {
      id: "ORD004",
      date: "2024-01-18",
      customer: "فاطمة أحمد",
      total: 1498,
      status: "pending",
      items: [{ name: "سماعات بلوتوث", quantity: 2, price: 749 }],
    },
  ],
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [orders, setOrders] = useState(initialOrders);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  const filteredOrders = Object.entries(orders)
    .filter(([date]) => !selectedDate || date === selectedDate)
    .reduce((acc, [date, orders]) => {
      const filteredDateOrders = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredDateOrders.length > 0) {
        acc[date] = filteredDateOrders;
      }
      return acc;
    }, {} as Record<string, Order[]>);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/orders/status', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderId, status: newStatus })
      // });
      // if (!response.ok) throw new Error('Failed to update status');

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setOrders((prevOrders) => {
        const newOrders = { ...prevOrders };
        Object.keys(newOrders).forEach((date) => {
          newOrders[date] = newOrders[date].map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          );
        });
        return newOrders;
      });

      toast.success(
        `تم تحديث حالة الطلب ${orderId} إلى ${statusColors[newStatus].label}`
      );
    } catch (error) {
      console.error("Error updating order status:", error);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">الطلبات</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث برقم الطلب أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <motion.div variants={containerVariants} className="space-y-8">
        {Object.entries(filteredOrders).map(([date, orders]) => (
          <motion.div key={date} variants={itemVariants}>
            <h2 className="text-lg font-semibold mb-4">
              {new Date(date).toLocaleDateString("ar", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">#{order.id}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            statusColors[order.status].bg
                          } ${
                            statusColors[order.status].text
                          } flex items-center gap-2`}
                        >
                          {React.createElement(
                            statusColors[order.status].icon,
                            {
                              className: "w-4 h-4",
                            }
                          )}
                          {statusColors[order.status].label}
                        </span>
                      </div>
                      <p className="text-gray-600">{order.customer}</p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">المنتجات:</h4>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm text-gray-600"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                          </div>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {statusFlow[order.status].length > 0 && (
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                      {statusFlow[order.status].map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          variant={
                            nextStatus === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          onClick={() =>
                            handleStatusUpdate(order.id, nextStatus)
                          }
                        >
                          {statusColors[nextStatus].label}
                        </Button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
