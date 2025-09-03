"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Button from "@/components/ui/Button";
import { Upload, Plus, X } from "lucide-react";

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

interface StoreSettingsFormData {
  // General Settings
  storeName: string;
  storeLogo: FileList;
  storeBanner: FileList;
  storeDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: {
    country: string;
    city: string;
    zip: string;
    details: string;
  };
  timezone: string;
  currency: string;

  // Payment Settings
  paymentMethods: {
    paypal: boolean;
    stripe: boolean;
    stcPay: boolean;
    applePay: boolean;
    bankTransfer: boolean;
  };
  merchantIds: {
    paypal: string;
    stripe: string;
    stcPay: string;
    applePay: string;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    iban: string;
  };

  // Shipping Settings
  shippingZones: {
    name: string;
    countries: string[];
    methods: {
      name: string;
      cost: number;
      freeThreshold?: number;
    }[];
  }[];

  // Store Policies
  returnPolicy: string;
  shippingPolicy: string;
  privacyPolicy: string;
  termsConditions: string;

  // Discounts & Promotions
  coupons: {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minPurchase?: number;
    maxUses?: number;
    expiryDate?: string;
  }[];
  automaticDiscounts: {
    name: string;
    type: "percentage" | "fixed";
    value: number;
    conditions: {
      minPurchase?: number;
      productCategories?: string[];
      customerGroups?: string[];
    };
  }[];

  sellingCourses: boolean;
  sellingDigitalProducts: boolean;
  selllingPhysicalProducts: boolean;
}

