"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const orders = [
  {
    id: "PO-001",
    date: "2024-01-15",
    status: "جديد",
    items: [{ name: "لابتوب HP", quantity: 5, requiredDate: "2024-02-01" }],
  },
  {
    id: "PO-002",
    date: "2024-01-10",
    status: "قيد التنفيذ",
    items: [{ name: "طابعة Canon", quantity: 3, requiredDate: "2024-01-25" }],
  },
];

const statusColors = {
  جديد: "bg-blue-100 text-blue-600 border border-blue-200",
  "قيد التنفيذ": "bg-yellow-100 text-yellow-600 border border-yellow-200",
  "تم التسليم": "bg-green-100 text-green-600 border border-green-200",
  ملغي: "bg-red-100 text-red-600 border border-red-200",
};

export default function PurchaseOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">أوامر الشراء</h1>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="p-6 bg-white shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">طلب رقم: {order.id}</h3>
                <p className="text-gray-500">تاريخ الطلب: {order.date}</p>
              </div>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="border-t pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">المنتج</p>
                      <p>{item.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold">الكمية</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div>
                      <p className="font-semibold">التاريخ المطلوب</p>
                      <p>{item.requiredDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">تحديث الحالة</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                عرض التفاصيل
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
