// أنواع البيانات المشتركة بين مكونات المصادقة

// نوع نموذج تسجيل الدخول
export interface LoginForm {
  email: string;
  verificationCode: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  password?: string;
  loginType?: "code" | "password" | "phone";
}

// نوع خطأ واجهة برمجة التطبيقات
export interface ApiError {
  message: string;
}

// نوع خصائص مودال تسجيل الدخول
export interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// نوع خطوات تسجيل الدخول
export type LoginStep =
  | "select" // اختيار طريقة تسجيل الدخول
  | "email" // إدخال البريد الإلكتروني
  | "emailLoginType" // اختيار نوع تسجيل الدخول بالبريد (رمز أو كلمة مرور)
  | "phone" // إدخال رقم الهاتف
  | "verification" // إدخال رمز التحقق
  | "register" // تسجيل مستخدم جديد
  | "forgotPassword" // نسيت كلمة المرور
  | "resetCode" // إدخال رمز إعادة تعيين كلمة المرور
  | "resetPassword"; // تعيين كلمة مرور جديدة