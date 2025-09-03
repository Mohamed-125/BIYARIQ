"use client";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const payments = [
  {
    id: "PAY-001",
    date: "2024-01-15",
    amount: 15000,
    method: "تحويل بنكي",
    status: "مكتمل",
    reference: "REF123456",
  },
  {
    id: "PAY-002",
    date: "2024-01-10",
    amount: 8500,
    method: "شيك",
    status: "مكتمل",
    reference: "CHK789012",
  },
];

export default function Payments() {
  const totalReceived = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const pendingAmount = 5000; // مثال للرصيد المستحق

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">المدفوعات</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 bg-white shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold">إجمالي المدفوعات المستلمة</h3>
          <p className="text-3xl font-bold text-green-600">
            {totalReceived} ريال
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold">الرصيد المستحق</h3>
          <p className="text-3xl font-bold text-purple-600">
            {pendingAmount} ريال
          </p>
        </Card>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">
                  دفعة رقم: {payment.id}
                </h3>
                <p className="text-gray-500">تاريخ الدفع: {payment.date}</p>
                <p className="text-gray-500">طريقة الدفع: {payment.method}</p>
                <p className="text-gray-500">رقم المرجع: {payment.reference}</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-purple-600 font-medium">
                  {payment.amount} ريال
                </p>
                <Badge className="bg-green-100 text-green-600 border border-green-200">{payment.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
