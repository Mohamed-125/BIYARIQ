"use client";

import { motion } from "framer-motion";
import { div } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { FiBookOpen, FiAward, FiPlay, FiUser } from "react-icons/fi";

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

interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  certificateAvailable: boolean;
  certificateUrl?: string;
  lastAccessedLesson: {
    title: string;
    module: string;
    url: string;
  };
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "تطوير تطبيقات الويب المتقدمة",
    instructor: {
      name: "أحمد محمد",
      avatar: "/images/instructor1.jpg",
    },
    coverImage:
      "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png",
    progress: 75,
    totalLessons: 48,
    completedLessons: 36,
    certificateAvailable: false,
    lastAccessedLesson: {
      title: "تطبيق مصادقة المستخدمين",
      module: "الأمان والمصادقة",
      url: "/courses/1/module-5/lesson-3",
    },
  },
  {
    id: "2",
    title: "تصميم واجهات المستخدم الحديثة",
    instructor: {
      name: "سارة أحمد",
      avatar: "/images/instructor2.jpg",
    },
    coverImage:
      "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png",
    progress: 100,
    totalLessons: 36,
    completedLessons: 36,
    certificateAvailable: true,
    certificateUrl: "/certificates/ui-design",
    lastAccessedLesson: {
      title: "المشروع النهائي",
      module: "إنهاء المشروع",
      url: "/courses/2/module-8/lesson-5",
    },
  },
];

export default function CoursesPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">دوراتي</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <FiBookOpen className="w-5 h-5" />
          <span>عدد الدورات: {mockCourses.length}</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {mockCourses.map((course) => (
          <motion.div
            key={course.id}
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative h-48">
              {/* <Image
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-cover"
              /> */}
              <img
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-cover w-full h-full"
              />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                {course.certificateAvailable && (
                  <Link
                    href={course.certificateUrl || "#"}
                    className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors"
                  >
                    <FiAward className="w-4 h-4" />
                    <span>الشهادة</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* <div className="w-8 h-8 relative rounded-full overflow-hidden"> */}
                {/* <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  /> */}
                {/* </div> */}
                <div className="flex items-center gap-1 text-gray-600">
                  <FiUser className="w-4 h-4" />
                  <span>{course.instructor.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {course.completedLessons} من {course.totalLessons} درس
                  </span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">آخر درس تم الوصول إليه:</span>
                </div>
                <Link
                  href={course.lastAccessedLesson.url}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div>
                    <p className="font-medium">
                      {course.lastAccessedLesson.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {course.lastAccessedLesson.module}
                    </p>
                  </div>
                  <FiPlay className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                </Link>
              </div>

              <Link
                href={`/courses/${course.id}`}
                className="block w-full text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mt-4"
              >
                متابعة التعلم
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
