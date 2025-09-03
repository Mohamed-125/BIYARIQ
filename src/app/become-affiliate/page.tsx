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

interface AffiliateFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;

  // Bank Information
  bankName: string;
  accountHolder: string;
  iban: string;

  // Social Media
  instagram: string;
  twitter: string;
  tiktok: string;
  youtube: string;

  // Marketing Information
  marketingExperience: string;
  targetAudience: string;
  promotionStrategy: string;

  // Terms
  agreeToTerms: boolean;
}

export default function BecomeAffiliatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AffiliateFormData>();

  const onSubmit = (data: AffiliateFormData) => {
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

        <h1 className="section-heading heading">انضم كشريك تسويق</h1>

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
                  المدينة
                </label>
                <input
                  type="text"
                  {...register("city", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.city && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bank Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">معلومات الحساب البنكي</h2>
            <div className="grid grid-cols-1 gap-4">
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
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">حسابات التواصل الاجتماعي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  انستغرام
                </label>
                <input
                  type="text"
                  {...register("instagram")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تويتر
                </label>
                <input
                  type="text"
                  {...register("twitter")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تيك توك
                </label>
                <input
                  type="text"
                  {...register("tiktok")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  يوتيوب
                </label>
                <input
                  type="text"
                  {...register("youtube")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Marketing Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">معلومات التسويق</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الخبرة في التسويق
                </label>
                <textarea
                  {...register("marketingExperience", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
                {errors.marketingExperience && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الجمهور المستهدف
                </label>
                <textarea
                  {...register("targetAudience", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
                {errors.targetAudience && (
                  <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  استراتيجية الترويج
                </label>
                <textarea
                  {...register("promotionStrategy", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
                {errors.promotionStrategy && (
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