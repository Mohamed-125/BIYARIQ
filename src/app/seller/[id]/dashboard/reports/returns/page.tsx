"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  RotateCcw,
  Package,
  AlertCircle,
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

interface ReturnedOrder {
  orderId: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  reason: string;
}

interface MostReturnedProduct {
  name: string;
  sku: string;
  returns: number;
  returnRate: number;
  totalSales: number;
}

interface ReturnReason {
  reason: string;
  count: number;
  percentage: number;
}

export default function ReturnsReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const returnedOrders: ReturnedOrder[] = [
    {
      orderId: "ORD-001",
      date: "2024-03-15",
      customer: "أحمد محمد",
      amount: 500,
      status: "مكتمل",
      reason: "مقاس غير مناسب",
    },
    {
      orderId: "ORD-002",
      date: "2024-03-14",
      customer: "سارة أحمد",
      amount: 750,
      status: "قيد المعالجة",
      reason: "منتج معيب",
    },
    {
      orderId: "ORD-003",
      date: "2024-03-13",
      customer: "محمد علي",
      amount: 300,
      status: "مكتمل",
      reason: "لون مختلف",
    },
  ];

  const mostReturnedProducts: MostReturnedProduct[] = [
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      returns: 15,
      returnRate: 12.5,
      totalSales: 120,
    },
    {
      name: "قميص قطني",
      sku: "SHT-003",
      returns: 10,
      returnRate: 8.3,
      totalSales: 120,
    },
    {
      name: "بنطلون جينز",
      sku: "PNT-001",
      returns: 8,
      returnRate: 6.7,
      totalSales: 120,
    },
  ];

  const returnReasons: ReturnReason[] = [
    {
      reason: "مقاس غير مناسب",
      count: 25,
      percentage: 35.7,
    },
    {
      reason: "منتج معيب",
      count: 15,
      percentage: 21.4,
    },
    {
      reason: "لون مختلف",
      count: 12,
      percentage: 17.1,
    },
    {
      reason: "وصف غير دقيق",
      count: 10,
      percentage: 14.3,
    },
    {
      reason: "تأخر التوصيل",
      count: 8,
      percentage: 11.5,
    },
  ];

  const returnStats = {
    totalReturns: 70,
    totalAmount: 14000,
    returnRate: 8.5,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير المرتجعات</h1>
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
                  <SelectItem value="orders">طلبات المرتجعات</SelectItem>
                  <SelectItem value="products">
                    المنتجات الأكثر إرجاعاً
                  </SelectItem>
                  <SelectItem value="reasons">أسباب الإرجاع</SelectItem>
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

      {/* إحصائيات المرتجعات */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-full text-white">
                <RotateCcw size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي المرتجعات</p>
                <h3 className="text-2xl font-semibold">
                  {returnStats.totalReturns}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <Package size={24} />
              </div>
              <div>
                <p className="text-gray-600">قيمة المرتجعات</p>
                <h3 className="text-2xl font-semibold">
                  {returnStats.totalAmount} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-gray-600">نسبة المرتجعات</p>
                <h3 className="text-2xl font-semibold">
                  {returnStats.returnRate}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="orders">طلبات المرتجعات</TabsTrigger>
          <TabsTrigger value="products">المنتجات الأكثر إرجاعاً</TabsTrigger>
          <TabsTrigger value="reasons">أسباب الإرجاع</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">طلبات المرتجعات</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>سبب الإرجاع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnedOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.amount} ريال</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="products">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              المنتجات الأكثر إرجاعاً
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>رمز المنتج</TableHead>
                  <TableHead>عدد المرتجعات</TableHead>
                  <TableHead>معدل الإرجاع</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostReturnedProducts.map((product) => (
                  <TableRow key={product.sku}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.returns}</TableCell>
                    <TableCell>{product.returnRate}%</TableCell>
                    <TableCell>{product.totalSales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="reasons">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">أسباب الإرجاع</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>السبب</TableHead>
                  <TableHead>عدد المرات</TableHead>
                  <TableHead>النسبة المئوية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnReasons.map((reason) => (
                  <TableRow key={reason.reason}>
                    <TableCell>{reason.reason}</TableCell>
                    <TableCell>{reason.count}</TableCell>
                    <TableCell>{reason.percentage}%</TableCell>
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
