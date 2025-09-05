"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { WarehouseSelector } from "@/components/warehouse/WarehouseSelector";
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

interface ColorVariant {
  color: string;
  colorCode: string;
}

interface SizeVariant {
  size: string;
  stockQuantity: number;
  sku: string;
}

interface Variant {
  name: string;
  options: string[];
}

interface PhysicalProductFormData {
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
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
  colorVariants: ColorVariant[];
  // Coupons
  coupons: Coupon[];
}

// واجهة المستودع
interface Warehouse {
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
    control,
    watch,
    formState: { errors },
  } = useForm<PhysicalProductFormData>({
    defaultValues: {
      warehouseIds: [],
    },
  });

  const [specifications, setSpecifications] = useState<
    { name: string; value: string }[]
  >([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [shippingLabels, setShippingLabels] = useState<ShippingLabel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  // حساب إجمالي المخزون من المستودعات
  const calculateTotalStock = (warehouses: Warehouse[]) => {
    return warehouses.reduce(
      (total, warehouse) => total + (warehouse.stock || 0),
      0
    );
  };

  // تحديث الكمية المتوفرة عند تغيير المخزون
  useEffect(() => {
    if (selectedWarehouses.length > 0) {
      const totalStock = calculateTotalStock(selectedWarehouses);
      setAvailableQuantity(totalStock);
    }
  }, [selectedWarehouses]);

  // التعامل مع تغيير الكمية المتوفرة
  const handleAvailableQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setAvailableQuantity(value);
    }
  };

  // إضافة مستودع
  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouses((prev) => [
      ...prev,
      { ...warehouse, stock: 0, isPrimary: prev.length === 0 },
    ]);
  };

  // إزالة مستودع
  const handleWarehouseRemove = (warehouseId: string) => {
    setSelectedWarehouses((prev) => {
      const newWarehouses = prev.filter((w) => w.id !== warehouseId);
      // إذا تم إزالة المستودع الرئيسي وهناك مستودعات أخرى،
      // اجعل المستودع الأول هو الرئيسي
      if (
        prev.find((w) => w.id === warehouseId)?.isPrimary &&
        newWarehouses.length > 0
      ) {
        newWarehouses[0].isPrimary = true;
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

  const [showAlert, setShowAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = (data: PhysicalProductFormData) => {
    // Add specifications, variants, coupons, shipping labels, and selected warehouses to form data
    const formData = {
      ...data,
      variants: variants,
      colorVariants: colorVariants,
      sizeVariants: sizeVariants,
      coupons: coupons,
      shippingLabels: shippingLabels,
      selectedWarehouses: selectedWarehouses,
    };
    console.log(formData);

    // عرض رسالة نجاح مع عدد المستودعات المختارة
    const warehouseCount = selectedWarehouses.length;
    toast.success(
      `تم حفظ المنتج المادي بنجاح في ${warehouseCount} مستودع${
        warehouseCount !== 1 ? "ات" : ""
      }`
    );
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
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

  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      {
        color: "",
        colorCode: "#000000",
      },
    ]);
    setShowAlert({ message: "تم إضافة لون جديد", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const removeColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
    setShowAlert({ message: "تم حذف اللون", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const updateColorVariant = (
    index: number,
    field: keyof ColorVariant,
    value: any
  ) => {
    const newColorVariants = [...colorVariants];
    newColorVariants[index] = { ...newColorVariants[index], [field]: value };
    setColorVariants(newColorVariants);
  };

  const addSizeVariant = () => {
    setSizeVariants([
      ...sizeVariants,
      {
        size: "",
        stockQuantity: 0,
        sku: "",
      },
    ]);
    setShowAlert({ message: "تم إضافة مقاس جديد", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const removeSizeVariant = (sizeIndex: number) => {
    setSizeVariants(sizeVariants.filter((_, i) => i !== sizeIndex));
    setShowAlert({ message: "تم حذف المقاس", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const updateSizeVariant = (
    sizeIndex: number,
    field: keyof SizeVariant,
    value: any
  ) => {
    const newSizeVariants = [...sizeVariants];
    newSizeVariants[sizeIndex] = {
      ...newSizeVariants[sizeIndex],
      [field]: value,
    };
    setSizeVariants(newSizeVariants);
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

  const addShippingLabel = () => {
    setShippingLabels([
      ...shippingLabels,
      {
        awbNumber: "",
        carrier: "",
        status: "pending",
        trackingUrl: "",
        shippingDate: "",
        estimatedDelivery: "",
      },
    ]);
    setShowAlert({ message: "تم إضافة ملصق شحن جديد", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const removeShippingLabel = (index: number) => {
    setShippingLabels(shippingLabels.filter((_, i) => i !== index));
    setShowAlert({ message: "تم حذف ملصق الشحن", type: "success" });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const updateShippingLabel = (
    index: number,
    field: keyof ShippingLabel,
    value: any
  ) => {
    const newShippingLabels = [...shippingLabels];
    newShippingLabels[index] = { ...newShippingLabels[index], [field]: value };
    setShippingLabels(newShippingLabels);
  };

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
      <h1 className="text-2xl font-bold mb-8">إضافة منتج مادي جديد</h1>

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
                العلامة التجارية
              </label>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    placeholder="اختر أو أضف علامة تجارية"
                    options={[
                      { value: "نايك", label: "نايك" },
                      { value: "أديداس", label: "أديداس" },
                      { value: "بوما", label: "بوما" },
                      { value: "ريبوك", label: "ريبوك" },
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
                السعر الأساسي *
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("basePrice", {
                  required: "السعر الأساسي مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

        {/* Digital Warehouses Selection */}
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
        />

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
                  step="0.01"
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
                step="0.01"
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
                step="0.01"
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
                  step="0.01"
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

        {/* General Variants */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">المتغيرات </h2>
          <div className="space-y-6">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      type="button"
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
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addVariant}
              type="button"
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة متغير جديد
            </Button>
          </div>
        </motion.section>

        {/* Color Variants */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">الألوان</h2>
            <Button
              type="button"
              onClick={addColorVariant}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة لون
            </Button>
          </div>

          {colorVariants.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              لا توجد ألوان مضافة. أضف لون جديد للبدء.
            </p>
          )}

          {colorVariants.map((colorVariant, colorIndex) => (
            <div
              key={colorIndex}
              className="mb-6 p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">لون #{colorIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeColorVariant(colorIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم اللون
                  </label>
                  <Input
                    type="text"
                    value={colorVariant.color}
                    onChange={(e) =>
                      updateColorVariant(colorIndex, "color", e.target.value)
                    }
                    placeholder="مثال: أحمر، أزرق، أسود"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    كود اللون
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colorVariant.colorCode}
                      onChange={(e) =>
                        updateColorVariant(
                          colorIndex,
                          "colorCode",
                          e.target.value
                        )
                      }
                      className="h-10 w-10 border border-gray-200 rounded"
                    />
                    <Input
                      type="text"
                      value={colorVariant.colorCode}
                      onChange={(e) =>
                        updateColorVariant(
                          colorIndex,
                          "colorCode",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Size Variants */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">المقاسات</h2>
            <Button
              type="button"
              onClick={addSizeVariant}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة مقاس
            </Button>
          </div>

          {sizeVariants.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              لا توجد مقاسات مضافة. أضف مقاس جديد للبدء.
            </p>
          )}

          {sizeVariants.map((sizeVariant, sizeIndex) => (
            <div
              key={sizeIndex}
              className="grid grid-cols-12 gap-2 items-center mb-2 p-2 bg-gray-50 rounded"
            >
              <div className="col-span-3">
                <Input
                  type="text"
                  value={sizeVariant.size}
                  onChange={(e) =>
                    updateSizeVariant(sizeIndex, "size", e.target.value)
                  }
                  placeholder="المقاس"
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  value={sizeVariant.stockQuantity}
                  onChange={(e) =>
                    updateSizeVariant(
                      sizeIndex,
                      "stockQuantity",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="الكمية"
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-5">
                <Input
                  type="text"
                  value={sizeVariant.sku}
                  onChange={(e) =>
                    updateSizeVariant(sizeIndex, "sku", e.target.value)
                  }
                  placeholder="رمز المنتج (SKU)"
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeSizeVariant(sizeIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </motion.section>

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
