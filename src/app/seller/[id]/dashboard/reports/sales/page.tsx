"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Category,
  Package,
  Download,
  Filter,
  ChevronDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
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
import { FaFilePdf } from "react-icons/fa";
import { div } from "framer-motion/client";

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

interface SalesByDate {
  date: string;
  amount: number;
  orders: number;
}

interface SalesByCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface SalesByProduct {
  product: string;
  sku: string;
  quantity: number;
  amount: number;
}

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const salesByDate: SalesByDate[] = [
    { date: "2024-03-15", amount: 2500, orders: 12 },
    { date: "2024-03-14", amount: 1800, orders: 8 },
    { date: "2024-03-13", amount: 3200, orders: 15 },
  ];

  const salesByCategory: SalesByCategory[] = [
    { category: "الإلكترونيات", amount: 15000, percentage: 40 },
    { category: "الملابس", amount: 12000, percentage: 32 },
    { category: "الأحذية", amount: 8000, percentage: 21 },
    { category: "الإكسسوارات", amount: 2500, percentage: 7 },
  ];

  const salesByProduct: SalesByProduct[] = [
    {
      product: "سماعات لاسلكية",
      sku: "HDP-001",
      quantity: 25,
      amount: 5000,
    },
    {
      product: "حذاء رياضي",
      sku: "SHO-002",
      quantity: 18,
      amount: 3600,
    },
    {
      product: "قميص قطني",
      sku: "SHT-003",
      quantity: 30,
      amount: 2400,
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
        <h1 className="text-2xl font-bold">تقارير المبيعات</h1>
        <Button
          variant="outline"
          onClick={() => setIsExportDialogOpen(true)}
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
                  <SelectItem value="by-date">المبيعات حسب التاريخ</SelectItem>
                  <SelectItem value="by-category">
                    المبيعات حسب الفئة
                  </SelectItem>
                  <SelectItem value="by-product">
                    المبيعات حسب المنتج
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

      <Tabs defaultValue="by-date" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="by-date">حسب التاريخ</TabsTrigger>
          <TabsTrigger value="by-category">حسب الفئة</TabsTrigger>
          <TabsTrigger value="by-product">حسب المنتج</TabsTrigger>
        </TabsList>

        <TabsContent value="by-date">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">المبيعات حسب التاريخ</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByDate.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.orders}</TableCell>
                    <TableCell>{sale.amount} ريال</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="by-category">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">المبيعات حسب الفئة</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الفئة</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                  <TableHead>النسبة المئوية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByCategory.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category.category}</TableCell>
                    <TableCell>{category.amount} ريال</TableCell>
                    <TableCell>{category.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="by-product">
          {/* المبيعات حسب المنتج */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">المبيعات حسب المنتج</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الكمية المباعة</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByProduct.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.product}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.amount} ريال</TableCell>
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
