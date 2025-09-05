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

// تعريف أنواع البيانات
interface Product {
  id: string;
  name: string;
  image: string;
  sku: string;
  quantity: number;
  batchNumber?: string;
  serialNumber?: string;
  expiryDate?: string;
  unitOfMeasure?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
}

interface CustomField {
  id: string;
  name: string;
  value: string;
  type: "text" | "date" | "number" | "url" | "file";
}

interface Warehouse {
  id: string;
  name: string;
  description?: string;
  location: {
    city: string;
    address: string;
  };
  manager: {
    name: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  products: Product[];
  totalQuantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  status: "available" | "low" | "unavailable";
  customFields: CustomField[];
}

// بيانات وهمية للمستودعات
const dummyWarehouses: Warehouse[] = [
  {
    id: "w1",
    name: "المستودع الرئيسي",
    description: "المستودع الرئيسي للمنتجات الإلكترونية",
    location: {
      city: "الرياض",
      address: "حي العليا، شارع التخصصي",
    },
    manager: {
      name: "أحمد محمد",
      phone: "+966501234567",
    },
    createdAt: "2023-01-15",
    updatedAt: "2023-06-20",
    products: [
      {
        id: "p1",
        name: "سماعات لاسلكية",
        image: "/images/products/headphones.jpg",
        sku: "HDP-001",
        quantity: 50,
        batchNumber: "B2023-01",
        minStockLevel: 10,
        maxStockLevel: 100,
        unitOfMeasure: "قطعة",
      },
      {
        id: "p2",
        name: "شاحن سريع",
        image: "/images/products/charger.jpg",
        sku: "CHG-002",
        quantity: 8,
        batchNumber: "B2023-02",
        minStockLevel: 15,
        maxStockLevel: 80,
        unitOfMeasure: "قطعة",
      },
    ],
    totalQuantity: 58,
    minStockLevel: 20,
    maxStockLevel: 200,
    status: "available",
    customFields: [
      {
        id: "cf1",
        name: "رقم الترخيص",
        value: "LIC-2023-456",
        type: "text",
      },
    ],
  },
  {
    id: "w2",
    name: "مستودع الملابس",
    description: "مستودع خاص بالملابس والأزياء",
    location: {
      city: "جدة",
      address: "حي الروضة، شارع فلسطين",
    },
    manager: {
      name: "سارة عبدالله",
      phone: "+966512345678",
    },
    createdAt: "2023-03-10",
    updatedAt: "2023-07-05",
    products: [
      {
        id: "p3",
        name: "قميص قطني",
        image: "/images/products/shirt.jpg",
        sku: "SHT-001",
        quantity: 5,
        batchNumber: "B2023-03",
        minStockLevel: 20,
        maxStockLevel: 150,
        unitOfMeasure: "قطعة",
      },
    ],
    totalQuantity: 5,
    minStockLevel: 30,
    maxStockLevel: 300,
    status: "low",
    customFields: [],
  },
  {
    id: "w3",
    name: "مستودع الأجهزة المنزلية",
    description: "مستودع للأجهزة المنزلية والكهربائية",
    location: {
      city: "الدمام",
      address: "حي النزهة، طريق الملك فهد",
    },
    manager: {
      name: "خالد العمري",
      phone: "+966523456789",
    },
    createdAt: "2023-05-20",
    updatedAt: "2023-08-15",
    products: [],
    totalQuantity: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    status: "unavailable",
    customFields: [
      {
        id: "cf2",
        name: "شهادة السلامة",
        value: "https://example.com/safety-cert",
        type: "url",
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

export default function WarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.warehouseId as string;

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditWarehouseDialogOpen, setIsEditWarehouseDialogOpen] =
    useState(false);
  const [isAddCustomFieldDialogOpen, setIsAddCustomFieldDialogOpen] =
    useState(false);
  const [isEditCustomFieldDialogOpen, setIsEditCustomFieldDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [editingCustomField, setEditingCustomField] =
    useState<CustomField | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);

  // الحصول على بيانات المستودع
  useEffect(() => {
    const foundWarehouse = dummyWarehouses.find((w) => w.id === warehouseId);
    if (foundWarehouse) {
      setWarehouse(foundWarehouse);
    } else {
      router.push(
        "/seller/1/dashboard/manage-physical-products/physical-warehouses"
      );
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

  // فلترة المنتجات بناءً على البحث
  const filteredProducts = warehouse.products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // تنسيق التاريخ
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

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
            href="/seller/1/dashboard/manage-physical-products/physical-warehouses"
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
          <TabsTrigger value="products" className="text-sm">
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="details" className="text-sm">
            تفاصيل المستودع
          </TabsTrigger>
          <TabsTrigger value="custom-fields" className="text-sm">
            الحقول المخصصة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="direction-rtl"
            >
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">الرمز التعريفي</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">رقم الدفعة</TableHead>
                    <TableHead className="text-right">وحدة القياس</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {product.sku}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.quantity <= (product.minStockLevel || 0)
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {product.batchNumber || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.unitOfMeasure || "-"}
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
                لا توجد منتجات
              </h3>
              <p className="text-gray-500 mb-4">
                لم يتم إضافة أي منتجات إلى هذا المستودع بعد.
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
                  <Label>الحد الأدنى للمخزون</Label>
                  <p className="mt-1">{warehouse.minStockLevel || "-"}</p>
                </div>
                <div>
                  <Label>الحد الأقصى للمخزون</Label>
                  <p className="mt-1">{warehouse.maxStockLevel || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-end">
                  <MapPin className="w-5 h-5" />
                  الموقع والمسؤول
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div>
                  <Label>المدينة</Label>
                  <p className="mt-1">{warehouse.location.city}</p>
                </div>
                <div>
                  <Label>العنوان</Label>
                  <p className="mt-1">{warehouse.location.address}</p>
                </div>
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
              <Paperclip className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                لا توجد حقول مخصصة
              </h3>
              <p className="text-gray-500 mb-4">
                يمكنك إضافة حقول مخصصة لتخزين معلومات إضافية عن المستودع.
              </p>
              <Button
                onClick={() => setIsAddCustomFieldDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة حقل مخصص
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddCustomFieldDialog
        isAddCustomFieldDialogOpen={isAddCustomFieldDialogOpen}
        setWarehouse={setWarehouse}
        warehouse={warehouse}
        setIsAddCustomFieldDialogOpen={setIsAddCustomFieldDialogOpen}
      />
    </div>
  );
}
