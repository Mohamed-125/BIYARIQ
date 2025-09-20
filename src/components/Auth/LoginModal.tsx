"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import EmailLoginForm from "./components/EmailLoginForm";
import VerificationCode from "./components/VerificationCode";
import NewPasswordForm from "./components/NewPasswordForm";
import { apiFetch } from "../../lib/apiFetch";
import { Mail, Phone, KeyRound, Lock } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type LoginType = "phone" | "email";
type EmailLoginType = "password" | "code" | "reset";

const LoginModal = ({ open, setOpen }: LoginModalProps) => {
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<LoginType | null>(null);
  const [emailLoginType, setEmailLoginType] = useState<EmailLoginType | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const resetForm = () => {
    setLoginType(null);
    setEmailLoginType(null);
    setEmail("");
    setStep(1);
    setEmailError("");
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleBack = () => {
    if (step === 2 && emailLoginType) {
      setEmailLoginType(null);
      setStep(1);
    } else if (step === 2) {
      setLoginType(null);
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleLoginSuccess = async (token: string) => {
    try {
      await login(token);
      toast.success("تم تسجيل الدخول بنجاح");
      handleClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent>
        <div className="relative">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
            >
              رجوع
            </button>
          )}

          {/* Step 1: Choose Login Method */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center mb-6">
                تسجيل الدخول
              </h2>
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  variant="outline"
                  size="full"
                  className="flex items-center gap-2 justify-center"
                  onClick={() => {
                    setLoginType("email");
                    setStep(2);
                  }}
                >
                  <Mail className="w-5 h-5" />
                  البريد الإلكتروني
                </Button>
                <Button
                  variant="outline"
                  size="full"
                  disabled
                  className="flex items-center gap-2 justify-center"
                  onClick={() => {
                    setLoginType("phone");
                    setStep(2);
                  }}
                >
                  <Phone className="w-5 h-5" />
                  رقم الهاتف
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Email Login Type */}
          {step === 2 && loginType === "email" && !emailLoginType && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center mb-6">
                اختر طريقة تسجيل الدخول
              </h2>
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  variant="outline"
                  size="full"
                  className="flex items-center gap-2 justify-center"
                  onClick={() => setEmailLoginType("password")}
                >
                  <Lock className="w-5 h-5" />
                  كلمة المرور
                </Button>
                <Button
                  variant="outline"
                  size="full"
                  className="flex items-center gap-2 justify-center"
                  onClick={() => setEmailLoginType("code")}
                >
                  <KeyRound className="w-5 h-5" />
                  رمز التحقق
                </Button>
              </div>
            </div>
          )}

          {/* Step 2a: Email Login Form */}
          {step === 2 && emailLoginType === "password" && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">
                تسجيل الدخول بكلمة المرور
              </h2>
              <EmailLoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToReset={() => setEmailLoginType("reset")}
              />
            </div>
          )}

          {/* Step 2b: Verification Code Email Input */}
          {step === 2 && emailLoginType === "code" && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">
                تسجيل الدخول برمز التحقق
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      emailError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="أدخل بريدك الإلكتروني"
                    dir="ltr"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                <Button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const response = await apiFetch("/auth/check-email", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                      });

                      setStep(3);
                    } catch (error) {
                      setEmailError("البريد الإلكتروني غير صحيح");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  loading={loading}
                  size="full"
                >
                  إرسال رمز التحقق
                </Button>
              </div>
            </div>
          )}

          {/* Step 2c: Reset Password Email Input */}
          {step === 2 && emailLoginType === "reset" && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">
                إعادة تعيين كلمة المرور
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      emailError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="أدخل بريدك الإلكتروني"
                    dir="ltr"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                <Button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const response = await apiFetch("/auth/reset-password", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                      });

                      console.log("step 3");
                      setStep(3);
                    } catch (error) {
                      setEmailError("البريد الإلكتروني غير صحيح");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  loading={loading}
                  size="full"
                >
                  إرسال رمز التحقق
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Verification Code Input will be added here */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">
                {emailLoginType === "reset"
                  ? "أدخل رمز التحقق"
                  : "أدخل رمز التحقق"}
              </h2>
              <VerificationCode
                email={email}
                setStep={setStep}
                onSuccess={handleLoginSuccess}
                onBack={handleBack}
                type={emailLoginType === "reset" ? "reset" : "login"}
              />
            </div>
          )}

          {/* Step 4: Set New Password will be added here */}
          {step === 4 && emailLoginType === "reset" && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">
                تعيين كلمة المرور الجديدة
              </h2>
              <NewPasswordForm
                email={email}
                onSuccess={() => {
                  toast.success("تم تغيير كلمة المرور بنجاح");
                  setEmailLoginType("password");
                  setStep(2);
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
