"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit2, Trash2, Eye, Users, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CoursesPage from "../../../../my-courses/page";
import { div } from "framer-motion/client";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: string;
  enrolledStudents: number;
  lessonsCount: number;
  isPublished: boolean;
  createdAt: string;
  units?: CourseUnit[];
}

interface CourseUnit {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
}

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

const initialCourses: Course[] = [
  {
    id: "1",
    title: "تطوير تطبيقات الويب باستخدام React",
    description:
      "تعلم كيفية بناء تطبيقات ويب حديثة باستخدام React وأحدث التقنيات",
    thumbnail: "/course-thumbnail.jpg",
    price: 199,
    category: "programming",
    level: "intermediate",
    enrolledStudents: 45,
    lessonsCount: 12,
    isPublished: true,
    createdAt: "2024-01-15",
    units: [
      {
        id: "u1",
        title: "مقدمة في React",
        lessons: [
          { id: "l1", title: "ما هو React؟", duration: "10:15" },
          { id: "l2", title: "إعداد بيئة العمل", duration: "15:30" },
          { id: "l3", title: "المكونات والخصائص", duration: "20:45" },
        ],
      },
      {
        id: "u2",
        title: "إدارة الحالة في React",
        lessons: [
          { id: "l4", title: "استخدام useState", duration: "18:20" },
          { id: "l5", title: "استخدام useEffect", duration: "22:10" },
          { id: "l6", title: "استخدام useContext", duration: "25:05" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "تصميم واجهات المستخدم UI/UX",
    description: "دورة شاملة في تصميم واجهات المستخدم وتجربة المستخدم",
    thumbnail: "/course-thumbnail-2.jpg",
    price: 149,
    category: "design",
    level: "beginner",
    enrolledStudents: 32,
    lessonsCount: 8,
    isPublished: true,
    createdAt: "2024-01-20",
    units: [
      {
        id: "u1",
        title: "أساسيات التصميم",
        lessons: [
          { id: "l1", title: "مبادئ التصميم", duration: "12:30" },
          { id: "l2", title: "نظرية الألوان", duration: "14:45" },
        ],
      },
      {
        id: "u2",
        title: "تصميم واجهات المستخدم",
        lessons: [
          { id: "l3", title: "تصميم الشاشات", duration: "18:20" },
          { id: "l4", title: "التصميم التفاعلي", duration: "20:15" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "التسويق الرقمي الشامل",
    description:
      "تعلم استراتيجيات التسويق الرقمي وكيفية تنمية عملك عبر الإنترنت",
    thumbnail: "/course-thumbnail-3.jpg",
    price: 179,
    category: "marketing",
    level: "advanced",
    enrolledStudents: 28,
    lessonsCount: 15,
    isPublished: false,
    createdAt: "2024-01-25",
    units: [
      {
        id: "u1",
        title: "أساسيات التسويق الرقمي",
        lessons: [
          { id: "l1", title: "مقدمة في التسويق الرقمي", duration: "15:20" },
          { id: "l2", title: "تحليل السوق المستهدف", duration: "18:45" },
        ],
      },
      {
        id: "u2",
        title: "استراتيجيات التسويق عبر وسائل التواصل الاجتماعي",
        lessons: [
          { id: "l3", title: "التسويق عبر فيسبوك", duration: "22:10" },
          { id: "l4", title: "التسويق عبر انستغرام", duration: "20:30" },
        ],
      },
    ],
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    setCourses(updatedCourses);
    toast.success("تم حذف الدورة بنجاح");
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "مبتدئ";
      case "intermediate":
        return "متوسط";
      case "advanced":
        return "متقدم";
      default:
        return level;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "programming":
        return "البرمجة";
      case "design":
        return "التصميم";
      case "marketing":
        return "التسويق";
      case "business":
        return "الأعمال";
      default:
        return category;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8 px-4"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">إدارة الدورات</h1>
        <div className="flex gap-2">
          {selectedCourse && (
            <Link
              href={`/seller/dashboard/courses/${selectedCourse.id}/add`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit2 size={20} />
              تعديل الدورة
            </Link>
          )}
        </div>
      </div>

      {/* Course Management Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">قائمة الدورات التدريبية</h2>
        <p className="text-gray-500">
          إدارة وتنظيم الدورات التدريبية الخاصة بك
        </p>
      </div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="البحث عن دورة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">جميع التصنيفات</option>
              <option value="programming">البرمجة</option>
              <option value="design">التصميم</option>
              <option value="marketing">التسويق</option>
              <option value="business">الأعمال</option>
            </select>
          </div>

          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">جميع المستويات</option>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </div>
        </div>
      </motion.div>

      {!selectedCourse && (
        <>
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <Link href={`courses/${course.id}`} className="cursor-pointer">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm ${
                        course.isPublished
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {course.isPublished ? "منشور" : "مسودة"}
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <div
                    onClick={() => setSelectedCourse(course)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.enrolledStudents} طالب</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.lessonsCount} دروس</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                      {getCategoryText(course.category)}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {getLevelText(course.level)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">
                      {course.price} ريال
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/seller/dashboard/courses/${course.id}/add`}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Course Content View (Udemy-like) */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-right"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedCourse.lessonsCount} دروس
              </span>
              <span className="mx-2">•</span>
              <span className="text-sm text-gray-500">
                {selectedCourse.enrolledStudents} طالب
              </span>
            </div>
          </div>

          {/* Course Units and Lessons */}
          <div className="space-y-4">
            {selectedCourse.units?.map((unit, unitIndex) => (
              <div
                key={unit.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <h3 className="font-medium">
                    الوحدة {unitIndex + 1}: {unit.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {unit.lessons.length} دروس
                  </span>
                </div>
                <div className="divide-y divide-gray-200">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">
                            {unitIndex + 1}.{lessonIndex + 1}
                          </span>
                          <h4 className="font-medium">{lesson.title}</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {lesson.duration}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
