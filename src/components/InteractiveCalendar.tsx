import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from "lucide-react";

interface InteractiveCalendarProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  pricePerNight: number;
}

export default function InteractiveCalendar({
  checkIn,
  checkOut,
  onChange,
  pricePerNight,
}: InteractiveCalendarProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, so 5 = June
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Parse YYYY-MM-DD back to JS Dates for comparisons
  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handleDayClick = (dayStr: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      // Start of fresh selection
      onChange(dayStr, "");
    } else {
      // Selecting the check-out date
      const d1 = new Date(checkIn);
      const d2 = new Date(dayStr);
      if (d2 <= d1) {
        // Underflow -> reset checkIn to current click
        onChange(dayStr, "");
      } else {
        onChange(checkIn, dayStr);
      }
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    // Prevent going past June 2026 for mock data range
    if (currentYear === 2026 && currentMonth === 5) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Generate blank grids & days
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const gridCells = [...blanks, ...days];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-slate-850 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon size={16} />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-none">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <span className="font-sans text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
              Interact below to schedule
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            disabled={currentYear === 2026 && currentMonth === 5}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-600 dark:text-slate-400 cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Weekdays Labels */}
      <div className="grid grid-cols-7 gap-1 text-center font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-1">
        {gridCells.map((day, idx) => {
          if (day === null) {
            return <div key={`blank-${idx}`} className="aspect-square" />;
          }

          const dateStr = formatDateString(currentYear, currentMonth, day);
          const cellDate = new Date(dateStr);

          // Calculate formatting classes
          const isCheckIn = checkIn === dateStr;
          const isCheckOut = checkOut === dateStr;
          
          let isInRange = false;
          if (checkInDate && checkOutDate) {
            isInRange = cellDate > checkInDate && cellDate < checkOutDate;
          } else if (checkInDate && hoveredDate) {
            const hDate = new Date(hoveredDate);
            isInRange = cellDate > checkInDate && cellDate <= hDate;
          }

          // Disable days in the past (before check-in mock baseline: June 22 2026)
          const baseDate = new Date("2026-06-22");
          const isPast = cellDate < baseDate;

          let bgClass = "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
          if (isPast) {
            bgClass = "opacity-25 pointer-events-none text-slate-300 line-through dark:text-slate-700";
          } else if (isCheckIn) {
            bgClass = "bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-md rounded-lg scale-[1.02] z-10";
          } else if (isCheckOut) {
            bgClass = "bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-md rounded-lg scale-[1.02] z-10";
          } else if (isInRange) {
            bgClass = "bg-slate-100/80 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md";
          }

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={isPast}
              onClick={() => handleDayClick(dateStr)}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`aspect-square text-xs font-semibold flex flex-col items-center justify-center relative transition-all duration-150 cursor-pointer ${bgClass}`}
              id={`calendar-cell-${dateStr}`}
            >
              <span>{day}</span>
              {/* Special Pricing accent dots */}
              {!isPast && !isCheckIn && !isCheckOut && !isInRange && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 scale-75" />
              )}
              {isCheckIn && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 text-[6px] text-white">
                  In
                </span>
              )}
              {isCheckOut && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900 text-[6px] text-white">
                  Out
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend and Summary Info */}
      <div className="pt-4 border-t border-slate-50 dark:border-white/5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-900 dark:bg-white inline-block" /> Selected Stay
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800 inline-block" /> Intermediary
          </span>
        </div>

        {checkIn && !checkOut && (
          <div className="bg-amber-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-amber-100/50 dark:border-slate-700 text-[11px] text-amber-800 dark:text-amber-300 font-sans font-medium">
            💡 Tap your departure day on the grid to complete stay dates.
          </div>
        )}
      </div>
    </div>
  );
}
