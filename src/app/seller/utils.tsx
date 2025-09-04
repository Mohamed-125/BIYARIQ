import {
  AlertCircle,
  CheckCircle,
  Edit,
  FileDown,
  FileUp,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

// الحصول على لون حالة المعاملة
export const getTransactionColor = (
  action: "add" | "remove" | "update" | "export" | "import"
) => {
  switch (action) {
    case "add":
      return "text-green-600";
    case "remove":
      return "text-red-600";
    case "update":
      return "text-blue-600";
    case "export":
      return "text-orange-600";
    case "import":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

// الحصول على أيقونة حالة المعاملة
export const getTransactionIcon = (
  action: "add" | "remove" | "update" | "export" | "import"
) => {
  switch (action) {
    case "add":
      return <Plus className="w-4 h-4" />;
    case "remove":
      return <Trash2 className="w-4 h-4" />;
    case "update":
      return <Edit className="w-4 h-4" />;
    case "export":
      return <FileUp className="w-4 h-4" />;
    case "import":
      return <FileDown className="w-4 h-4" />;
    default:
      return null;
  }
};

export const warehouseStatusColors = {
  available: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "متوفر",
    icon: CheckCircle,
  },
  low: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "مخزون منخفض",
    icon: AlertCircle,
  },
  unavailable: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "غير متوفر",
    icon: XCircle,
  },
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};
