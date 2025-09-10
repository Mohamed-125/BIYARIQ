"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  CircleDollarSign,
  CreditCard,
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

interface OrdersByStatus {
  status: string;
  count: number;
  amount: number;
  percentage: number;
}

interface OrdersByPayment {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export default function OrdersReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const ordersByStatus: OrdersByStatus[] = [
    {
      status: "مكتملة",
      count: 120,
      amount: 24000,
      percentage: 60,
    },
    {
      status: "قيد المعالجة",
      count: 45,
      amount: 9000,
      percentage: 22.5,
    },
    {
      status: "ملغاة",
      count: 25,
      amount: 5000,
      percentage: 12.5,
    },
    {
      status: "مرتجعة",
      count: 10,
      amount: 2000,
      percentage: 5,
    },
  ];

  const ordersByPayment: OrdersByPayment[] = [
    {
      method: "بطاقة ائتمان",
      count: 80,
      amount: 16000,
      percentage: 40,
    },
    {
      method: "الدفع عند الاستلام",
      count: 60,
      amount: 12000,
      percentage: 30,
    },
    {
      method: "محفظة إلكترونية",
      count: 40,
      amount: 8000,
      percentage: 20,
    },
    {
      method: "تحويل بنكي",
      count: 20,
      amount: 4000,
      percentage: 10,
    },
  ];

  const averageOrderValue = 200; // ريال

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير الطلبات</h1>
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
                  <SelectItem value="by-status">الطلبات حسب الحالة</SelectItem>
                  <SelectItem value="by-payment">
                    الطلبات حسب طريقة الدفع
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

      {/* متوسط قيمة الطلب */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <CircleDollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-600">متوسط قيمة الطلب</p>
                <h3 className="text-2xl font-semibold">
                  {averageOrderValue} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="by-status" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="by-status">حسب الحالة</TabsTrigger>
          <TabsTrigger value="by-payment">حسب طريقة الدفع</TabsTrigger>
        </TabsList>

        <TabsContent value="by-status">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">الطلبات حسب الحالة</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الحالة</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                  <TableHead>النسبة المئوية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersByStatus.map((status, index) => (
                  <TableRow key={index}>
                    <TableCell>{status.status}</TableCell>
                    <TableCell>{status.count}</TableCell>
                    <TableCell>{status.amount} ريال</TableCell>
                    <TableCell>{status.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="by-payment">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              الطلبات حسب طريقة الدفع
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                  <TableHead>النسبة المئوية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersByPayment.map((payment) => (
                  <TableRow key={payment.method}>
                    <TableCell className="flex items-center gap-2">
                      <CreditCard size={16} />
                      {payment.method}
                    </TableCell>
                    <TableCell>{payment.count}</TableCell>
                    <TableCell>{payment.amount} ريال</TableCell>
                    <TableCell>{payment.percentage}%</TableCell>
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
