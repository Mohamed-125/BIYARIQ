"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowLeft,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  FileUp,
  FileDown,
  User,
  Calendar,
  Clock,
  Info,
  Filter,
  MoreVertical,
  History,
  MapPin,
  Save,
  X,
  FileText,
  Paperclip,
  Link2,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import AddCustomFieldDialog from "../../../../../Components/AddCustomFieldDialog";
import AddWarehouseDialog from "../../../../../Components/AddWarehouseDialog";
import { formatDate } from "../../../../../utils";

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
  availableItems: number;
  usedItems: number;
  status: "available" | "low" | "unavailable";
  customFields: CustomField[];
}

// بيانات وهمية للمستودعات
const dummyDigitalWarehouses: DigitalWarehouse[] = [
  {
    id: "dw1",
    name: "مستودع الأكواد",
    description: "مستودع لتخزين أكواد التفعيل والتراخيص",
    manager: {
      name: "أحمد محمد",
      phone: "+966501234567",
    },
    createdAt: "2023-01-15",
    updatedAt: "2023-06-20",
    items: [
      {
        id: "i1",
        name: "كود تفعيل برنامج 1",
        type: "code",
        value: "XXXX-YYYY-ZZZZ",
        isUsed: false,
        createdAt: "2023-01-15",
      },
      {
        id: "i2",
        name: "حساب خدمة س",
        type: "account",
        value: "premium_account_1",
        isUsed: true,
        createdAt: "2023-01-20",
        additionalInfo: {
          username: "user123",
          password: "********",
          loginUrl: "https://example.com/login",
        },
      },
    ],
    totalItems: 10,
    availableItems: 8,
    usedItems: 2,
    status: "available",
    customFields: [
      {
        id: "cf1",
        name: "نوع المنتج",
        value: "برمجيات",
        type: "text",
      },
    ],
  },
];

// أنماط الحركة
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

const statusColors = {
  available: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "متوفر",
    icon: CheckCircle,
  },
  low: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "مخزون منخفض",
    icon: AlertCircle,
  },
  unavailable: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "غير متوفر",
    icon: XCircle,
  },
};

