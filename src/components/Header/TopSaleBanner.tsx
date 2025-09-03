"use client";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function TopSaleBanner() {
  // Set your sale end date here
  const saleEndDate = new Date("2025-08-20T23:59:59").getTime(); // Example: 20 Aug 2025

  // State for countdown parts
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown update function
  useEffect(() => {
    function updateCountdown() {
      const now = new Date().getTime();
      const diff = saleEndDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [saleEndDate]);

  // Arabic labels for time units
  const arabicLabels = {
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثواني",
  };

  // Close banner state
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 text-white px-6 py-3 rounded-md shadow-lg flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-center md:text-right font-semibold text-lg">
        <span>🔥 خصم 50% على جميع المنتجات الرقمية!</span>
        <div className="flex gap-3 font-mono">
          <TimeUnit value={timeLeft.days} label={arabicLabels.days} />
          <TimeUnit value={timeLeft.hours} label={arabicLabels.hours} />
          <TimeUnit value={timeLeft.minutes} label={arabicLabels.minutes} />
          <TimeUnit value={timeLeft.seconds} label={arabicLabels.seconds} />
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        aria-label="إغلاق"
        className="text-white hover:text-gray-300 transition"
      >
        <FiX size={24} />
      </button>
    </div>
  );
}

// Helper component for each time unit block
function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[50px]">
      <span className="text-2xl font-bold tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
