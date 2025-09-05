"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Download,
  ArrowLeft,
  ArrowRight,
  Send,
  User,
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

interface Question {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  answer?: {
    text: string;
    createdAt: string;
  };
}

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
// Dummy questions data for demonstration
const questionsData: Question[] = [
  {
    id: "1",
    userId: "user1",
    userName: "محمد أحمد",
    text: "كيف يمكنني تطبيق مفهوم الـ Custom Hooks في React?",
    createdAt: "2024-03-15T10:30:00",
    answer: {
      text: "Custom Hooks هي وظيفة تبدأ باسم use وتسمح لك بإعادة استخدام منطق الحالة بين المكونات. يمكنك إنشاء custom hook عن طريق استخراج منطق الحالة من المكون إلى وظيفة منفصلة.",
      createdAt: "2024-03-15T11:00:00",
    },
  },
  {
    id: "2",
    userId: "user2",
    userName: "سارة خالد",
    text: "ما هو الفرق بين useEffect و useLayoutEffect?",
    createdAt: "2024-03-16T09:15:00",
  },
];

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
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [newQuestion, setNewQuestion] = useState("");

  const getNextLesson = () => {
    let nextLesson: Lesson | null = null;
    let found = false;

    for (const unit of units) {
      for (let i = 0; i < unit.lessons.length; i++) {
        if (found && !nextLesson) {
          nextLesson = unit.lessons[i];
          break;
        }
        if (unit.lessons[i].id === currentLesson.id) {
          found = true;
        }
      }
      if (nextLesson) break;
    }

    return nextLesson;
  };

  const getPreviousLesson = () => {
    let previousLesson: Lesson | null = null;
    let found = false;

    for (const unit of units.slice().reverse()) {
      for (let i = unit.lessons.length - 1; i >= 0; i--) {
        if (found && !previousLesson) {
          previousLesson = unit.lessons[i];
          break;
        }
        if (unit.lessons[i].id === currentLesson.id) {
          found = true;
        }
      }
      if (previousLesson) break;
    }

    return previousLesson;
  };

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;

    const question: Question = {
      id: `q${questions.length + 1}`,
      userId: "current-user",
      userName: "أنت",
      text: newQuestion,
      createdAt: new Date().toISOString(),
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");
  };

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

            {/* Navigation Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between gap-4 mb-6"
            >
              {getPreviousLesson() && (
                <button
                  onClick={() => setCurrentLesson(getPreviousLesson()!)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowRight className="rtl:hidden" />
                  <ArrowLeft className="hidden rtl:block" />
                  الدرس السابق
                </button>
              )}
              {getNextLesson() && (
                <button
                  onClick={() => setCurrentLesson(getNextLesson()!)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mr-auto"
                >
                  الدرس التالي
                  <ArrowLeft className="rtl:hidden" />
                  <ArrowRight className="hidden rtl:block" />
                </button>
              )}
            </motion.div>

            {/* Questions Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm mb-6"
            >
              <button
                onClick={() => setShowQuestions(!showQuestions)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <h3 className="text-xl font-bold">الأسئلة والأجوبة</h3>
                  <span className="text-sm text-gray-500">({questions.length})</span>
                </div>
                {showQuestions ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {showQuestions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Ask Question Form */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="اكتب سؤالك هنا..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button
                        onClick={handleAskQuestion}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Send size={16} />
                        إرسال
                      </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{question.userName}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(question.createdAt).toLocaleDateString("ar-SA")}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-700">{question.text}</p>

                              {question.answer && (
                                <div className="mt-4 mr-8 p-4 bg-purple-50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-purple-700">
                                      {courseData.instructor}
                                    </span>
                                    <span className="text-sm text-purple-600">
                                      {new Date(question.answer.createdAt).toLocaleDateString(
                                        "ar-SA"
                                      )}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-gray-700">{question.answer.text}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
