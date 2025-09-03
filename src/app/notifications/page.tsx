"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { ar } from "date-fns/locale";

interface Notification {
  id: string;
  message: string;
  date: Date;
  read: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      message: "تم تأكيد طلبك رقم #123",
      date: new Date(),
      read: false,
    },
    {
      id: "2",
      message: "تم شحن طلبك رقم #123",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      read: false,
    },
    {
      id: "3",
      message: "لديك تخفيض 20% على طلبك القادم",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
    },
  ]);

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach((notification) => {
      let dateKey = "";

      if (isToday(notification.date)) {
        dateKey = "اليوم";
      } else if (isYesterday(notification.date)) {
        dateKey = "الأمس";
      } else {
        dateKey = format(notification.date, "dd MMMM yyyy", { locale: ar });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });

    return groups;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-purple-800">الإشعارات</h1>
          {unreadCount > 0 && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {unreadCount} غير مقروءة
            </span>
          )}
        </motion.div>

        <motion.div className="space-y-8" variants={containerVariants}>
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <motion.div key={date} variants={itemVariants}>
              <h2 className="text-lg font-semibold text-gray-600 mb-4">{date}</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-sm p-4 border-r-4 ${notification.read ? "border-gray-200" : "border-purple-500"}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(notification.date, "HH:mm", { locale: ar })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}