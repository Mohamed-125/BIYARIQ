"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Share2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Facebook,
  Twitter,
  WhatsApp,
  Link,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Metadata } from "next";
import Head from "next/head";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { Product } from "@/context/CartContext";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Dialog } from "@/components/ui/modal";
import { SharePopup } from "@/components/SharePopup";
import { div } from "framer-motion/client";
import Rating from "@/components/ui/Rating";

// Define interfaces
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

interface Store {
  id: string;
  name: string;
  avatar: string;
  description: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
  responseTime: string;
  details: string;
}

const dummyStore: Store = {
  id: "1",
  name: "متجر التقنية المتقدمة",
  avatar: "https://i.pravatar.cc/150?img=3",
  description: "متخصصون في بيع تراخيص البرامج الأصلية وحلول الأمن الرقمي",
  rating: 4.8,
  totalSales: 1234,
  joinedDate: "2023-01-15",
  responseTime: "خلال ساعة",
  details: `
    <div class="space-y-6">
      <h3 class="text-xl font-bold">عن المتجر</h3>
      <p>نحن متجر متخصص في توفير حلول البرمجيات الأصلية وتراخيص الأنظمة. نعمل مع كبرى الشركات العالمية لضمان جودة منتجاتنا.</p>
      
      <h3 class="text-xl font-bold">خدماتنا</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>توفير تراخيص برمجيات أصلية</li>
        <li>دعم فني على مدار الساعة</li>
        <li>ضمان استرداد الأموال</li>
        <li>خدمة ما بعد البيع</li>
      </ul>

      <h3 class="text-xl font-bold">سياسة الضمان</h3>
      <p>نقدم ضمان استرداد كامل للمبلغ خلال 30 يوماً من تاريخ الشراء في حال وجود أي مشكلة في المنتج.</p>
    </div>
  `,
};

const dummyProduct: Product = {
  id: "1",
  name: "ترخيص ويندوز 10",
  price: 99.99,
  originalPrice: 149.99,
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIDfSFemHF1vxdjs0p7jclNlu0sabq9Izy0Q&s",
  rating: 4.5,
  type: "digital",
  fileSize: "4.3GB",
  format: "ISO",
  downloadLink: "#",
  licenseKey: "XXXXX-XXXXX-XXXXX-XXXXX",
  details: `
    <div class="space-y-6">
      <h3 class="text-xl font-bold">المواصفات</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>المعالج:</strong> 1 gigahertz (GHz) or faster</li>
        <li><strong>الذاكرة:</strong> 1 GB for 32-bit or 2 GB for 64-bit</li>
        <li><strong>مساحة القرص:</strong> 16 GB for 32-bit OS or 20 GB for 64-bit OS</li>
        <li><strong>كرت الشاشة:</strong> DirectX 9 or later with WDDM 1.0 driver</li>
      </ul>

      <h3 class="text-xl font-bold">الوصف</h3>
      <p>ترخيص ويندوز 10 الأصلي من مايكروسوفت. يتضمن جميع الميزات الأساسية والتحديثات المجانية.</p>

      <h3 class="text-xl font-bold">المميزات</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>تحديثات مجانية مدى الحياة</li>
        <li>دعم فني 24/7</li>
        <li>تفعيل فوري</li>
        <li>ضمان استرداد الأموال</li>
      </ul>

      <h3 class="text-xl font-bold">طريقة التفعيل</h3>
      <ol class="list-decimal list-inside space-y-2">
        <li>قم بتحميل النسخة من الرابط المرفق</li>
        <li>ثبت النظام على جهازك</li>
        <li>استخدم مفتاح الترخيص المرفق للتفعيل</li>
        <li>استمتع بنظام تشغيل أصلي</li>
      </ol>
    </div>
  `,
};

const dummyImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIDfSFemHF1vxdjs0p7jclNlu0sabq9Izy0Q&s",
  "https://images.unsplash.com/photo-1420593248178-d88870618ca0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJhbHxlbnwwfHwwfHx8MA%3D%3D",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg/1200px-Altja_j%C3%B5gi_Lahemaal.jpg",
];

const dummyReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "محمد أحمد",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment: "منتج رائع وسهل الاستخدام. التنصيب كان سلس جداً.",
    createdAt: "2024-02-15",
    likes: 12,
    dislikes: 2,
  },
  {
    id: "2",
    userId: "user2",
    userName: "سارة محمد",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    comment: "جيد جداً ولكن كان هناك بعض التأخير في استلام مفتاح الترخيص.",
    createdAt: "2024-02-14",
    likes: 8,
    dislikes: 1,
  },
];

export default function ProductDetails() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showSharePopup, setShowSharePopup] = useState(false);

  const shareUrl = "";

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{dummyProduct.name}</title>
        <meta
          name="description"
          content="اشترِ ترخيص ويندوز 10 الأصلي بأفضل سعر مع ضمان استرداد الأموال"
        />
      </Head>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Swiper
            spaceBetween={10}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Pagination, Thumbs]}
            className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
          >
            {dummyImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt={`${dummyProduct.name} - ${index + 1}`}
                    className=" w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={0}
            slidesPerView={4}
            width={350}
            // freeMode
            watchSlidesProgress
            modules={[Navigation, Thumbs]}
            className="thumbs-swiper"
          >
            {dummyImages.map((image, index) => (
              <SwiperSlide key={index} className="!h-fit">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className=" object-cover cursor-pointer w-[75px] rounded-xl aspect-square"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 mt-0 lg:mt-10"
        >
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">
              {dummyProduct.name}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  isLiked ? "text-red-500" : "bg-gray-50 text-gray-500"
                }`}
              >
                <Heart className={isLiked ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => setShowSharePopup(true)}
                className="p-2 rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <Share2 />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {<Rating rating={dummyProduct.rating} />}
            </div>
            <span className="text-gray-500">({dummyProduct.rating} تقييم)</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#7b2cbf]">
                {dummyProduct.price} ﷼
              </span>
              {dummyProduct.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {dummyProduct.originalPrice} ﷼
                </span>
              )}
            </div>
            <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
              خصم 33%
            </span>
          </div>

          <div className="space-y-4 py-6 border-y border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">حجم الملف:</span>
              <span>{(dummyProduct as any).fileSize}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">الصيغة:</span>
              <span>{(dummyProduct as any).format}</span>
            </div>
          </div>

          <button className="w-full py-4 px-6 bg-[#7b2cbf] text-white rounded-lg font-medium hover:bg-[#6a24a6] transition-colors">
            إضافة إلى السلة
          </button>
        </motion.div>
      </div>

      {/* Store Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm mt-9 lg:mt-28"
      >
        <div className="flex items-center gap-4">
          <img
            src={dummyStore.avatar}
            alt={dummyStore.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {dummyStore.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {<Rating rating={dummyStore.rating} />}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {dummyStore.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-[#7b2cbf]">
              {dummyStore.totalSales}+
            </div>
            <div className="text-sm text-gray-600">مبيعات</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-[#7b2cbf]">
              {dummyStore.responseTime}
            </div>
            <div className="text-sm text-gray-600">وقت الرد</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-[#7b2cbf]">
              {new Date(dummyStore.joinedDate).getFullYear()}
            </div>
            <div className="text-sm text-gray-600">عضو منذ</div>
          </div>
        </div>
      </motion.div>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">تفاصيل المنتج</h2>
        <div dangerouslySetInnerHTML={{ __html: dummyProduct.details }} />
      </motion.div>

      {/* Share Popup */}
      <SharePopup open={showSharePopup} onOpenChange={setShowSharePopup} />

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          تقييمات المنتج
        </h2>

        <div className="space-y-8">
          {dummyReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {review.userName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {<Rating rating={dummyStore.rating} />}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-gray-600">{review.comment}</p>

              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span>({review.likes})</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsDown className="w-4 h-4" />
                  <span>({review.dislikes})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
