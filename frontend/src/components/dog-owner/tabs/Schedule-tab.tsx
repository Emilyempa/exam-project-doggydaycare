// dog-owner/tabs/ScheduleTab.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
import { format, startOfWeek, addDays, isWeekend } from "date-fns";
import NextAndPrevious from "@/components/buttons/Next-and-previous";
import { DaySchedule } from "../types/schedule";

// Static data moved outside component to prevent recreation on each render
const today = new Date();
const monday = startOfWeek(today, { weekStartsOn: 1 });
const tuesday = addDays(monday, 1);
const thursday = addDays(monday, 3);

const INITIAL_SCHEDULE: DaySchedule[] = [
  { date: format(monday, "yyyy-MM-dd"), dropOff: "08:00", pickUp: "16:00" },
  { date: format(tuesday, "yyyy-MM-dd"), dropOff: "07:30", pickUp: "17:00" },
  { date: format(thursday, "yyyy-MM-dd"), dropOff: "08:00", pickUp: "16:00" },
];

export default function ScheduleTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  // For testing empty state, change INITIAL_SCHEDULE to []
  const [selectedDays, setSelectedDays] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [originalSchedule, setOriginalSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);

  // Memoize week days calculation
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dayName: format(date, "EEEE"),
        fullDate: format(date, "MMM d"),
        dateStr: format(date, "yyyy-MM-dd"),
        isWeekend: isWeekend(date),
      };
    });
  }, [currentDate]);

  const weekNumber = useMemo(() => Number.parseInt(format(currentDate, "I"), 10), [currentDate]);
  const year = useMemo(() => format(currentDate, "yyyy"), [currentDate]);

  const handleDayToggle = useCallback((dateStr: string, isBookable: boolean) => {
    if (!isBookable || !isEditing) return;

    setSelectedDays((prev) => {
      const exists = prev.find((d) => d.date === dateStr);

      if (exists) {
        return prev.filter((d) => d.date !== dateStr);
      }

      return [
        ...prev,
        {
          date: dateStr,
          dropOff: "08:00",
          pickUp: "16:00",
        },
      ];
    });
  }, [isEditing]);

  const updateTime = useCallback((
    date: string,
    field: "dropOff" | "pickUp",
    value: string
  ) => {
    if (!isEditing) return;

    setSelectedDays((prev) =>
      prev.map((d) =>
        d.date === date ? { ...d, [field]: value } : d
      )
    );
  }, [isEditing]);

  const goToNextWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    });
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const prevWeek = new Date(prev);
      prevWeek.setDate(prevWeek.getDate() - 7);
      return prevWeek;
    });
  }, []);

  const handleSave = useCallback(() => {
    setOriginalSchedule(selectedDays);
    setIsEditing(false);
  }, [selectedDays]);

  const handleCancel = useCallback(() => {
    setSelectedDays(originalSchedule);
    setIsEditing(false);
  }, [originalSchedule]);

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <NextAndPrevious
        currentIndex={weekNumber}
        label={`Week ${weekNumber}, ${year}`}
        onPrevious={goToPreviousWeek}
        onNext={goToNextWeek}
      />

      {/* Action buttons */}
      {isEditing ? (
        <div className="flex gap-2">
          <button
            className="btn-primary flex-1"
            onClick={handleSave}
            aria-label="Save schedule changes"
          >
            Save changes
          </button>
          <button
            className="secondary flex-1"
            onClick={handleCancel}
            aria-label="Cancel editing and discard changes"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="secondary w-full"
          onClick={() => setIsEditing(true)}
          aria-label="Edit your schedule"
        >
          Edit Schedule
        </button>
      )}

      {/* Day selection */}
      <ul className="space-y-2" aria-label="Weekly schedule">
        {weekDays.map((day) => {
          const isBookable = !day.isWeekend;

          const selectedDay = selectedDays.find(
            (d) => d.date === day.dateStr
          );
          const isSelected = !!selectedDay;

          return (
            <li key={day.dateStr} className="space-y-2">
              {/* Day card */}
              <div
                className={`
                  w-full p-4 rounded-lg transition-all
                  ${
                  isSelected
                    ? "bg-brand-primary text-beige-light"
                    : "bg-feature-primary text-brand-secondary"
                }
                  ${
                  isBookable
                    ? ""
                    : "opacity-50"
                }
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{day.dayName}</p>
                    <p className="text-sm">{day.fullDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isBookable && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded" aria-label="Daycare closed on weekends">
                        Closed
                      </span>
                    )}
                    {isSelected && isBookable && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded" aria-label="Day is booked">
                        Booked
                      </span>
                    )}
                    {/* Add/Remove button - only visible in edit mode */}
                    {isEditing && isBookable && (
                      <button
                        onClick={() => handleDayToggle(day.dateStr, isBookable)}
                        className="text-xs px-3 py-1 rounded bg-white text-beige-light hover:bg-gray-100 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        aria-label={isSelected ? `Remove ${day.dayName} from schedule` : `Add ${day.dayName} to schedule`}
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Time selection - always visible for booked days */}
              {isSelected && (
                <div className="grid grid-cols-2 gap-3 px-4 py-2 bg-gray-50 rounded">
                  <div>
                    <label
                      htmlFor={`dropoff-${day.dateStr}`}
                      className="block text-sm mb-1 text-gray-700 font-medium"
                    >
                      Drop-off
                    </label>
                    {isEditing ? (
                      <input
                        id={`dropoff-${day.dateStr}`}
                        type="time"
                        min="06:00"
                        max="18:00"
                        value={selectedDay.dropOff}
                        onChange={(e) =>
                          updateTime(
                            day.dateStr,
                            "dropOff",
                            e.target.value
                          )
                        }
                        className="w-full rounded px-2 py-1 border focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        aria-label={`Drop-off time for ${day.dayName}`}
                      />
                    ) : (
                      <div
                        className="w-full px-2 py-1 bg-white rounded border font-medium text-gray-900"
                        aria-label={`Drop-off time: ${selectedDay.dropOff}`}
                      >
                        {selectedDay.dropOff}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`pickup-${day.dateStr}`}
                      className="block text-sm mb-1 text-gray-700 font-medium"
                    >
                      Pick-up
                    </label>
                    {isEditing ? (
                      <input
                        id={`pickup-${day.dateStr}`}
                        type="time"
                        min="06:00"
                        max="18:00"
                        value={selectedDay.pickUp}
                        onChange={(e) =>
                          updateTime(
                            day.dateStr,
                            "pickUp",
                            e.target.value
                          )
                        }
                        className="w-full rounded px-2 py-1 border focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        aria-label={`Pick-up time for ${day.dayName}`}
                      />
                    ) : (
                      <div
                        className="w-full px-2 py-1 bg-white rounded border font-medium text-gray-900"
                        aria-label={`Pick-up time: ${selectedDay.pickUp}`}
                      >
                        {selectedDay.pickUp}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
