"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import Label from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "../../../utils";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
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
interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  activePermissions: number;
  status: "active" | "suspended";
  permissions: Permission[];
}

interface SearchFilters {
  employeeName: string;
  permissions: string[];
  activityDate: string;
  activityType: string;
  employeeId: string;
}

interface Permission {
  id: string;
  name: string;
  isGranted: boolean;
  subPermissions?: Permission[];
}

interface ActivityLog {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  timestamp: string;
}

// Example data
const dummyEmployees: Employee[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "مدير المبيعات",
    lastLogin: "2024-03-20 14:30",
    activePermissions: 5,
    status: "active",
    permissions: [],
  },
  {
    id: "2",
    name: "سارة خالد",
    email: "sara@example.com",
    role: "مسؤول المخزون",
    lastLogin: "2024-03-19 09:15",
    activePermissions: 3,
    status: "active",
    permissions: [],
  },
];

const dummyLogs: ActivityLog[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "أحمد محمد",
    action: "تعديل منتج #12345",
    timestamp: "2024-03-20 15:45",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "سارة خالد",
    action: "إضافة مخزون جديد",
    timestamp: "2024-03-20 11:30",
  },
];

export default function PermissionsPage() {
  const [employees, setEmployees] = useState<Employee[]>(dummyEmployees);
  const [logs, setLogs] = useState<ActivityLog[]>(dummyLogs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [filters, setFilters] = useState<SearchFilters>({
    employeeName: "",
    permissions: [],
    activityDate: "",
    activityType: "",
    employeeId: "",
  });

  // تحويل روابط القائمة الجانبية إلى هيكل الصلاحيات
  const generatePermissionsFromSidebar = () => {
    return sidebarLinks.map((link) => ({
      id: link.id,
      name: link.title,
      isGranted: false,
      icon: link.icon,
      href: link.href,
      subPermissions: link.subLinks?.map((subLink) => ({
        id: `${link.id}-${subLink.id}`,
        name: subLink.title,
        isGranted: false,
        href: subLink.href,
      })),
    }));
  };

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    permissions: generatePermissionsFromSidebar(),
  });

  const countActivePermissions = (permissions: Permission[]) => {
    let count = 0;
    permissions.forEach((permission) => {
      if (permission.isGranted) count++;
      if (permission.subPermissions) {
        permission.subPermissions.forEach((subPermission) => {
          if (subPermission.isGranted) count++;
        });
      }
    });
    return count;
  };

  const handleAddEmployee = () => {
    // التحقق من صحة البيانات
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.role
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // إضافة الموظف الجديد
    const newEmployeeData: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      lastLogin: "-",
      activePermissions: countActivePermissions(newEmployee.permissions),
      status: "active",
      permissions: newEmployee.permissions,
    };

    setEmployees([...employees, newEmployeeData]);
    setIsAddDialogOpen(false);
    toast.success("تم إضافة الموظف بنجاح");

    // إعادة تعيين النموذج
    setNewEmployee({
      name: "",
      email: "",
      password: "",
      role: "",
      permissions: generatePermissionsFromSidebar(),
    });
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id
        ? {
            ...selectedEmployee,
            activePermissions: countActivePermissions(
              selectedEmployee.permissions
            ),
          }
        : emp
    );

    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    toast.success("تم تحديث صلاحيات الموظف بنجاح");
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
    toast.success("تم حذف الموظف بنجاح");
  };

  const handleToggleStatus = (employeeId: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? { ...emp, status: emp.status === "active" ? "suspended" : "active" }
          : emp
      )
    );
    toast.success("تم تحديث حالة الموظف بنجاح");
  };

  const handlePermissionChange = (
    permissionId: string,
    isGranted: boolean,
    employeeData: any,
    setEmployeeData: any
  ) => {
    const updatePermissions = (permissions: Permission[]): Permission[] => {
      return permissions.map((permission) => {
        if (permission.id === permissionId) {
          // تحديث الصلاحية الرئيسية
          const updatedPermission = { ...permission, isGranted };

          // تحديث الصلاحيات الفرعية إذا وجدت
          if (updatedPermission.subPermissions) {
            updatedPermission.subPermissions =
              updatedPermission.subPermissions.map((sub) => ({
                ...sub,
                isGranted,
              }));
          }
          return updatedPermission;
        } else if (permission.subPermissions) {
          // البحث في الصلاحيات الفرعية
          const subPermission = permission.subPermissions.find(
            (sub) => sub.id === permissionId
          );
          if (subPermission) {
            // إذا تم العثور على الصلاحية الفرعية، تحديث الصلاحيات الفرعية
            return {
              ...permission,
              subPermissions: permission.subPermissions.map((sub) =>
                sub.id === permissionId ? { ...sub, isGranted } : sub
              ),
              // تحديث حالة الصلاحية الرئيسية بناءً على الصلاحيات الفرعية
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

    setEmployeeData({
      ...employeeData,
      permissions: updatePermissions(employeeData.permissions),
    });
  };

  const PermissionsList = ({
    permissions,
    employeeData,
    setEmployeeData,
  }: any) => (
    <div className="space-y-4">
      {permissions.map((permission: Permission) => (
        <div key={permission.id} className="space-y-2">
          <div className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-50">
            <input
              type="checkbox"
              id={permission.id}
              checked={permission.isGranted}
              onChange={(e) =>
                handlePermissionChange(
                  permission.id,
                  e.checked as boolean,
                  employeeData,
                  setEmployeeData
                )
              }
            />
            <div className="flex items-center gap-2">
              {permission.icon && (
                <div className="text-gray-500">{permission.icon}</div>
              )}
              <label
                htmlFor={permission.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.name}
              </label>
            </div>
          </div>
          {permission.subPermissions &&
            permission.subPermissions.length > 0 && (
              <div className="mr-6 border-r pr-4 border-gray-200">
                {permission.subPermissions.map((subPermission) => (
                  <div
                    key={subPermission.id}
                    className="flex items-center space-x-2 mt-2 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={subPermission.id}
                      checked={subPermission.isGranted}
                      onChange={(e) =>
                        handlePermissionChange(
                          subPermission.id,
                          e.checked as boolean,
                          employeeData,
                          setEmployeeData
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
  );

  const pathname = usePathname();
  const filteredEmployees = employees.filter((employee) => {
    const nameMatch = employee.name
      .toLowerCase()
      .includes(filters.employeeName.toLowerCase());

    const permissionsMatch =
      filters.permissions.length === 0 ||
      employee.permissions.some((permission) =>
        filters.permissions.includes(permission.id)
      );

    return nameMatch && permissionsMatch;
  });

  const filteredLogs = logs.filter((log) => {
    const dateMatch =
      !filters.activityDate || log.timestamp.includes(filters.activityDate);

    const typeMatch =
      !filters.activityType ||
      log.action.toLowerCase().includes(filters.activityType.toLowerCase());

    const employeeMatch =
      !filters.employeeId || log.employeeId === filters.employeeId;

    return dateMatch && typeMatch && employeeMatch;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold mb-2">إدارة الصلاحيات والموظفين</h1>
        <p className="text-gray-600">
          يمكنك إضافة موظفين لحساب متجرك وتحديد الصلاحيات المسموح لهم بالوصول
          إليها.
        </p>
      </motion.div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">الموظفون</TabsTrigger>
          <TabsTrigger value="activity">سجل النشاط</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            {/* فلتر البحث للموظفين */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="البحث باسم الموظف..."
                  className="pl-10"
                  value={filters.employeeName}
                  onChange={(e) =>
                    setFilters({ ...filters, employeeName: e.target.value })
                  }
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.permissions[0] || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    permissions: e.target.value ? [e.target.value] : [],
                  })
                }
              >
                <option value="">جميع الصلاحيات</option>
                {sidebarLinks.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">الموظفون</h2>
              <Button
                variant={"primary"}
                onClick={() => {
                  setIsAddDialogOpen(true);
                }}
              >
                إضافة موظف جديد
                <Plus />
              </Button>
              <Dialog open={isAddDialogOpen} setOpen={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة موظف جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="اسم الموظف"
                        value={newEmployee.name}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="البريد الإلكتروني"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="كلمة المرور المبدئية"
                        type="password"
                        value={newEmployee.password}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            password: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="المسمى الوظيفي"
                        value={newEmployee.role}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            role: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">الصلاحيات</h4>
                      <PermissionsList
                        permissions={newEmployee.permissions}
                        employeeData={newEmployee}
                        setEmployeeData={setNewEmployee}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddEmployee}>إضافة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>المسمى الوظيفي</TableHead>
                    <TableHead>آخر تسجيل دخول</TableHead>
                    <TableHead>عدد الصلاحيات المفعلة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.lastLogin}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {employee.activePermissions}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            employee.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {employee.status === "active" ? "مفعل" : "موقوف"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Link href={pathname + "/" + employee.id}>
                              {" "}
                              عرض{" "}
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(employee.id)}
                          >
                            {employee.status === "active" ? "إيقاف" : "تفعيل"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            حذف
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="activity">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            {/* فلتر البحث للنشاطات */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <Input
                type="date"
                value={filters.activityDate}
                onChange={(e) =>
                  setFilters({ ...filters, activityDate: e.target.value })
                }
              />
              <Input
                type="text"
                placeholder="نوع النشاط..."
                value={filters.activityType}
                onChange={(e) =>
                  setFilters({ ...filters, activityType: e.target.value })
                }
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.employeeId}
                onChange={(e) =>
                  setFilters({ ...filters, employeeId: e.target.value })
                }
              >
                <option value="">جميع الموظفين</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <h2 className="text-xl font-semibold mb-4">سجل النشاط</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>الإجراء</TableHead>
                    <TableHead>الوقت والتاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.employeeName}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
