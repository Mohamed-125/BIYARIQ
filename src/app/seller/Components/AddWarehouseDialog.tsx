import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import { useState } from "react";

type WarehouseFormData = {
  name: string;
  description?: string;
  location: {
    city: string;
    address: string;
  };
  manager: {
    name: string;
    phone: string;
  };
  minStockLevel?: number;
  maxStockLevel?: number;
};

interface AddWarehouseDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: WarehouseFormData) => void;
}

export default function AddWarehouseDialog({
  open,
  setOpen,
  onSubmit,
}: AddWarehouseDialogProps) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مستودع جديد</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newWarehouse: WarehouseFormData = {
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              location: {
                city: formData.get("city") as string,
                address: formData.get("address") as string,
              },
              manager: {
                name: formData.get("managerName") as string,
                phone: formData.get("managerPhone") as string,
              },
              minStockLevel: formData.get("minStockLevel")
                ? parseInt(formData.get("minStockLevel") as string)
                : undefined,
              maxStockLevel: formData.get("maxStockLevel")
                ? parseInt(formData.get("maxStockLevel") as string)
                : undefined,
            };

            onSubmit(newWarehouse);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">اسم المستودع</Label>
            <Input
              id="name"
              name="name"
              placeholder="أدخل اسم المستودع"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              name="description"
              placeholder="أدخل وصف المستودع"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                name="city"
                placeholder="أدخل المدينة"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                name="address"
                placeholder="أدخل العنوان"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="managerName">اسم المسؤول</Label>
              <Input
                id="managerName"
                name="managerName"
                placeholder="أدخل اسم المسؤول"
                required
              />
            </div>
            <div>
              <Label htmlFor="managerPhone">رقم الهاتف</Label>
              <Input
                id="managerPhone"
                name="managerPhone"
                placeholder="أدخل رقم الهاتف"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStockLevel">الحد الأدنى للمخزون</Label>
              <Input
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                placeholder="أدخل الحد الأدنى"
              />
            </div>
            <div>
              <Label htmlFor="maxStockLevel">الحد الأقصى للمخزون</Label>
              <Input
                id="maxStockLevel"
                name="maxStockLevel"
                type="number"
                placeholder="أدخل الحد الأقصى"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">إضافة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
