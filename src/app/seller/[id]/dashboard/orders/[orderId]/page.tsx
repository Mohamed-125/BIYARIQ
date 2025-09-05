"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  Truck,
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Printer,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { formatDate } from "../../../../utils";
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
type OrderStatus = "new" | "processing" | "shipped" | "completed" | "cancelled";
type ShippingCompany = "aramex" | "dhl" | "fedex" | "manual" | "";

interface Variant {
  name: string;
  value: string;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  colorCode?: string;
  size?: string;
  variants?: Variant[];
}

interface CustomerInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface ShippingInfo {
  company: ShippingCompany;
  trackingNumber: string;
  estimatedPickupDate: string;
  estimatedDeliveryDate: string;
  mayArriveSooner: boolean;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: CustomerInfo;
  shipping: ShippingInfo;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
}

// Helper functions
const formatPrice = (price: number) =>
  new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(price);

const generateTrackingNumber = () => {
  const randomDigits = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `Aramx${randomDigits}SA`;
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return <AlertCircle className="w-5 h-5" />;
    case "processing":
      return <RefreshCw className="w-5 h-5" />;
    case "shipped":
      return <Truck className="w-5 h-5" />;
    case "completed":
      return <CheckCircle className="w-5 h-5" />;
    case "cancelled":
      return <XCircle className="w-5 h-5" />;
    default:
      return null;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return "جديد";
    case "processing":
      return "قيد المعالجة";
    case "shipped":
      return "تم الشحن";
    case "completed":
      return "مكتمل";
    case "cancelled":
      return "ملغي";
    default:
      return "";
  }
};

