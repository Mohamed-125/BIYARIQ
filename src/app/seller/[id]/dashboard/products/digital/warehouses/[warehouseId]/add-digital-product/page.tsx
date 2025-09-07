"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import Label from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ProductVariants } from "@/app/seller/Components/ProductVariants";

interface ImportedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  warehouse?: string;
  [key: string]: any;
}
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/ui/Button";
import {
  Upload,
  X,
  Plus,
  CheckCircle,
  Package,
  Search,
  User,
  Key,
  Clock,
  FileText,
  GraduationCap,
  Hash,
  Settings,
  File,
  Trash2,
} from "lucide-react";
import { Editor, EditorContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreatableSelect from "react-select/creatable";
import TipTapEditor from "@/components/TipTapEditor";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import * as XLSX from "xlsx";
import Papa from "papaparse";

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

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  minPurchaseAmount: number;
}

interface Variant {
  name: string;
  type: "text" | "number" | "date" | "color";
  value: string;
  quantity: number;
}

type DigitalProductType = "software" | "license" | "file" | "account";

interface DigitalProductFormData {
  // البيانات العامة
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  wholesalePrice: number;
  sellingPrice: number;
  profitMargin: number;
  discountPrice: number;
  currency: string;
  stockQuantity: number;
  allowBackorders: boolean;
  mainImage: FileList;
  additionalImages: FileList;
  videoLink: string;
  shortDescription: string;
  fullDescription: string;
  productType: DigitalProductType;

  // حقول البرامج
  software?: {
    version: string;
    systemRequirements: string;
    installationGuide: string;
    files: { file: File; description: string }[];
  };

  // حقول التراخيص
  license?: {
    codes: {
      code: string;
      isUsed: boolean;
      deviceLimit?: number;
      userLimit?: number;
      expiryDate?: string;
    }[];
    validityPeriod: string;
    activationInstructions: string;
  };

  // حقول الملفات
  digitalFiles: {
    file: File;
    description: string;
    format: string;
    size: number;
    downloadLimit?: number;
    expiryDate?: string;
  }[];

  // حقول الحسابات
  accounts: {
    username: string;
    password: string;
    platform: string;
    loginUrl: string;
    validityPeriod: string;
    features: string[];
    additionalInfo: string;
  }[];

  // حقول مشتركة
  accessPassword: string;
  expirationDate: string;
  warehouseId: string;
  variants: Variant[];
  coupons: Coupon[];

  // حقول الاستيراد
  importFile?: File;
  importType?: "csv" | "xlsx";
  importMapping?: {
    [key: string]: string;
  };
}

// واجهة المستودع الرقمي
import { WarehouseSelector } from "@/app/seller/Components/WarehouseSelector";
import { Warehouse } from "../physical/page";

interface DigitalWarehouse {
  isPrimary?: boolean;
  stock?: number;
  id: string;
  name: string;
  description: string;
  manager: {
    name: string;
    phone: string;
  };
  totalItems: number;
  availableItems: number;
}

