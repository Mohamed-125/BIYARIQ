"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  FileSpreadsheet,
  FilePdf,
  FileText,
  Filter,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
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

interface ExportHistory {
  id: string;
  type: string;
  format: string;
  dateRange: string;
  createdAt: string;
  status: string;
}

export default function ExportReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [reportType, setReportType] = useState("");
  const [exportFormat, setExportFormat] = useState("");

  const exportHistory: ExportHistory[] = [
    {
      id: "EXP-001",
      type: "تقرير المبيعات",
      format: "PDF",
      dateRange: "01/03/2024 - 15/03/2024",
      createdAt: "2024-03-15",
      status: "مكتمل",
    },
    {
      id: "EXP-002",
      type: "تقرير المخزون",
      format: "Excel",
      dateRange: "01/02/2024 - 29/02/2024",
      createdAt: "2024-03-14",
      status: "مكتمل",
    },
    {
      id: "EXP-003",
      type: "تقرير العملاء",
      format: "PDF",
      dateRange: "01/01/2024 - 31/01/2024",
      createdAt: "2024-03-13",
      status: "مكتمل",
    },
  ];

  const handleExport = () => {
    // تنفيذ عملية التصدير
    console.log("تصدير التقرير...", {
      reportType,
      exportFormat,
      dateRange,
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تصدير التقارير</h1>
      </div>

      {/* نموذج التصدير */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>نوع التقرير</Label>
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">تقرير المبيعات</SelectItem>
                  <SelectItem value="orders">تقرير الطلبات</SelectItem>
                  <SelectItem value="inventory">تقرير المخزون</SelectItem>
                  <SelectItem value="customers">تقرير العملاء</SelectItem>
                  <SelectItem value="profits">تقرير الأرباح</SelectItem>
                  <SelectItem value="returns">تقرير المرتجعات</SelectItem>
                  <SelectItem value="ratings">تقرير التقييمات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>تنسيق التصدير</Label>
              <Select
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر تنسيق التصدير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FilePdf size={16} />
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
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
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
            disabled={!reportType || !exportFormat || !dateRange.from || !dateRange.to}
          >
            <Download size={16} />
            تصدير التقرير
          </Button>
        </div>
      </motion.div>

      {/* سجل التصدير */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">سجل التصدير</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم التصدير</TableHead>
              <TableHead>نوع التقرير</TableHead>
              <TableHead>التنسيق</TableHead>
              <TableHead>النطاق الزمني</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exportHistory.map((export_, index) => (
              <TableRow key={index}>
                <TableCell>{export_.id}</TableCell>
                <TableCell>{export_.type}</TableCell>
                <TableCell>{export_.format}</TableCell>
                <TableCell>{export_.dateRange}</TableCell>
                <TableCell>{export_.createdAt}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {export_.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Download size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}