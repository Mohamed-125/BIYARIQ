import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Package, X, CheckCircle } from "lucide-react";
import Input from "@/components/ui/Input";

interface Warehouse {
  id: string;
  name: string;
  description: string;
  location?: string;
  manager: {
    phone: string;
    name: string;
  };
  availableItems: number;
  totalItems: number;
  isPrimary?: boolean;
  stock?: number;
}

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
  selectedWarehouses: Warehouse[];
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onWarehouseRemove: (warehouseId: string) => void;
  onPrimaryWarehouseChange: (warehouseId: string) => void;
  onStockChange: (warehouseId: string, stock: number) => void;
  isDigital?: boolean;
  error?: string;
  availableQuantity: number;
  handleAvailableQuantityChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
  warehouses,
  selectedWarehouses,
  onWarehouseSelect,
  onWarehouseRemove,
  onPrimaryWarehouseChange,
  onStockChange,
  isDigital = false,
  error,
  availableQuantity,
  handleAvailableQuantityChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (warehouses.length > 0 && selectedWarehouses.length === 0) {
      const firstWarehouse = warehouses[0];
      onWarehouseSelect(firstWarehouse);
      onPrimaryWarehouseChange(firstWarehouse.id);
    }
  }, [warehouses]);

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (warehouse.location?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)
  );

  const handleStockChange = (warehouseId: string, value: string) => {
    const stock = parseInt(value) || 0;
    if (stock >= 0) {
      const totalStock = selectedWarehouses.reduce((sum, w) => {
        return sum + (w.id === warehouseId ? stock : w.stock || 0);
      }, 0);
      
      onStockChange(warehouseId, stock);
      handleAvailableQuantityChange({ target: { value: totalStock.toString() } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      <motion.section
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">
          اختيار المستودعات {isDigital ? "الرقمية" : "المادية"}
        </h2>

        {/* البحث عن المستودعات */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البحث عن مستودع
          </label>
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`ابحث باسم المستودع أو الوصف${
                !isDigital ? " أو الموقع" : ""
              }`}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* قائمة المستودعات المتاحة */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3">المستودعات المتاحة</h3>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : filteredWarehouses.length > 0 ? (
              <div className="space-y-2">
                {filteredWarehouses.map((warehouse) => {
                  const isSelected = selectedWarehouses.some(
                    (w) => w.id === warehouse.id
                  );
                  return (
                    <div
                      key={warehouse.id}
                      className={`p-3 border ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-300"
                      } rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
                      onClick={() =>
                        !isSelected && onWarehouseSelect(warehouse)
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{warehouse.name}</h4>
                          <p className="text-sm text-gray-600">
                            {warehouse.description}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            <span className="mr-3">
                              {warehouse.manager?.name}
                            </span>
                            <Package className="h-3 w-3 mr-1" />
                            <span>
                              {warehouse.availableItems} /{" "}
                              {warehouse.totalItems} متاح
                            </span>
                            {!isDigital && warehouse.location && (
                              <span className="mr-3">{warehouse.location}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div
                            className={`h-5 w-5 rounded-full border ${
                              isSelected
                                ? "bg-purple-500 border-purple-500"
                                : "border-gray-300"
                            } flex items-center justify-center`}
                          >
                            {isSelected && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                لا توجد مستودعات مطابقة لبحثك
              </div>
            )}
          </div>
        </div>

        {/* المستودعات المختارة */}
        <div>
          <h3 className="text-md font-medium mb-3">
            المستودعات المختارة ({selectedWarehouses.length})
          </h3>
          {selectedWarehouses.length > 0 ? (
            <div className="space-y-2">
              {selectedWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{warehouse.name}</h4>
                        {warehouse.isPrimary && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            المستودع الرئيسي
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {warehouse.description}
                      </p>
                      <div className="flex items-center mt-2 gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            الكمية المتوفرة
                          </label>
                          <Input
                            type="number"
                            min="1"
                            required
                            value={warehouse.stock || undefined}
                            onChange={(e) =>
                              handleStockChange(warehouse.id, e.target.value)
                            }
                            className="w-full px-3 py-1 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="primaryWarehouse"
                            checked={warehouse.isPrimary}
                            onChange={() =>
                              onPrimaryWarehouseChange(warehouse.id)
                            }
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <label className="text-sm text-gray-600">
                            مستودع رئيسي
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onWarehouseRemove(warehouse.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-gray-300 rounded-lg text-gray-500">
              لم تقم باختيار أي مستودع بعد
            </div>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </motion.section>
      {/* Available Quantity */}
      <motion.section
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">الكمية المتوفرة</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الكمية المتوفرة *
            </label>
            <Input
              type="number"
              defaultValue={
                selectedWarehouses.length > 0 ? availableQuantity : null
              }
              onChange={handleAvailableQuantityChange}
              disabled={selectedWarehouses.length > 0}
              placeholder="أدخل الكمية المتوفرة"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {selectedWarehouses.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                * يتم حساب الكمية المتوفرة تلقائياً من مجموع المخزون في
                المستودعات المختارة
              </p>
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};
