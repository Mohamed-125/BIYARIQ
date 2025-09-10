"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
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

interface ProfitSummary {
  date: string;
  grossProfit: number;
  commission: number;
  netProfit: number;
}

interface CommissionDetails {
  category: string;
  rate: number;
  amount: number;
  commission: number;
}

export default function ProfitsReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const profitSummary: ProfitSummary[] = [
    {
      date: "2024-03-15",
      grossProfit: 5000,
      commission: 750,
      netProfit: 4250,
    },
    {
      date: "2024-03-14",
      grossProfit: 4200,
      commission: 630,
      netProfit: 3570,
    },
    {
      date: "2024-03-13",
      grossProfit: 6300,
      commission: 945,
      netProfit: 5355,
    },
  ];

  const commissionDetails: CommissionDetails[] = [
    {
      category: "الإلكترونيات",
      rate: 15,
      amount: 15000,
      commission: 2250,
    },
    {
      category: "الملابس",
      rate: 12,
      amount: 12000,
      commission: 1440,
    },
    {
      category: "الأحذية",
      rate: 12,
      amount: 8000,
      commission: 960,
    },
  ];

  const totalStats = {
    grossProfit: 35000,
    commission: 4650,
    netProfit: 30350,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير الأرباح والعمولات</h1>
        <Button
          variant="outline"
          onClick={() => {
            setIsExportDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          تصدير التقرير
        </Button>
        <Dialog open={isExportDialogOpen} setOpen={setIsExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تصدير التقرير</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>نوع التقرير</Label>
                <Select value={exportTab} onValueChange={setExportTab}>
                  <SelectItem value="profit-summary">ملخص الأرباح</SelectItem>
                  <SelectItem value="commission-details">
                    تفاصيل العمولات
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

      {/* ملخص الأرباح */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي الأرباح</p>
                <h3 className="text-2xl font-semibold">
                  {totalStats.grossProfit} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <Percent size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي العمولات</p>
                <h3 className="text-2xl font-semibold">
                  {totalStats.commission} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-600">صافي الأرباح</p>
                <h3 className="text-2xl font-semibold">
                  {totalStats.netProfit} ريال
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="profit-summary" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="profit-summary">ملخص الأرباح</TabsTrigger>
          <TabsTrigger value="commission-details">تفاصيل العمولات</TabsTrigger>
        </TabsList>

        <TabsContent value="profit-summary">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>إجمالي الأرباح</TableHead>
                  <TableHead>العمولات</TableHead>
                  <TableHead>صافي الأرباح</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitSummary.map((summary, index) => (
                  <TableRow key={index}>
                    <TableCell>{summary.date}</TableCell>
                    <TableCell>{summary.grossProfit} ريال</TableCell>
                    <TableCell>{summary.commission} ريال</TableCell>
                    <TableCell>{summary.netProfit} ريال</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="commission-details">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الفئة</TableHead>
                  <TableHead>نسبة العمولة</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                  <TableHead>قيمة العمولة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail.category}</TableCell>
                    <TableCell>{detail.rate}%</TableCell>
                    <TableCell>{detail.amount} ريال</TableCell>
                    <TableCell>{detail.commission} ريال</TableCell>
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
