"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

interface Variant {
  name: string;
  type: "text" | "number" | "date" | "color";
  value: string;
  quantity: number;
  wholesalePrice: number;
  sellingPrice: number;
  profitMargin: number;
}

interface ProductVariantsProps {
  variants: Variant[];
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
  isDigital?: boolean;
  totalQuantity: number;
  wholesalePrice: number;
  sellingPrice: number;
  profitMargin: number;
}

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

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  variants,
  setVariants,
  isDigital = false,
  totalQuantity,
  wholesalePrice,
  sellingPrice,
  profitMargin,
}) => {
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        type: "text",
        value: "",
        quantity: 0,
        wholesalePrice,
        sellingPrice,
        profitMargin,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    const variant = newVariants[index];

    if (field === "quantity") {
      const newQuantity = parseInt(value) || 0;
      variant.quantity = newQuantity;
    } else if (
      field === "wholesalePrice" ||
      field === "sellingPrice" ||
      field === "profitMargin"
    ) {
      const numValue = parseFloat(value) || 0;
      variant[field] = numValue;

      // العلاقات الحسابية المستقلة لكل Variant
      if (field === "wholesalePrice" && variant.sellingPrice > 0) {
        variant.profitMargin =
          ((variant.sellingPrice - numValue) / numValue) * 100;
      } else if (field === "sellingPrice" && variant.wholesalePrice > 0) {
        variant.profitMargin =
          ((numValue - variant.wholesalePrice) / variant.wholesalePrice) * 100;
      } else if (field === "profitMargin" && variant.wholesalePrice > 0) {
        variant.sellingPrice = variant.wholesalePrice * (1 + numValue / 100);
      }
    } else {
      variant[field] = value;
    }

    setVariants(newVariants);
  };

  const totalVariantsQuantity = variants.reduce(
    (sum, variant) => sum + variant.quantity,
    0
  );

  console.log("totalVariantsQuantity", totalVariantsQuantity);
  return (
    <>
      <motion.section
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">المتغيرات</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={addVariant}
              type="button"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة متغير
            </Button>
          </div>

          {variants.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              لا توجد متغيرات مضافة. أضف متغير جديد للبدء.
            </p>
          )}

          {variants.map((variant, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">متغير #{index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>اسم المتغير</Label>
                  <Input
                    placeholder="مثال: اللون، المقاس، التاريخ"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(index, "name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>نوع المتغير</Label>
                  <Select
                    value={variant.type}
                    onValueChange={(value) =>
                      updateVariant(index, "type", value as Variant["type"])
                    }
                    placeholder="اختر نوع المتغير"
                  >
                    <SelectItem value="text">نص</SelectItem>
                    <SelectItem value="number">رقم</SelectItem>
                    <SelectItem value="date">تاريخ</SelectItem>
                    {!isDigital && <SelectItem value="color">لون</SelectItem>}
                  </Select>
                </div>

                <div>
                  <Label>القيمة</Label>
                  {variant.type === "color" ? (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={variant.value}
                        onChange={(e) =>
                          updateVariant(index, "value", e.target.value)
                        }
                        className="w-12"
                      />
                      <Input
                        type="text"
                        value={variant.value}
                        onChange={(e) =>
                          updateVariant(index, "value", e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      type={variant.type}
                      value={variant.value}
                      onChange={(e) =>
                        updateVariant(index, "value", e.target.value)
                      }
                      placeholder={variant.type === "date" ? "YYYY-MM-DD" : ""}
                    />
                  )}
                </div>

                <div>
                  <Label>الكمية</Label>
                  <Input
                    required
                    type="number"
                    value={variant.quantity || undefined}
                    onChange={(e) =>
                      updateVariant(index, "quantity", e.target.value)
                    }
                    min={0}
                  />
                </div>

                {/* الأسعار */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 col-span-4">
                  <div>
                    <Label>سعر الجملة</Label>
                    <Input
                      type="number"
                      value={variant.wholesalePrice}
                      onChange={(e) =>
                        updateVariant(index, "wholesalePrice", e.target.value)
                      }
                      min={0}
                      step="1"
                    />
                  </div>

                  <div>
                    <Label>سعر البيع</Label>
                    <Input
                      type="number"
                      value={variant.sellingPrice}
                      onChange={(e) =>
                        updateVariant(index, "sellingPrice", e.target.value)
                      }
                      min={0}
                      step="1"
                    />
                  </div>

                  <div>
                    <Label>نسبة الربح (%)</Label>
                    <Input
                      type="number"
                      value={variant.profitMargin}
                      onChange={(e) =>
                        updateVariant(index, "profitMargin", e.target.value)
                      }
                      min={0}
                      step="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
      <motion.section
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">إجمالي الكميه</h2>

        <Label>إجمالي الكميه </Label>
        <Input
          value={variants.length > 0 ? totalVariantsQuantity : undefined}
          disabled={variants.length > 0}
        />
      </motion.section>
    </>
  );
};
