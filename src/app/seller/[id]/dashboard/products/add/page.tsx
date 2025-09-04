"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Upload, X, Plus } from "lucide-react";
import AddCourseComponent from "./components/AddCourseComponent";
import { Editor, EditorContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreatableSelect from "react-select/creatable";
import { data } from "framer-motion/client";
import TipTapEditor from "@/components/TipTapEditor";
import Input from "@/components/ui/Input";

const categoryOptions = [
  { value: "electronics", label: "إلكترونيات" },
  { value: "clothing", label: "ملابس" },
  { value: "books", label: "كتب" },
];

const subcategoryOptions = [
  { value: "mobile", label: "هواتف" },
  { value: "laptops", label: "لابتوبات" },
  { value: "accessories", label: "إكسسوارات" },
];

const brandOptions = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "sony", label: "Sony" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
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

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  tags: string;
  brand: string;
  basePrice: number;
  discountPrice: number;
  currency: string;
  stockQuantity: number;
  stockStatus: "in_stock" | "out_of_stock" | "pre_order";
  allowBackorders: boolean;
  mainImage: FileList;
  additionalImages: FileList;
  videoLink: string;
  shortDescription: string;
  fullDescription: string;
  productType: "physical" | "digital" | "course";
  // Digital product fields
  digitalFile: FileList;
  downloadUrl: string;
  licenseKeys: string;
  accessPassword: string;
  allowedDownloads: number;
  expirationDate: string;
  // Physical product fields
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingClass: string;
  variants: {
    name: string;
    options: string[];
    price: number;
    stock: number;
  }[];
  // Shipping Labels
  shippingLabels: ShippingLabel[];
  // Coupons
  coupons: Coupon[];
}

export default function AddProductPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>();

  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  const [variants, setVariants] = useState<
    { name: string; options: string[]; price: number; stock: number }[]
  >([]);

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [shippingLabels, setShippingLabels] = useState<ShippingLabel[]>([]);

  const productType = watch("productType");

  const onSubmit = (data: ProductFormData) => {
    if (coupons.length > 0 && !validateCoupons()) {
      return;
    }

    // Add coupons and shipping labels to form data
    const formData = {
      ...data,
      coupons: coupons,
      shippingLabels: shippingLabels,
    };
    console.log(formData);
    setShowAlert({ message: "تم حفظ المنتج بنجاح", type: "success" });
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", options: [], price: 0, stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const [showAlert, setShowAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
      <h1 className="text-2xl font-bold mb-8">إضافة منتج جديد</h1>

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
                نوع المنتج
              </label>
              <select
                {...register("productType", { required: "نوع المنتج مطلوب" })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="physical">منتج فعلي</option>
                <option value="digital">منتج رقمي</option>
                <option value="course">دورة</option>
              </select>
              {errors.productType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المنتج *
              </label>
              <Input
                type="text"
                {...register("name", { required: "اسم المنتج مطلوب" })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {productType === "physical" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التصنيف *
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "التصنيف مطلوب" }}
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        options={categoryOptions}
                        placeholder="اختر أو أضف تصنيف"
                        onChange={(selected) => field.onChange(selected?.value)}
                        onCreateOption={(newValue) => {
                          const newOption = {
                            value: newValue,
                            label: newValue,
                          };
                          categoryOptions.push(newOption);
                          field.onChange(newValue);
                        }}
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

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التصنيف الفرعي
                  </label>
                  <Controller
                    name="subcategory"
                    control={control}
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        options={subcategoryOptions}
                        placeholder="اختر أو أضف تصنيف فرعي"
                        onChange={(selected) => field.onChange(selected?.value)}
                        onCreateOption={(newValue) => {
                          const newOption = {
                            value: newValue,
                            label: newValue,
                          };
                          subcategoryOptions.push(newOption);
                          field.onChange(newValue);
                        }}
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                </div>

                {/* Brand */}
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
                        options={brandOptions}
                        placeholder="اختر أو أضف علامة تجارية"
                        onChange={(selected) => field.onChange(selected?.value)}
                        onCreateOption={(newValue) => {
                          const newOption = {
                            value: newValue,
                            label: newValue,
                          };
                          brandOptions.push(newOption);
                          field.onChange(newValue);
                        }}
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                </div>
              </>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكلمات المفتاحية
              </label>
              <Input
                type="text"
                {...register("tags")}
                placeholder="افصل بين الكلمات بفواصل"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            {productType === "physical" ? (
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
            ) : null}

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

        {/* Shipping Labels - Only for Physical Products */}
        {productType === "physical" && (
          <motion.section
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">بوالص الشحن</h2>
            <div className="space-y-6">
              {shippingLabels.map((label, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم بوليصة الشحن (AWB)
                      </label>
                      <Input
                        type="text"
                        value={label.awbNumber}
                        onChange={(e) => {
                          const newLabels = [...shippingLabels];
                          newLabels[index] = {
                            ...label,
                            awbNumber: e.target.value,
                          };
                          setShippingLabels(newLabels);
                        }}
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
                        onChange={(e) => {
                          const newLabels = [...shippingLabels];
                          newLabels[index] = {
                            ...label,
                            carrier: e.target.value,
                          };
                          setShippingLabels(newLabels);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        حالة الشحنة
                      </label>
                      <select
                        value={label.status}
                        onChange={(e) => {
                          const newLabels = [...shippingLabels];
                          newLabels[index] = {
                            ...label,
                            status: e.target.value as
                              | "pending"
                              | "shipped"
                              | "delivered",
                          };
                          setShippingLabels(newLabels);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التوصيل</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رابط التتبع
                      </label>
                      <Input
                        type="url"
                        value={label.trackingUrl}
                        onChange={(e) => {
                          const newLabels = [...shippingLabels];
                          newLabels[index] = {
                            ...label,
                            trackingUrl: e.target.value,
                          };
                          setShippingLabels(newLabels);
                        }}
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
                        onChange={(e) => {
                          const newLabels = [...shippingLabels];
                          newLabels[index] = {
                            ...label,
                            shippingDate: e.target.value,
                          };
                          setShippingLabels(newLabels);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ التوصيل المتوقع
                      </label>
                      <Input
                        type="date"
                        value={label.estimatedDelivery}
                        onChange={(e) => {
                          const newLabels = [...shippingLabels];
                          newLabels[index] = {
                            ...label,
                            estimatedDelivery: e.target.value,
                          };
                          setShippingLabels(newLabels);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newLabels = shippingLabels.filter(
                        (_, i) => i !== index
                      );
                      setShippingLabels(newLabels);
                    }}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    حذف البوليصة
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
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
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                إضافة بوليصة شحن جديدة
              </button>
            </div>
          </motion.section>
        )}

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

        {/* Course Fields */}
        {productType === "course" && (
          <AddCourseComponent
            control={control}
            register={register}
            watch={watch}
            errors={errors}
          />
        )}

        {/* Digital Product Fields */}
        {productType === "digital" && (
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
                          accept=".pdf,.zip,.docx"
                        />
                      </label>
                      <p className="pr-1">أو اسحب وأفلت</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, ZIP, DOCX حتى 100MB
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رابط التحميل
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
                  عدد مرات التحميل المسموح بها
                </label>
                <Input
                  type="number"
                  {...register("allowedDownloads")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ انتهاء الصلاحية
                </label>
                <Input
                  type="date"
                  {...register("expirationDate")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.section>
        )}

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
