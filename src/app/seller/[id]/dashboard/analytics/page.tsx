"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Rating from "@/components/ui/Rating";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const stats = [
  {
    title: "إجمالي المبيعات",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "purple",
  },
  {
    title: "عدد الطلبات",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "blue",
  },
  {
    title: "المنتجات النشطة",
    value: "45",
    change: "-2",
    trend: "down",
    icon: Package,
    color: "green",
  },
  {
    title: "العملاء الجدد",
    value: "89",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "orange",
  },
];

const salesData = [
  { month: "يناير", sales: 4000, orders: 24 },
  { month: "فبراير", sales: 3000, orders: 18 },
  { month: "مارس", sales: 5000, orders: 35 },
  { month: "أبريل", sales: 2780, orders: 20 },
  { month: "مايو", sales: 1890, orders: 15 },
  { month: "يونيو", sales: 2390, orders: 28 },
  { month: "يوليو", sales: 3490, orders: 32 },
];

const categoryData = [
  { name: "إلكترونيات", value: 400 },
  { name: "ملابس", value: 300 },
  { name: "أثاث", value: 200 },
  { name: "مستلزمات منزلية", value: 150 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const customerData = [
  { month: "يناير", جدد: 400, عائدون: 240 },
  { month: "فبراير", جدد: 300, عائدون: 139 },
  { month: "مارس", جدد: 200, عائدون: 980 },
  { month: "أبريل", جدد: 278, عائدون: 390 },
  { month: "مايو", جدد: 189, عائدون: 480 },
  { month: "يونيو", جدد: 239, عائدون: 380 },
  { month: "يوليو", جدد: 349, عائدون: 430 },
];

const topProducts = [
  {
    name: "لابتوب ماك بوك برو",
    sales: 25,
    revenue: 74975,
    rating: 4.8,
    growth: 12.5,
  },
  {
    name: "سماعات بلوتوث",
    sales: 42,
    revenue: 3147,
    rating: 4.5,
    growth: -2.3,
  },
  {
    name: "آيفون 15",
    sales: 18,
    revenue: 89982,
    rating: 4.9,
    growth: 8.7,
  },
];

export default function AnalyticsPage() {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      <h1 className="text-2xl font-bold">التحليلات</h1>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Sales Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">تحليل المبيعات</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#salesColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Distribution & Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">توزيع الفئات</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => {
                    const total = categoryData.reduce(
                      (acc, cur) => acc + cur.value,
                      0
                    );
                    const percent = ((value / total) * 100).toFixed(1);
                    return [`${percent}%`, name]; // [value to show, label]
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Customer Analysis */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">تحليل العملاء</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" textAnchor="start" />
                <YAxis width={50} />
                <Tooltip />
                <Legend />
                <Bar dataKey="جدد" fill="#8884d8" />
                <Bar dataKey="عائدون" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">أفضل المنتجات مبيعاً</h2>
        <div className="space-y-6">
          {topProducts.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <Rating rating={product.rating} size="sm" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-gray-600">
                    {product.sales} مبيعات
                  </p>
                  <div
                    className={`flex items-center ${
                      product.growth > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.growth > 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-sm">{Math.abs(product.growth)}%</span>
                  </div>
                </div>
                <p className="font-semibold">{formatPrice(product.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
