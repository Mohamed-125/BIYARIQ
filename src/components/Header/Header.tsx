"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginModal from "../Auth/LoginModal";
import SearchModal from "../SearchModal";

import {
  FiMenu,
  FiX,
  FiHeart,
  FiShoppingCart,
  FiSun,
  FiMoon,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShoppingBag,
  FiBell,
  FiGlobe,
  FiHeadphones,
  FiUsers,
  FiPackage,
  FiGrid,
  FiDownload,
  FiKey,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import { CiShop } from "react-icons/ci";

import TopSaleBanner from "./TopSaleBanner";
import { motion, Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownSection,
  DropdownSeparator,
} from "@/components/ui/Dropdown";
import { useAuth, UserType } from "@/context/AuthContext";
import { Search } from "lucide-react";

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const menuData = [
  { title: "الرئيسية", to: "" },

  {
    title: "منتجات فعلية",
    to: "physical-products",
    links: [
      { title: "ملابس", to: "clothes" },
      { title: "أجهزة", to: "devices" },
      {
        title: "إكسسوارات",
        links: [{ title: "ساعات", to: "watches" }],
      },
    ],
  },
  {
    title: "منتجات رقمية",
    to: "digital-products",
    links: [
      { title: "كتب PDF", to: "books" },
      { title: "برامج", to: "programs" },
      { title: "تصاميم", to: "design" },
    ],
  },
  {
    title: "الدورات",
    to: "courses",
    links: [
      { title: "برمجة", to: "programming" },
      { title: "تصميم", to: "design" },
      { title: "تسويق", to: "markting" },
    ],
  },
] as MenuItems;

type MenuItem = {
  title: string;
  to: string;
  links?: MenuItem[];
};

type MenuItems = MenuItem[];

function RecursiveMenu({
  items,
  isChild = false,
  parentPath = "",
  toggleSidebar,
}: {
  items?: MenuItem[];
  isChild?: boolean;
  parentPath?: string;
  toggleSidebar: () => void;
}) {
  const [openIndexes, setOpenIndexes] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <ul className={isChild ? "ml-4 border-l border-gray-200 pl-4" : ""}>
      {items?.map((item, idx) => {
        // const currentPath = parentPath
        //   ? `${parentPath}/${item.to}`
        //   : `/${item.to}`;

        const currentPath = item.to === "الرئيسية" ? "" : "products";
        const isOpen = openIndexes[idx];

        return (
          <li key={item.title} className="relative">
            {item.links ? (
              <>
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left flex justify-between items-center px-4 py-2.5 text-[15px] font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{item.title}</span>
                  <span className="text-gray-400">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <RecursiveMenu
                    toggleSidebar={toggleSidebar}
                    items={item.links}
                    parentPath={currentPath}
                    isChild
                  />
                )}
              </>
            ) : (
              <Link
                href={`${currentPath}`}
                onClick={toggleSidebar}
                className="block px-4 py-2.5 text-[15px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <header dir="rtl" className={`${darkMode ? "dark" : ""}`}>
      <TopSaleBanner />

      <motion.nav
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="!bg-white shadow-lg border-b border-gray-200 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-[85px] items-center justify-between">
          {/* Right Side - Hamburger Menu and Search */}
          <motion.div
            variants={itemVariants}
            className="flex items-center flex-1 gap-3 order-1"
          >
            <button
              onClick={toggleSidebar}
              className="rounded-lg hover:bg-gray-100 transition-colors text-xl"
            >
              <FiMenu />
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center justify-center p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
              aria-label="بحث"
            >
              <Search className="text-purple-600" size={20} />
            </button>

            <SearchModal open={searchModalOpen} setOpen={setSearchModalOpen} />
          </motion.div>

          {/* Center - Logo */}
          <Link href={"/"} className="flex items-center justify-center order-2">
            <Image src="/logo.svg" width={100} height={100} alt="logo" />
          </Link>

          {/* Left Side - Icons */}
          <div className="flex items-center gap-3 justify-end flex-1 order-3">
            <button
              onClick={toggleDarkMode}
              className="text-xl rounded-full hover:bg-gray-100 transition-colors"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <div className="text-xl">
              <Link href={"/wishlist"} className="text-xl">
                <FiHeart className="cursor-pointer hover:text-purple-600 transition-colors" />
              </Link>
            </div>
            <Link href={"/cart"} className="text-xl">
              <FiShoppingCart className="cursor-pointer hover:text-purple-600 transition-colors" />
            </Link>
            {user ? (
              <UserDropdown
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                user={user}
                logout={logout}
              />
            ) : (
              <>
                <Button onClick={() => setLoginModalOpen(true)}>
                  تسجيل الدخول
                </Button>
                <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="font-bold text-lg">القائمة</span>
          <FiX className="cursor-pointer" onClick={toggleSidebar} />
        </div>

        <div className="p-4">
          <RecursiveMenu items={menuData} toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/35 backdrop-blur-[5px] z-40"
          onClick={toggleSidebar}
        />
      )}
    </header>
  );
}

const UserDropdown = ({
  dropdownOpen,
  setDropdownOpen,
  user,
  logout,
}: {
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType;
  logout: () => void;
}) => {
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };
  const UserAvatar = () => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-medium cursor-pointer"
    >
      {user?.firstName?.[0]?.toUpperCase()}
    </motion.div>
  );
  return (
    <Dropdown
      open={dropdownOpen}
      setOpen={setDropdownOpen}
      trigger={<UserAvatar />}
      align="start"
    >
      <DropdownSection>
        <div className="px-4 py-3">
          <p className=" font-medium  text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className=" text-gray-500">{user.email}</p>
        </div>
      </DropdownSection>
      <DropdownSeparator />
      <DropdownSection>
        {user.type === "user" && (
          <>
            <DropdownItem>
              <Link href="/orders" className="flex items-center gap-2">
                <FiShoppingBag className="w-4 h-4" />
                <span>طلباتي</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/wishlist" className="flex items-center gap-2">
                <FiHeart className="w-4 h-4" />
                <span>قائمة الرغبات</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/notifications" className="flex items-center gap-2">
                <div className="relative">
                  <FiBell className="w-4 h-4" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </div>
                <span>اشعارات</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <button className="flex items-center gap-2 w-full">
                <FiGlobe className="w-4 h-4" />
                <span>اللغة</span>
              </button>
            </DropdownItem>
            <DropdownItem>
              <Link href="/downloads" className="flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                <span>تنزيلاتي</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/licenses" className="flex items-center gap-2">
                <FiKey className="w-4 h-4" />
                <span>تراخيصي</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/my-courses" className="flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                <span>دوراتي</span>
                <FiAward className="w-4 h-4 text-yellow-500 ml-auto" />
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/support" className="flex items-center gap-2">
                <FiHeadphones className="w-4 h-4" />
                <span>الدعم الفني</span>
              </Link>
            </DropdownItem>
          </>
        )}

        {user.type === "seller" && (
          <DropdownItem>
            <Link href="/seller/exampleId" className="flex items-center gap-2">
              <CiShop className="w-4 h-4" />
              <span>متجري</span>
            </Link>
          </DropdownItem>
        )}

        {user.type === "admin" && (
          <>
            <DropdownItem>
              <Link href="/admin" className="flex items-center gap-2">
                <FiGrid className="w-4 h-4" />
                <span>لوحة تحكم المدير</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/admin/users" className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                <span>إدارة المستخدمين</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/admin/products" className="flex items-center gap-2">
                <FiPackage className="w-4 h-4" />
                <span>إدارة المنتجات</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/admin/orders" className="flex items-center gap-2">
                <FiShoppingBag className="w-4 h-4" />
                <span>إدارة الطلبات</span>
              </Link>
            </DropdownItem>
          </>
        )}

        <DropdownItem>
          <Link href="/settings" className="flex items-center gap-2">
            <FiSettings className="w-4 h-4" />
            <span>الإعدادات</span>
          </Link>
        </DropdownItem>
      </DropdownSection>
      <DropdownSeparator />
      <DropdownSection>
        <DropdownItem>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-red-600 hover:text-red-700"
          >
            <FiLogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </DropdownItem>
      </DropdownSection>
    </Dropdown>
  );
};
