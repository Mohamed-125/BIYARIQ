"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MessageCircle,
  Search,
  Calendar,
  Filter,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "../../../../../components/ui/Input";
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

type ReviewType = "product" | "seller";
type ReviewRating = 1 | 2 | 3 | 4 | 5;

interface Review {
  id: string;
  type: ReviewType;
  productId?: string;
  productName?: string;
  productImage?: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: ReviewRating;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  reply?: {
    content: string;
    date: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      type: "product",
      productId: "p1",
      productName: "قميص قطني بأكمام طويلة",
      productImage: "/images/products/shirt.jpg",
      customerId: "c1",
      customerName: "أحمد محمد",
      customerAvatar: "/images/avatars/user1.jpg",
      rating: 4,
      title: "منتج رائع وجودة ممتازة",
      content:
        "اشتريت هذا القميص وأنا سعيد جدًا بالجودة والخامة. المقاس مناسب تمامًا والألوان كما هي في الصورة. سأشتري المزيد من هذا النوع.",
      date: "2023-05-15",
      helpful: 12,
      notHelpful: 2,
      reply: {
        content:
          "شكرًا لك على تقييمك الإيجابي! نحن سعداء بأنك راضٍ عن المنتج ونتطلع لخدمتك مرة أخرى.",
        date: "2023-05-16",
      },
    },
    {
      id: "2",
      type: "product",
      productId: "p2",
      productName: "حذاء رياضي",
      productImage: "/images/products/shoes.jpg",
      customerId: "c2",
      customerName: "سارة أحمد",
      customerAvatar: "/images/avatars/user2.jpg",
      rating: 2,
      title: "مقاس غير مناسب",
      content:
        "المنتج جميل لكن المقاس أصغر مما هو موضح في الوصف. اضطررت لإرجاعه واستبداله بمقاس أكبر.",
      date: "2023-06-20",
      helpful: 8,
      notHelpful: 1,
    },
    {
      id: "3",
      type: "seller",
      customerId: "c3",
      customerName: "محمد علي",
      customerAvatar: "/images/avatars/user3.jpg",
      rating: 5,
      title: "خدمة عملاء ممتازة",
      content:
        "تعاملت مع هذا البائع عدة مرات وكانت التجربة رائعة في كل مرة. سرعة في الرد والشحن وحل المشكلات بشكل فوري.",
      date: "2023-07-05",
      helpful: 15,
      notHelpful: 0,
      reply: {
        content:
          "شكرًا جزيلاً على ثقتك المستمرة في متجرنا! نسعى دائمًا لتقديم أفضل خدمة لعملائنا الكرام.",
        date: "2023-07-06",
      },
    },
    {
      id: "4",
      type: "product",
      productId: "p3",
      productName: "سماعات لاسلكية",
      productImage: "/images/products/headphones.jpg",
      customerId: "c4",
      customerName: "فاطمة محمود",
      customerAvatar: "/images/avatars/user4.jpg",
      rating: 3,
      title: "جودة صوت متوسطة",
      content:
        "السماعات تعمل بشكل جيد لكن جودة الصوت متوسطة مقارنة بالسعر. البطارية تدوم لفترة طويلة وهذا جيد.",
      date: "2023-08-10",
      helpful: 6,
      notHelpful: 3,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchByProduct, setSearchByProduct] = useState("");
  const [searchByDate, setSearchByDate] = useState("");
  const [filterType, setFilterType] = useState<ReviewType | "all">("all");
  const [filterRating, setFilterRating] = useState<ReviewRating | "all">("all");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{
    [key: string]: boolean;
  }>({});

  const filteredReviews = reviews.filter((review) => {
    // Filter by general search term
    const matchesSearch =
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by product name
    const matchesProductName =
      searchByProduct === "" ||
      (review.productName &&
        review.productName
          .toLowerCase()
          .includes(searchByProduct.toLowerCase()));

    // Filter by date
    const matchesDate =
      searchByDate === "" || review.date.includes(searchByDate);

    // Filter by type
    const matchesType = filterType === "all" || review.type === filterType;

    // Filter by rating
    const matchesRating =
      filterRating === "all" || review.rating === filterRating;

    return (
      matchesSearch &&
      matchesProductName &&
      matchesDate &&
      matchesType &&
      matchesRating
    );
  });

