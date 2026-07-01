import React from 'react';
import { Calendar } from 'lucide-react';

interface AppointmentButtonProps {
  onClick: () => void;
}

export function AppointmentButton({ onClick }: AppointmentButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-20 md:right-4">
      <button
        onClick={onClick}
        className="relative flex items-center gap-2 px-5 py-4 bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-full shadow-xl hover:shadow-emerald-700/40 transition-all duration-300 hover:scale-105 group animate-float"
        title="رزرو وقت ملاقات"
        aria-label="رزرو وقت ملاقات"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping-slow opacity-30" />
        <Calendar className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="relative z-10 text-sm hidden sm:inline">رزرو وقت ملاقات</span>
        <span className="relative z-10 text-sm sm:hidden">رزرو</span>
      </button>
    </div>
  );
}
