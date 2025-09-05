"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { sidebarLinks } from "../../../../utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Animation variants
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

// Types
interface Permission {
  id: string;
  name: string;
  isGranted: boolean;
  subPermissions?: Permission[];
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  lastLogin: string;
  status: "active" | "suspended";
  permissions: Permission[];
  activityStats: {
    totalActions: number;
    lastWeekActions: number;
    mostFrequentAction: string;
  };
  recentActivity: ActivityLog[];
}

// Example data
const dummyEmployee: Employee = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: "مدير المبيعات",
  joinDate: "2024-01-15",
  lastLogin: "2024-03-20 14:30",
  status: "active",
  permissions: sidebarLinks.map((link) => ({
    id: link.href,
    name: link.label,
    isGranted: Math.random() > 0.5,
    subPermissions: link.subItems?.map((subItem) => ({
      id: subItem.href,
      name: subItem.label,
      isGranted: Math.random() > 0.5,
    })),
  })),
  activityStats: {
    totalActions: 156,
    lastWeekActions: 23,
    mostFrequentAction: "تعديل المنتجات",
  },
  recentActivity: [
    {
      id: "1",
      action: "تعديل منتج",
      timestamp: "2024-03-20 15:45",
      details: "تحديث سعر المنتج #12345",
    },
    {
      id: "2",
      action: "إضافة مخزون",
      timestamp: "2024-03-20 14:30",
      details: "إضافة 50 قطعة للمنتج #12345",
    },
    {
      id: "3",
      action: "تحديث طلب",
      timestamp: "2024-03-20 13:15",
      details: "تغيير حالة الطلب #67890 إلى 'تم الشحن'",
    },
  ],
};

// بيانات الرسم البياني
const activityData = [
  { day: "السبت", actions: 12 },
  { day: "الأحد", actions: 15 },
  { day: "الاثنين", actions: 8 },
  { day: "الثلاثاء", actions: 10 },
  { day: "الأربعاء", actions: 14 },
  { day: "الخميس", actions: 9 },
  { day: "الجمعة", actions: 6 },
];

export default function EmployeeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee>(dummyEmployee);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // في التطبيق الحقيقي، هنا سيتم جلب بيانات الموظف من الخادم
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.employeeId]);

  const handlePermissionChange = (permissionId: string, isGranted: boolean) => {
    const updatePermissions = (permissions: Permission[]): Permission[] => {
      return permissions.map((permission) => {
        if (permission.id === permissionId) {
          const updatedPermission = { ...permission, isGranted };
          if (updatedPermission.subPermissions) {
            updatedPermission.subPermissions =
              updatedPermission.subPermissions.map((sub) => ({
                ...sub,
                isGranted,
              }));
          }
          return updatedPermission;
        } else if (permission.subPermissions) {
          const subPermission = permission.subPermissions.find(
            (sub) => sub.id === permissionId
          );
          if (subPermission) {
            return {
              ...permission,
              subPermissions: permission.subPermissions.map((sub) =>
                sub.id === permissionId ? { ...sub, isGranted } : sub
              ),
              isGranted:
                isGranted ||
                permission.subPermissions.some(
                  (sub) => sub.id !== permissionId && sub.isGranted
                ),
            };
          }
          return permission;
        }
        return permission;
      });
    };

    setEmployee({
      ...employee,
      permissions: updatePermissions(employee.permissions),
    });
  };

  const handleSavePermissions = async () => {
    try {
      // في التطبيق الحقيقي، هنا سيتم إرسال الصلاحيات المحدثة إلى الخادم
      // await fetch(`/api/employees/${params.employeeId}/permissions`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ permissions: employee.permissions }),
      // });

      toast.success("تم تحديث الصلاحيات بنجاح");
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("حدث خطأ أثناء تحديث الصلاحيات");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = employee.status === "active" ? "suspended" : "active";
      // في التطبيق الحقيقي، هنا سيتم إرسال الحالة المحدثة إلى الخادم
      // await fetch(`/api/employees/${params.employeeId}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      // });

      setEmployee({ ...employee, status: newStatus });
      toast.success("تم تحديث حالة الموظف بنجاح");
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الموظف");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold mb-2">تفاصيل الموظف</h1>
          <p className="text-gray-600">{employee.name}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            رجوع
          </Button>
          <Button
            variant={employee.status === "active" ? "destructive" : "default"}
            onClick={handleToggleStatus}
          >
            {employee.status === "active" ? "إيقاف الحساب" : "تفعيل الحساب"}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات الموظف */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">المعلومات الأساسية</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">
                  البريد الإلكتروني
                </label>
                <p>{employee.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">المسمى الوظيفي</label>
                <p>{employee.role}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">تاريخ الانضمام</label>
                <p>{employee.joinDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">آخر تسجيل دخول</label>
                <p>{employee.lastLogin}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الحالة</label>
                <p
                  className={`inline-block px-2 py-1 rounded-full text-sm ${
                    employee.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.status === "active" ? "مفعل" : "موقوف"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">إحصائيات النشاط</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">
                  إجمالي الإجراءات
                </label>
                <p className="text-2xl font-bold text-purple-600">
                  {employee.activityStats.totalActions}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  إجراءات الأسبوع الماضي
                </label>
                <p className="text-2xl font-bold text-purple-600">
                  {employee.activityStats.lastWeekActions}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  الإجراء الأكثر تكراراً
                </label>
                <p>{employee.activityStats.mostFrequentAction}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* الصلاحيات والنشاط */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* رسم بياني للنشاط */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">نشاط الأسبوع الماضي</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="actions" fill="#9333ea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* الصلاحيات */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">الصلاحيات</h2>
              <Button onClick={handleSavePermissions}>حفظ التغييرات</Button>
            </div>
            <div className="space-y-4">
              {employee.permissions.map((permission) => (
                <div key={permission.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type='checkbox'
                      id={permission.id}
                      checked={permission.isGranted}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.id,
                          e.checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                    </label>
                  </div>
                  {permission.subPermissions &&
                    permission.subPermissions.length > 0 && (
                      <div className="mr-6 border-r pr-4 border-gray-200">
                        {permission.subPermissions.map((subPermission) => (
                          <div
                            key={subPermission.id}
                            className="flex items-center space-x-2 mt-2"
                          >
                            <input type='checkbox'
                              id={subPermission.id}
                              checked={subPermission.isGranted}
                              onChange={(e) =>
                                handlePermissionChange(
                                  subPermission.id,
                                  e.checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={subPermission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {subPermission.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* سجل النشاط */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">سجل النشاط</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الإجراء</TableHead>
                    <TableHead>التفاصيل</TableHead>
                    <TableHead>الوقت والتاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell>{activity.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
