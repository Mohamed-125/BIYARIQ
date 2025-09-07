"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Upload, X, Plus, Trash2, Search } from "lucide-react";
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
import { WarehouseSelector } from "@/app/seller/Components/WarehouseSelector";
import CreatableSelect from "react-select/creatable";
import TipTapEditor from "@/components/TipTapEditor";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { form } from "framer-motion/client";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { ProductVariants } from "../../../../../../../Components/ProductVariants";

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

interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  minPurchaseAmount: number;
}

interface ShippingLabel {
  awbNumber: string;
  carrier: string;
  status: "pending" | "shipped" | "delivered";
  trackingUrl: string;
  shippingDate: string;
  estimatedDelivery: string;
}

interface Variant {
  name: string;
  type: "text" | "number" | "date" | "color";
  value: string;
  quantity: number;
}

interface ImportedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  warehouse?: string;
  sku?: string;
  brand?: string;
  weight?: number;
  weightUnit?: string;
  stockQuantity?: number;
  [key: string]: any;
}

interface PhysicalProductFormData {
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  tags: string;
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
  // Physical product fields
  weight: number;
  weightUnit: "kg" | "g" | "lb" | "oz";
  length: number;
  width: number;
  height: number;
  dimensionsUnit: "cm" | "m" | "in" | "ft";
  // Warehouses - تم تغييره من مستودع واحد إلى مستودعات متعددة
  warehouseIds: string[];
  // Stock levels
  minStockLevel?: number;
  maxStockLevel?: number;
  // Variants
  variants: Variant[];
  // Coupons
  coupons: Coupon[];
}

// واجهة المستودع
export interface Warehouse {
  id: string;
  name: string;
  description: string;
  location: string;
  isPrimary?: boolean;
  stock?: number;
  manager: {
    name: string;
    phone: string;
  };
  totalItems: number;
  availableItems: number;
}

