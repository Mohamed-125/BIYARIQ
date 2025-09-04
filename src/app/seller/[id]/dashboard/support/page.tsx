"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type User = {
  id: string;
  name: string;
  role: "عميل" | "دعم بيارق";
};

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

const Users: User[] = [
  { id: "admin", name: "دعم بيارق", role: "دعم بيارق" },
  { id: "1", name: "أحمد علي", role: "عميل" },
  { id: "2", name: "محمد يوسف", role: "عميل" },
];

// رسائل تجريبية
const DummyMessages: Record<string, Message[]> = {
  admin: [
    {
      id: "1",
      sender: "دعم بيارق",
      text: "مرحباً بك 👋 كيف يمكننا مساعدتك؟",
      timestamp: "10:00 ص",
    },
    {
      id: "2",
      sender: "أنا",
      text: "عندي مشكلة في الطلب الأخير",
      timestamp: "10:02 ص",
    },
  ],
  "1": [
    { id: "3", sender: "أحمد علي", text: "مساء الخير ✨", timestamp: "9:15 م" },
    {
      id: "4",
      sender: "أنا",
      text: "أهلاً أحمد! كيف أقدر أساعدك؟",
      timestamp: "9:17 م",
    },
  ],
  "2": [
    {
      id: "5",
      sender: "محمد يوسف",
      text: "محتاج أعرف حالة شحني 🚚",
      timestamp: "11:00 ص",
    },
    {
      id: "6",
      sender: "أنا",
      text: "تمام محمد، خليني أشوفلك حالاً",
      timestamp: "11:05 ص",
    },
  ],
};

export default function SupportPage() {
  const [selectedUser, setSelectedUser] = useState<User>(Users[0]);
  const [messages, setMessages] = useState<Message[]>(
    DummyMessages[Users[0].id] || []
  );
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "أنا",
      text: input,
      timestamp: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setMessages(DummyMessages[user.id] || []);
  };

  return (
    <div className="flex h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
      {/* Sidebar */}
      <div className="w-72 bg-gray-100 border-r border-gray-300 flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-300">
          الدعم الفني
        </h2>
        <div className="flex-1 overflow-y-auto">
          {Users.map((user) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={user.id}
              className={`p-4 cursor-pointer flex items-center gap-3 transition ${
                selectedUser?.id === user.id
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-gray-200"
              } ${
                user.id === "admin" ? "font-bold border-b border-gray-300" : ""
              }`}
              onClick={() => handleSelectUser(user)}
            >
              {/* صورة رمزية بسيطة */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                  user.id === "admin"
                    ? "bg-[var(--secondray)] text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <p>{user.name}</p>
                <span className="text-xs opacity-70">{user.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
              <span className="text-sm text-gray-500">{selectedUser.role}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400">
                  لا توجد رسائل مع {selectedUser.name} بعد
                </p>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[70%] p-3 rounded-xl shadow-md border border-gray-300 ${
                      msg.sender === "أنا"
                        ? "bg-purple-600 text-white ml-auto"
                        : "bg-white text-gray-800 mr-auto"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-xs mt-1 opacity-70 text-right">
                      {msg.timestamp}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-300 bg-white flex gap-2">
              <Input
                placeholder="اكتب رسالتك..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>إرسال</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            اختر محادثة لبدء التواصل
          </div>
        )}
      </div>
    </div>
  );
}
