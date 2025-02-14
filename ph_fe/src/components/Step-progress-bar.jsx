import React from "react";
import { motion } from "framer-motion";
import { UserIcon, EnvelopeIcon, KeyIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const steps = [
  { icon: <UserIcon className="w-5 h-5" />, label: "User" },
  { icon: <EnvelopeIcon className="w-5 h-5" />, label: "Input OTP" },
  { icon: <KeyIcon className="w-5 h-5" />, label: "Verify" },
  { icon: <CheckCircleIcon className="w-5 h-5" />, label: "Done" }
];

export default function StepProgress({ step }) {
  return (
    <div className="relative flex items-center justify-between mb-6 w-full">
      {/* Background Line (Màu Xám) */}
      <div className="absolute top-1/2 left-0 p-1 w-full h-1 bg-gray-300 -translate-y-1/2" />

      {/* Animated Progress Line (Màu Xanh) */}
      <motion.div
        className="absolute top-1/2 left-0 p-1 h-1 bg-green-500 -translate-y-1/2"
        initial={{ width: "1%" }}
        animate={{ width: `${(step-1) * 33}%` }}
        transition={{ duration: 0.8 }}
      />

      {/* Steps (Icons) */}
      {steps.map((s, index) => (
        <div key={index} className="relative flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              step > index ? "bg-green-500 text-white border-green-500" : "bg-gray-300 text-gray-500 border-gray-300"
            }`}
          >
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
