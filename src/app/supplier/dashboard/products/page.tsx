"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Upload, FileSpreadsheet } from "lucide-react";

const products = [
  {
    id: "PROD-001",
    name: "لابتوب HP ProBook",
    sku: "HP-PB-001",
    quantity: 50,
    price: 3500,
  },
  {
    id: "PROD-002",
    name: "طابعة Canon PIXMA",
    sku: "CN-PX-001",
    quantity: 30,
    price: 850,
  },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">المنتجات</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <FileSpreadsheet className="ml-2" />
            استيراد Excel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Upload className="ml-2" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">إضافة منتج جديد</h2>
          </div>

          <form className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>اسم المنتج</label>
              <Input placeholder="أدخل اسم المنتج" />
            </div>

            <div className="space-y-2">
              <label>الكمية المتاحة</label>
              <Input type="number" placeholder="أدخل الكمية" />
            </div>

            <div className="space-y-2">
              <label>السعر</label>
              <Input type="number" placeholder="أدخل السعر" />
            </div>

            <div className="space-y-2 col-span-2">
              <label>المواصفات</label>
              <textarea
                className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
                placeholder="أدخل مواصفات المنتج"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label>صورة المنتج</label>
              <Input type="file" accept="image/*" />
            </div>

            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                حفظ المنتج
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="p-6 bg-white shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">{product.price} ريال</p>
                <p className="text-gray-500">الكمية: {product.quantity}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">تعديل</Button>
              <Button variant="destructive">حذف</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
