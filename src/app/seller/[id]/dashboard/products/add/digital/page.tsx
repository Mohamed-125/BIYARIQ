"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import Input from "../../../../../../../components/ui/Input";
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

interface Variant {
  name: string;
  options: string[];
}

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
  // Digital product fields
  digitalFile: FileList;
  downloadUrl: string;
  licenseKeys: string;
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
interface DigitalWarehouse {
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
    formState: { errors },
  } = useForm<DigitalProductFormData>({
    defaultValues: {
      warehouseIds: [],
    },
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // قائمة المستودعات الرقمية المتاحة
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

  // البحث في المستودعات
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState("");
  const [selectedWarehouses, setSelectedWarehouses] = useState<
    DigitalWarehouse[]
  >([]);

  // تصفية المستودعات حسب البحث
  const filteredWarehouses = digitalWarehouses.filter(
    (warehouse) =>
      warehouse.name.includes(warehouseSearchQuery) ||
      warehouse.description.includes(warehouseSearchQuery)
  );

  // إضافة أو إزالة مستودع من القائمة المختارة
  const toggleWarehouseSelection = (warehouse: DigitalWarehouse) => {
    const isSelected = selectedWarehouses.some((w) => w.id === warehouse.id);

    if (isSelected) {
      setSelectedWarehouses(
        selectedWarehouses.filter((w) => w.id !== warehouse.id)
      );
    } else {
      setSelectedWarehouses([...selectedWarehouses, warehouse]);
    }
  };

  // تحديث قائمة المستودعات المختارة في النموذج
  const { setValue } = useForm();

  useEffect(() => {
    const warehouseIds = selectedWarehouses.map(w => w.id);
    setValue("warehouseIds", warehouseIds);
  }, [selectedWarehouses, setValue]);

  const [showAlert, setShowAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = (data: DigitalProductFormData) => {
    // Add coupons, variants, and selected warehouses to form data
    const formData = {
      ...data,
      coupons: coupons,
      variants: variants,
      warehouses: selectedWarehouses
    };
    console.log(formData);

    // عرض رسالة نجاح مع عدد المستودعات المختارة
    const warehouseCount = selectedWarehouses.length;
    setShowAlert({ 
      message: `تم حفظ المنتج الرقمي بنجاح في ${warehouseCount} مستودع${warehouseCount !== 1 ? "ات" : ""}`, 
      type: "success" 
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
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">
            اختيار المستودعات الرقمية
          </h2>

          {/* البحث عن المستودعات */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البحث عن مستودع
            </label>
            <div className="relative">
              <Input
                type="text"
                value={warehouseSearchQuery}
                onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                placeholder="اكتب اسم المستودع أو الوصف للبحث..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* قائمة المستودعات المتاحة */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">المستودعات المتاحة</h3>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {filteredWarehouses.length > 0 ? (
                <div className="space-y-2">
                  {filteredWarehouses.map((warehouse) => {
                    const isSelected = selectedWarehouses.some(
                      (w) => w.id === warehouse.id
                    );
                    return (
                      <div
                        key={warehouse.id}
                        className={`p-3 border ${
                          isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300"
                        } rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
                        onClick={() => toggleWarehouseSelection(warehouse)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{warehouse.name}</h4>
                            <p className="text-sm text-gray-600">
                              {warehouse.description}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <User className="h-3 w-3 mr-1" />
                              <span className="mr-3">
                                {warehouse.manager.name}
                              </span>
                              <Package className="h-3 w-3 mr-1" />
                              <span>
                                {warehouse.availableItems} /{" "}
                                {warehouse.totalItems} متاح
                              </span>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`h-5 w-5 rounded-full border ${
                                isSelected
                                  ? "bg-purple-500 border-purple-500"
                                  : "border-gray-300"
                              } flex items-center justify-center`}
                            >
                              {isSelected && (
                                <CheckCircle className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  لا توجد مستودعات مطابقة لبحثك
                </div>
              )}
            </div>
          </div>

          {/* المستودعات المختارة */}
          <div>
            <h3 className="text-md font-medium mb-3">
              المستودعات المختارة ({selectedWarehouses.length})
            </h3>
            {selectedWarehouses.length > 0 ? (
              <div className="space-y-2">
                {selectedWarehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{warehouse.name}</h4>
                        <p className="text-sm text-gray-600">
                          {warehouse.description}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span className="mr-3">{warehouse.manager.name}</span>
                          <Package className="h-3 w-3 mr-1" />
                          <span>
                            {warehouse.availableItems} / {warehouse.totalItems}{" "}
                            متاح
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWarehouseSelection(warehouse)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border border-gray-300 rounded-lg text-gray-500">
                لم تقم باختيار أي مستودع بعد
              </div>
            )}
          </div>
        </motion.section>

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
              </div>
            ))}

            <Button
              variant="outline"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكمية المتوفرة
              </label>
              <Input
                type="number"
                {...register("stockQuantity", {
                  min: { value: 0, message: "الكمية يجب أن تكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stockQuantity.message}
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

        {/* Digital Product Fields */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">تفاصيل المنتج الرقمي</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الملف الرقمي *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع ملف</span>
                      <Input
                        type="file"
                        {...register("digitalFile", {
                          required: "الملف الرقمي مطلوب",
                        })}
                        className="sr-only"
                        accept=".pdf,.zip,.docx,.mp3,.mp4,.rar"
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, ZIP, DOCX, MP3, MP4, RAR حتى 100MB
                  </p>
                </div>
              </div>
              {errors.digitalFile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.digitalFile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط التحميل الآمن
              </label>
              <Input
                type="url"
                {...register("downloadUrl")}
                placeholder="رابط مباشر للتحميل"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مفاتيح الترخيص
              </label>
              <textarea
                {...register("licenseKeys")}
                placeholder="مفتاح واحد في كل سطر"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة مرور الوصول
              </label>
              <Input
                type="text"
                {...register("accessPassword")}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عدد مرات التحميل المسموح بها *
              </label>
              <Input
                type="number"
                {...register("allowedDownloads", {
                  required: "عدد مرات التحميل مطلوب",
                  min: { value: 1, message: "يجب أن يكون العدد أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.allowedDownloads && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.allowedDownloads.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ انتهاء الصلاحية *
              </label>
              <Input
                type="date"
                {...register("expirationDate", {
                  required: "تاريخ انتهاء الصلاحية مطلوب",
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.expirationDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expirationDate.message}
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
