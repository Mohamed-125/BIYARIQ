import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialog";
import Label from "../../../components/ui/Label";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { toast } from "sonner";
interface CustomField {
  id: string;
  name: string;
  value: string;
  type: "text" | "date" | "number" | "url" | "file";
}

const AddCustomFieldDialog = ({
  open,
  setOpen,
  warehouse,
  setWarehouse,
  onSubmit,
}) => {
  const [selectedType, setSelectedType] = useState<
    "text" | "date" | "number" | "url" | "file"
  >("text");
  // إضافة حقل مخصص جديد
  const handleAddCustomField = (data: Omit<CustomField, "id">) => {
    const newCustomField: CustomField = {
      id: `cf${warehouse.customFields.length + 1}`,
      ...data,
    };

    const updatedWarehouse = {
      ...warehouse,
      customFields: [...warehouse.customFields, newCustomField],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setWarehouse(updatedWarehouse);
    setOpen(false);
    toast.success("تم إضافة الحقل المخصص بنجاح");
  };

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة حقل مخصص</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddCustomField({
              name: formData.get("name") as string,
              value: formData.get("value") as string,
              type: formData.get("type") as
                | "text"
                | "date"
                | "number"
                | "url"
                | "file",
            });
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">اسم الحقل</Label>
            <Input
              id="name"
              name="name"
              placeholder="أدخل اسم الحقل"
              required
            />
          </div>

          {/* نحدد النوع */}
          <div>
            <Label htmlFor="type">نوع الحقل</Label>
            <select
              id="type"
              name="type"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              required
            >
              <option value="text">نص</option>
              <option value="date">تاريخ</option>
              <option value="number">رقم</option>
              <option value="url">رابط</option>
              <option value="file">ملف</option>
            </select>
          </div>

          {/* حقل القيمة يتغير حسب النوع */}
          <div>
            <Label htmlFor="value">قيمة الحقل</Label>
            {selectedType === "file" ? (
              <Input id="value" name="value" type="file" required />
            ) : (
              <Input
                id="value"
                name="value"
                type={selectedType}
                placeholder="أدخل قيمة الحقل"
                required
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCustomFieldDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">إضافة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomFieldDialog;
