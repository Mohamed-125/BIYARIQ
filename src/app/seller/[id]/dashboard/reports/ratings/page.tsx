"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  Star,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

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

interface ProductRating {
  name: string;
  sku: string;
  rating: number;
  reviews: number;
  lastReview: string;
}

interface CustomerReview {
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingByPeriod {
  period: string;
  count: number;
  averageRating: number;
  change: number;
}

export default function RatingsReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const productRatings: ProductRating[] = [
    {
      name: "سماعات لاسلكية",
      sku: "HDP-001",
      rating: 4.8,
      reviews: 250,
      lastReview: "2024-03-15",
    },
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      rating: 4.6,
      reviews: 180,
      lastReview: "2024-03-14",
    },
    {
      name: "ساعة ذكية",
      sku: "WCH-003",
      rating: 4.7,
      reviews: 200,
      lastReview: "2024-03-13",
    },
  ];

  const customerReviews: CustomerReview[] = [
    {
      customer: "أحمد محمد",
      product: "سماعات لاسلكية",
      rating: 5,
      comment: "جودة ممتازة وصوت نقي",
      date: "2024-03-15",
    },
    {
      customer: "سارة أحمد",
      product: "حذاء رياضي",
      rating: 4,
      comment: "مريح جداً ولكن المقاس أكبر قليلاً",
      date: "2024-03-14",
    },
    {
      customer: "محمد علي",
      product: "ساعة ذكية",
      rating: 5,
      comment: "تصميم جميل وبطارية تدوم طويلاً",
      date: "2024-03-13",
    },
  ];

  const ratingsByPeriod: RatingByPeriod[] = [
    {
      period: "مارس 2024",
      count: 150,
      averageRating: 4.7,
      change: 5.2,
    },
    {
      period: "فبراير 2024",
      count: 120,
      averageRating: 4.5,
      change: 3.8,
    },
    {
      period: "يناير 2024",
      count: 100,
      averageRating: 4.3,
      change: -2.1,
    },
  ];

  const ratingStats = {
    averageRating: 4.6,
    totalReviews: 630,
    positiveReviews: 580,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير التقييمات</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <Download size={16} />
          </Button>
        </div>
      </div>

      {/* فلتر التاريخ */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label>من تاريخ</Label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <Label>إلى تاريخ</Label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
          <Button className="flex items-center gap-2">
            <Calendar size={16} />
            تطبيق
          </Button>
        </div>
      </motion.div>

      {/* إحصائيات التقييمات */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <Star size={24} />
              </div>
              <div>
                <p className="text-gray-600">متوسط التقييم</p>
                <h3 className="text-2xl font-semibold flex items-center gap-1">
                  <Star
                    className="text-yellow-500 fill-current"
                    size={20}
                  />
                  {ratingStats.averageRating}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي التقييمات</p>
                <h3 className="text-2xl font-semibold">
                  {ratingStats.totalReviews}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-gray-600">التقييمات الإيجابية</p>
                <h3 className="text-2xl font-semibold">
                  {ratingStats.positiveReviews}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* تقييمات المنتجات */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">تقييمات المنتجات</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>رمز المنتج</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead>عدد التقييمات</TableHead>
              <TableHead>آخر تقييم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productRatings.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  {product.rating}
                </TableCell>
                <TableCell>{product.reviews}</TableCell>
                <TableCell>{product.lastReview}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* آخر تقييمات العملاء */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">آخر تقييمات العملاء</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العميل</TableHead>
              <TableHead>المنتج</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead>التعليق</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerReviews.map((review, index) => (
              <TableRow key={index}>
                <TableCell>{review.customer}</TableCell>
                <TableCell>{review.product}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  {review.rating}
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* التقييمات حسب الفترة */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">التقييمات حسب الفترة</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الفترة</TableHead>
              <TableHead>عدد التقييمات</TableHead>
              <TableHead>متوسط التقييم</TableHead>
              <TableHead>نسبة التغيير</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingsByPeriod.map((period, index) => (
              <TableRow key={index}>
                <TableCell>{period.period}</TableCell>
                <TableCell>{period.count}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  {period.averageRating}
                </TableCell>
                <TableCell
                  className={`${period.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {period.change >= 0 ? "+" : ""}
                  {period.change}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}