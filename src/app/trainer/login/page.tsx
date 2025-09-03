import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";

export default function TrainerLogin() {
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
          <Image
            src="/images/trainer-board.svg"
            alt="رمز المدرّب"
            width={80}
            height={80}
            className="mx-auto mt-4"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            تسجيل دخول المدرّب - إدارة الدورات
          </h2>
        </div>

        <form className="mt-8 space-y-6">
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
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/trainer/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            تسجيل الدخول
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link
              href="/trainer/register"
              className="text-purple-600 hover:text-purple-500"
            >
              سجّل كمدرّب جديد
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-gray-500">
            من خلال هذه اللوحة يمكنك رفع دوراتك، متابعة الطلاب، وتحليل نتائجهم.
          </p>
        </form>

        <footer className="mt-8 text-center text-sm text-gray-500">
          جميع الحقوق محفوظة متجر بيارق 2025
        </footer>
      </div>
    </div>
  );
}