export default function StoreSettingsPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StoreSettingsFormData>();

  const [shippingZones, setShippingZones] = useState<
    StoreSettingsFormData["shippingZones"]
  >([]);

  const [coupons, setCoupons] = useState<StoreSettingsFormData["coupons"]>([]);

  const [automaticDiscounts, setAutomaticDiscounts] = useState<
    StoreSettingsFormData["automaticDiscounts"]
  >([]);

  const onSubmit = (data: StoreSettingsFormData) => {
    console.log(data);
  };

  const addShippingZone = () => {
    setShippingZones([
      ...shippingZones,
      { name: "", countries: [], methods: [] },
    ]);
  };

  const removeShippingZone = (index: number) => {
    setShippingZones(shippingZones.filter((_, i) => i !== index));
  };

  const addShippingMethod = (zoneIndex: number) => {
    const newZones = [...shippingZones];
    newZones[zoneIndex].methods.push({ name: "", cost: 0 });
    setShippingZones(newZones);
  };

  const removeShippingMethod = (zoneIndex: number, methodIndex: number) => {
    const newZones = [...shippingZones];
    newZones[zoneIndex].methods = newZones[zoneIndex].methods.filter(
      (_, i) => i !== methodIndex
    );
    setShippingZones(newZones);
  };

  const addCoupon = () => {
    setCoupons([
      ...coupons,
      {
        code: "",
        type: "percentage",
        value: 0,
      },
    ]);
  };

  const removeCoupon = (index: number) => {
    setCoupons(coupons.filter((_, i) => i !== index));
  };

  const addAutomaticDiscount = () => {
    setAutomaticDiscounts([
      ...automaticDiscounts,
      {
        name: "",
        type: "percentage",
        value: 0,
        conditions: {},
      },
    ]);
  };

  const removeAutomaticDiscount = (index: number) => {
    setAutomaticDiscounts(automaticDiscounts.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8"
    >
      <h1 className="text-2xl font-bold mb-8">إعدادات المتجر</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Settings */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الإعدادات العامة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المتجر *
              </label>
              <input
                type="text"
                {...register("storeName", { required: "اسم المتجر مطلوب" })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.storeName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شعار المتجر
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع شعار</span>
                      <input
                        type="file"
                        {...register("storeLogo")}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 2MB</p>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة الغلاف
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        {...register("storeBanner")}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف المتجر
              </label>
              <textarea
                {...register("storeDescription")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.section>

        {/* Discounts & Promotions */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الخصومات والعروض</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  كوبونات الخصم
                </h3>
                <button
                  type="button"
                  onClick={addCoupon}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة كوبون</span>
                </button>
              </div>
              <div className="space-y-4">
                {coupons.map((coupon, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">كوبون {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCoupon(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={coupon.code}
                        onChange={(e) => {
                          const newCoupons = [...coupons];
                          newCoupons[index].code = e.target.value;
                          setCoupons(newCoupons);
                        }}
                        placeholder="رمز الكوبون"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={coupon.type}
                        onChange={(e) => {
                          const newCoupons = [...coupons];
                          newCoupons[index].type = e.target.value as
                            | "percentage"
                            | "fixed";
                          setCoupons(newCoupons);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="percentage">نسبة مئوية</option>
                        <option value="fixed">قيمة ثابتة</option>
                      </select>
                      <input
                        type="number"
                        value={coupon.value}
                        onChange={(e) => {
                          const newCoupons = [...coupons];
                          newCoupons[index].value = parseFloat(e.target.value);
                          setCoupons(newCoupons);
                        }}
                        placeholder="قيمة الخصم"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={coupon.minPurchase}
                        onChange={(e) => {
                          const newCoupons = [...coupons];
                          newCoupons[index].minPurchase = parseFloat(
                            e.target.value
                          );
                          setCoupons(newCoupons);
                        }}
                        placeholder="الحد الأدنى للشراء"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={coupon.maxUses}
                        onChange={(e) => {
                          const newCoupons = [...coupons];
                          newCoupons[index].maxUses = parseInt(e.target.value);
                          setCoupons(newCoupons);
                        }}
                        placeholder="الحد الأقصى للاستخدام"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={coupon.expiryDate}
                        onChange={(e) => {
                          const newCoupons = [...coupons];
                          newCoupons[index].expiryDate = e.target.value;
                          setCoupons(newCoupons);
                        }}
                        placeholder="تاريخ الانتهاء"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  الخصومات التلقائية
                </h3>
                <button
                  type="button"
                  onClick={addAutomaticDiscount}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة خصم</span>
                </button>
              </div>
              <div className="space-y-4">
                {automaticDiscounts.map((discount, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">خصم {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeAutomaticDiscount(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={discount.name}
                        onChange={(e) => {
                          const newDiscounts = [...automaticDiscounts];
                          newDiscounts[index].name = e.target.value;
                          setAutomaticDiscounts(newDiscounts);
                        }}
                        placeholder="اسم الخصم"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={discount.type}
                        onChange={(e) => {
                          const newDiscounts = [...automaticDiscounts];
                          newDiscounts[index].type = e.target.value as
                            | "percentage"
                            | "fixed";
                          setAutomaticDiscounts(newDiscounts);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="percentage">نسبة مئوية</option>
                        <option value="fixed">قيمة ثابتة</option>
                      </select>
                      <input
                        type="number"
                        value={discount.value}
                        onChange={(e) => {
                          const newDiscounts = [...automaticDiscounts];
                          newDiscounts[index].value = parseFloat(
                            e.target.value
                          );
                          setAutomaticDiscounts(newDiscounts);
                        }}
                        placeholder="قيمة الخصم"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={discount.conditions?.minPurchase}
                        onChange={(e) => {
                          const newDiscounts = [...automaticDiscounts];
                          newDiscounts[index].conditions = {
                            ...newDiscounts[index].conditions,
                            minPurchase: parseFloat(e.target.value),
                          };
                          setAutomaticDiscounts(newDiscounts);
                        }}
                        placeholder="الحد الأدنى للشراء"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={
                          discount.conditions?.productCategories?.join(", ") ||
                          ""
                        }
                        onChange={(e) => {
                          const newDiscounts = [...automaticDiscounts];
                          newDiscounts[index].conditions = {
                            ...newDiscounts[index].conditions,
                            productCategories: e.target.value
                              .split(",")
                              .map((cat) => cat.trim()),
                          };
                          setAutomaticDiscounts(newDiscounts);
                        }}
                        placeholder="فئات المنتجات (مفصولة بفواصل)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={
                          discount.conditions?.customerGroups?.join(", ") || ""
                        }
                        onChange={(e) => {
                          const newDiscounts = [...automaticDiscounts];
                          newDiscounts[index].conditions = {
                            ...newDiscounts[index].conditions,
                            customerGroups: e.target.value
                              .split(",")
                              .map((group) => group.trim()),
                          };
                          setAutomaticDiscounts(newDiscounts);
                        }}
                        placeholder="مجموعات العملاء (مفصولة بفواصل)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            إلغاء
          </Button>
          <Button type="submit">حفظ الإعدادات</Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
