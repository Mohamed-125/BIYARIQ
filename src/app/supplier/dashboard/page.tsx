"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

export default function SupplierProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">البيانات الأساسية</h1>
      </div>

      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم المورد</Label>
              <Input
                placeholder="اسم الشركة أو الشخص"
                defaultValue="شركة التوريدات المتحدة"
              />
            </div>

            <div className="space-y-2">
              <Label>نوع المورد</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50">
                <option>شركة</option>
                <option>شخصي</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input
                placeholder="العنوان التفصيلي"
                defaultValue="شارع الملك فهد، الرياض"
              />
            </div>

            <div className="space-y-2">
              <Label>رقم الجوال</Label>
              <Input placeholder="05xxxxxxxx" defaultValue="0512345678" />
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="example@domain.com"
                defaultValue="info@supplier.com"
              />
            </div>

            <div className="space-y-2">
              <Label>مسؤول الاتصال</Label>
              <Input placeholder="اسم الشخص المسؤول" defaultValue="أحمد محمد" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              طلب تحديث البيانات
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
