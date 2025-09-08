"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import {
  FileText,
  Plus,
  Printer,
  Download,
  Trash2,
  Filter,
  Calendar,
} from "lucide-react";
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
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { toast } from "sonner";
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

interface Report {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: "completed" | "processing" | "failed";
  downloadUrl?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "تقرير المبيعات الشهري",
      type: "sales",
      createdAt: "2024-03-15",
      status: "completed",
      downloadUrl: "/reports/sales-march-2024.pdf",
    },
    {
      id: "2",
      title: "تقرير المخزون",
      type: "inventory",
      createdAt: "2024-03-14",
      status: "completed",
      downloadUrl: "/reports/inventory-march-2024.pdf",
    },
  ]);

  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const handleCreateReport = () => {
    if (!selectedReportType || !dateRange.from || !dateRange.to) {
      toast.error("الرجاء تحديد نوع التقرير والفترة الزمنية");
      return;
    }

    const newReport: Report = {
      id: `${reports.length + 1}`,
      title: `تقرير ${getReportTypeName(selectedReportType)}`,
      type: selectedReportType,
      createdAt: new Date().toISOString().split("T")[0],
      status: "processing",
    };

    setReports([newReport, ...reports]);
    setIsCreateReportOpen(false);
    toast.success("تم بدء إنشاء التقرير");

    // محاكاة اكتمال إنشاء التقرير بعد ثانيتين
    setTimeout(() => {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === newReport.id
            ? {
                ...report,
                status: "completed",
                downloadUrl: `/reports/${report.type}-${report.createdAt}.pdf`,
              }
            : report
        )
      );
      toast.success("تم إنشاء التقرير بنجاح");
    }, 2000);
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter((report) => report.id !== reportId));
    toast.success("تم حذف التقرير");
  };

  const getReportTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      sales: "المبيعات",
      inventory: "المخزون",
      orders: "الطلبات",
      profits: "الأرباح والعمولات",
      products: "المنتجات",
      returns: "المرتجعات",
      ratings: "التقييمات",
      customers: "العملاء",
    };
    return types[type] || type;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6 print:space-y-0"
    >
      <style>{printStyles}</style>
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center no-print">
        <h1 className="text-2xl font-bold">إدارة التقارير</h1>
        <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              إنشاء تقرير جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء تقرير جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>نوع التقرير</Label>
                <Select
                  value={selectedReportType}
                  onValueChange={setSelectedReportType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التقرير" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">تقرير المبيعات</SelectItem>
                    <SelectItem value="inventory">تقرير المخزون</SelectItem>
                    <SelectItem value="orders">تقرير الطلبات</SelectItem>
                    <SelectItem value="profits">
                      تقرير الأرباح والعمولات
                    </SelectItem>
                    <SelectItem value="products">تقرير المنتجات</SelectItem>
                    <SelectItem value="returns">تقرير المرتجعات</SelectItem>
                    <SelectItem value="ratings">تقرير التقييمات</SelectItem>
                    <SelectItem value="customers">تقرير العملاء</SelectItem>
                  </SelectContent>
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
                onClick={handleCreateReport}
                className="w-full flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                إنشاء التقرير
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full no-print">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="profits">الأرباح</TabsTrigger>
          <TabsTrigger value="products">المنتجات</TabsTrigger>
        </TabsList>

        <TabsList className="grid grid-cols-5 w-full mt-2 no-print">
          <TabsTrigger value="returns">المرتجعات</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="ratings">التقييمات</TabsTrigger>
          <TabsTrigger value="customers">العملاء</TabsTrigger>
          <TabsTrigger value="export">التصدير</TabsTrigger>
        </TabsList>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="profits">الأرباح</TabsTrigger>
          <TabsTrigger value="products">المنتجات</TabsTrigger>
        </TabsList>

        <TabsList className="grid grid-cols-5 w-full mt-2">
          <TabsTrigger value="returns">المرتجعات</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="ratings">التقييمات</TabsTrigger>
          <TabsTrigger value="customers">العملاء</TabsTrigger>
          <TabsTrigger value="export">التصدير</TabsTrigger>
        </TabsList>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان التقرير</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{getReportTypeName(report.type)}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        report.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : report.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.status === "completed"
                        ? "مكتمل"
                        : report.status === "processing"
                        ? "قيد المعالجة"
                        : "فشل"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {report.status === "completed" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.print()}
                          >
                            <Printer size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              window.open(report.downloadUrl, "_blank")
                            }
                          >
                            <Download size={16} />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
}