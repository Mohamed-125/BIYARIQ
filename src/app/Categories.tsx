"use client";

import { motion } from "framer-motion";

const categories = [
  {
    title: "ألعاب",
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",
    description: "افضل الالعاب بأقل الاسعار",
  },
  {
    title: "كتب",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",
    description: "أكتشف اكبر تشكيله من الكتب في كل المجالات",
  },
  {
    title: "ملابس",
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",
    description: "ملابس بأفضل جوده",
  },
  {
    title: "اجهزه كهربائيه",
    image:
      "https://cdn.firstcry.com/education/2023/01/13101355/Names-Of-Household-Appliances-In-English.jpg",
    description: "افضل الاجهزه الكهربائيه من افضل الماركات",
  },
];

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
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function Categories() {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 font-arabic bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          أشهر التصنيفات
        </h2>
        <motion.div
          variants={containerVariants}
          whileInView={"visible"}
          viewport={{ amount: 0.3, once: true }}
          initial="hidden"
          className="grid md:grid-cols-3 gap-5"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className={`group relative ${
                index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"
              } cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ease-out`}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative h-[400px] overflow-hidden">
                <motion.img
                  src={
                    category.image ||
                    "https://assets.awwwards.com/awards/element/2023/11/6557e6420213c468237972.jpg"
                  }
                  alt={category.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <motion.h3
                    className="text-3xl font-bold text-white mb-1 font-arabic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {category.title}
                  </motion.h3>

                  <motion.p
                    className="text-white/90 mb-3 text-lg max-w-md transform group-hover:opacity-100 opacity-80 transition-opacity duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {category.description}
                  </motion.p>

                  <motion.button
                    className="bg-white  text-gray-900 px-6 py-3 mb-3 rounded-xl font-semibold transform hover:scale-105 hover:shadow-lg transition-all duration-300 group-hover:bg-opacity-100 bg-opacity-90"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    تسوق الأن
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
