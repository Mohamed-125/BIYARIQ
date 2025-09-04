"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { FiMail, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";
import Input from "@/components/ui/Input";

interface LoginForm {
  email: string;
  password: string;
  phoneNumber: string;
  verificationCode: string;
}

interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function LoginModal({ open, setOpen }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<"select" | "email" | "phone">(
    "select"
  );
  const [phoneStep, setPhoneStep] = useState<"phone" | "verification">("phone");
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>();

  const handleBack = () => {
    if (phoneStep === "verification") {
      setPhoneStep("phone");
    } else {
      setLoginMethod("select");
      reset();
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      if (loginMethod === "email") {
        await login(data.email, data.password);
        setOpen(false);
      } else if (loginMethod === "phone") {
        if (phoneStep === "phone") {
          // Here you would typically make an API call to send verification code
          console.log("Sending verification code to:", data.phoneNumber);
          setPhoneStep("verification");
        } else {
          // Here you would typically verify the code and log the user in
          console.log("Verifying code:", data.verificationCode);
          setOpen(false);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent className="sm:max-w-md relative">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            {loginMethod !== "select" && (
              <button
                onClick={handleBack}
                className="absolute right-4  top-7 text-gray-500 hover:text-gray-700"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
            )}
            {loginMethod === "select"
              ? "تسجيل الدخول"
              : loginMethod === "email"
              ? "البريد الإلكتروني"
              : phoneStep === "phone"
              ? "رقم الهاتف"
              : "أدخل رمز التحقق"}
          </DialogTitle>
        </DialogHeader>

        {loginMethod === "select" ? (
          <div className="flex justify-center gap-4 p-5">
            <Button
              className="bg-transparent hover:text-white hover:bg-[var(--button-color)] px-9 py-5 border-gray-400 text-gray-800 border"
              onClick={() => setLoginMethod("email")}
            >
              <div className="flex items-center flex-col justify-center gap-2 ">
                <FiMail className="w-5 h-5" />
                <span>البريد الإلكتروني</span>
              </div>
            </Button>
            <Button
              className="bg-transparent hover:text-white hover:bg-[var(--button-color)] px-9 py-5 border-gray-400 text-gray-800 border"
              onClick={() => setLoginMethod("phone")}
            >
              <div className="flex items-center flex-col justify-center gap-2 ">
                <FiPhone className="w-5 h-5" />
                <span>رقم الهاتف</span>
              </div>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {loginMethod === "email" ? (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 text-right mb-1"
                  >
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      dir="ltr"
                      className="appearance-none block w-full pr-10 py-2 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="example@email.com"
                      {...register("email", {
                        required: "البريد الإلكتروني مطلوب",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "البريد الإلكتروني غير صالح",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-600 text-right"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 text-right mb-1"
                  >
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      className="appearance-none block w-full pr-10 py-2 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="••••••••"
                      {...register("password", {
                        required: "كلمة المرور مطلوبة",
                        minLength: {
                          value: 8,
                          message:
                            "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
                        },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-600 text-right"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>
              </>
            ) : phoneStep === "phone" ? (
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 text-right mb-1"
                >
                  رقم الهاتف
                </label>
                <div className="relative">
                  <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    dir="ltr"
                    className="appearance-none block w-full pr-10 py-2 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="05XXXXXXXX"
                    {...register("phoneNumber", {
                      required: "رقم الهاتف مطلوب",
                      pattern: {
                        value: /^05\d{8}$/,
                        message: "يجب أن يبدأ الرقم بـ 05 ويتكون من 10 أرقام",
                      },
                    })}
                  />
                </div>
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600 text-right"
                  >
                    {errors.phoneNumber.message}
                  </motion.p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700 text-right mb-1"
                >
                  رمز التحقق
                </label>
                <div className="relative">
                  <Input
                    id="verificationCode"
                    type="text"
                    dir="ltr"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="XXXX"
                    maxLength={4}
                    {...register("verificationCode", {
                      required: "رمز التحقق مطلوب",
                      pattern: {
                        value: /^\d{4}$/,
                        message: "يجب أن يتكون الرمز من 4 أرقام",
                      },
                    })}
                  />
                </div>
                {errors.verificationCode && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600 text-right"
                  >
                    {errors.verificationCode.message}
                  </motion.p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" variant="secondary" size="full">
                {loginMethod === "email"
                  ? "تسجيل الدخول"
                  : phoneStep === "phone"
                  ? "إرسال رمز التحقق"
                  : "تسجيل الدخول"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
