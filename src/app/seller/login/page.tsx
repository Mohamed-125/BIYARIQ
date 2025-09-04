"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FaMoneyBill } from "react-icons/fa";

export default function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/seller/dashboard");
    } catch (err) {
      setError(
        "فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="متجر بيارق"
            width={150}
            height={40}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            تسجيل دخول البائع - إدارة المتجر
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            قم بإدارة منتجاتك ومبيعاتك وطلباتك من لوحة تحكم البائع.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                required
                className="mt-1 block w-full text-right"
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <Input
                type="password"
                required
                className="mt-1 block w-full text-right"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/seller/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link
              href="/sell-with-us"
              className="text-purple-600 hover:text-purple-500"
            >
              سجّل كبائع جديد
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-gray-500">
            الوصول إلى لوحة البائع يتيح لك إدارة المنتجات والطلبات وتحليل
            المبيعات.
          </p>
        </form>

        <footer className="mt-8 text-center text-sm text-gray-500">
          جميع الحقوق محفوظة متجر بيارق 2025
        </footer>
      </div>
    </div>
  );
}