export default function AddDigitalProductPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DigitalProductFormData>({
    defaultValues: {
      warehouseId: [],
      productType: "file",
      digitalFiles: [],
      codes: [],
      accounts: [],
      services: { serviceDetails: "", deliveryTime: "", requirements: "" },
    },
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  // تحديث إجمالي الكمية عند تغيير كميات المتغيرات
  useEffect(() => {
    if (variants.length > 0) {
      const newTotal = variants.reduce(
        (sum, variant) => sum + variant.quantity,
        0
      );
      setTotalQuantity(newTotal);
    }
  }, [variants]);
  const [selectedType, setSelectedType] = useState<DigitalProductType>("file");
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>(
    []
  );
  const [showImportDialog, setShowImportDialog] = useState(false);

  // إضافة مستودع (مع منع التكرار)
  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouses((prev) => {
      if (prev.some((w) => w.id === warehouse.id)) return prev; // لا تكرر
      return [
        ...prev,
        { ...warehouse, stock: 0, isPrimary: prev.length === 0 },
      ];
    });
  };

  const handleSaveImportedProducts = () => {
    const allProductsHaveWarehouse = importedProducts.every(
      (product) => product.warehouse
    );
    if (!allProductsHaveWarehouse) {
      toast.error("يرجى اختيار مستودع لجميع المنتجات");
      return;
    }
    console.log("Saving imported products:", importedProducts);
    toast.success("تم حفظ المنتجات بنجاح");
    setShowImportDialog(false);
    setImportedProducts([]);
  };

  const handleProductTypeChange = (type: DigitalProductType) => {
    setSelectedType(type);
    setValue("productType", type);
  };

  const handleImportFile = async (file: File) => {
    setValue("importFile", file);
    setValue("importType", file.name.endsWith(".xlsx") ? "xlsx" : "csv");

    // قراءة الملف وعرض البيانات
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        let data;
        if (file.name.endsWith(".xlsx")) {
          // استخدام مكتبة xlsx لقراءة ملفات Excel
          const XLSX = await import("xlsx");
          const workbook = XLSX.read(e.target?.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
          // استخدام مكتبة papaparse لقراءة ملفات CSV
          const Papa = await import("papaparse");
          const result = Papa.parse(e.target?.result as string, {
            header: true,
          });
          data = result.data;
        }

        // عرض البيانات للمستخدم وإتاحة اختيار المستودع لكل منتج
        console.log("Imported data:", data);
        toast.success(`تم استيراد ${data.length} منتج بنجاح`);

        // تحديث واجهة المستخدم لعرض المنتجات المستوردة
        // TODO: إضافة جدول لعرض المنتجات وإتاحة اختيار المستودع لكل منتج
      } catch (error) {
        console.error("Error importing file:", error);
        toast.error("حدث خطأ أثناء استيراد الملف");
      }
    };

    if (file.name.endsWith(".xlsx")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        description: "",
      }));
      setValue("digitalFiles", [...watch("digitalFiles"), ...newFiles]);
    }
  };

  const handleFileRemove = (index: number) => {
    const files = watch("digitalFiles");
    files.splice(index, 1);
    setValue("digitalFiles", files);
  };

  const handleCodeRemove = (index: number) => {
    const codes = watch("codes");
    codes.splice(index, 1);
    setValue("codes", codes);
  };

  const handleAccountRemove = (index: number) => {
    const accounts = watch("accounts");
    accounts.splice(index, 1);
    setValue("accounts", accounts);
  };

  const handleCodeAdd = () => {
    const codes = watch("codes");
    setValue("codes", [...codes, { code: "", isUsed: false }]);
  };

  const handleCodeChange = (index: number, value: string) => {
    const codes = watch("codes");
    codes[index].code = value;
    setValue("codes", codes);
  };

  const handleAccountAdd = () => {
    const accounts = watch("accounts");
    setValue("accounts", [
      ...accounts,
      { username: "", password: "", platform: "", additionalInfo: "" },
    ]);
  };

  const handleAccountChange = (
    index: number,
    field: keyof (typeof accounts)[0],
    value: string
  ) => {
    const accounts = watch("accounts");
    accounts[index][field] = value;
    setValue("accounts", accounts);
  };
  // قائمة المستودعات الرقمية المتاحة
  const [availableQuantity, setAvailableQuantity] = useState(0);
  // const [digitalWarehouses, setDigitalWarehouses] = useState<
  //   DigitalWarehouse[]
  // >([
  //   {
  //     id: "dw-1",
  //     name: "مستودع أكواد التفعيل",
  //     description: "مستودع خاص بأكواد تفعيل البرامج والتطبيقات",
  //     manager: {
  //       name: "محمد أحمد",
  //       phone: "+966512345678",
  //     },
  //     totalItems: 250,
  //     availableItems: 180,
  //   },
  //   {
  //     id: "dw-2",
  //     name: "مستودع الحسابات",
  //     description: "مستودع خاص بحسابات المواقع والخدمات",
  //     manager: {
  //       name: "سارة خالد",
  //       phone: "+966523456789",
  //     },
  //     totalItems: 120,
  //     availableItems: 75,
  //   },
  //   {
  //     id: "dw-3",
  //     name: "مستودع الملفات الرقمية",
  //     description: "مستودع خاص بالكتب الإلكترونية والملفات القابلة للتحميل",
  //     manager: {
  //       name: "فهد عبدالله",
  //       phone: "+966534567890",
  //     },
  //     totalItems: 350,
  //     availableItems: 320,
  //   },
  // ]);

  const [selectedWarehouses, setSelectedWarehouses] = useState<
    DigitalWarehouse[]
  >([]);

  // Calculate total stock from warehouses
  const calculateTotalStock = (warehouses: DigitalWarehouse[]) => {
    return warehouses.reduce(
      (total, warehouse) => total + (warehouse.stock || 0),
      0
    );
  };

  // Update available quantity when warehouses change
  useEffect(() => {
    if (selectedWarehouses.length > 0) {
      const totalStock = calculateTotalStock(selectedWarehouses);
      setAvailableQuantity(totalStock);
    }
  }, [selectedWarehouses]);

  // const handleWarehouseSelect = (warehouse: DigitalWarehouse) => {
  //   setSelectedWarehouses((prev) => [
  //     ...prev,
  //     { ...warehouse, stock: 0, isPrimary: prev.length === 0 },
  //   ]);
  // };

  const handleWarehouseRemove = (warehouseId: string) => {
    setSelectedWarehouses((prev) => {
      const newWarehouses = prev.filter((w) => w.id !== warehouseId);
      // If we removed the primary warehouse and there are other warehouses,
      // make the first one primary
      if (
        prev.find((w) => w.id === warehouseId)?.isPrimary &&
        newWarehouses.length > 0
      ) {
        newWarehouses[0].isPrimary = true;
      }
      return newWarehouses;
    });
  };

  const handlePrimaryWarehouseChange = (warehouseId: string) => {
    setSelectedWarehouses((prev) =>
      prev.map((w) => ({ ...w, isPrimary: w.id === warehouseId }))
    );
  };

  const handleStockChange = (warehouseId: string, stock: number) => {
    setSelectedWarehouses((prev) =>
      prev.map((w) => (w.id === warehouseId ? { ...w, stock } : w))
    );
  };

  // Update available quantity field
  const handleAvailableQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setAvailableQuantity(value);
    }
  };

  // تحديث قائمة المستودعات المختارة في النموذج
  useEffect(() => {
    const warehouseIds = selectedWarehouses.map((w) => w.id);
  }, [selectedWarehouses]);

  const [showAlert, setShowAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = (data: DigitalProductFormData) => {
    // التحقق من وجود مستودع رئيسي
    const hasPrimaryWarehouse = selectedWarehouses.some((w) => w.isPrimary);
    if (selectedWarehouses.length > 0 && !hasPrimaryWarehouse) {
      toast.error("يجب تحديد مستودع رئيسي للمنتج");
      return;
    }

    // Add coupons, variants, and selected warehouses to form data
    const formData = {
      ...data,
      coupons: coupons,
      variants: variants,
      warehouses: selectedWarehouses,
      availableQuantity:
        selectedWarehouses.length > 0
          ? calculateTotalStock(selectedWarehouses)
          : availableQuantity,
    };
    console.log(formData);

    // عرض رسالة نجاح مع عدد المستودعات المختارة
    const warehouseCount = selectedWarehouses.length;
    setShowAlert({
      message: `تم حفظ المنتج الرقمي بنجاح في ${warehouseCount} مستودع${
        warehouseCount !== 1 ? "ات" : ""
      }`,
      type: "success",
    });
  };
  const wholesalePrice = watch("wholesalePrice");
  const sellingPrice = watch("sellingPrice");
  const profitMargin = watch("profitMargin");

  // لو المستخدم غيّر نسبة الربح → احسب سعر البيع
  useEffect(() => {
    if (wholesalePrice > 0 && profitMargin > 0) {
      const newSellPrice = wholesalePrice * (1 + profitMargin / 100);
      const rounded = parseFloat(newSellPrice.toFixed(2));

      if (sellingPrice !== rounded) {
        setValue("sellingPrice", rounded, { shouldValidate: true });
      }
    }
  }, [profitMargin, wholesalePrice]);

  // لو المستخدم غيّر سعر البيع → احسب نسبة الربح
  useEffect(() => {
    if (wholesalePrice > 0 && sellingPrice > 0) {
      const newProfitRatio =
        ((sellingPrice - wholesalePrice) / wholesalePrice) * 100;
      const rounded = parseFloat(newProfitRatio.toFixed(2));

      if (profitMargin !== rounded) {
        setValue("profitMargin", rounded, { shouldValidate: true });
      }
    }
  }, [sellingPrice, wholesalePrice]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8 relative"
    >
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            showAlert.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {showAlert.message}
        </motion.div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">إضافة منتج رقمي جديد</h1>
        <Button
          onClick={() => {
            setShowImportDialog(true);
          }}
          variant="outline"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          استيراد منتجات
        </Button>
        <Dialog open={showImportDialog} setOpen={setShowImportDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>استيراد منتجات</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="importFile" className="min-w-[100px]">
                  اختر ملف:
                </Label>
                <Input
                  id="importFile"
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) =>
                    e.target.files && handleImportFile(e.target.files[0])
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="primary"
                onClick={handleSaveImportedProducts}
                disabled={importedProducts.length === 0}
              >
                حفظ المنتجات
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Type Selection */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">نوع المنتج الرقمي</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => handleProductTypeChange("software")}
              className={`p-4 rounded-lg border ${
                selectedType === "software"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              } flex flex-col items-center gap-2`}
            >
              <Package
                className={
                  selectedType === "software"
                    ? "text-purple-500"
                    : "text-gray-500"
                }
              />
              <span>برنامج</span>
            </button>
            <button
              type="button"
              onClick={() => handleProductTypeChange("license")}
              className={`p-4 rounded-lg border ${
                selectedType === "license"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              } flex flex-col items-center gap-2`}
            >
              <CheckCircle
                className={
                  selectedType === "license"
                    ? "text-purple-500"
                    : "text-gray-500"
                }
              />
              <span>ترخيص</span>
            </button>
            <button
              type="button"
              onClick={() => handleProductTypeChange("file")}
              className={`p-4 rounded-lg border ${
                selectedType === "file"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              } flex flex-col items-center gap-2`}
            >
              <File />
              <span>ملف</span>
            </button>
            <button
              type="button"
              onClick={() => handleProductTypeChange("account")}
              className={`p-4 rounded-lg border ${
                selectedType === "account"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              } flex flex-col items-center gap-2`}
            >
              <User
                className={
                  selectedType === "account"
                    ? "text-purple-500"
                    : "text-gray-500"
                }
              />
              <span>حساب</span>
            </button>
          </div>
        </motion.section>
        {/* Basic Information */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">معلومات أساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المنتج *
              </label>
              <Input
                type="text"
                {...register("name", { required: "اسم المنتج مطلوب" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكلمات المفتاحية
              </label>
              <Input
                type="text"
                {...register("tags")}
                placeholder="افصل بين الكلمات بفواصل"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.section>
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="text-xl font-bold">المستودع : مستودع Nike</div>
        </motion.section>
        {/* Digital Warehouses Selection */}
        {/* <WarehouseSelector
          warehouses={digitalWarehouses}
          selectedWarehouses={selectedWarehouses}
          onWarehouseSelect={handleWarehouseSelect}
          onWarehouseRemove={handleWarehouseRemove}
          onPrimaryWarehouseChange={handlePrimaryWarehouseChange}
          onStockChange={handleStockChange}
          isDigital={true}
          availableQuantity={availableQuantity}
          handleAvailableQuantityChange={handleAvailableQuantityChange}
          error={errors.warehouseIds?.message}
        /> */}

        {/* Pricing & Stock */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">السعر والمخزون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر الجملة *
              </label>
              <Input
                type="number"
                step="1"
                {...register("wholesalePrice", {
                  required: "سعر الجملة مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
              />
              {errors.wholesalePrice && (
                <p className="text-sm text-red-600">
                  {errors.wholesalePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر البيع *
              </label>
              <Input
                type="number"
                step="1"
                {...register("sellingPrice", {
                  required: "سعر البيع مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
              />
              {errors.sellingPrice && (
                <p className="text-sm text-red-600">
                  {errors.sellingPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نسبة الربح (%)
              </label>
              <Input
                type="number"
                step="1"
                {...register("profitMargin", {
                  min: { value: 0, message: "النسبة يجب أن تكون أكبر من 0" },
                })}
              />
              {errors.profitMargin && (
                <p className="text-sm text-red-600">
                  {errors.profitMargin.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر الخصم
              </label>
              <Input
                type="number"
                step="1"
                {...register("discountPrice", {
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
              />
              {errors.discountPrice && (
                <p className="text-sm text-red-600">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Variants */}
        <ProductVariants
          variants={variants}
          setVariants={setVariants}
          isDigital={true}
          profitMargin={profitMargin}
          sellingPrice={sellingPrice}
          wholesalePrice={wholesalePrice}
          totalQuantity={availableQuantity}
        />

        {/* Digital Product Content */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">محتوى المنتج الرقمي</h2>

          {selectedType === "file" && (
            <div className="space-y-4">
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                      <span>رفع ملفات</span>
                      <input
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                {watch("digitalFiles").map((file, index) => (
                  <motion.div
                    key={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <span className="flex-shrink-0 text-gray-600">
                      {file.file.name}
                    </span>
                    <Input
                      placeholder="وصف الملف"
                      value={file.description}
                      onChange={(e) => {
                        const files = watch("digitalFiles");
                        files[index].description = e.target.value;
                        setValue("digitalFiles", files);
                      }}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFileRemove(index)}
                      className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {selectedType === "software" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    إصدار البرنامج
                  </label>
                  <Input
                    type="text"
                    {...register("software.version")}
                    placeholder="مثال: 1.0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    متطلبات النظام
                  </label>
                  <Input
                    type="text"
                    {...register("software.systemRequirements")}
                    placeholder="مثال: Windows 10, 4GB RAM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رابط التحميل
                </label>
                <Input
                  type="url"
                  {...register("software.downloadLink")}
                  placeholder="رابط تحميل البرنامج"
                />
              </div>
            </div>
          )}

          {selectedType === "license" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الترخيص
                  </label>
                  <Input
                    type="text"
                    {...register("license.type")}
                    placeholder="مثال: مستخدم واحد، تجاري"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ انتهاء الصلاحية
                  </label>
                  <Input type="date" {...register("license.expiryDate")} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الأجهزة المسموح بها
                </label>
                <Input
                  type="number"
                  {...register("license.devicesLimit")}
                  placeholder="عدد الأجهزة المسموح بها"
                />
              </div>
            </div>
          )}

          {selectedType === "file" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الملف
                  </label>
                  <Input
                    type="text"
                    {...register("file.type")}
                    placeholder="مثال: PDF, ZIP, ePub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    حجم الملف
                  </label>
                  <Input
                    type="text"
                    {...register("file.size")}
                    placeholder="مثال: 50MB"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد مرات التحميل المسموح بها
                </label>
                <Input
                  type="number"
                  {...register("file.downloadLimit")}
                  placeholder="عدد مرات التحميل المسموح بها"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ انتهاء الصلاحية
                </label>
                <Input type="date" {...register("file.expiryDate")} />
              </div>
            </div>
          )}

          {selectedType === "account" && (
            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleAccountAdd}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة حساب جديد
              </Button>
              <AnimatePresence mode="popLayout">
                {watch("accounts").map((account, index) => (
                  <motion.div
                    key={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAccountRemove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="اسم المستخدم"
                      value={account.username}
                      onChange={(e) =>
                        handleAccountChange(index, "username", e.target.value)
                      }
                    />
                    <Input
                      type="password"
                      placeholder="كلمة المرور"
                      value={account.password}
                      onChange={(e) =>
                        handleAccountChange(index, "password", e.target.value)
                      }
                    />
                    <Input
                      placeholder="المنصة"
                      value={account.platform}
                      onChange={(e) =>
                        handleAccountChange(index, "platform", e.target.value)
                      }
                    />
                    <Input
                      placeholder="معلومات إضافية"
                      value={account.additionalInfo}
                      onChange={(e) =>
                        handleAccountChange(
                          index,
                          "additionalInfo",
                          e.target.value
                        )
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
        {/* Media */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الوسائط</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الصورة الرئيسية *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع صورة</span>
                      <Input
                        type="file"
                        {...register("mainImage", {
                          required: "الصورة الرئيسية مطلوبة",
                        })}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF حتى 10MB
                  </p>
                </div>
              </div>
              {errors.mainImage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mainImage.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صور إضافية
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع صور</span>
                      <Input
                        type="file"
                        {...register("additionalImages")}
                        className="sr-only"
                        accept="image/*"
                        multiple
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF حتى 10MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط الفيديو
              </label>
              <Input
                type="url"
                {...register("videoLink")}
                placeholder="رابط يوتيوب أو فيميو"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.section>
        {/* Description & Details */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الوصف والتفاصيل</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف الكامل *
              </label>
              <Controller
                name="fullDescription"
                control={control}
                rules={{ required: "الوصف الكامل مطلوب" }}
                render={({ field }) => (
                  <div className="min-h-[300px] border border-gray-200 rounded-lg">
                    <TipTapEditor />
                  </div>
                )}
              />
              {errors.fullDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullDescription.message}
                </p>
              )}
            </div>
          </div>
        </motion.section>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="destructive">
            إلغاء
          </Button>
          <Button type="submit">حفظ المنتج</Button>
        </div>
      </form>
    </motion.div>
  );
}