export default function AddPhysicalProductPage() {
  const {
    register,
    handleSubmit,
    control, // kept if you extend later
    watch,
    formState: { errors },
    setValue, // ✅ needed for handleImportFile
  } = useForm<PhysicalProductFormData>({
    defaultValues: { warehouseIds: [] },
  });

  const [specifications, setSpecifications] = useState<
    { name: string; value: string }[]
  >([]);
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
  const [selectedColor, setSelectedColor] = useState<{
    color: string;
    colorCode: string;
  } | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [newVariantQuantity, setNewVariantQuantity] = useState<number>(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [shippingLabels, setShippingLabels] = useState<ShippingLabel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>(
    []
  );
  const [showImportDialog, setShowImportDialog] = useState(false);

  // قائمة المستودعات المتاحة
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "wh-1",
      name: "مستودع الأحذية الرياضية",
      description: "مستودع خاص بالأحذية الرياضية من مختلف الماركات",
      location: "الرياض، حي العليا",
    },
    {
      id: "wh-2",
      name: "مستودع الملابس",
      description: "مستودع خاص بالملابس الرجالية والنسائية",
      location: "جدة، حي الروضة",
    },
    {
      id: "wh-3",
      name: "مستودع الإكسسوارات",
      description: "مستودع خاص بالإكسسوارات والحقائب",
      location: "الدمام، حي الشاطئ",
    },
    {
      id: "wh-4",
      name: "مستودع الأجهزة المنزلية",
      description: "مستودع خاص بالأجهزة المنزلية والإلكترونيات",
      location: "الرياض، حي النزهة",
    },
    {
      id: "wh-5",
      name: "مستودع مستحضرات التجميل",
      description: "مستودع خاص بمستحضرات التجميل والعناية الشخصية",
      location: "جدة، حي الصفا",
    },
    {
      id: "wh-6",
      name: "مستودع الأثاث المنزلي",
      description: "مستودع خاص بالأثاث المنزلي والديكورات",
      location: "الدمام، حي الفيصلية",
    },
  ]);

  const [selectedWarehouses, setSelectedWarehouses] = useState<Warehouse[]>([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);

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

  // إزالة مستودع
  const handleWarehouseRemove = (warehouseId: string) => {
    setSelectedWarehouses((prev) => {
      const newWarehouses = prev.filter((w) => w.id !== warehouseId);
      // لو تم حذف الرئيسي، عيّن أول واحد كرئيسي
      if (
        prev.find((w) => w.id === warehouseId)?.isPrimary &&
        newWarehouses.length > 0
      ) {
        newWarehouses[0] = { ...newWarehouses[0], isPrimary: true };
      }
      return newWarehouses;
    });
  };

  // تغيير المستودع الرئيسي
  const handlePrimaryWarehouseChange = (warehouseId: string) => {
    setSelectedWarehouses((prev) =>
      prev.map((w) => ({ ...w, isPrimary: w.id === warehouseId }))
    );
  };

  // تحديث كمية المخزون
  const handleStockChange = (warehouseId: string, stock: number) => {
    setSelectedWarehouses((prev) =>
      prev.map((w) => (w.id === warehouseId ? { ...w, stock } : w))
    );
  };

  // التعامل مع تغيير الكمية المتوفرة
  const handleAvailableQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(e.target.value || "0", 10) || 0;
    if (value >= 0) setAvailableQuantity(value);
  };

  async function handleImportFile(file: File): Promise<ImportedProduct[]> {
    return new Promise((resolve, reject) => {
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data: ImportedProduct[] = results.data.map((row: any) => ({
              name: row.name || "",
              description: row.description || "",
              price: parseFloat(row.price) || 0,
              category: row.category || "",
              subcategory: row.subcategory || "",
              warehouse: row.warehouse || "",
              sku: row.sku || "",
              brand: row.brand || "",
              weight: row.weight ? parseFloat(row.weight) : undefined,
              weightUnit: row.weightUnit || "",
              stockQuantity: row.stockQuantity
                ? parseInt(row.stockQuantity, 10)
                : undefined,
            }));
            resolve(data);
          },
          error: (err) => reject(err),
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

          const products: ImportedProduct[] = jsonData.map((row: any) => ({
            name: row.name || "",
            description: row.description || "",
            price: parseFloat(row.price) || 0,
            category: row.category || "",
            subcategory: row.subcategory || "",
            warehouse: row.warehouse || "",
            sku: row.sku || "",
            brand: row.brand || "",
            weight: row.weight ? parseFloat(row.weight) : undefined,
            weightUnit: row.weightUnit || "",
            stockQuantity: row.stockQuantity
              ? parseInt(row.stockQuantity, 10)
              : undefined,
          }));

          resolve(products);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error("Unsupported file type. Please upload CSV or XLSX."));
      }
    });
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedProducts = await handleImportFile(file);
        // setProducts(importedProducts);
        console.log("Imported:", importedProducts);
      } catch (err) {
        console.error("Import failed:", err);
      }
    }
  };

  // حفظ المنتجات المستوردة بعد تخصيص المستودعات
  const handleSaveImportedProducts = () => {
    const allProductsHaveWarehouse = importedProducts.every((p) => p.warehouse);
    if (!allProductsHaveWarehouse) {
      toast.error("يرجى اختيار مستودع لجميع المنتجات");
      return;
    }
    console.log("Saving imported products:", importedProducts);
    toast.success("تم حفظ المنتجات بنجاح");
    setShowImportDialog(false);
    setImportedProducts([]);
  };

  const [showAlert, setShowAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // submit
  const onSubmit = (data: PhysicalProductFormData) => {
    const formData = {
      ...data,
      variants,

      coupons,
      shippingLabels,
      selectedWarehouses,
    };
    const totalVariantsQuantity = variants.reduce(
      (sum, variant) => sum + variant.quantity,
      0
    );
    const isQuantityValid = totalVariantsQuantity === availableQuantity;

    if (!isQuantityValid) {
      alert("يجب ان يساوي عدد النسخ عدد الكميه المتوفره");
    }
    console.log(formData);
    const warehouseCount = selectedWarehouses.length;
    toast.success(
      `تم حفظ المنتج المادي بنجاح في ${warehouseCount} مستودع${
        warehouseCount !== 1 ? "ات" : ""
      }`
    );
  };

  // const addCoupon = () => {
  //   setCoupons([
  //     ...coupons,
  //     {
  //       code: "",
  //       type: "percentage",
  //       value: 0,
  //       startDate: "",
  //       endDate: "",
  //       usageLimit: 0,
  //       minPurchaseAmount: 0,
  //     },
  //   ]);
  //   setShowAlert({ message: "تم إضافة كوبون جديد", type: "success" });
  //   setTimeout(() => setShowAlert(null), 3000);
  // };

  // const removeCoupon = (index: number) => {
  //   setCoupons(coupons.filter((_, i) => i !== index));
  //   setShowAlert({ message: "تم حذف الكوبون", type: "success" });
  //   setTimeout(() => setShowAlert(null), 3000);
  // };

  // const updateCoupon = (index: number, field: keyof Coupon, value: any) => {
  //   const newCoupons = [...coupons];
  //   newCoupons[index] = { ...newCoupons[index], [field]: value };
  //   setCoupons(newCoupons);
  // };

  // const addShippingLabel = () => {
  //   setShippingLabels([
  //     ...shippingLabels,
  //     {
  //       awbNumber: "",
  //       carrier: "",
  //       status: "pending",
  //       trackingUrl: "",
  //       shippingDate: "",
  //       estimatedDelivery: "",
  //     },
  //   ]);
  //   setShowAlert({ message: "تم إضافة ملصق شحن جديد", type: "success" });
  //   setTimeout(() => setShowAlert(null), 3000);
  // };

  // const removeShippingLabel = (index: number) => {
  //   setShippingLabels(shippingLabels.filter((_, i) => i !== index));
  //   setShowAlert({ message: "تم حذف ملصق الشحن", type: "success" });
  //   setTimeout(() => setShowAlert(null), 3000);
  // };

  // const updateShippingLabel = (
  //   index: number,
  //   field: keyof ShippingLabel,
  //   value: any
  // ) => {
  //   const newShippingLabels = [...shippingLabels];
  //   newShippingLabels[index] = { ...newShippingLabels[index], [field]: value };
  //   setShippingLabels(newShippingLabels);
  // };

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        <h1 className="text-2xl font-bold">إضافة منتج مادي جديد</h1>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => setShowImportDialog(true)}
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
                  onChange={handleFileChange}
                />
              </div>
              {importedProducts.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المنتج</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>الكمية</TableHead>
                      <TableHead>المستودع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>
                          <WarehouseSelector
                            value={product.warehouse}
                            onChange={(value) =>
                              handleWarehouseSelect(index, value)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="flex justify-end mt-4">
                <Button
                  variant="primary"
                  onClick={handleSaveImportedProducts}
                  disabled={importedProducts.length === 0}
                >
                  حفظ المنتجات
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                الفئة *
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "الفئة مطلوبة" }}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    placeholder="اختر أو أضف فئة"
                    options={[
                      { value: "ملابس", label: "ملابس" },
                      { value: "إلكترونيات", label: "إلكترونيات" },
                      { value: "منزل وحديقة", label: "منزل وحديقة" },
                      { value: "جمال وصحة", label: "جمال وصحة" },
                    ]}
                    className="react-select"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة الفرعية
              </label>
              <Controller
                name="subcategory"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    placeholder="اختر أو أضف فئة فرعية"
                    options={[
                      { value: "قمصان", label: "قمصان" },
                      { value: "بناطيل", label: "بناطيل" },
                      { value: "أحذية", label: "أحذية" },
                      { value: "اكسسوارات", label: "اكسسوارات" },
                    ]}
                    className="react-select"
                    classNamePrefix="react-select"
                  />
                )}
              />
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

        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="text-xl font-bold">المستودع : مستودع Nike</div>
        </motion.section>
        {/* Digital Warehouses Selection
        <WarehouseSelector
          warehouses={warehouses}
          selectedWarehouses={selectedWarehouses}
          onWarehouseSelect={handleWarehouseSelect}
          onWarehouseRemove={handleWarehouseRemove}
          onPrimaryWarehouseChange={handlePrimaryWarehouseChange}
          onStockChange={handleStockChange}
          availableQuantity={availableQuantity}
          handleAvailableQuantityChange={handleAvailableQuantityChange}
          error={errors.warehouseIds?.message}
        /> */}

        {/* Dimensions & Weight */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الأبعاد والوزن</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوزن *
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="1"
                  {...register("weight", {
                    required: "الوزن مطلوب",
                    min: { value: 0, message: "الوزن يجب أن يكون أكبر من 0" },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  {...register("weightUnit")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="kg">كجم</option>
                  <option value="g">جم</option>
                  <option value="lb">رطل</option>
                  <option value="oz">أونصة</option>
                </select>
              </div>
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الطول *
              </label>
              <Input
                type="number"
                step="1"
                {...register("length", {
                  required: "الطول مطلوب",
                  min: { value: 0, message: "الطول يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.length && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.length.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العرض *
              </label>
              <Input
                type="number"
                step="1"
                {...register("width", {
                  required: "العرض مطلوب",
                  min: { value: 0, message: "العرض يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.width && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.width.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الارتفاع *
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="1"
                  {...register("height", {
                    required: "الارتفاع مطلوب",
                    min: {
                      value: 0,
                      message: "الارتفاع يجب أن يكون أكبر من 0",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  {...register("dimensionsUnit")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="cm">سم</option>
                  <option value="m">متر</option>
                  <option value="in">بوصة</option>
                  <option value="ft">قدم</option>
                </select>
              </div>
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.height.message}
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Variants */}
        <ProductVariants
          wholesalePrice={wholesalePrice}
          sellingPrice={sellingPrice}
          profitMargin={profitMargin}
          variants={variants}
          setVariants={setVariants}
          isDigital={false}
          totalQuantity={availableQuantity}
        />

        {/* Shipping Labels
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">ملصقات الشحن</h2>
            <Button
              type="button"
              onClick={addShippingLabel}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة ملصق شحن
            </Button>
          </div>

          {shippingLabels.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              لا توجد ملصقات شحن مضافة. أضف ملصق شحن جديد للبدء.
            </p>
          )}

          {shippingLabels.map((label, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">ملصق شحن #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeShippingLabel(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم AWB
                  </label>
                  <Input
                    type="text"
                    value={label.awbNumber}
                    onChange={(e) =>
                      updateShippingLabel(index, "awbNumber", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شركة الشحن
                  </label>
                  <Input
                    type="text"
                    value={label.carrier}
                    onChange={(e) =>
                      updateShippingLabel(index, "carrier", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <select
                    value={label.status}
                    onChange={(e) =>
                      updateShippingLabel(
                        index,
                        "status",
                        e.target.value as "pending" | "shipped" | "delivered"
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التسليم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رابط التتبع
                  </label>
                  <Input
                    type="url"
                    value={label.trackingUrl}
                    onChange={(e) =>
                      updateShippingLabel(index, "trackingUrl", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ الشحن
                  </label>
                  <Input
                    type="date"
                    value={label.shippingDate}
                    onChange={(e) =>
                      updateShippingLabel(index, "shippingDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ التسليم المتوقع
                  </label>
                  <Input
                    type="date"
                    value={label.estimatedDelivery}
                    onChange={(e) =>
                      updateShippingLabel(
                        index,
                        "estimatedDelivery",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.section> */}

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