// Example dummy data
const dummyOrder: Order = {
  id: "ORD12345",
  date: "2024-03-15",
  status: "new",
  items: [
    {
      id: "PROD001",
      name: "قميص قطني فاخر",
      image: "https://via.placeholder.com/150",
      price: 199.99,
      quantity: 2,
      color: "أزرق",
      colorCode: "#3B82F6",
      size: "متوسط",
      variants: [
        { name: "النوع", value: "رجالي" },
        { name: "الموديل", value: "كلاسيك" },
      ],
    },
    {
      id: "PROD002",
      name: "بنطلون جينز",
      image: "https://via.placeholder.com/150",
      price: 249.99,
      quantity: 1,
      color: "أسود",
      colorCode: "#000000",
      size: "كبير",
    },
  ],
  customer: {
    name: "أحمد محمد",
    address: "شارع الملك فهد، حي الورود",
    city: "الرياض",
    postalCode: "12345",
    country: "المملكة العربية السعودية",
    phone: "+966 50 123 4567",
    email: "ahmed@example.com",
  },
  shipping: {
    company: "ARAMX",
    trackingNumber: generateTrackingNumber(),
    estimatedPickupDate: new Date().setDate(new Date().getDate() + 1), // Pickup tomorrow
    estimatedDeliveryDate: new Date().setDate(new Date().getDate() + 7), // Pickup tomorrow
    mayArriveSooner: Math.random() > 0.5, // 50% chance it may arrive sooner
  },
  total: 649.97,
  subtotal: 599.97,
  tax: 30.0,
  shippingCost: 20.0,
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order>(dummyOrder);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, fetch the order data based on the orderId
  useEffect(() => {
    // This would be an API call in a real application
    // const fetchOrder = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch(`/api/orders/${params.orderId}`);
    //     const data = await response.json();
    //     setOrder(data);
    //   } catch (error) {
    //     console.error("Error fetching order:", error);
    //     toast.error("حدث خطأ أثناء جلب بيانات الطلب");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchOrder();

    // For demo purposes, we'll just use the dummy data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.orderId]);

  const isOrderActive =
    order.status !== "completed" && order.status !== "cancelled";

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      // في التطبيق الحقيقي، هنا سيتم إرسال طلب API لتحديث حالة الطلب
      // await fetch(`/api/orders/${params.orderId}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // للعرض التجريبي، نقوم بتحديث الحالة مباشرة
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  function handlePrintLabel(trackingNumber: string, company?: string) {
    // 1- أنشئ PDF جديد
    const doc = new jsPDF();

    // 2- العنوان
    doc.setFontSize(18);
    doc.text("Bill of lading", 105, 20, { align: "center" });

    // 3- بيانات الشركة
    doc.setFontSize(12);
    doc.text(`Shipping Company:  ${company || "Unkown"}`, 20, 40);
    doc.text(`Tracking Number: ${trackingNumber}`, 20, 50);
    doc.text(`Printing Date: ${new Date().toLocaleDateString()}`, 20, 60);

    // 4- توليد الباركود على <canvas> مؤقت
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, trackingNumber, {
      format: "CODE128",
      displayValue: true,
      fontSize: 14,
    });

    // 5- إدراج الباركود داخل PDF
    const barcodeImg = canvas.toDataURL("image/png");
    doc.addImage(barcodeImg, "PNG", 20, 80, 160, 40);

    // 6- تحميل الملف
    doc.save(`shipping-label-${trackingNumber}.pdf`);
  }

  // أنماط CSS للطباعة
  useEffect(() => {
    // إضافة أنماط CSS للطباعة
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        /* إخفاء العناصر غير الضرورية عند الطباعة */
        button, .no-print {
          display: none !important;
        }
        
        /* تنسيق الصفحة للطباعة */
        body {
          font-size: 12pt;
          color: #000;
          background-color: #fff;
        }
        
        /* إزالة الظلال والتأثيرات */
        .shadow-sm {
          box-shadow: none !important;
        }
        
        /* تنسيق العناوين */
        h1, h2, h3 {
          color: #000;
        }
        
        /* تنسيق الحاويات */
        .rounded-xl {
          border: 1px solid #ddd;
        }
        
        /* تحسين استخدام المساحة */
        .p-6 {
          padding: 10px !important;
        }
        
        .gap-6 {
          gap: 10px !important;
        }
        
        /* إظهار الروابط بشكل واضح */
        a::after {
          content: ' (' attr(href) ')';
          font-size: 10pt;
          font-style: italic;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          variants={itemVariants}
          className="text-2xl flex items-cent font-bold"
        >
          تفاصيل الطلب #{order.id}
          <Button
            variant={"outline"}
            onClick={() => window.print()}
            className="no-print"
          >
            <Printer />
          </Button>
        </motion.h1>
        <motion.div variants={itemVariants} className="no-print">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            العودة للطلبات
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">حالة الطلب</h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {isOrderActive && (
                <div className="mt-4 no-print w-64">
                  <Select
                    value={order.status}
                    onValueChange={(value: OrderStatus) =>
                      handleStatusChange(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر حالة الطلب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="new"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-blue-700">
                          <AlertCircle className="w-4 h-4" />
                          جديد
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="processing"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-yellow-700">
                          <RefreshCw className="w-4 h-4" />
                          قيد المعالجة
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="shipped"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-purple-700">
                          <Truck className="w-4 h-4" />
                          تم الشحن
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="completed"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          مكتمل
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="cancelled"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-red-700">
                          <XCircle className="w-4 h-4" />
                          إلغاء
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="border border-gray-100 rounded-lg p-4 flex gap-4"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        {/* Display variants */}
                        {item.variants && item.variants.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-1">
                            {item.variants.map((variant, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 px-2 py-1 rounded-md"
                              >
                                {variant.name}: {variant.value}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Display color and size */}
                        <div className="flex flex-wrap gap-3 mt-1">
                          {item.color && (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">اللون:</span>
                              <span className="flex items-center gap-1">
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      item.colorCode || item.color,
                                  }}
                                ></span>
                                {item.color}
                              </span>
                            </span>
                          )}
                          {item.size && (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">المقاس:</span>
                              <span>{item.size}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          <span className="text-gray-600">الكمية: </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="font-bold text-purple-700">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-sm text-gray-500 mr-1">
                            × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">معلومات الشحن</h2>

              {order.shipping.company && (
                <div className="space-y-4 border-t pt-4">
                  {/* شركة الشحن */}
                  <div className="flex items-center gap-2">
                    <Truck className="text-gray-500 w-5 h-5" />
                    <span className="font-medium">شركة الشحن:</span>
                    <span className="text-purple-700 font-bold">
                      {order.shipping.company.toUpperCase()}
                    </span>
                  </div>

                  {/* رقم التتبع مع أزرار نسخ وطباعة */}
                  {order.shipping.trackingNumber && (
                    <div className="flex items-center gap-2">
                      <Package className="text-gray-500 w-5 h-5" />
                      <span className="font-medium">رقم التتبع:</span>
                      <span>{order.shipping.trackingNumber}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="no-print"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            order.shipping.trackingNumber
                          );
                        }}
                      >
                        نسخ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="no-print"
                        onClick={() =>
                          handlePrintLabel(order.shipping.trackingNumber)
                        }
                      >
                        طباعة بوليصة
                      </Button>
                    </div>
                  )}

                  {/* حالة الشحنة */}
                  {order.shipping.status && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">حالة الشحنة:</span>
                      <span className="text-blue-600 font-semibold">
                        {order.shipping.status}
                      </span>
                    </div>
                  )}

                  {/* تاريخ الاستلام */}
                  {order.shipping.estimatedPickupDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500 w-5 h-5" />
                      <span className="font-medium">
                        تاريخ الاستلام المتوقع:
                      </span>
                      <span>
                        {formatDate(order.shipping.estimatedPickupDate)}
                      </span>
                    </div>
                  )}

                  {/* تاريخ التوصيل */}
                  {order.shipping.estimatedDeliveryDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500 w-5 h-5" />
                      <span className="font-medium">
                        تاريخ التوصيل المتوقع:
                      </span>
                      <span>
                        {formatDate(order.shipping.estimatedDeliveryDate)}
                      </span>
                      {order.shipping.mayArriveSooner && (
                        <span className="text-green-600 text-sm">
                          (قد يصل مبكراً)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!order.shipping.company && isOrderActive && (
                <div className="text-center text-gray-500 py-4">
                  يرجى اختيار شركة الشحن لعرض معلومات الشحن
                </div>
              )}

              {!isOrderActive && !order.shipping.company && (
                <div className="text-center text-gray-500 py-4">
                  لا توجد معلومات شحن لهذا الطلب
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="space-y-6">
            {/* Customer Information */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">معلومات العميل</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="text-gray-500 w-5 h-5" />
                  <span className="font-medium">الاسم:</span>
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="text-gray-500 w-5 h-5 mt-1" />
                  <span className="font-medium mt-1">العنوان:</span>
                  <div>
                    <p>{order.customer.address}</p>
                    <p>
                      {order.customer.city}, {order.customer.postalCode}
                    </p>
                    <p>{order.customer.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-500 w-5 h-5" />
                  <span className="font-medium">الهاتف:</span>
                  <span dir="ltr">{order.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">البريد الإلكتروني:</span>
                  <span>{order.customer.email}</span>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تكلفة الشحن:</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>الإجمالي:</span>
                    <span className="text-purple-700">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Date */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500 w-5 h-5" />
                <span className="font-medium">تاريخ الطلب:</span>
                <span>{formatDate(order.date)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