  const handleReply = (reviewId: string) => {
    if (!replyText[reviewId] || replyText[reviewId].trim() === "") return;

    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              reply: {
                content: replyText[reviewId],
                date: new Date().toISOString().split("T")[0],
              },
            }
          : review
      )
    );

    // Reset reply form
    setReplyText({ ...replyText, [reviewId]: "" });
    setShowReplyForm({ ...showReplyForm, [reviewId]: false });
  };

  const toggleReplyForm = (reviewId: string) => {
    setShowReplyForm({
      ...showReplyForm,
      [reviewId]: !showReplyForm[reviewId],
    });
    if (!replyText[reviewId]) {
      setReplyText({ ...replyText, [reviewId]: "" });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8"
    >
      <h1 className="text-2xl font-bold mb-8">التقييمات والمراجعات</h1>

      {/* Filters and Search */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
      >
        <div className="flex flex-col gap-4">
          {/* Main Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Input
                type="text"
                placeholder="بحث في التقييمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as ReviewType | "all")
                  }
                  className="appearance-none w-full md:w-40 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                >
                  <option value="all">جميع التقييمات</option>
                  <option value="product">تقييمات المنتجات</option>
                  <option value="seller">تقييمات البائع</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="relative w-full md:w-auto">
                <select
                  value={filterRating}
                  onChange={(e) =>
                    setFilterRating(
                      e.target.value === "all"
                        ? "all"
                        : (parseInt(e.target.value) as ReviewRating)
                    )
                  }
                  className="appearance-none w-full md:w-40 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                >
                  <option value="all">جميع التقييمات</option>
                  <option value="5">5 نجوم</option>
                  <option value="4">4 نجوم</option>
                  <option value="3">3 نجوم</option>
                  <option value="2">2 نجوم</option>
                  <option value="1">1 نجمة</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Additional Search Options */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search by Product Name */}
            <div className="relative w-full md:w-1/2">
              <Input
                type="text"
                placeholder="بحث باسم المنتج..."
                value={searchByProduct}
                onChange={(e) => setSearchByProduct(e.target.value)}
                className="w-full pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Filter size={18} />
              </div>
            </div>

            {/* Search by Date */}
            <div className="relative w-full md:w-1/2">
              <Input
                type="date"
                placeholder="بحث بتاريخ التقييم..."
                value={searchByDate}
                onChange={(e) => setSearchByDate(e.target.value)}
                className="w-full pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Calendar size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div variants={itemVariants} className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <p className="text-gray-500">لا توجد تقييمات تطابق معايير البحث</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={review.customerAvatar}
                      alt={review.customerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/40";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{review.customerName}</h3>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{review.date}</span>
                </div>
              </div>

              {review.type === "product" && review.productName && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-200">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/48";
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">المنتج:</span>
                    <h4 className="font-medium">{review.productName}</h4>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                <p className="text-gray-700">{review.content}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button className="text-gray-500 hover:text-green-500">
                      <ThumbsUp size={16} />
                    </button>
                    <span className="text-sm">{review.helpful}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="text-gray-500 hover:text-red-500">
                      <ThumbsDown size={16} />
                    </button>
                    <span className="text-sm">{review.notHelpful}</span>
                  </div>
                </div>

                {!review.reply && (
                  <Button
                    onClick={() => toggleReplyForm(review.id)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MessageCircle size={16} />
                    رد
                  </Button>
                )}
              </div>

              {/* Reply Form */}
              {showReplyForm[review.id] && !review.reply && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={replyText[review.id] || ""}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [review.id]: e.target.value,
                      })
                    }
                    placeholder="اكتب ردك هنا..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      onClick={() =>
                        setShowReplyForm({
                          ...showReplyForm,
                          [review.id]: false,
                        })
                      }
                      variant="outline"
                      size="sm"
                    >
                      إلغاء
                    </Button>
                    <Button onClick={() => handleReply(review.id)} size="sm">
                      إرسال الرد
                    </Button>
                  </div>
                </div>
              )}

              {/* Seller Reply */}
              {review.reply && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border-r-4 border-purple-500">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-purple-700">ردك:</h4>
                    <span className="text-xs text-gray-500">
                      {review.reply.date}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.reply.content}</p>
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => toggleReplyForm(review.id)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      تعديل الرد
                    </Button>
                  </div>

                  {/* Edit Reply Form */}
                  {showReplyForm[review.id] && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <textarea
                        value={replyText[review.id] || review.reply.content}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [review.id]: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          onClick={() =>
                            setShowReplyForm({
                              ...showReplyForm,
                              [review.id]: false,
                            })
                          }
                          variant="outline"
                          size="sm"
                        >
                          إلغاء
                        </Button>
                        <Button
                          onClick={() => handleReply(review.id)}
                          size="sm"
                        >
                          تحديث الرد
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
