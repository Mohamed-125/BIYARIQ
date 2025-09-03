"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

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

interface SellerFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;

  // Store Information
  storeName: string;
  productType: string;
  description: string;
  logo: FileList;

  // Products & Services
  categories: string[];
  licenses: string;
  courses: string;

  // Payment Settings
  bankName: string;
  accountHolder: string;
  iban: string;
  paypalEmail: string;
  currency: string;

  // Official Documents
  businessLicense: FileList;
  idCard: FileList;

  // Terms
  agreeToTerms: boolean;
}

export default function SellWithUsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerFormData>();

  const onSubmit = (data: SellerFormData) => {
    console.log(data);
  };

  return (
    <section className="section info-page">
      <div className="container">
        <img
          src="/images/banner-gradient.png"
          alt=""
          className="bg--gradient white-version"
        />

        <img src="/images/element-moon1.png" alt="" className="element one" />
        <img src="/images/element-moon2.png" alt="" className="element two" />

        <h1 className="section-heading heading">انضم كبائع</h1>

        <motion.form
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Personal Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">المعلومات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الأول
                </label>
                <input
                  type="text"
                  {...register("firstName", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  {...register("lastName", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  {...register("phone", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموقع
                </label>
                <input
                  type="text"
                  {...register("location", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.location && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Store Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">معلومات المتجر</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  {...register("storeName", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.storeName && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع المنتجات الرقمية
                </label>
                <input
                  type="text"
                  {...register("productType", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.productType && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف المتجر
                </label>
                <textarea
                  {...register("description", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شعار المتجر
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("logo", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.logo && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products & Services */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">المنتجات والخدمات</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الفئات
                </label>
                <select
                  multiple
                  {...register("categories", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="templates">قوالب</option>
                  <option value="graphics">تصاميم جرافيك</option>
                  <option value="courses">دورات تدريبية</option>
                  <option value="ebooks">كتب إلكترونية</option>
                  <option value="software">برمجيات</option>
                </select>
                {errors.categories && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التراخيص
                </label>
                <textarea
                  {...register("licenses", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="اذكر التراخيص والشهادات المهنية ذات الصلة"
                />
                {errors.licenses && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الدورات والتدريب
                </label>
                <textarea
                  {...register("courses", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="اذكر الدورات التدريبية والمؤهلات ذات الصلة"
                />
                {errors.courses && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Payment Settings */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">إعدادات الدفع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم البنك
                </label>
                <input
                  type="text"
                  {...register("bankName", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.bankName && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم صاحب الحساب
                </label>
                <input
                  type="text"
                  {...register("accountHolder", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.accountHolder && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الآيبان
                </label>
                <input
                  type="text"
                  {...register("iban", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.iban && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  بريد PayPal
                </label>
                <input
                  type="email"
                  {...register("paypalEmail", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.paypalEmail && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العملة المفضلة
                </label>
                <select
                  {...register("currency", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="SAR">ريال سعودي</option>
                  <option value="USD">دولار أمريكي</option>
                  <option value="EUR">يورو</option>
                </select>
                {errors.currency && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Official Documents */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">الوثائق الرسمية</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الرخصة التجارية
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("businessLicense", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.businessLicense && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الهوية الوطنية
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("idCard", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.idCard && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Terms and Conditions */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register("agreeToTerms", { required: true })}
                  className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                />
              </div>
              <div className="mr-3 text-sm">
                <label className="font-medium text-gray-700">
                  أوافق على الشروط والأحكام وسياسة العمولة
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500">يجب الموافقة على الشروط والأحكام</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              إرسال الطلب
            </button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}