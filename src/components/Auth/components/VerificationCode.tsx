"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { apiFetch } from "../../../lib/apiFetch";

interface VerificationCodeProps {
  email: string;
  onSuccess: (token: string) => Promise<void>;
  onBack: () => void;
  type: "login" | "reset";
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerificationCode = ({
  email,
  onSuccess,
  onBack,
  type,
  setStep,
}: VerificationCodeProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    const digits = pastedData.split("");
    for (let i = 0; i < Math.min(digits.length, 6); i++) {
      newCode[i] = digits[i];
    }
    setCode(newCode);
    setError("");

    // Focus last input or first empty input
    const lastFilledIndex = newCode.findIndex((digit) => !digit);
    const focusIndex =
      lastFilledIndex === -1 ? 5 : Math.min(lastFilledIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("يرجى إدخال الرمز كاملاً");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        type === "login" ? "/auth/verify-email" : "/auth/verify-reset-code";

      const body = { email };
      type === "login"
        ? (body.verificationCode = verificationCode)
        : (body.code = verificationCode);
      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (type !== "login") {
        setStep(4);
      }
    } catch (error) {
      setError("رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const endpoint =
        type === "login" ? "/auth/check-email" : "/auth/reset-password";
      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setResendTimer(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      setError("");
    } catch (error) {
      setError("فشل إرسال رمز التحقق");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-2">تم إرسال رمز التحقق إلى</p>
        <p className="text-gray-900 font-medium" dir="ltr">
          {email}
        </p>
      </div>

      <div className="flex justify-center gap-2 ">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={`الرقم ${index + 1} من رمز التحقق`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="space-y-3">
        <Button onClick={handleSubmit} loading={loading} size="full">
          تحقق من الرمز
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={!canResend || loading}
            className={`text-sm ${
              canResend
                ? "text-purple-600 hover:text-purple-700"
                : "text-gray-400"
            }`}
          >
            {canResend
              ? "إعادة إرسال الرمز"
              : `إعادة الإرسال بعد ${resendTimer} ثانية`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
