"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
  Package,
  AlertTriangle,
  Archive,
  TrendingDown,
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

interface InventoryProduct {
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  warehouse: string;
  lastUpdated: string;
}

interface LowStockProduct {
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  daysUntilStockout: number;
}

export default function InventoryReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [exportFormat, setExportFormat] = useState("");
  const [exportTab, setExportTab] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const inventoryProducts: InventoryProduct[] = [
    {
      name: "سماعات لاسلكية",
      sku: "HDP-001",
      quantity: 50,
      minQuantity: 20,
      warehouse: "المستودع الرئيسي",
      lastUpdated: "2024-03-15",
    },
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      quantity: 15,
      minQuantity: 25,
      warehouse: "المستودع الرئيسي",
      lastUpdated: "2024-03-14",
    },
    {
      name: "ساعة ذكية",
      sku: "WCH-003",
      quantity: 30,
      minQuantity: 15,
      warehouse: "المستودع الفرعي",
      lastUpdated: "2024-03-13",
    },
  ];

  const lowStockProducts: LowStockProduct[] = [
    {
      name: "حذاء رياضي",
      sku: "SHO-002",
      quantity: 15,
      minQuantity: 25,
      daysUntilStockout: 5,
    },
    {
      name: "قميص قطني",
      sku: "SHT-003",
      quantity: 8,
      minQuantity: 20,
      daysUntilStockout: 3,
    },
    {
      name: "حقيبة ظهر",
      sku: "BAG-001",
      quantity: 12,
      minQuantity: 15,
      daysUntilStockout: 7,
    },
  ];

  const inventoryStats = {
    totalProducts: 150,
    lowStockProducts: 12,
    outOfStockProducts: 5,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقارير المخزون</h1>
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
                  <SelectItem value="inventory">حالة المخزون</SelectItem>
                  <SelectItem value="low-stock">
                    المنتجات منخفضة المخزون
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

      {/* إحصائيات المخزون */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <Package size={24} />
              </div>
              <div>
                <p className="text-gray-600">إجمالي المنتجات</p>
                <h3 className="text-2xl font-semibold">
                  {inventoryStats.totalProducts}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-gray-600">منتجات منخفضة المخزون</p>
                <h3 className="text-2xl font-semibold">
                  {inventoryStats.lowStockProducts}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-full text-white">
                <Archive size={24} />
              </div>
              <div>
                <p className="text-gray-600">منتجات نفذت من المخزون</p>
                <h3 className="text-2xl font-semibold">
                  {inventoryStats.outOfStockProducts}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            حالة المخزون
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            المنتجات منخفضة المخزون
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الكمية المتوفرة</TableHead>
                  <TableHead>الحد الأدنى</TableHead>
                  <TableHead>المستودع</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell
                      className={`font-semibold ${
                        product.quantity < product.minQuantity
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {product.quantity}
                    </TableCell>
                    <TableCell>{product.minQuantity}</TableCell>
                    <TableCell>{product.warehouse}</TableCell>
                    <TableCell>{product.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="low-stock">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الكمية المتوفرة</TableHead>
                  <TableHead>الحد الأدنى</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product, index) => (
                  <TableRow key={index} className="text-right">
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-red-500 font-semibold">
                      {product.quantity}
                    </TableCell>
                    <TableCell>{product.minQuantity}</TableCell>
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
