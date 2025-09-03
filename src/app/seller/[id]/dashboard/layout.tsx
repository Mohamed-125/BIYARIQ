"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ChevronLeft,
  Menu,
  ChevronDown,
  Settings,
} from "lucide-react";
import { CiMoneyBill } from "react-icons/ci";
import { FaProductHunt } from "react-icons/fa";

const sidebarLinks = [
  {
    href: "/seller/test-seller/dashboard/analytics",
    icon: LayoutDashboard,
    label: "التحليلات",
  },
  {
    href: "/seller/test-seller/dashboard/orders",
    icon: ShoppingBag,
    label: "الطلبات",
  },
  {
    href: "/seller/test-seller/dashboard/products",
    icon: Package,
    label: "المنتجات",
  },
  {
    href: "/seller/test-seller/dashboard/courses",
    icon: Package,
    label: "الدورات التدريبية",
  },
  {
    href: "/seller/test-seller/dashboard/settings",
    icon: Settings,
    label: "الإعدادات",
  },
  {
    href: "/seller/test-seller/dashboard/balance",
    icon: CiMoneyBill,
    label: "رصيدي",
  },
  {
    href: "/seller/test-seller/dashboard/returned-orders",
    icon: FaProductHunt,
    label: "الطلبات المرتجعة",
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={` h-screen transition-all bg-white border-l border-gray-200 ${
          isSidebarOpen ? "w-64" : "w-20"
        } p-4`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2
            className={`font-bold text-xl transition-all   delay-100 ${
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

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className={!isSidebarOpen ? "hidden" : ""}>
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main content */}
      <main className={`flex-1 transition-all  p-8`}>{children}</main>
    </div>
  );
}
