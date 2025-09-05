"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/Card/ProductCard";
import Categories from "./Categories";
import { useCart } from "@/context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Input from "../components/ui/Input";
import { div } from "framer-motion/client";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  const { dummyProducts } = useCart();

  const physicalProducts = dummyProducts.filter((p) => p.type === "physical");
  const digitalProducts = dummyProducts.filter((p) => p.type === "digital");
  const courseProducts = dummyProducts.filter((p) => p.type === "course");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative sm:h-[500px] md:h-[700px] bg-[var(--section)] overflow-hidden py-12 sm:py-8">
        <motion.div
          className="container mx-auto  h-full flex items-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
            <motion.div
              className="flex-1 text-right w-full"
              variants={fadeInUp}
            >
              <h1 className="text-4xl text-center sm:text-right md:text-6xl font-bold mb-6 text-[#2D3436] leading-tight">
                متجر متكامل لجميع احتياجاتك
              </h1>
              <div className="flex gap-4 justify-center sm:justify-start items-center mb-8">
                <motion.div className="text-lg" variants={fadeInUp}>
                  <span className="font-bold text-2xl">+100</span>
                  <br />
                  منتج
                </motion.div>
                <motion.div className="text-lg" variants={fadeInUp}>
                  <span className="font-bold text-2xl">+50</span>
                  <br />
                  عميل
                </motion.div>
              </div>
              <motion.div
                className="relative flex gap-2 sm:gap-1.5 w-full sm:max-w-md items-center"
                variants={fadeInUp}
              >
                <Input
                  type="text"
                  placeholder="ما الذي تبحث عنه؟"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 border-[#7b2cbf] focus:outline-none focus:border-[#7b2cbf] text-right"
                />
                <button className="bg-[#7b2cbf] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full hover:bg-[#7b2cbf]/90 transition-colors sm:w-auto">
                  بحث
                </button>
              </motion.div>
            </motion.div>
            <motion.div
              className="flex-1 relative px-4 hidden sm:flex sm:px-0"
              variants={fadeInUp}
            >
              <img
                src="/Hero.png"
                alt="Hero Image"
                className="object-contain w-full h-full max-h-[300px] sm:max-h-none"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Physical Products Section */}
      <section className="py-16 bg-[var(--section)]">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            variants={fadeInUp}
          >
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">المنتجات الفعلية</h2>
              <p className="text-gray-600">
                اكتشف مجموعتنا من المنتجات الفعلية عالية الجودة
              </p>
            </div>
            <Link href="/products">
              <Button variant="secondary" size="md">
                <div className="flex items-center gap-2">
                  عرض الكل
                  <ChevronLeft size={16} />
                </div>
              </Button>
            </Link>
          </motion.div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={{
                nextEl: ".swiper-button-next-physical",
                prevEl: ".swiper-button-prev-physical",
              }}
              className="pb-12"
            >
              {physicalProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-physical absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-colors">
              <ChevronRight size={24} className="text-purple-600" />
            </button>
            <button className="swiper-button-next-physical absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-colors">
              <ChevronLeft size={24} className="text-purple-600" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Digital Products Section */}
      <section className="py-16">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            variants={fadeInUp}
          >
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">المنتجات الرقمية</h2>
              <p className="text-gray-600">
                مجموعة متنوعة من المنتجات الرقمية عالية الجودة
              </p>
            </div>{" "}
            <Link href="/products">
              <Button variant="secondary" size="md">
                <div className="flex items-center gap-2">
                  عرض الكل
                  <ChevronLeft size={16} />
                </div>
              </Button>
            </Link>
          </motion.div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={{
                nextEl: ".swiper-button-next-digital",
                prevEl: ".swiper-button-prev-digital",
              }}
              className="pb-12"
            >
              {digitalProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-digital absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-colors">
              <ChevronRight size={24} className="text-purple-600" />
            </button>
            <button className="swiper-button-next-digital absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-colors">
              <ChevronLeft size={24} className="text-purple-600" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-[var(--section)]">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            variants={fadeInUp}
          >
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">الدورات التدريبية</h2>
              <p className="text-gray-600">
                تعلم مهارات جديدة مع أفضل المدربين
              </p>
            </div>
            <Link href="/products">
              <Button variant="secondary" size="md">
                <div className="flex items-center gap-2">
                  عرض الكل
                  <ChevronLeft size={16} />
                </div>
              </Button>
            </Link>
          </motion.div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              loop
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={{
                nextEl: ".swiper-button-next-courses",
                prevEl: ".swiper-button-prev-courses",
              }}
              className="pb-12"
            >
              {courseProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-courses absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-colors">
              <ChevronRight size={24} className="text-purple-600" />
            </button>
            <button className="swiper-button-next-courses absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-colors">
              <ChevronLeft size={24} className="text-purple-600" />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