export default function DigitalWarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.warehouseId as string;

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditWarehouseDialogOpen, setIsEditWarehouseDialogOpen] =
    useState(false);
  const [isAddCustomFieldDialogOpen, setIsAddCustomFieldDialogOpen] =
    useState(false);
  const [isEditCustomFieldDialogOpen, setIsEditCustomFieldDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [editingCustomField, setEditingCustomField] =
    useState<CustomField | null>(null);
  const [warehouse, setWarehouse] = useState<DigitalWarehouse | null>(null);

  // الحصول على بيانات المستودع
  useEffect(() => {
    const foundWarehouse = dummyDigitalWarehouses.find(
      (w) => w.id === warehouseId
    );
    if (foundWarehouse) {
      setWarehouse(foundWarehouse);
    } else {
    }
  }, [warehouseId, router]);

  // التحقق من وجود المستودع
  if (!warehouse) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AlertCircle className="text-red-500 mr-2" size={24} />
        <p>المستودع غير موجود</p>
      </div>
    );
  }

  // فلترة العناصر بناءً على البحث
  const filteredItems = warehouse.items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حذف حقل مخصص
  const handleDeleteCustomField = (id: string) => {
    const updatedCustomFields = warehouse.customFields.filter(
      (field) => field.id !== id
    );

    const updatedWarehouse = {
      ...warehouse,
      customFields: updatedCustomFields,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setWarehouse(updatedWarehouse);
    toast.success("تم حذف الحقل المخصص بنجاح");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/seller/1/dashboard/manage-digital-products/digital-warehouses"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{warehouse.name}</h1>
          <Badge
            className={`${statusColors[warehouse.status].bg} ${
              statusColors[warehouse.status].text
            }`}
          >
            {statusColors[warehouse.status].label}
          </Badge>
        </div>
        <Button
          onClick={() => setIsEditWarehouseDialogOpen(true)}
          variant="outline"
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          تحرير المستودع
        </Button>
      </div>

      <AddWarehouseDialog
        setOpen={setIsEditWarehouseDialogOpen}
        open={isEditWarehouseDialogOpen}
        onSubmit={() => {}}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="items" className="text-sm">
            العناصر
          </TabsTrigger>
          <TabsTrigger value="details" className="text-sm">
            تفاصيل المستودع
          </TabsTrigger>
          <TabsTrigger value="custom-fields" className="text-sm">
            الحقول المخصصة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في العناصر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="direction-rtl"
            >
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العنصر</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">القيمة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                            {item.type === "code" ? (
                              <FileText className="w-6 h-6 text-gray-500" />
                            ) : item.type === "account" ? (
                              <User className="w-6 h-6 text-gray-500" />
                            ) : item.type === "url" ? (
                              <Link2 className="w-6 h-6 text-gray-500" />
                            ) : (
                              <FileText className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.type === "code"
                          ? "كود"
                          : item.type === "account"
                          ? "حساب"
                          : item.type === "url"
                          ? "رابط"
                          : "ملف"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.type === "url" ? (
                          <a
                            href={item.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : item.type === "file" ? (
                          <a
                            href={item.value}
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            عرض الملف
                          </a>
                        ) : (
                          <span>{item.value}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={item.isUsed ? "destructive" : "success"}
                          className="text-xs"
                        >
                          {item.isUsed ? "مستخدم" : "متاح"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-row-reverse items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                لا توجد عناصر
              </h3>
              <p className="text-gray-500 mb-4">
                لم يتم إضافة أي عناصر إلى هذا المستودع بعد.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-end">
                  <Info className="w-5 h-5" />
                  معلومات المستودع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>اسم المستودع</Label>
                  <p className="mt-1">{warehouse.name}</p>
                </div>
                {warehouse.description && (
                  <div>
                    <Label>الوصف</Label>
                    <p className="mt-1">{warehouse.description}</p>
                  </div>
                )}
                <div>
                  <Label>تاريخ الإنشاء</Label>
                  <p className="mt-1">{formatDate(warehouse.createdAt)}</p>
                </div>
                <div>
                  <Label>آخر تحديث</Label>
                  <p className="mt-1">{formatDate(warehouse.updatedAt)}</p>
                </div>
                <div>
                  <Label>إجمالي العناصر</Label>
                  <p className="mt-1">{warehouse.totalItems}</p>
                </div>
                <div>
                  <Label>العناصر المتاحة</Label>
                  <p className="mt-1">{warehouse.availableItems}</p>
                </div>
                <div>
                  <Label>العناصر المستخدمة</Label>
                  <p className="mt-1">{warehouse.usedItems}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-end">
                  <User className="w-5 h-5" />
                  معلومات المسؤول
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>اسم المسؤول</Label>
                  <p className="mt-1">{warehouse.manager.name}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p className="mt-1">{warehouse.manager.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom-fields" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">الحقول المخصصة</h3>
            <Button onClick={() => setIsAddCustomFieldDialogOpen(true)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة حقل مخصص
            </Button>
          </div>

          {warehouse.customFields.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {warehouse.customFields.map((field) => (
                <motion.div className="" key={field.id} variants={itemVariants}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <Label>{field.name}</Label>
                          <div className="mt-1">
                            {field.type === "url" ? (
                              <a
                                href={field.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {field.value}
                              </a>
                            ) : field.type === "file" ? (
                              <a
                                href={field.value}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <FileText className="w-4 h-4" />
                                عرض الملف
                              </a>
                            ) : (
                              <p>{field.value}</p>
                            )}
                          </div>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {field.type === "text"
                                ? "نص"
                                : field.type === "date"
                                ? "تاريخ"
                                : field.type === "number"
                                ? "رقم"
                                : field.type === "url"
                                ? "رابط"
                                : "ملف"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingCustomField(field);
                              setIsAddCustomFieldDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCustomField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                لا توجد حقول مخصصة
              </h3>
              <p className="text-gray-500 mb-4">
                لم يتم إضافة أي حقول مخصصة لهذا المستودع بعد.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddCustomFieldDialog
        open={isAddCustomFieldDialogOpen}
        setOpen={setIsAddCustomFieldDialogOpen}
        setWarehouse={setWarehouse}
        warehouse={warehouse}
        onSubmit={() => {}}
      />
    </div>
  );
}
