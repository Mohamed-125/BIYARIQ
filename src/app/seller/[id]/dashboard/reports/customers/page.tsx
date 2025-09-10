"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  Users,
  UserPlus,
  Repeat,
  ShoppingBag,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
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

interface ActiveCustomer {
  name: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  averageOrderValue: number;
}

interface NewCustomer {
  name: string;
  joinDate: string;
  firstOrder: string;
  orderValue: number;
}

interface RepeatCustomer {
  name: string;
  totalOrders: number;
  frequency: number; // بالأيام
  lastOrder: string;
  totalSpent: number;
}

export default function CustomersAnalyticsPage() {
  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const activeCustomers: ActiveCustomer[] = [
    {
      name: "أحمد محمد",
      orders: 12,
      totalSpent: 5000,
      lastOrder: "2024-03-15",
      averageOrderValue: 416.67,
    },
    {
      name: "سارة أحمد",
      orders: 10,
      totalSpent: 4200,
      lastOrder: "2024-03-14",
      averageOrderValue: 420,
    },
    {
      name: "محمد علي",
      orders: 8,
      totalSpent: 3800,
      lastOrder: "2024-03-13",
      averageOrderValue: 475,
    },
  ];

  const newCustomers: NewCustomer[] = [
    {
      name: "فاطمة حسن",
      joinDate: "2024-03-15",
      firstOrder: "2024-03-15",
      orderValue: 450,
    },
    {
      name: "عمر خالد",
      joinDate: "2024-03-14",
      firstOrder: "2024-03-14",
      orderValue: 380,
    },
    {
      name: "نورا أحمد",
      joinDate: "2024-03-13",
      firstOrder: "2024-03-13",
      orderValue: 520,
    },
  ];

  const repeatCustomers: RepeatCustomer[] = [
    {
      name: "أحمد محمد",
      totalOrders: 12,
      frequency: 15,
      lastOrder: "2024-03-15",
      totalSpent: 5000,
    },
    {
      name: "سارة أحمد",
      totalOrders: 10,
      frequency: 18,
      lastOrder: "2024-03-14",
      totalSpent: 4200,
    },
    {
      name: "محمد علي",
      totalOrders: 8,
      frequency: 22,
      lastOrder: "2024-03-13",
      totalSpent: 3800,
    },
  ];

  const customerStats = {
    totalCustomers: 500,
    newCustomers: 45,
    repeatRate: 65,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تحليلات العملاء</h1>
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
                  <SelectItem value="active">العملاء الأكثر نشاطاً</SelectItem>
                  <SelectItem value="new">العملاء الجدد</SelectItem>
                  <SelectItem value="repeat">معدل تكرار الشراء</SelectItem>
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

      {/* إحصائيات العملاء */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي العملاء</p>
                <h3 className="text-2xl font-semibold">
                  {customerStats.totalCustomers}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-gray-600">العملاء الجدد</p>
                <h3 className="text-2xl font-semibold">
                  {customerStats.newCustomers}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-full text-white">
                <Repeat size={24} />
              </div>
              <div>
                <p className="text-gray-600">معدل تكرار الشراء</p>
                <h3 className="text-2xl font-semibold">
                  {customerStats.repeatRate}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="active">العملاء الأكثر نشاطاً</TabsTrigger>
          <TabsTrigger value="new">العملاء الجدد</TabsTrigger>
          <TabsTrigger value="repeat">معدل تكرار الشراء</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">العملاء الأكثر نشاطاً</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي الإنفاق</TableHead>
                  <TableHead>متوسط قيمة الطلب</TableHead>
                  <TableHead>آخر طلب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>{customer.totalSpent} ريال</TableCell>
                    <TableCell>{customer.averageOrderValue} ريال</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="new">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold">العملاء الجدد</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>تاريخ الانضمام</TableHead>
                  <TableHead>أول طلب</TableHead>
                  <TableHead>قيمة الطلب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.joinDate}</TableCell>
                    <TableCell>{customer.firstOrder}</TableCell>
                    <TableCell>{customer.orderValue} ريال</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="repeat">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Repeat className="text-purple-500" size={24} />
              <h2 className="text-xl font-semibold">معدل تكرار الشراء</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>متوسط الفترة بين الطلبات</TableHead>
                  <TableHead>آخر طلب</TableHead>
                  <TableHead>إجمالي الإنفاق</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repeatCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>{customer.frequency} يوم</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell>{customer.totalSpent} ريال</TableCell>
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
