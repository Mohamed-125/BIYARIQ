"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Filter, Plus } from "lucide-react";
import { Product } from "@/context/CartContext";
import FilterSidebar from "../../components/FilterSidebar";
import ProductCard from "@/components/Card/ProductCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const filterConfig = {
  category: "laptops",
  filters: [
    {
      id: "brand",
      type: "checkbox",
      label: "العلامة التجارية",
      options: [
        { value: "apple", label: "آبل" },
        { value: "dell", label: "ديل" },
        { value: "lenovo", label: "لينوفو" },
        { value: "hp", label: "اتش بي" },
      ],
    },
    {
      id: "price",
      type: "range",
      label: "السعر",
      min: 0,
      max: 5000,
      step: 50,
      unit: "﷼",
    },
    {
      id: "processor",
      type: "checkbox",
      label: "نوع المعالج",
      options: [
        { value: "i3", label: "انتل كور i3" },
        { value: "i5", label: "انتل كور i5" },
        { value: "i7", label: "انتل كور i7" },
        { value: "ryzen5", label: "رايزن 5" },
      ],
    },
    {
      id: "ram",
      type: "checkbox",
      label: "الذاكرة العشوائية",
      options: [
        { value: "4gb", label: "4 جيجابايت" },
        { value: "8gb", label: "8 جيجابايت" },
        { value: "16gb", label: "16 جيجابايت" },
      ],
    },
    {
      id: "rating",
      type: "rating",
      label: "تقييم العملاء",
      options: [
        { value: 4, label: "4 نجوم وأعلى" },
        { value: 3, label: "3 نجوم وأعلى" },
        { value: 2, label: "نجمتان وأعلى" },
      ],
    },
  ],
};

const dummyProducts: Product[] = [
  // Physical
  {
    id: "p1",
    name: "Wireless Mouse",
    price: 25,
    originalPrice: 35,
    rating: 4,
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",
    type: "physical",
    stock: 50,
    weight: 0.2,
    dimensions: "10x6x4 cm",
  },
  {
    id: "p2",
    name: "Bluetooth Headphones",
    price: 80,
    originalPrice: 100,
    rating: 4,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",
    type: "physical",
    stock: 30,
    weight: 0.5,
    dimensions: "20x15x8 cm",
  },
  {
    id: "p3",
    name: "Office Chair",
    price: 150,
    rating: 4,
    originalPrice: 200,
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",
    type: "physical",
    stock: 10,
    weight: 12,
    dimensions: "70x70x110 cm",
  },
  // Digital
  {
    id: "d1",
    name: "E-book: Learn JavaScript",
    price: 15,
    rating: 4,
    type: "digital",
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",
    fileSize: "5MB",
    format: "PDF",
    downloadLink: "/downloads/js-ebook.pdf",
    licenseKey: "JS123-456",
  },
  {
    id: "d2",
    name: "Stock Photo Pack",
    price: 25,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",
    type: "digital",
    rating: 4,
    fileSize: "500MB",
    format: "JPEG",
    downloadLink: "/downloads/stock-photos.zip",
  },
  {
    id: "d3",
    name: "Music Album",
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",
    price: 10,
    type: "digital",
    rating: 3.5,
    fileSize: "120MB",
    format: "MP3",
    downloadLink: "/downloads/album.zip",
  },
  // Courses
  {
    id: "c1",
    name: "Web Development Bootcamp",
    price: 200,
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",
    type: "course",
    duration: 40,
    rating: 4,
    lectures: 120,
    level: "Beginner",
    instructor: "John Doe",
  },
  {
    id: "c2",
    name: "Advanced React",
    price: 150,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",
    type: "course",
    duration: 25,
    lectures: 80,
    rating: 2.5,
    level: "Advanced",
    instructor: "Jane Smith",
  },
  {
    id: "c3",
    name: "UI/UX Design Fundamentals",
    price: 100,
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",
    type: "course",
    duration: 20,
    rating: 4.5,
    lectures: 60,
    level: "Intermediate",
    instructor: "Emily Johnson",
  },
];

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const itemsPerPage = 6;

  // Filter products based on search, type, and price range
  const filteredProducts = dummyProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || product.type === selectedType;
    // const matchesPrice =
    //   product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesType;
    //  && matchesPrice;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mb-8 bg-[hsl(259.09_96.49%_77.65%_/_13%)] h-[200px] flex flex-col justify-center items-center rounded-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 z-[-1] bg-[url('/_next/static/media/breadcrumb-gradient-bg.9ef1bda5.png')] bg-no-repeat bg-center bg-cover"></div>
        <h2 className="text-2xl font-bold text-[#0a0a1a]">جميع المنتجات</h2>
      </motion.div>

      {/* Top Filters */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px] max-w-xl">
          <Input
            type="text"
            placeholder="ابحث عن المنتجات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b2cbf] focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b2cbf] focus:border-transparent transition-all"
          >
            <option value="all">جميع المنتجات</option>
            <option value="physical">منتجات فعلية</option>
            <option value="digital">منتجات رقمية</option>
            <option value="course">دورات تدريبية</option>
          </select>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[#7b2cbf] text-white rounded-lg hover:bg-[#6a24a6] transition-colors"
          >
            <Filter size={20} />
            <span>الفلترة</span>
          </button>
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filterConfig.filters}
        selectedFilters={selectedFilters}
        onFilterChange={(filterId, value) => {
          setSelectedFilters((prev) => ({
            ...prev,
            [filterId]: value,
          }));
        }}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openModal("product", { product })}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? "bg-[#7b2cbf] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
