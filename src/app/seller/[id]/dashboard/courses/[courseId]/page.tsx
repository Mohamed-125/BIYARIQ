"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  Clock,
  Users,
  BookOpen,
  MessageSquare,
  BarChart,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  label,
  input,
  p,
  div,
  button,
  form,
  h2,
  h3,
} from "framer-motion/client";
import Button from "../../../../../../components/ui/Button";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  order: number;
  isPublished: boolean;
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

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
}

interface Reply {
  id: string;
  content: string;
  authorName: string;
  date: string;
  isInstructor: boolean;
}

interface Question {
  id: string;
  studentName: string;
  question: string;
  date: string;
  lessonTitle: string;
  isAnswered: boolean;
  replies: Reply[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  enrolledStudents: number;
  lessons: Lesson[];
  units?: CourseUnit[];
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

const initialStudents: Student[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    progress: 75,
    lastActive: "منذ يومين",
  },
  {
    id: "2",
    name: "سارة علي",
    email: "sara@example.com",
    progress: 45,
    lastActive: "منذ 3 ساعات",
  },
  {
    id: "3",
    name: "محمد خالد",
    email: "mohamed@example.com",
    progress: 90,
    lastActive: "منذ 5 دقائق",
  },
  {
    id: "4",
    name: "فاطمة أحمد",
    email: "fatima@example.com",
    progress: 20,
    lastActive: "منذ أسبوع",
  },
];

const initialQuestions: Question[] = [
  {
    id: "1",
    studentName: "أحمد محمد",
    question: "هل يمكنني استخدام Vite بدلاً من Create React App؟",
    date: "منذ 3 أيام",
    lessonTitle: "مقدمة في React",
    isAnswered: true,
    replies: [
      {
        id: "1",
        content:
          "شكراً على سؤالك! نعم، يمكنك استخدام Vite بدلاً من Create React App، وهو في الواقع أسرع وأكثر كفاءة في معظم الحالات.",
        authorName: "المدرس",
        date: "منذ 2 أيام",
        isInstructor: true,
      },
      {
        id: "2",
        content: "شكراً جزيلاً على الإجابة، سأجرب Vite في مشروعي القادم.",
        authorName: "أحمد محمد",
        date: "منذ يوم",
        isInstructor: false,
      },
    ],
  },
  {
    id: "2",
    studentName: "سارة علي",
    question: "كيف يمكنني استخدام Context API مع TypeScript؟",
    date: "منذ يومين",
    lessonTitle: "إدارة الحالة",
    isAnswered: false,
    replies: [],
  },
  {
    id: "3",
    studentName: "محمد خالد",
    question: "ما هو الفرق بين useState و useReducer؟",
    date: "منذ 5 ساعات",
    lessonTitle: "إدارة الحالة",
    isAnswered: false,
    replies: [],
  },
];

const dummyCourse: Course = {
  id: "1",
  title: "تطوير تطبيقات الويب باستخدام React",
  description:
    "تعلم كيفية بناء تطبيقات ويب حديثة باستخدام React وأحدث التقنيات",
  thumbnail: "/course-thumbnail.jpg",
  price: 199,
  enrolledStudents: 45,
  units: [
    {
      id: "unit1",
      title: "أساسيات React",
      lessons: [
        {
          id: "l1",
          title: "مقدمة في React",
          duration: "45:00",
          isCompleted: true,
        },
        {
          id: "l2",
          title: "إعداد بيئة التطوير",
          duration: "30:00",
          isCompleted: true,
        },
      ],
    },
    {
      id: "unit2",
      title: "المكونات والخصائص",
      lessons: [
        {
          id: "l3",
          title: "إنشاء المكونات",
          duration: "55:00",
          isCompleted: false,
        },
        {
          id: "l4",
          title: "استخدام الخصائص",
          duration: "40:00",
          isCompleted: false,
        },
      ],
    },
    {
      id: "unit3",
      title: "إدارة الحالة",
      lessons: [
        {
          id: "l5",
          title: "استخدام useState",
          duration: "50:00",
          isCompleted: false,
        },
        {
          id: "l6",
          title: "استخدام useContext",
          duration: "45:00",
          isCompleted: false,
        },
        {
          id: "l7",
          title: "استخدام useReducer",
          duration: "60:00",
          isCompleted: false,
        },
      ],
    },
  ],
  lessons: [
    {
      id: "1",
      title: "مقدمة في React",
      duration: "45:00",
      description: "تعرف على أساسيات React وكيفية إعداد بيئة التطوير",
      videoUrl: "https://example.com/video1.mp4",
      order: 1,
      isPublished: true,
    },
    {
      id: "2",
      title: "المكونات والخصائص",
      duration: "55:00",
      description: "تعلم كيفية إنشاء وإدارة المكونات والخصائص في React",
      videoUrl: "https://example.com/video2.mp4",
      order: 2,
      isPublished: true,
    },
    {
      id: "3",
      title: "إدارة الحالة",
      duration: "60:00",
      description: "فهم كيفية إدارة حالة التطبيق باستخدام useState وuseContext",
      videoUrl: "https://example.com/video3.mp4",
      order: 3,
      isPublished: false,
    },
  ],
};

export default function CourseLessonsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [course, setCourse] = useState<Course>(dummyCourse);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "content" | "students" | "questions"
  >("content");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [replyingToQuestion, setReplyingToQuestion] = useState<string | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Lesson>();

