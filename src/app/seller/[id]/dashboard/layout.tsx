"use client";

import { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { sidebarLinks } from "../../utils";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Toggle expanded state for sidebar items with subitems
  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  // Check if an item is expanded
  const isExpanded = (href: string) => expandedItems.includes(href);

  // Check if current path is active or a subitem is active
  const isActiveOrHasActiveChild = (link: any) => {
    const isMainActive = pathname === link.href;
    const hasActiveChild = link.subItems?.some(
      (subItem: any) => pathname === subItem.href
    );
    return isMainActive || hasActiveChild;
  };

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden  print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop and Mobile */}
      <motion.aside
        // initial="hidden"
        // animate="visible"
        variants={containerVariants}
        className={`fixed print:hidden md:relative h-screen transition-all bg-white border-l border-gray-200 z-50 ${
          isSidebarOpen ? "md:w-64" : "md:w-20"
        } ${isMobileMenuOpen ? "w-64 right-0" : "-right-64 md:right-auto"} p-4`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2
            className={`font-bold text-xl transition-all delay-100 ${
              !isSidebarOpen && "hidden md:block md:w-0"
            }`}
          >
            لوحة التحكم
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isSidebarOpen ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-100px)]">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const isItemActive = isActiveOrHasActiveChild(link);
            const hasSubItems = link.subItems && link.subItems.length > 0;

            return (
              <div key={link.href}>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <motion.div variants={itemVariants} className="flex-1">
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isItemActive
                            ? "bg-purple-50 text-purple-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          if (hasSubItems) {
                            e.preventDefault();
                            toggleExpanded(link.href);
                          }
                        }}
                      >
                        <link.icon className="w-5 h-5 flex-shrink-0" />
                        <span
                          className={
                            !isSidebarOpen ? "hidden md:hidden" : "flex-1"
                          }
                        >
                          {link.label}
                        </span>
                        {hasSubItems && isSidebarOpen && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isExpanded(link.href) ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Link>
                    </motion.div>
                  </div>

                  {/* Sub Items */}
                  {hasSubItems && isExpanded(link.href) && isSidebarOpen && (
                    <div className="mr-7 mt-1 border-r-2 border-gray-200 pr-2">
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1"
                        >
                          {link.subItems.map((subItem: any) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <motion.div
                                key={subItem.href}
                                variants={itemVariants}
                              >
                                <Link
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                  }}
                                  href={subItem.href}
                                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                    isSubActive
                                      ? "bg-purple-50 text-purple-600"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-current"></span>
                                  <span>{subItem.label}</span>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 transition-all p-8 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
