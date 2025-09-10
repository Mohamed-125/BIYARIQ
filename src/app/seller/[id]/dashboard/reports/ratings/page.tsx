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
  FileSpreadsheet,
  FileText,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { FaFilePdf } from "react-icons/fa";

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

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

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
        <Button
          variant="outline"
          onClick={() => {
            setIsExportDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          تصدير التقرير
        </Button>{" "}
        <Dialog open={isExportDialogOpen} setOpen={setIsExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تصدير التقرير</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>نوع التقرير</Label>
                <Select value={exportTab} onValueChange={setExportTab}>
                  <SelectItem value="product-ratings">
                    تقييمات المنتجات
                  </SelectItem>
                  <SelectItem value="customer-reviews">
                    مراجعات العملاء
                  </SelectItem>
                  <SelectItem value="ratings-by-period">
                    التقييمات حسب الفترة
                  </SelectItem>
                </Select>
              </div>
              <div>
                <Label>تنسيق التصدير</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FaFilePdf size={16} />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet size={16} />
                      Excel
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      CSV
                    </div>
                  </SelectItem>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>من تاريخ</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>إلى تاريخ</Label>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                className="w-full"
                disabled={
                  !exportFormat ||
                  !exportTab ||
                  !dateRange.from ||
                  !dateRange.to
                }
                onClick={() => {
                  // تنفيذ عملية التصدير
                  console.log("تصدير التقرير...", {
                    format: exportFormat,
                    tab: exportTab,
                    dateRange,
                  });
                  setIsExportDialogOpen(false);
                }}
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* إحصائيات التقييمات */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <Star size={24} />
              </div>
              <div>
                <p className="text-gray-600">متوسط التقييم</p>
                <h3 className="text-2xl font-semibold">
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
                <p className="text-gray-600">إجمالي المراجعات</p>
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
                <p className="text-gray-600">المراجعات الإيجابية</p>
                <h3 className="text-2xl font-semibold">
                  {ratingStats.positiveReviews}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="product-ratings" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="product-ratings">تقييمات المنتجات</TabsTrigger>
          <TabsTrigger value="customer-reviews">مراجعات العملاء</TabsTrigger>
          <TabsTrigger value="ratings-by-period">
            التقييمات حسب الفترة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product-ratings">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>رقم المنتج</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>عدد المراجعات</TableHead>
                  <TableHead>آخر مراجعة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productRatings.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.rating}</TableCell>
                    <TableCell>{product.reviews}</TableCell>
                    <TableCell>{product.lastReview}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="customer-reviews">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
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
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>{review.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="ratings-by-period">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
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
                    <TableCell>{period.averageRating}</TableCell>
                    <TableCell
                      className={
                        period.change >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {period.change >= 0 ? "+" : ""}
                      {period.change}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
