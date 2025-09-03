"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Upload, Plus, X, Percent } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import TipTapEditor from "@/components/TipTapEditor";

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

interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "فيديو" | "مستند" | "اختبار";
  content: string;
  isPreview: boolean;
}

interface CourseFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: FileList;
  previewVideo: FileList;
  price: number;
  discountPrice: number;
  category: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  language: string;
  prerequisites: string;
  learningObjectives: string[];
  certificateAvailable: boolean;
  enrollmentLimit: number;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  coupons: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    expiryDate: string;
    maxUses: number;
  }[];
  units: Unit[];
}

export default function AddCoursePage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseFormData>();

  const [coupons, setCoupons] = useState<CourseFormData["coupons"]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [draggedLessonId, setDraggedLessonId] = useState<string | null>(null);
  const [draggedUnitId, setDraggedUnitId] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addUnit = () => {
    const newUnit: Unit = {
      id: generateId(),
      title: "",
      description: "",
      lessons: [],
      isExpanded: true,
    };
    setUnits([...units, newUnit]);
  };

  const removeUnit = (unitId: string) => {
    setUnits(units.filter((unit) => unit.id !== unitId));
  };

  const addLesson = (unitId: string) => {
    const newLesson: Lesson = {
      id: generateId(),
      title: "",
      description: "",
      duration: "",
      type: "فيديو",
      content: "",
      isPreview: false,
    };
    setUnits(
      units.map((unit) => {
        if (unit.id === unitId) {
          return { ...unit, lessons: [...unit.lessons, newLesson] };
        }
        return unit;
      })
    );
  };

  const removeLesson = (unitId: string, lessonId: string) => {
    setUnits(
      units.map((unit) => {
        if (unit.id === unitId) {
          return {
            ...unit,
            lessons: unit.lessons.filter((lesson) => lesson.id !== lessonId),
          };
        }
        return unit;
      })
    );
  };

  const toggleUnitExpansion = (unitId: string) => {
    setUnits(
      units.map((unit) => {
        if (unit.id === unitId) {
          return { ...unit, isExpanded: !unit.isExpanded };
        }
        return unit;
      })
    );
  };

  const handleDragStart = (
    e: React.DragEvent,
    unitId: string | null,
    lessonId: string | null
  ) => {
    if (lessonId) setDraggedLessonId(lessonId);
    if (unitId) setDraggedUnitId(unitId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.add("bg-purple-50");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const dropZone = target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.remove("bg-purple-50");
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    targetUnitId: string,
    targetLessonId?: string
  ) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.remove("bg-purple-50");
    }

    if (draggedLessonId) {
      const sourceUnit = units.find((unit) =>
        unit.lessons.some((lesson) => lesson.id === draggedLessonId)
      );
      const targetUnit = units.find((unit) => unit.id === targetUnitId);

      if (sourceUnit && targetUnit) {
        const lesson = sourceUnit.lessons.find(
          (l) => l.id === draggedLessonId
        )!;
        const newUnits = units.map((unit) => {
          if (unit.id === sourceUnit.id) {
            return {
              ...unit,
              lessons: unit.lessons.filter((l) => l.id !== draggedLessonId),
            };
          }
          if (unit.id === targetUnitId) {
            const targetIndex = targetLessonId
              ? unit.lessons.findIndex((l) => l.id === targetLessonId)
              : unit.lessons.length;
            const newLessons = [...unit.lessons];
            newLessons.splice(targetIndex, 0, lesson);
            return { ...unit, lessons: newLessons };
          }
          return unit;
        });
        setUnits(newUnits);
      }
    } else if (draggedUnitId && draggedUnitId !== targetUnitId) {
      const draggedUnit = units.find((unit) => unit.id === draggedUnitId)!;
      const targetIndex = units.findIndex((unit) => unit.id === targetUnitId);
      const newUnits = units.filter((unit) => unit.id !== draggedUnitId);
      newUnits.splice(targetIndex, 0, draggedUnit);
      setUnits(newUnits);
    }

    setDraggedLessonId(null);
    setDraggedUnitId(null);
  };

  const onSubmit = (data: CourseFormData) => {
    console.log(data);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto py-8"
    >
      <h1 className="text-2xl font-bold mb-8">إضافة دورة جديدة</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">المعلومات الأساسية</h2>
            <div className="text-sm text-gray-500">* حقول إلزامية</div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان الدورة *
              </label>
              <input
                type="text"
                {...register("title", { required: "عنوان الدورة مطلوب" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف مختصر *
              </label>
              <textarea
                {...register("shortDescription", {
                  required: "الوصف المختصر مطلوب",
                })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف الكامل *
              </label>
              <TipTapEditor />
            </div>
          </div>
        </motion.section>

        {/* Media */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الوسائط</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة الدورة *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        {...register("thumbnail", {
                          required: "صورة الدورة مطلوبة",
                        })}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF حتى 10MB
                  </p>
                </div>
              </div>
              {errors.thumbnail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فيديو تعريفي
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>رفع فيديو</span>
                      <input
                        type="file"
                        {...register("previewVideo")}
                        className="sr-only"
                        accept="video/*"
                      />
                    </label>
                    <p className="pr-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500">MP4 حتى 100MB</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Pricing & Enrollment */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">السعر والتسجيل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر *
              </label>
              <input
                type="number"
                {...register("price", {
                  required: "السعر مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر الخصم
              </label>
              <input
                type="number"
                {...register("discountPrice", {
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.discountPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحد الأقصى للمشتركين
              </label>
              <input
                type="number"
                {...register("enrollmentLimit", {
                  min: { value: 1, message: "يجب أن يكون العدد أكبر من 0" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.section>

        {/* Units and Lessons */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">الوحدات والدروس</h2>
            <button
              type="button"
              onClick={addUnit}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              إضافة وحدة
            </button>
          </div>

          <div className="space-y-6">
            {units.map((unit, unitIndex) => (
              <div
                key={unit.id}
                className="border border-gray-200 rounded-lg overflow-hidden drop-zone"
                draggable
                onDragStart={(e) => handleDragStart(e, unit.id, null)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, unit.id)}
              >
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="عنوان الوحدة"
                      value={unit.title}
                      onChange={(e) => {
                        const newUnits = [...units];
                        newUnits[unitIndex].title = e.target.value;
                        setUnits(newUnits);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      type="button"
                      onClick={() => toggleUnitExpansion(unit.id)}
                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {unit.isExpanded ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUnit(unit.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {unit.isExpanded && (
                  <div className="p-4 space-y-4">
                    <textarea
                      placeholder="وصف الوحدة"
                      value={unit.description}
                      onChange={(e) => {
                        const newUnits = [...units];
                        newUnits[unitIndex].description = e.target.value;
                        setUnits(newUnits);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />

                    <div className="space-y-4">
                      {unit.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 drop-zone"
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, null, lesson.id)
                          }
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, unit.id, lesson.id)}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="عنوان الدرس"
                              value={lesson.title}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[lessonIndex].title =
                                  e.target.value;
                                setUnits(newUnits);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="مدة الدرس (مثال: 30:00)"
                              value={lesson.duration}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[
                                  lessonIndex
                                ].duration = e.target.value;
                                setUnits(newUnits);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div className="mt-4">
                            <textarea
                              placeholder="وصف الدرس"
                              value={lesson.description}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[
                                  lessonIndex
                                ].description = e.target.value;
                                setUnits(newUnits);
                              }}
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                              value={lesson.type}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[lessonIndex].type =
                                  e.target.value as
                                    | "فيديو"
                                    | "مستند"
                                    | "اختبار";
                                setUnits(newUnits);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="فيديو">فيديو</option>
                              <option value="مستند">مستند</option>
                              <option value="اختبار">اختبار</option>
                            </select>

                            <input
                              type="text"
                              placeholder="رابط المحتوى"
                              value={lesson.content}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[
                                  lessonIndex
                                ].content = e.target.value;
                                setUnits(newUnits);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={lesson.isPreview}
                                onChange={(e) => {
                                  const newUnits = [...units];
                                  newUnits[unitIndex].lessons[
                                    lessonIndex
                                  ].isPreview = e.target.checked;
                                  setUnits(newUnits);
                                }}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-600">
                                درس مجاني للمعاينة
                              </span>
                            </label>

                            <button
                              type="button"
                              onClick={() => removeLesson(unit.id, lesson.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addLesson(unit.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-500 transition-colors"
                      >
                        <Plus size={16} />
                        إضافة درس
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Course Details */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">تفاصيل الدورة</h2>
            <div className="text-sm text-gray-500">* حقول إلزامية</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التصنيف *
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "التصنيف مطلوب" }}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    options={["البرمجة", "التصميم", "الأعمال", "التسويق"]}
                    placeholder="اختر أو أضف تصنيف"
                    onChange={(selected) => field.onChange(selected)}
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المستوى *
              </label>
              <Controller
                name="level"
                control={control}
                rules={{ required: "المستوى مطلوب" }}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    options={["مبتدئ", "متوسط", "متقدم"]}
                    placeholder="اختر المستوى"
                    onChange={(selected) => field.onChange(selected)}
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لغة الدورة *
              </label>
              <Controller
                name="language"
                control={control}
                rules={{ required: "لغة الدورة مطلوبة" }}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    options={["العربية", "الإنجليزية"]}
                    placeholder="اختر اللغة"
                    onChange={(selected) => field.onChange(selected)}
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المتطلبات السابقة
              </label>
              <textarea
                {...register("prerequisites")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="المهارات أو المعرفة المطلوبة قبل بدء الدورة"
              />
            </div>
          </div>
        </motion.section>

        {/* Schedule */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">جدول الدورة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ البداية
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ النهاية
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.section>

        {/* Publishing */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">النشر</h2>
              <p className="text-sm text-gray-500">
                عند النشر، ستكون الدورة متاحة للتسجيل
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("isPublished")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </motion.section>

        {/* Units and Lessons */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">الوحدات والدروس</h2>
          <div className="space-y-6">
            {units.map((unit, unitIndex) => (
              <div
                key={unit.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
                draggable
                onDragStart={(e) => handleDragStart(e, unit.id, null)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, unit.id)}
              >
                <div className="bg-gray-50 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={unit.title}
                        onChange={(e) => {
                          const newUnits = [...units];
                          newUnits[unitIndex].title = e.target.value;
                          setUnits(newUnits);
                        }}
                        placeholder="عنوان الوحدة"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <textarea
                        value={unit.description}
                        onChange={(e) => {
                          const newUnits = [...units];
                          newUnits[unitIndex].description = e.target.value;
                          setUnits(newUnits);
                        }}
                        placeholder="وصف الوحدة"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleUnitExpansion(unit.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {unit.isExpanded ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeUnit(unit.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                {unit.isExpanded && (
                  <div className="p-4 space-y-4">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                        draggable
                        onDragStart={(e) => handleDragStart(e, null, lesson.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, unit.id, lesson.id)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[lessonIndex].title =
                                  e.target.value;
                                setUnits(newUnits);
                              }}
                              placeholder="عنوان الدرس"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <select
                              value={lesson.type}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[lessonIndex].type =
                                  e.target.value as
                                    | "فيديو"
                                    | "مستند"
                                    | "اختبار";
                                setUnits(newUnits);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="فيديو">فيديو</option>
                              <option value="مستند">مستند</option>
                              <option value="اختبار">اختبار</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <textarea
                              value={lesson.description}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[
                                  lessonIndex
                                ].description = e.target.value;
                                setUnits(newUnits);
                              }}
                              placeholder="وصف الدرس"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[
                                  lessonIndex
                                ].duration = e.target.value;
                                setUnits(newUnits);
                              }}
                              placeholder="مدة الدرس (مثال: 15:30)"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={lesson.content}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].lessons[
                                  lessonIndex
                                ].content = e.target.value;
                                setUnits(newUnits);
                              }}
                              placeholder={
                                lesson.type === "فيديو"
                                  ? "رابط الفيديو"
                                  : lesson.type === "مستند"
                                  ? "رابط المستند"
                                  : "رابط الاختبار"
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="md:col-span-2 flex items-center justify-between">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={lesson.isPreview}
                                onChange={(e) => {
                                  const newUnits = [...units];
                                  newUnits[unitIndex].lessons[
                                    lessonIndex
                                  ].isPreview = e.target.checked;
                                  setUnits(newUnits);
                                }}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-600">
                                درس مجاني للمعاينة
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeLesson(unit.id, lesson.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(unit.id)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>إضافة درس جديد</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addUnit}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-6 h-6" />
              <span>إضافة وحدة جديدة</span>
            </button>
          </div>
        </motion.section>

        {/* Coupons */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">كوبونات الخصم</h2>
          <div className="space-y-4">
            {coupons.map((coupon, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg space-y-4 relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCoupons(coupons.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      كود الخصم
                    </label>
                    <input
                      type="text"
                      value={coupon.code}
                      onChange={(e) => {
                        const newCoupons = [...coupons];
                        newCoupons[index].code = e.target.value;
                        setCoupons(newCoupons);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع الخصم
                    </label>
                    <select
                      value={coupon.discountType}
                      onChange={(e) => {
                        const newCoupons = [...coupons];
                        newCoupons[index].discountType = e.target.value as
                          | "percentage"
                          | "fixed";
                        setCoupons(newCoupons);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="percentage">نسبة مئوية</option>
                      <option value="fixed">قيمة ثابتة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      قيمة الخصم
                    </label>
                    <input
                      type="number"
                      value={coupon.discountValue}
                      onChange={(e) => {
                        const newCoupons = [...coupons];
                        newCoupons[index].discountValue = Number(
                          e.target.value
                        );
                        setCoupons(newCoupons);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="date"
                      value={coupon.expiryDate}
                      onChange={(e) => {
                        const newCoupons = [...coupons];
                        newCoupons[index].expiryDate = e.target.value;
                        setCoupons(newCoupons);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحد الأقصى للاستخدام
                    </label>
                    <input
                      type="number"
                      value={coupon.maxUses}
                      onChange={(e) => {
                        const newCoupons = [...coupons];
                        newCoupons[index].maxUses = Number(e.target.value);
                        setCoupons(newCoupons);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setCoupons([
                  ...coupons,
                  {
                    code: "",
                    discountType: "percentage",
                    discountValue: 0,
                    expiryDate: "",
                    maxUses: 0,
                  },
                ])
              }
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كوبون</span>
            </button>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            إنشاء الدورة
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
