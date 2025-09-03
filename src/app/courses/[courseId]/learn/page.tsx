"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Play,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Download,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
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

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  downloadUrl?: string;
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
  expanded?: boolean;
}

// Dummy data for demonstration
const courseData = {
  id: "1",
  title: "تطوير تطبيقات الويب المتقدمة",
  instructor: "أحمد محمد",
  progress: 40,
  units: [
    {
      id: "1",
      title: "مقدمة في تطوير الويب المتقدم",
      lessons: [
        {
          id: "1",
          title: "نظرة عامة على المنهج",
          duration: "10:00",
          completed: true,
          videoUrl: "https://example.com/video1.mp4",
          downloadUrl: "https://example.com/materials1.pdf",
        },
        {
          id: "2",
          title: "إعداد بيئة التطوير",
          duration: "15:00",
          completed: false,
          videoUrl: "https://example.com/video2.mp4",
          downloadUrl: "https://example.com/materials2.pdf",
        },
      ],
    },
    {
      id: "2",
      title: "أساسيات React.js",
      lessons: [
        {
          id: "3",
          title: "مكونات React",
          duration: "20:00",
          completed: false,
          videoUrl: "https://example.com/video3.mp4",
          downloadUrl: "https://example.com/materials3.pdf",
        },
        {
          id: "4",
          title: "إدارة الحالة في React",
          duration: "25:00",
          completed: false,
          videoUrl: "https://example.com/video4.mp4",
          downloadUrl: "https://example.com/materials4.pdf",
        },
      ],
    },
  ],
};

export default function CourseLearnPage() {
  const [units, setUnits] = useState<Unit[]>(
    courseData.units.map((unit) => ({ ...unit, expanded: false }))
  );
  const [currentLesson, setCurrentLesson] = useState<Lesson>(
    courseData.units[0].lessons[0]
  );
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState("");

  const toggleUnit = (unitId: string) => {
    setUnits(
      units.map((unit) =>
        unit.id === unitId ? { ...unit, expanded: !unit.expanded } : unit
      )
    );
  };

  const markLessonComplete = (lessonId: string) => {
    setUnits(
      units.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        ),
      }))
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50"
    >
      {/* Course Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{courseData.title}</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                تقدمك: {courseData.progress}%
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${courseData.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <motion.div
              variants={itemVariants}
              className="aspect-video bg-black rounded-xl relative"
            >
              {/* Replace with actual video player */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Play size={48} />
              </div>
            </motion.div>

            {/* Lesson Title and Actions */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                <button
                  onClick={() => markLessonComplete(currentLesson.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  إكمال الدرس
                </button>
              </div>

              {currentLesson.downloadUrl && (
                <a
                  href={currentLesson.downloadUrl}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Download size={20} />
                  تحميل المواد التعليمية
                </a>
              )}
            </motion.div>

            {/* Notes Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center justify-between w-full"
              >
                <h3 className="text-xl font-bold">ملاحظاتي</h3>
                {showNotes ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {showNotes && (
                <div className="mt-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="اكتب ملاحظاتك هنا..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Course Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">محتوى الدورة</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {units.map((unit) => (
                <div key={unit.id} className="">
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                        {
                          unit.lessons.filter((lesson) => lesson.completed)
                            .length
                        }
                        /{unit.lessons.length}
                      </span>
                      <h3 className="font-medium">{unit.title}</h3>
                    </div>
                    {unit.expanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {unit.expanded && (
                    <div className="bg-gray-50 divide-y divide-gray-100">
                      {unit.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors ${
                            currentLesson.id === lesson.id ? "bg-purple-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center">
                              {lesson.completed ? (
                                <CheckCircle
                                  className="text-green-600"
                                  size={24}
                                />
                              ) : (
                                <Play className="text-gray-400" size={24} />
                              )}
                            </span>
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {lesson.duration}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
