"use client";

import { motion } from "framer-motion";
import { FiDownload, FiClock, FiCalendar, FiFile } from "react-icons/fi";

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

interface Download {
  id: string;
  title: string;
  fileType: string;
  downloadCount: number;
  maxDownloads: number;
  expiryDate: string;
  downloadHistory: {
    date: string;
    ip: string;
  }[];
  fileUrl: string;
}

const mockDownloads: Download[] = [
  {
    id: "1",
    title: "كتاب تعلم البرمجة للمبتدئين",
    fileType: "PDF",
    downloadCount: 2,
    maxDownloads: 5,
    expiryDate: "2024-12-31",
    downloadHistory: [
      { date: "2024-01-15", ip: "192.168.1.1" },
      { date: "2024-01-16", ip: "192.168.1.2" },
    ],
    fileUrl: "/files/programming-book.pdf",
  },
  {
    id: "2",
    title: "برنامج تحرير الصور",
    fileType: "ZIP",
    downloadCount: 1,
    maxDownloads: 3,
    expiryDate: "2024-06-30",
    downloadHistory: [{ date: "2024-01-15", ip: "192.168.1.1" }],
    fileUrl: "/files/photo-editor.zip",
  },
];

export default function DownloadsPage() {
  const handleDownload = (download: Download) => {
    // Handle download logic here
    console.log(`Downloading ${download.title}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">تنزيلاتي</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <FiDownload className="w-5 h-5" />
          <span>إجمالي التنزيلات: {mockDownloads.reduce((acc, curr) => acc + curr.downloadCount, 0)}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {mockDownloads.map((download) => (
          <motion.div
            key={download.id}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{download.title}</h3>
                <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <FiFile className="w-4 h-4" />
                    <span>{download.fileType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiDownload className="w-4 h-4" />
                    <span>
                      {download.downloadCount} من {download.maxDownloads} تنزيلات
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>تاريخ الانتهاء: {new Date(download.expiryDate).toLocaleDateString("ar-SA")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">سجل التنزيلات:</h4>
                  {download.downloadHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <FiClock className="w-4 h-4" />
                      <span>{new Date(history.date).toLocaleDateString("ar-SA")}</span>
                      <span className="text-gray-400">|</span>
                      <span dir="ltr">{history.ip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDownload(download)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <FiDownload className="w-4 h-4" />
                <span>تنزيل</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(download.downloadCount / download.maxDownloads) * 100}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}