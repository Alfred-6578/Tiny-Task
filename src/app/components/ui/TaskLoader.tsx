"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdAssignmentTurnedIn } from "react-icons/md";

const loadingTexts = [
  "Matching you with a tasker...",
  "Loading the task board...",
  "Posting your request...",
  "Checking availability...",
  "Tidying up your TinyTasks..."
];

export default function TaskLoader() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      {/* Animated task card */}
      <motion.div
        className="w-20 h-20 bg-white shadow-xl rounded-xl flex items-center justify-center"
        animate={{ rotateY: [0, 180, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <MdAssignmentTurnedIn className="text-4xl text-green-500" />
      </motion.div>

      {/* Rotating loading text */}
      <motion.p
        key={textIndex}
        className="mt-6 text-base font-medium text-center px-4 max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loadingTexts[textIndex]}
      </motion.p>
    </div>
  );
}
