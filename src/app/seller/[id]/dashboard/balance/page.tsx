"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CreditCard,
  Building,
  Mail,
} from "lucide-react";
import Button from "@/components/ui/Button";
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

type TransactionStatus = "pending" | "completed" | "failed";
type TransactionType = "withdrawal" | "sale" | "refund";

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
}

const statusColors: Record<
  TransactionStatus,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "معلّق",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "مكتمل",
  },
  failed: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "مرفوض",
  },
};

const typeColors: Record<TransactionType, { icon: any; text: string }> = {
  withdrawal: {
    icon: ArrowUpRight,
    text: "text-orange-600",
  },
  sale: {
    icon: ArrowDownRight,
    text: "text-green-600",
  },
  refund: {
    icon: ArrowUpRight,
    text: "text-red-600",
  },
};

// Initial transactions data grouped by date
const initialTransactions: Record<string, Transaction[]> = {
  "2024-01-20": [
    {
      id: "TRX001",
      date: "2024-01-20",
      type: "sale",
      amount: 2999,
      status: "completed",
      description: "مبيعات لابتوب ماك بوك برو",
    },
    {
      id: "TRX002",
      date: "2024-01-20",
      type: "withdrawal",
      amount: 1500,
      status: "pending",
      description: "سحب إلى PayPal",
    },
  ],
  "2024-01-19": [
    {
      id: "TRX003",
      date: "2024-01-19",
      type: "refund",
      amount: 749,
      status: "completed",
      description: "استرداد سماعات بلوتوث",
    },
    {
      id: "TRX004",
      date: "2024-01-19",
      type: "withdrawal",
      amount: 2000,
      status: "failed",
      description: "سحب إلى PayPal - خطأ في المعاملة",
    },
  ],
};

