"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Search,
  Plus,
  Warehouse,
  User,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  FileText,
  Eye,
  MapPin,
  Paperclip,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";
import Label from "@/components/ui/Label";
import AddWarehouseDialog from "../../../../../Components/AddWarehouseDialog";
import { warehouseStatusColors } from "../../../../../utils";
import { usePathname } from "next/navigation";

// تعريف أنواع البيانات
interface DigitalItem {
  id: string;
  name: string;
  type: "code" | "account" | "url" | "file";
  value: string;
  expiryDate?: string;
  isUsed: boolean;
  createdAt: string;
  additionalInfo?: {
    username?: string;
    password?: string;
    loginUrl?: string;
  };
}

interface CustomField {
  id: string;
  name: string;
  value: string;
  type: "text" | "date" | "number" | "url" | "file";
}

interface DigitalWarehouse {
  id: string;
  name: string;
  description?: string;
  manager: {
    name: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  items: DigitalItem[];
  totalItems: number;
  usedItems: number;
  availableItems: number;
  status: "available" | "low" | "unavailable";
  customFields: CustomField[];
}

// بيانات وهمية للمستودعات الرقمية
const dummyDigitalWarehouses: DigitalWarehouse[] = [
  {
    id: "dw1",
    name: "مخزن أكواد الترخيص",
    description: "مخزن لأكواد تفعيل البرامج والتطبيقات",
    manager: {
      name: "أحمد محمد",
      phone: "+966501234567",
    },
    createdAt: "2023-01-15",
    updatedAt: "2023-06-20",
    items: [
      {
        id: "di1",
        name: "كود ترخيص برنامج أوفيس",
        type: "code",
        value: "XXXX-YYYY-ZZZZ-AAAA",
        expiryDate: "2024-12-31",
        isUsed: false,
        createdAt: "2023-02-10",
      },
      {
        id: "di2",
        name: "كود ترخيص برنامج فوتوشوب",
        type: "code",
        value: "AAAA-BBBB-CCCC-DDDD",
        expiryDate: "2024-10-15",
        isUsed: true,
        createdAt: "2023-03-05",
      },
    ],
    totalItems: 2,
    usedItems: 1,
    availableItems: 1,
    status: "available",
    customFields: [
      {
        id: "cf1",
        name: "مصدر الأكواد",
        value: "موزع معتمد",
        type: "text",
      },
    ],
  },
  {
    id: "dw2",
    name: "مخزن حسابات الاشتراكات",
    description: "مخزن لحسابات المستخدمين للخدمات المدفوعة",
    manager: {
      name: "سارة عبدالله",
      phone: "+966512345678",
    },
    createdAt: "2023-03-10",
    updatedAt: "2023-07-05",
    items: [
      {
        id: "di3",
        name: "حساب نتفلكس بريميوم",
        type: "account",
        value: "حساب مشترك",
        expiryDate: "2024-08-20",
        isUsed: false,
        createdAt: "2023-04-15",
        additionalInfo: {
          username: "user123",
          password: "pass123",
          loginUrl: "https://netflix.com/login",
        },
      },
    ],
    totalItems: 1,
    usedItems: 0,
    availableItems: 1,
    status: "low",
    customFields: [],
  },
  {
    id: "dw3",
    name: "مخزن روابط التحميل",
    description: "مخزن لروابط تحميل الملفات الرقمية",
    manager: {
      name: "خالد العمري",
      phone: "+966523456789",
    },
    createdAt: "2023-05-20",
    updatedAt: "2023-08-15",
    items: [],
    totalItems: 0,
    usedItems: 0,
    availableItems: 0,
    status: "unavailable",
    customFields: [
      {
        id: "cf2",
        name: "مزود الخدمة",
        value: "أمازون S3",
        type: "text",
      },
    ],
  },
];

// تعريف متغيرات الحركة للانيميشن
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

export default function DigitalWarehousesPage() {
  const [warehouses, setWarehouses] = useState<DigitalWarehouse[]>(
    dummyDigitalWarehouses
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddWarehouseDialogOpen, setIsAddWarehouseDialogOpen] =
    useState(false);

  // فلترة المستودعات حسب البحث
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // دالة إضافة مستودع جديد
  const handleAddWarehouse = (data: any) => {
    const newWarehouse: DigitalWarehouse = {
      id: `dw${warehouses.length + 1}`,
      name: data.name || "مستودع رقمي جديد",
      description: data.description || "",
      manager: {
        name: data.manager || "مدير المستودع",
        phone: data.phone || "",
      },
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      items: [],
      totalItems: 0,
      usedItems: 0,
      availableItems: 0,
      status: "available",
      customFields: [],
    };

    setWarehouses([...warehouses, newWarehouse]);
    toast.success("تم إضافة المستودع الرقمي بنجاح");
    setIsAddWarehouseDialogOpen(false);
  };

  // // دالة حذف مستودع
  // const handleDeleteWarehouse = (warehouseId: string) => {
  //   setWarehouses(warehouses.filter((w) => w.id !== warehouseId));
  //   toast.success("تم حذف المستودع بنجاح");
  // };

  // // دالة إضافة حقل مخصص
  // const handleAddCustomField = (
  //   warehouseId: string,
  //   field: Partial<CustomField>
  // ) => {
  //   const newField: CustomField = {
  //     id: `cf${Math.random().toString(36).substr(2, 9)}`,
  //     name: field.name || "حقل جديد",
  //     value: field.value || "",
  //     type: field.type || "text",
  //   };

  //   setWarehouses(
  //     warehouses.map((warehouse) => {
  //       if (warehouse.id === warehouseId) {
  //         return {
  //           ...warehouse,
  //           customFields: [...warehouse.customFields, newField],
  //           updatedAt: new Date().toISOString().split("T")[0],
  //         };
  //       }
  //       return warehouse;
  //     })
  //   );

  //   toast.success("تم إضافة الحقل المخصص بنجاح");
  //   setIsAddCustomFieldDialogOpen(false);
  // };

  // // دالة حذف حقل مخصص
  // const handleDeleteCustomField = (warehouseId: string, fieldId: string) => {
  //   setWarehouses(
  //     warehouses.map((warehouse) => {
  //       if (warehouse.id === warehouseId) {
  //         return {
  //           ...warehouse,
  //           customFields: warehouse.customFields.filter(
  //             (field) => field.id !== fieldId
  //           ),
  //           updatedAt: new Date().toISOString().split("T")[0],
  //         };
  //       }
  //       return warehouse;
  //     })
  //   );

  //   toast.success("تم حذف الحقل المخصص بنجاح");
  // };

  // الحصول على لون حالة المستودع
  const getStatusColor = (status: "available" | "low" | "unavailable") => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // الحصول على نص حالة المستودع
  const getStatusText = (status: "available" | "low" | "unavailable") => {
    switch (status) {
      case "available":
        return "متاح";
      case "low":
        return "منخفض";
      case "unavailable":
        return "غير متوفر";
      default:
        return "غير معروف";
    }
  };

  // الحصول على أيقونة حالة المستودع
  const getStatusIcon = (status: "available" | "low" | "unavailable") => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />;
      case "low":
        return <AlertCircle className="w-4 h-4" />;
      case "unavailable":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const pathname = usePathname();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">المستودعات الرقمية</h1>
        <Button
          onClick={() => setIsAddWarehouseDialogOpen(true)}
          variant={"primary"}
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة مستودع جديد
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث في المستودعات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        {filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((warehouse) => (
            <Link
              href={`${pathname}/${warehouse.id}`}
              as={`/seller/1/dashboard/products/digital/warehouses/${warehouse.id}`}
              key={warehouse.id}
            >
              <Card className="h-full hover:border-primary transition-all cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">
                        {warehouse.name}
                      </CardTitle>
                    </div>
                    <div
                      className={`${
                        warehouseStatusColors[warehouse.status].bg
                      } ${
                        warehouseStatusColors[warehouse.status].text
                      } px-3 py-1 rounded-full text-sm flex items-center gap-2`}
                    >
                      {warehouseStatusColors[warehouse.status].label}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{warehouse.manager.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{warehouse.createdAt}</span>
                    </div>
                  </div>

                  {warehouse.customFields && warehouse.customFields[0] && (
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">
                          {warehouse.customFields[0].name}:{" "}
                          {warehouse.customFields[0].value}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>لا توجد مستودعات مطابقة</p>
          </div>
        )}
      </motion.div>

      <AddWarehouseDialog
        setOpen={setIsAddWarehouseDialogOpen}
        open={isAddWarehouseDialogOpen}
        onSubmit={handleAddWarehouse}
      />
    </motion.div>
  );
}
