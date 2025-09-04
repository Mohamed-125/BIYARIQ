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
  MapPin,
  User,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  FileText,
  Paperclip,
} from "lucide-react";
import Badge from "../../../../../../components/ui/Badge";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../../../components/ui/Dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../../../components/ui/Table";
import Label from "@/components/ui/Label";
import { Product } from "../../../../../../context/CartContext";
import { div } from "framer-motion/client";
import AddWarehouseDialog from "../../../../Components/AddWarehouseDialog";
import { bg } from "date-fns/locale";
import { formatDate } from "../../../../utils";
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

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(dummyWarehouses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddWarehouseDialogOpen, setIsAddWarehouseDialogOpen] =
    useState(false);

  // اختيار مستودع
  const handleSelectWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  // إضافة مستودع جديد
  const handleAddWarehouse = (
    newWarehouse: Omit<
      Warehouse,
      | "id"
      | "products"
      | "totalQuantity"
      | "status"
      | "createdAt"
      | "updatedAt"
      | "customFields"
    >
  ) => {
    const now = new Date().toISOString().split("T")[0];
    const warehouse: Warehouse = {
      id: `w${warehouses.length + 1}`,
      ...newWarehouse,
      products: [],
      totalQuantity: 0,
      status: "available",
      createdAt: now,
      updatedAt: now,
      customFields: [],
    };

    setWarehouses([...warehouses, warehouse]);
    setIsAddWarehouseDialogOpen(false);
    toast.success(`تم إضافة المستودع ${warehouse.name} بنجاح`);
  };

  // فلترة المستودعات حسب البحث
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المستودعات المادية</h1>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredWarehouses.map((warehouse) => (
          <motion.div key={warehouse.id} variants={itemVariants}>
            <Link
              href={`/seller/1/dashboard/manage-physical-products/physical-warehouses/${warehouse.id}`}
            >
              <Card className="cursor-pointer  !border-gray-300 transition-colors">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{warehouse.name}</CardTitle>
                    <div
                      className={`${statusColors[warehouse.status].bg} ${
                        statusColors[warehouse.status].text
                      } px-3 py-1 rounded-full text-sm flex items-center gap-2`}
                    >
                      {statusColors[warehouse.status].label}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {warehouse.location.city}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    {warehouse.manager.name}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    {warehouse.totalQuantity} منتج
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(warehouse.createdAt)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <AddWarehouseDialog
        setOpen={setIsAddWarehouseDialogOpen}
        open={isAddWarehouseDialogOpen}
        onSubmit={handleAddWarehouse}
      />
    </div>
  );
}
