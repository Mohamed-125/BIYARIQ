"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Star,
  Package,
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../../components/ui/Select";
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

interface ProductPerformance {
  name: string;
  sku: string;
  sales: number;
  revenue: number;
  rating: number;
}

interface RatedProduct {
  name: string;
  sku: string;
  rating: number;
  reviews: number;
  lastReview: string;
}

export default function ProductsReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const topProducts: ProductPerformance[] = [
    {
      name: "سماعات لاسلكية",
      sku: "HDP-001",
      sales: 150,
      revenue: 30000,
      rating: 4.8,
    },
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      sales: 120,
      revenue: 24000,
      rating: 4.6,
    },
    {
      name: "ساعة ذكية",
      sku: "WCH-003",
      sales: 100,
      revenue: 35000,
      rating: 4.7,
    },
  ];

  const lowPerformingProducts: ProductPerformance[] = [
    {
      name: "حقيبة يد",
      sku: "BAG-001",
      sales: 5,
      revenue: 1000,
      rating: 3.5,
    },
    {
      name: "نظارة شمسية",
      sku: "SGL-002",
      sales: 8,
      revenue: 1600,
      rating: 3.8,
    },
    {
      name: "محفظة جلدية",
      sku: "WLT-003",
      sales: 10,
      revenue: 1500,
      rating: 3.2,
    },
  ];

  const ratedProducts: RatedProduct[] = [
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير المنتجات</h1>
        <Button
          onClick={() => {
            setIsExportDialogOpen(true);
          }}
          variant="outline"
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
                <Select
                  placeholder="اختر نوع التقرير"
                  value={exportTab}
                  onValueChange={setExportTab}
                >
                  <SelectItem value="top-products">
                    المنتجات الأكثر مبيعاً
                  </SelectItem>
                  <SelectItem value="low-products">
                    المنتجات الأقل مبيعاً
                  </SelectItem>
                  <SelectItem value="rated-products">
                    المنتجات المقيمة
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

      <Tabs defaultValue="top-products" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="top-products">الأكثر مبيعاً</TabsTrigger>
          <TabsTrigger value="low-products">الأقل مبيعاً</TabsTrigger>
          <TabsTrigger value="rated-products">المنتجات المقيمة</TabsTrigger>
        </TabsList>

        <TabsContent value="top-products">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold">المنتجات الأكثر مبيعاً</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>عدد المبيعات</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{product.revenue} ريال</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="low-products">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="text-red-500" size={24} />
              <h2 className="text-xl font-semibold">المنتجات الأقل مبيعاً</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>عدد المبيعات</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowPerformingProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{product.revenue} ريال</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="rated-products">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold">المنتجات المقيمة</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>عدد التقييمات</TableHead>
                  <TableHead>متوسط التقييم</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratedProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.reviews}</TableCell>
                    <TableCell>{product.rating}</TableCell>
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