  const onSubmit = (data: Lesson) => {
    if (editingLesson) {
      // Update existing lesson
      const updatedLessons = course.lessons.map((lesson) =>
        lesson.id === editingLesson.id ? { ...lesson, ...data } : lesson
      );
      setCourse({ ...course, lessons: updatedLessons });
      toast.success("تم تحديث الدرس بنجاح");
    } else {
      // Add new lesson
      const newLesson = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        order: course.lessons.length + 1,
        isPublished: false,
      };
      setCourse({ ...course, lessons: [...course.lessons, newLesson] });
      toast.success("تم إضافة الدرس بنجاح");
    }
    setEditingLesson(null);
    setIsAddingLesson(false);
    reset();
  };

  const handleDeleteLesson = (lessonId: string) => {
    const updatedLessons = course.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );
    setCourse({ ...course, lessons: updatedLessons });
    toast.success("تم حذف الدرس بنجاح");
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsAddingLesson(true);
    reset(lesson);
  };

  const handleAnswerQuestion = (questionId: string) => {
    setReplyingToQuestion(questionId);
  };

  const handleSubmitReply = (questionId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: Math.random().toString(36).substr(2, 9),
      content: replyContent,
      authorName: "المدرس",
      date: "الآن",
      isInstructor: true,
    };

    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          isAnswered: true,
          replies: [...q.replies, newReply],
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setReplyContent("");
    setReplyingToQuestion(null);
    toast.success("تم إضافة الرد بنجاح");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto py-8 px-4"
    >
      {/* Course Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="text-gray-400" />
              <span className="text-gray-600">
                {course.enrolledStudents} طالب
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" />
              <span className="text-gray-600">
                {course.lessons.length} دروس
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
              activeTab === "content"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BookOpen size={18} />
            محتوى الدورة
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
              activeTab === "students"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users size={18} />
            الطلاب
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
              activeTab === "questions"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare size={18} />
            الأسئلة
          </button>
        </div>
      </motion.div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-semibold">محتوى الدورة</h2>
              <Button>
                <Link
                  href={"/seller/test-seller/dashboard/courses/add"}
                  className="flex gap-2 items-center"
                >
                  تعديل
                  <Edit />
                </Link>
              </Button>
            </div>
            <div className="space-y-6">
              {course.units?.map((unit, unitIndex) => (
                <div
                  key={unit.id}
                  className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden bg-white"
                >
                  {/* Header of Unit */}
                  <div className="bg-gray-50/80 p-5 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      الوحدة {unitIndex + 1}: {unit.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {unit.lessons.length} درس
                    </span>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-gray-100">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="p-5 hover:bg-gray-50/60 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          {/* Lesson Info */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-400">
                              {unitIndex + 1}.{lessonIndex + 1}
                            </span>
                            <h4 className="font-medium text-gray-800">
                              {lesson.title}
                            </h4>
                          </div>

                          {/* Lesson Actions */}
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-2">الطلاب المسجلين</h2>
            <p className="text-gray-500">
              إدارة ومتابعة تقدم الطلاب في الدورات
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-right">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطالب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    آخر نشاط
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {student.progress}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900">
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-2">أسئلة الطلاب</h2>
            <p className="text-gray-500">
              الإجابة على استفسارات الطلاب حول محتوى الدورات
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {questions.map((question) => (
              <div
                key={question.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {question.studentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{question.studentName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>الدرس: {question.lessonTitle}</span>
                        <span>•</span>
                        <span>{question.date}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        question.isAnswered
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {question.isAnswered ? "تمت الإجابة" : "بانتظار الإجابة"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 mb-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {question.question}
                </div>

                {/* Replies Section */}
                {question.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {question.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-lg ${
                          reply.isInstructor ? "bg-purple-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {reply.authorName}
                            </span>
                            {reply.isInstructor && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                                مدرس
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {reply.date}
                          </span>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingToQuestion === question.id ? (
                  <div className="mt-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setReplyingToQuestion(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleSubmitReply(question.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        إرسال الرد
                      </button>
                    </div>
                  </div>
                ) : (
                  !question.isAnswered && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleAnswerQuestion(question.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        الرد على السؤال
                      </button>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
