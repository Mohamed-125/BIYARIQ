"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Editor, EditorContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreatableSelect from "react-select/creatable";
import TipTapEditor from "@/components/TipTapEditor";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
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
  options: string[];
}

type DigitalProductType = "code" | "account" | "file" | "service";

interface DigitalProductFormData {
  name: string;
  sku: string;
  tags: string;
  basePrice: number;
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
  // Digital product fields based on type
  digitalFiles: { file: File; description: string }[];
  codes: { code: string; isUsed: boolean }[];
  accounts: {
    username: string;
    password: string;
    platform: string;
    additionalInfo: string;
  }[];
  services: {
    serviceDetails: string;
    deliveryTime: string;
    requirements: string;
  };
  // Common digital fields
  accessPassword: string;
  allowedDownloads: number;
  expirationDate: string;
  // Warehouses - مستودعات متعددة
  warehouseIds: string[];
  // Variants
  variants: Variant[];
  // Coupons
  coupons: Coupon[];
}

// واجهة المستودع الرقمي
import { WarehouseSelector } from "@/components/warehouse/WarehouseSelector";

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
      warehouseIds: [],
      productType: "file",
      digitalFiles: [],
      codes: [],
      accounts: [],
      services: { serviceDetails: "", deliveryTime: "", requirements: "" },
    },
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedType, setSelectedType] = useState<DigitalProductType>("file");

  const handleProductTypeChange = (type: DigitalProductType) => {
    setSelectedType(type);
    setValue("productType", type);
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
  const [digitalWarehouses, setDigitalWarehouses] = useState<
    DigitalWarehouse[]
  >([
    {
      id: "dw-1",
      name: "مستودع أكواد التفعيل",
      description: "مستودع خاص بأكواد تفعيل البرامج والتطبيقات",
      manager: {
        name: "محمد أحمد",
        phone: "+966512345678",
      },
      totalItems: 250,
      availableItems: 180,
    },
    {
      id: "dw-2",
      name: "مستودع الحسابات",
      description: "مستودع خاص بحسابات المواقع والخدمات",
      manager: {
        name: "سارة خالد",
        phone: "+966523456789",
      },
      totalItems: 120,
      availableItems: 75,
    },
    {
      id: "dw-3",
      name: "مستودع الملفات الرقمية",
      description: "مستودع خاص بالكتب الإلكترونية والملفات القابلة للتحميل",
      manager: {
        name: "فهد عبدالله",
        phone: "+966534567890",
      },
      totalItems: 350,
      availableItems: 320,
    },
  ]);

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

  const handleWarehouseSelect = (warehouse: DigitalWarehouse) => {
    setSelectedWarehouses((prev) => [
      ...prev,
      { ...warehouse, stock: 0, isPrimary: prev.length === 0 },
    ]);
  };

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

  const addCoupon = () => {
    setCoupons([
      ...coupons,
      {
        code: "",
        type: "percentage",
        value: 0,
        startDate: "",
        endDate: "",
        usageLimit: 0,
        minPurchaseAmount: 0,
      },
    ]);
    setShowAlert({ message: "تم إضافة كوبون جديد", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const removeCoupon = (index: number) => {
    setCoupons(coupons.filter((_, i) => i !== index));
    setShowAlert({ message: "تم حذف الكوبون", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const updateCoupon = (index: number, field: keyof Coupon, value: any) => {
    const newCoupons = [...coupons];
    newCoupons[index] = { ...newCoupons[index], [field]: value };
    setCoupons(newCoupons);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        options: [],
      },
    ]);
    setShowAlert({ message: "تم إضافة متغير جديد", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
    setShowAlert({ message: "تم حذف المتغير", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariantOption = (variantIndex: number, option: string) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options = [
      ...newVariants[variantIndex].options,
      option,
    ];
    setVariants(newVariants);
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options = newVariants[
      variantIndex
    ].options.filter((_, i) => i !== optionIndex);
    setVariants(newVariants);
  };

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
      <h1 className="text-2xl font-bold mb-8">إضافة منتج رقمي جديد</h1>

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
              onClick={() => handleProductTypeChange("file")}
              className={`p-4 rounded-lg border ${
                selectedType === "file"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              } flex flex-col items-center gap-2`}
            >
              <Package
                className={
                  selectedType === "file" ? "text-purple-500" : "text-gray-500"
                }
              />
              <span>ملف رقمي</span>
            </button>
            <button
              type="button"
              onClick={() => handleProductTypeChange("code")}
              className={`p-4 rounded-lg border ${
                selectedType === "code"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              } flex flex-col items-center gap-2`}
            >
              <CheckCircle
                className={
                  selectedType === "code" ? "text-purple-500" : "text-gray-500"
                }
              />
              <span>كود تفعيل</span>
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
                رمز المنتج (SKU)
              </label>
              <Input
                type="text"
                {...register("sku")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

        {/* Digital Warehouses Selection */}
        <WarehouseSelector
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
        />

        {/* Variants */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">المتغيرات (Variants)</h2>
          <div className="space-y-6">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المتغير
                    </label>
                    <Input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, "name", e.target.value)
                      }
                      placeholder="مثال: المساحة، الإصدار، اللون"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => removeVariant(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخيارات
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {variant.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center bg-gray-100 rounded-lg px-3 py-1"
                      >
                        <span>{option}</span>
                        <button
                          onClick={() =>
                            removeVariantOption(index, optionIndex)
                          }
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="أضف خيار جديد"
                    className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          addVariantOption(index, target.value.trim());
                          target.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        addVariantOption(index, input.value.trim());
                        input.value = "";
                      }
                    }}
                  >
                    إضافة
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              type="button"
              onClick={addVariant}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة متغير جديد
            </Button>
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
                السعر الأساسي *
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("basePrice", {
                  required: "السعر الأساسي مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.basePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر الخصم
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("discountPrice", {
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.discountPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  {...register("allowBackorders")}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  السماح بالطلب المسبق
                </span>
              </label>
            </div>
          </div>
        </motion.section>

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

          {selectedType === "code" && (
            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleCodeAdd}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة كود جديد
              </Button>
              <AnimatePresence mode="popLayout">
                {watch("codes").map((code, index) => (
                  <motion.div
                    key={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center gap-4"
                  >
                    <Input
                      placeholder="أدخل الكود"
                      value={code.code}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCodeRemove(index)}
                      className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
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
