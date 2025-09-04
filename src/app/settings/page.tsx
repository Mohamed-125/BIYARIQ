"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Bell, CreditCard, Globe, Lock, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Address {
  id: string;
  street: string;
  houseNumber: string;
  floor: string;
  city: string;
  state: string;
  postalCode: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  label: string;
}

interface PaymentCard {
  id: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
}

interface SettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  addresses: Address[];
  phoneNumbers: PhoneNumber[];
  paymentCards: PaymentCard[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsForm>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      language: "ar",
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      promotionalEmails: false,
    },
  });

  const onSubmit = (data: SettingsForm) => {
    console.log(data);
    // Handle form submission
  };

  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "payment", label: "طرق الدفع", icon: CreditCard },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "language", label: "اللغة", icon: Globe },
  ];

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-purple-800"
        variants={itemVariants}
      >
        إعدادات الحساب
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs */}
        <motion.div className="md:w-1/4 space-y-2" variants={itemVariants}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-100 text-purple-800"
                  : "hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          className="md:w-3/4 bg-white rounded-xl shadow-lg p-6"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  معلومات الملف الشخصي
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الاسم الأول
                    </label>
                    <Input
                      type="text"
                      {...register("firstName", {
                        required: "هذا الحقل مطلوب",
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    {errors.firstName && (
                      <span className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الاسم الأخير
                    </label>
                    <Input
                      type="text"
                      {...register("lastName", { required: "هذا الحقل مطلوب" })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    {errors.lastName && (
                      <span className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "هذا الحقل مطلوب",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "البريد الإلكتروني غير صالح",
                      },
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Addresses Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">العناوين</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="الشارع"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="رقم المنزل"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="الطابق"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="المدينة"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="المنطقة"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="الرمز البريدي"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <Button className="mt-4 w-full">إضافة عنوان جديد</Button>
                  </div>

                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <p>{`${address.street} - منزل ${address.houseNumber} - طابق ${address.floor}`}</p>
                      <p>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button className="px-3 py-1 text-sm">تعديل</Button>
                        <Button className="px-3 py-1 text-sm bg-red-500">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phone Numbers Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">أرقام الهاتف</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="tel"
                        placeholder="رقم الهاتف"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="التسمية (منزل، عمل، الخ)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <Button className="mt-4 w-full">إضافة رقم جديد</Button>
                  </div>

                  {phoneNumbers.map((phone) => (
                    <div
                      key={phone.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{phone.number}</p>
                        <p className="text-sm text-gray-500">{phone.label}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="px-3 py-1 text-sm">تعديل</Button>
                        <Button className="px-3 py-1 text-sm bg-red-500">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">تغيير كلمة المرور</h3>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">
                      كلمة المرور الحالية
                    </label>
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      {...register("currentPassword")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute left-3 top-9 text-gray-500"
                    >
                      {showCurrentPassword ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-9 text-gray-500"
                    >
                      {showNewPassword ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-9 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Addresses Settings */}
            {activeTab === "addresses" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">العناوين</h2>
                  <Button
                    onClick={() => setShowAddAddress(true)}
                    className="px-4 py-2"
                  >
                    إضافة عنوان جديد
                  </Button>
                </div>

                {showAddAddress && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="الشارع"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="المدينة"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="المنطقة"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="الرمز البريدي"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700"
                      >
                        إلغاء
                      </Button>
                      <Button className="px-4 py-2">حفظ</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <p>{address.street}</p>
                      <p>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button className="px-3 py-1 text-sm">تعديل</Button>
                        <Button className="px-3 py-1 text-sm bg-red-500">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Phone Numbers Settings */}
            {activeTab === "phones" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">أرقام الهاتف</h2>
                  <Button
                    onClick={() => setShowAddPhone(true)}
                    className="px-4 py-2"
                  >
                    إضافة رقم جديد
                  </Button>
                </div>

                {showAddPhone && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="tel"
                        placeholder="رقم الهاتف"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <Input
                        type="text"
                        placeholder="التسمية (منزل، عمل، الخ)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        onClick={() => setShowAddPhone(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700"
                      >
                        إلغاء
                      </Button>
                      <Button className="px-4 py-2">حفظ</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {phoneNumbers.map((phone) => (
                    <div
                      key={phone.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{phone.number}</p>
                        <p className="text-sm text-gray-500">{phone.label}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="px-3 py-1 text-sm">تعديل</Button>
                        <Button className="px-3 py-1 text-sm bg-red-500">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  إعدادات الإشعارات
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      إشعارات البريد الإلكتروني
                    </label>
                    <Input
                      type="checkbox"
                      {...register("emailNotifications")}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      الإشعارات المنبثقة
                    </label>
                    <Input
                      type="checkbox"
                      {...register("pushNotifications")}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      تحديثات الطلبات
                    </label>
                    <Input
                      type="checkbox"
                      {...register("orderUpdates")}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      رسائل البريد الترويجية
                    </label>
                    <Input
                      type="checkbox"
                      {...register("promotionalEmails")}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment Methods */}
            {activeTab === "payment" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">طرق الدفع</h2>
                  <Button
                    onClick={() => setShowAddCard(true)}
                    className="px-4 py-2"
                  >
                    إضافة بطاقة جديدة
                  </Button>
                </div>

                {showAddCard && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          رقم البطاقة
                        </label>
                        <Input
                          type="text"
                          placeholder="**** **** **** ****"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          الاسم على البطاقة
                        </label>
                        <Input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            تاريخ الانتهاء
                          </label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            CVV
                          </label>
                          <Input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        onClick={() => setShowAddCard(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700"
                      >
                        إلغاء
                      </Button>
                      <Button className="px-4 py-2">حفظ</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {paymentCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            **** **** **** {card.cardNumber.slice(-4)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {card.cardName}
                          </p>
                          <p className="text-sm text-gray-500">
                            تنتهي في {card.expiryDate}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="radio"
                              checked={card.isDefault}
                              onChange={() => {
                                // Handle setting as default
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <label className="text-sm">
                              البطاقة الافتراضية
                            </label>
                          </div>
                          <div className="flex space-x-2">
                            <Button className="px-3 py-1 text-sm">تعديل</Button>
                            <Button className="px-3 py-1 text-sm bg-red-500">
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Language Settings */}
            {activeTab === "language" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-6">إعدادات اللغة</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    اختر اللغة
                  </label>
                  <select
                    {...register("language")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </motion.div>
            )}

            <motion.div
              className="flex justify-end mt-8"
              variants={itemVariants}
            >
              <Button type="submit" className="px-8">
                حفظ التغييرات
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
