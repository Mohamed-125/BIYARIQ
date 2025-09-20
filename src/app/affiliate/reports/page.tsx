"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Download, FileText, Map, Package } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "يناير", orders: 45, revenue: 4500 },
  { month: "فبراير", orders: 52, revenue: 5200 },
  { month: "مارس", orders: 48, revenue: 4800 },
  { month: "أبريل", orders: 70, revenue: 7000 },
  { month: "مايو", orders: 65, revenue: 6500 },
  { month: "يونيو", orders: 85, revenue: 8500 },
];

const productData = [
  { name: "منتج 1", value: 45 },
  { name: "منتج 2", value: 32 },
  { name: "منتج 3", value: 28 },
  { name: "منتج 4", value: 25 },
  { name: "منتج 5", value: 20 },
];

const countryData = [
  { name: "السعودية", value: 55 },
  { name: "الإمارات", value: 25 },
  { name: "الكويت", value: 15 },
  { name: "قطر", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ReportsPage() {
  const exportReport = async () => {
    try {
      const response = await fetch("/api/affiliate/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "all",
          dateRange: {
            start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            end: new Date(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("فشل تصدير التقرير");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `تقرير_المسوق_${new Date().toLocaleDateString("ar-EG")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("خطأ في تصدير التقرير:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">التقارير</h1>
        <Button variant="outline" onClick={exportReport}>
          <Download className="w-4 h-4 ml-2" />
          تصدير التقارير
        </Button>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            تقرير شهري
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            تقرير المنتجات
          </TabsTrigger>
          <TabsTrigger value="countries" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            تقرير الدول
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <Select placeholder="اختر السنة">
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </Select>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    fill="#8884d8"
                    name="الطلبات"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    fill="#82ca9d"
                    name="العمولات"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {productData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {productData.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span className="text-gray-600">{product.value} طلب</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="countries">
          <Card className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {countryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {countryData.map((country, index) => (
                  <div
                    key={country.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="font-medium">{country.name}</span>
                    </div>
                    <span className="text-gray-600">{country.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
