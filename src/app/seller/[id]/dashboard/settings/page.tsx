"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Button from "@/components/ui/Button";
import { Upload, Plus, X, CreditCard, Building2, Check } from "lucide-react";
import Input from "../../../../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { AnimatePresence } from "framer-motion";
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

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  isDefault?: boolean;
}

interface Card {
  id: string;
  cardType: "visa" | "mastercard" | "amex" | "other";
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
}

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
  bankAccounts: BankAccount[];
  cards: Card[];

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
    reset,
    formState: { errors },
  } = useForm<StoreSettingsFormData>();

  const [shippingZones, setShippingZones] = useState<
    StoreSettingsFormData["shippingZones"]
  >([]);

  const [coupons, setCoupons] = useState<StoreSettingsFormData["coupons"]>([]);

  const [automaticDiscounts, setAutomaticDiscounts] = useState<
    StoreSettingsFormData["automaticDiscounts"]
  >([]);

  // حالات للحسابات البنكية والبطاقات
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "bank-1",
      bankName: "البنك الأهلي السعودي",
      accountName: "محمد أحمد",
      accountNumber: "458212345678",
      iban: "SA44 8000 0000 6080 1016 7519",
      isDefault: true,
    },
    {
      id: "bank-2",
      bankName: "مصرف الراجحي",
      accountName: "محمد أحمد",
      accountNumber: "789112345678",
      iban: "SA03 8000 0000 6080 1016 7519",
      isDefault: false,
    },
  ]);

  const [cards, setCards] = useState<Card[]>([
    {
      id: "card-1",
      cardType: "visa",
      cardNumber: "4242424242424242",
      cardholderName: "محمد أحمد",
      expiryMonth: "12",
      expiryYear: "25",
      isDefault: true,
    },
    {
      id: "card-2",
      cardType: "mastercard",
      cardNumber: "5678567856785678",
      cardholderName: "محمد أحمد",
      expiryMonth: "09",
      expiryYear: "26",
      isDefault: false,
    },
  ]);

  // حالات للنوافذ المنبثقة
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingBankAccount, setEditingBankAccount] =
    useState<BankAccount | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // نماذج للحسابات البنكية والبطاقات
  const {
    register: registerBankAccount,
    handleSubmit: handleSubmitBankAccount,
    reset: resetBankAccount,
    formState: { errors: bankAccountErrors },
  } = useForm<BankAccount>();

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    reset: resetCard,
    formState: { errors: cardErrors },
  } = useForm<Card>();

  const onSubmit = (data: StoreSettingsFormData) => {
    // إضافة الحسابات البنكية والبطاقات إلى البيانات
    const formData = {
      ...data,
      bankAccounts,
      cards,
    };
    console.log(formData);
  };

  // وظائف إدارة الحسابات البنكية
  const openAddBankDialog = () => {
    setEditingBankAccount(null);
    resetBankAccount();
    setIsBankDialogOpen(true);
  };

  const openEditBankDialog = (bankAccount: BankAccount) => {
    setEditingBankAccount(bankAccount);
    resetBankAccount(bankAccount);
    setIsBankDialogOpen(true);
  };

  const handleSaveBankAccount = (data: BankAccount) => {
    if (editingBankAccount) {
      // تحديث حساب بنكي موجود
      setBankAccounts(
        bankAccounts.map((account) =>
          account.id === editingBankAccount.id
            ? { ...data, id: account.id }
            : account
        )
      );
    } else {
      // إضافة حساب بنكي جديد
      const newBankAccount = {
        ...data,
        id: `bank-${Date.now()}`,
        isDefault: bankAccounts.length === 0 ? true : false,
      };
      setBankAccounts([...bankAccounts, newBankAccount]);
    }
    setIsBankDialogOpen(false);
  };

  const handleDeleteBankAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter((account) => account.id !== id));
  };

  const setDefaultBankAccount = (id: string) => {
    setBankAccounts(
      bankAccounts.map((account) => ({
        ...account,
        isDefault: account.id === id,
      }))
    );
  };

  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);

  // ---- Bank Accounts ----
  const handleSaveBank = (account: BankAccount) => {
    if (editingBank) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === editingBank.id ? { ...account, id: editingBank.id } : b
        )
      );
    } else {
      setBankAccounts((prev) => [
        ...prev,
        { ...account, id: Date.now().toString() },
      ]);
    }
    setEditingBank(null);
    setIsBankDialogOpen(false);
  };

  const handleDeleteBank = (id: string) => {
    setBankAccounts((prev) => prev.filter((b) => b.id !== id));
  };

  const setDefaultBank = (id: string) => {
    setBankAccounts((prev) =>
      prev.map((b) => ({ ...b, isDefault: b.id === id }))
    );
  };

  // ---- Cards ----
  const handleSaveCard = (card: Card) => {
    if (editingCard) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingCard.id ? { ...card, id: editingCard.id } : c
        )
      );
    } else {
      setCards((prev) => [...prev, { ...card, id: Date.now().toString() }]);
    }
    setEditingCard(null);
    setIsCardDialogOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const setDefaultCard = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
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
              <Input
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
                      <Input
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
                      <Input
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
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 shadow-lg space-y-12"
        >
          <h2 className="text-2xl font-bold mb-6">💳 طرق الدفع</h2>

          {/* Bank Accounts */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">🏦 الحسابات البنكية</h3>
              <Button onClick={() => setIsBankDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> إضافة حساب
              </Button>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                <Building2 className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>لا توجد حسابات بنكية بعد</p>
                <Button
                  variant="ghost"
                  className="mt-3 text-purple-600"
                  onClick={() => setIsBankDialogOpen(true)}
                >
                  إضافة حساب
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {bankAccounts.map((account) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={account.id}
                    className="p-5 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white relative"
                  >
                    {account.isDefault && (
                      <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        افتراضي
                      </span>
                    )}
                    <h4 className="text-lg font-bold">{account.bankName}</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      {account.accountName} - ****
                      {account.accountNumber.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      IBAN: {account.iban}
                    </p>

                    <div className="flex gap-2 mt-4">
                      {!account.isDefault && (
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setDefaultBank(account.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> افتراضي
                        </Button>
                      )}
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingBank(account);
                          setIsBankDialogOpen(true);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="destructive"
                        onClick={() => handleDeleteBank(account.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> حذف
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Cards */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">💳 البطاقات</h3>
              <Button onClick={() => setIsCardDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> إضافة بطاقة
              </Button>
            </div>

            {cards.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                <CreditCard className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>لا توجد بطاقات بعد</p>
                <Button
                  variant="ghost"
                  type="button"
                  className="mt-3 text-purple-600"
                  onClick={() => setIsCardDialogOpen(true)}
                >
                  إضافة بطاقة
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={card.id}
                    className="p-6 rounded-xl text-white shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 relative"
                  >
                    {card.isDefault && (
                      <span className="absolute top-1 right-2 bg-white text-purple-700 text-xs px-2 py-1 rounded">
                        افتراضي
                      </span>
                    )}
                    <p className="text-sm opacity-80">
                      {card.cardType.toUpperCase()}
                    </p>
                    <p className="text-lg font-bold tracking-wider my-2">
                      **** **** **** {card.cardNumber.slice(-4)}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-70">صاحب البطاقة</p>
                        <p className="text-sm">{card.cardholderName}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70">تنتهي</p>
                        <p className="text-sm">
                          {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!card.isDefault && (
                        <Button
                          size="sm"
                          type="button"
                          variant="secondary"
                          onClick={() => setDefaultCard(card.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> افتراضي
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingCard(card);
                          setIsCardDialogOpen(true);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> حذف
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Dialogs */}
          <AnimatePresence>
            {isBankDialogOpen && (
              <Dialog
                open={isBankDialogOpen}
                onOpenChange={setIsBankDialogOpen}
              >
                <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
                  <DialogHeader className="p-4 border-b">
                    <DialogTitle className="text-center">
                      {editingBankAccount
                        ? "تعديل حساب بنكي"
                        : "إضافة حساب بنكي جديد"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-6">
                    <form
                      onSubmit={handleSubmitBankAccount(handleSaveBankAccount)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اسم البنك *
                        </label>
                        <Input
                          type="text"
                          {...registerBankAccount("bankName", {
                            required: "اسم البنك مطلوب",
                          })}
                          className="w-full"
                        />
                        {bankAccountErrors.bankName && (
                          <p className="mt-1 text-sm text-red-600">
                            {bankAccountErrors.bankName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اسم صاحب الحساب *
                        </label>
                        <Input
                          type="text"
                          {...registerBankAccount("accountName", {
                            required: "اسم صاحب الحساب مطلوب",
                          })}
                          className="w-full"
                        />
                        {bankAccountErrors.accountName && (
                          <p className="mt-1 text-sm text-red-600">
                            {bankAccountErrors.accountName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          رقم الحساب *
                        </label>
                        <Input
                          type="text"
                          {...registerBankAccount("accountNumber", {
                            required: "رقم الحساب مطلوب",
                          })}
                          className="w-full"
                        />
                        {bankAccountErrors.accountNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {bankAccountErrors.accountNumber.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          رقم الآيبان (IBAN) *
                        </label>
                        <Input
                          type="text"
                          {...registerBankAccount("iban", {
                            required: "رقم الآيبان مطلوب",
                          })}
                          className="w-full"
                        />
                        {bankAccountErrors.iban && (
                          <p className="mt-1 text-sm text-red-600">
                            {bankAccountErrors.iban.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsBankDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit">
                          {editingBankAccount ? "تحديث" : "إضافة"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCardDialogOpen && (
              <Dialog
                open={isCardDialogOpen}
                onOpenChange={setIsCardDialogOpen}
              >
                <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
                  <DialogHeader className="p-4 border-b">
                    <DialogTitle className="text-center">
                      {editingCard ? "تعديل بطاقة" : "إضافة بطاقة جديدة"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-6">
                    <form
                      onSubmit={handleSubmitCard(handleSaveCard)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          نوع البطاقة *
                        </label>
                        <Input
                          type="text"
                          {...registerCard("cardType", {
                            required: "نوع البطاقة مطلوب",
                          })}
                          className="w-full"
                        />
                        {cardErrors.cardType && (
                          <p className="mt-1 text-sm text-red-600">
                            {cardErrors.cardType.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          رقم البطاقة *
                        </label>
                        <Input
                          type="text"
                          {...registerCard("cardNumber", {
                            required: "رقم البطاقة مطلوب",
                          })}
                          className="w-full"
                        />
                        {cardErrors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {cardErrors.cardNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الشهر *
                          </label>
                          <Input
                            type="text"
                            {...registerCard("expiryMonth", {
                              required: "الشهر مطلوب",
                            })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            السنة *
                          </label>
                          <Input
                            type="text"
                            {...registerCard("expiryYear", {
                              required: "السنة مطلوبة",
                            })}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اسم صاحب البطاقة *
                        </label>
                        <Input
                          type="text"
                          {...registerCard("cardholderName", {
                            required: "اسم صاحب البطاقة مطلوب",
                          })}
                          className="w-full"
                        />
                        {cardErrors.cardholderName && (
                          <p className="mt-1 text-sm text-red-600">
                            {cardErrors.cardholderName.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCardDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit">
                          {editingCard ? "تحديث" : "إضافة"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>
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