export default function BalancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "paypal" | "bank" | "card"
  >("paypal");
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  const totalBalance = 5248.5; // This would come from an API
  const pendingBalance = 1500.0; // This would come from an API
  const withdrawableBalance = totalBalance - pendingBalance;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  const filteredTransactions = Object.entries(transactions)
    .filter(([date]) => !selectedDate || date === selectedDate)
    .reduce((acc, [date, transactions]) => {
      const filteredDateTransactions = transactions.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      if (filteredDateTransactions.length > 0) {
        acc[date] = filteredDateTransactions;
      }
      return acc;
    }, {} as Record<string, Transaction[]>);

  // Bank accounts data (would come from API/settings)
  const bankAccounts = [
    {
      id: "bank1",
      name: "البنك الأهلي السعودي",
      accountNumber: "**** **** **** 4582",
    },
    { id: "bank2", name: "مصرف الراجحي", accountNumber: "**** **** **** 7891" },
  ];

  // Cards data (would come from API/settings)
  const cards = [
    {
      id: "card1",
      type: "VISA",
      number: "**** **** **** 4242",
      expiry: "12/25",
    },
    {
      id: "card2",
      type: "MASTERCARD",
      number: "**** **** **** 5678",
      expiry: "09/26",
    },
  ];

  const handleExportCSV = (date: string) => {
    // In a real application, this would generate and download a CSV file
    toast.success(`تم تصدير معاملات ${date} بنجاح`);
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);

    if (amount > withdrawableBalance) {
      toast.error("المبلغ المطلوب أكبر من الرصيد المتاح للسحب");
      return;
    }

    // Validate based on selected payment method
    if (selectedPaymentMethod === "paypal" && !paypalEmail) {
      toast.error("يرجى إدخال بريد PayPal الإلكتروني");
      return;
    } else if (selectedPaymentMethod === "bank" && !selectedBankAccount) {
      toast.error("يرجى اختيار حساب بنكي");
      return;
    } else if (selectedPaymentMethod === "card" && !selectedCard) {
      toast.error("يرجى اختيار بطاقة");
      return;
    }

    if (!amount) {
      toast.error("يرجى إدخال المبلغ المطلوب سحبه");
      return;
    }

    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/withdraw', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     paymentMethod: selectedPaymentMethod,
      //     paypalEmail: selectedPaymentMethod === 'paypal' ? paypalEmail : undefined,
      //     bankAccountId: selectedPaymentMethod === 'bank' ? selectedBankAccount : undefined,
      //     cardId: selectedPaymentMethod === 'card' ? selectedCard : undefined,
      //     amount
      //   })
      // });
      // if (!response.ok) throw new Error('Failed to process withdrawal');

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let description = "";
      if (selectedPaymentMethod === "paypal") {
        description = `سحب إلى PayPal (${paypalEmail})`;
      } else if (selectedPaymentMethod === "bank") {
        const bank = bankAccounts.find((b) => b.id === selectedBankAccount);
        description = `سحب إلى ${bank?.name} (${bank?.accountNumber})`;
      } else if (selectedPaymentMethod === "card") {
        const card = cards.find((c) => c.id === selectedCard);
        description = `سحب إلى بطاقة ${card?.type} (${card?.number})`;
      }

      const newTransaction: Transaction = {
        id: `TRX${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split("T")[0],
        type: "withdrawal",
        amount,
        status: "pending",
        description,
      };

      // Update local state
      setTransactions((prev) => {
        const today = new Date().toISOString().split("T")[0];
        return {
          ...prev,
          [today]: [...(prev[today] || []), newTransaction],
        };
      });

      setPaypalEmail("");
      setWithdrawalAmount("");
      toast.success("تم تقديم طلب السحب بنجاح");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("حدث خطأ أثناء معالجة طلب السحب");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">الرصيد الكلي</h2>
            <Wallet className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{formatPrice(totalBalance)}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">الرصيد المعلق</h2>
            <Wallet className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {formatPrice(pendingBalance)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">الرصيد القابل للسحب</h2>
            <Wallet className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {formatPrice(withdrawableBalance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">سجل المعاملات</h2>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="البحث في المعاملات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pr-10 py-2 px-4 border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(filteredTransactions).map(
                ([date, transactions]) => (
                  <div key={date}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-500">
                        {new Date(date).toLocaleDateString("ar", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <button
                        onClick={() => handleExportCSV(date)}
                        className="flex items-center text-xs text-purple-600 hover:text-purple-800"
                      >
                        <Download size={14} className="mr-1" />
                        تصدير CSV
                      </button>
                    </div>
                    <div className="space-y-3">
                      {transactions.map((transaction) => {
                        const TypeIcon = typeColors[transaction.type].icon;
                        return (
                          <motion.div
                            key={transaction.id}
                            variants={itemVariants}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  typeColors[transaction.type].text
                                } bg-white`}
                              >
                                <TypeIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {transaction.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                  #{transaction.id}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-medium ${
                                  typeColors[transaction.type].text
                                }`}
                              >
                                {transaction.type === "sale" ? "+ " : "- "}
                                {formatPrice(transaction.amount)}
                              </p>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  statusColors[transaction.status].bg
                                } ${statusColors[transaction.status].text}`}
                              >
                                {statusColors[transaction.status].label}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">سحب الرصيد</h2>
            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  اختر طريقة السحب
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("paypal")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      selectedPaymentMethod === "paypal"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Mail className="w-5 h-5 mb-1 text-blue-600" />
                    <span className="text-sm">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("bank")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      selectedPaymentMethod === "bank"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Building className="w-5 h-5 mb-1 text-green-600" />
                    <span className="text-sm">حساب بنكي</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      selectedPaymentMethod === "card"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-purple-600" />
                    <span className="text-sm">بطاقة</span>
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === "paypal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني لـ PayPal
                  </label>
                  <Input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full py-2 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {selectedPaymentMethod === "bank" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اختر الحساب البنكي
                  </label>
                  <select
                    value={selectedBankAccount}
                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                    className="w-full py-2 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">اختر حساب بنكي</option>
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({account.accountNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedPaymentMethod === "card" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اختر البطاقة
                  </label>
                  <select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className="w-full py-2 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">اختر بطاقة</option>
                    {cards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.type} ({card.number})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المبلغ (ريال سعودي)
                </label>
                <Input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min="0"
                  step="1"
                  placeholder="0.00"
                  className="w-full py-2 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" className="w-full">
                سحب الرصيد
              </Button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
