"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Link as LinkIcon,
  ShoppingCart,
  Wallet,
  ChevronDown,
  BarChart2,
  Trophy,
  FileText,
  HelpCircle,
  Package,
} from "lucide-react";

const navigation = [
  {
    name: "لوحة التحكم",
    href: "/affiliate",
    icon: LayoutDashboard,
  },
  {
    name: "المنتجات",
    href: "/affiliate/products",
    icon: Package,
  },
  {
    name: "روابط التسويق",
    href: "/affiliate/links",
    icon: LinkIcon,
  },
  {
    name: "المدفوعات",
    href: "/affiliate/balance",
    icon: Wallet,
  },
  {
    name: "الإحصائيات",
    href: "/affiliate/analytics",
    icon: BarChart2,
  },
  {
    name: "ترتيب المسوقين",
    href: "/affiliate/top-affiliates",
    icon: Trophy,
  },
  {
    name: "التقارير",
    href: "/affiliate/reports",
    icon: FileText,
  },
  {
    name: "الدعم الفني",
    href: "/affiliate/support",
    icon: HelpCircle,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`transition-all bg-white border-l border-gray-200 overflow-y-auto ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 mb-4">
          <h2
            className={`font-bold text-xl transition-all delay-100 ${
              !isSidebarOpen && "hidden w-0"
            }`}
          >
            لوحة التحكم
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isSidebarOpen ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
        </div>
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={isActive ? "text-purple-600" : "text-gray-400"}
                  />
                  <span
                    className={`${isActive ? "font-medium" : ""} ${
                      !isSidebarOpen && "hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all `}>{children}</main>
    </div>
  );
}
