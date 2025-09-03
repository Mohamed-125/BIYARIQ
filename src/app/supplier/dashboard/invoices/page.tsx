"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Upload } from "lucide-react";

const invoices = [
  {
    id: "INV-001",
    date: "2024-01-15",
    amount: 15000,
    status: "مقبولة",
    purchaseOrder: "PO-001",
  },
  {
    id: "INV-002",
    date: "2024-01-10",
    amount: 8500,
    status: "تحت المراجعة",
    purchaseOrder: "PO-002",
  },
];

const statusColors = {
  مقبولة: "bg-green-100 text-green-600 border border-green-200",
  "تحت المراجعة": "bg-yellow-100 text-yellow-600 border border-yellow-200",
  مدفوعة: "bg-blue-100 text-blue-600 border border-blue-200",
  مرفوضة: "bg-red-100 text-red-600 border border-red-200",
};

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">الفواتير</h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
          <Upload className="ml-2" />
          رفع فاتورة جديدة
        </Button>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card
            key={invoice.id}
            className="p-6 bg-white shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  فاتورة رقم: {invoice.id}
                </h3>
                <p className="text-gray-500">تاريخ الفاتورة: {invoice.date}</p>
                <p className="text-gray-500">
                  رقم أمر الشراء: {invoice.purchaseOrder}
                </p>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">{invoice.amount} ريال</p>
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">تحميل PDF</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                عرض التفاصيل
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
