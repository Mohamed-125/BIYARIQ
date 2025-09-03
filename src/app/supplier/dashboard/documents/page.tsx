"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Download, Upload, File } from "lucide-react";

const documents = [
  {
    id: "DOC-001",
    name: "عقد التوريد",
    type: "pdf",
    uploadedBy: "المورد",
    date: "2024-01-15",
  },
  {
    id: "DOC-002",
    name: "شهادة ضمان الجودة",
    type: "pdf",
    uploadedBy: "المورد",
    date: "2024-01-10",
  },
  {
    id: "DOC-003",
    name: "دليل المواصفات",
    type: "pdf",
    uploadedBy: "الشركة",
    date: "2024-01-05",
  },
];

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">المرفقات</h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
          <Upload className="ml-2" />
          رفع مستند جديد
        </Button>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="p-6 bg-white shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <File className="h-6 w-6 text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold">{doc.name}</h3>
                  <p className="text-gray-500">
                    تم الرفع بواسطة: {doc.uploadedBy} | التاريخ: {doc.date}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="ml-2" />
                تحميل
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
