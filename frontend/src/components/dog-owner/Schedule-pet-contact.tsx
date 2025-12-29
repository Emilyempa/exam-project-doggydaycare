"use client";

import { useState } from "react";
import { Card } from "@/components/card/Card";
import { CalendarClock, Dog, User } from "lucide-react";
import { format, startOfWeek, addDays, isWeekend } from "date-fns";
import NextAndPrevious from "@/components/buttons/Next-and-previous";

/*
  =========================
  This type replaces string[] so each selected day
  can store drop-off and pick-up times.
  This structure is backend-ready.
  =========================
*/
type DaySchedule = {
  date: string;
  dropOff: string;
  pickUp: string;
};

// Separate for each tab
function ScheduleTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<DaySchedule[]>([]);

  // Get the week's days
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday = 1

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dayName: format(date, "EEEE"), // Monday, Tuesday, etc.
        fullDate: format(date, "MMM d"), // Dec 30
        dateStr: format(date, "yyyy-MM-dd"),
        isWeekend: isWeekend(date),
      };
    });
  };

  const weekDays = getWeekDays();
  const weekNumber = Number.parseInt(format(currentDate, "I"));
  const year = format(currentDate, "yyyy");

  const handleDayToggle = (dateStr: string, isBookable: boolean) => {
    if (!isBookable) return;

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
  };

  const updateTime = (
    date: string,
    field: "dropOff" | "pickUp",
    value: string
  ) => {
    setSelectedDays((prev) =>
      prev.map((d) =>
        d.date === date ? { ...d, [field]: value } : d
      )
    );
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <NextAndPrevious
        currentIndex={weekNumber}
        maxIndex={52}
        label={`Week ${weekNumber}, ${year}`}
        onPrevious={goToPreviousWeek}
        onNext={goToNextWeek}
      />

      {/* Day selection */}
      <div className="space-y-2">
        {weekDays.map((day) => {
          const isBookable = !day.isWeekend;

          const selectedDay = selectedDays.find(
            (d) => d.date === day.dateStr
          );
          const isSelected = !!selectedDay;

          return (
            <div key={day.dateStr} className="space-y-2">
              <button
                onClick={() =>
                  handleDayToggle(day.dateStr, isBookable)
                }
                disabled={!isBookable}
                className={`
                  w-full p-4 rounded-lg text-left transition-all
                  ${
                  isSelected
                    ? "bg-brand-primary text-beige-light"
                    : "bg-feature-primary text-brand-secondary"
                }
                  ${
                  !isBookable
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-brand-secondary"
                }
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{day.dayName}</p>
                    <p className="text-sm">{day.fullDate}</p>
                  </div>
                  <div>
                    {!isBookable && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Closed
                      </span>
                    )}
                    {isSelected && isBookable && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {isSelected && isBookable && (
                <div className="grid grid-cols-2 gap-3 px-4">
                  <div>
                    <label htmlFor="Drop off time" className="block text-xs mb-1">
                      Drop-off
                    </label>
                    <input
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
                      className="w-full rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="Pick up time" className="block text-xs mb-1">
                      Pick-up
                    </label>
                    <input
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
                      className="w-full rounded px-2 py-1"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {selectedDays.length > 0 && (
        <div className="p-4 bg-brand-secondary text-beige-light rounded-lg">
          <p className="font-semibold">
            Selected days: {selectedDays.length}
          </p>

          {/*
            =========================
            TEMP:
            Console log instead of backend call.
            Structure is already API-ready.
            =========================
          */}
          <button
            className="mt-2 btn-primary w-full"
            onClick={() =>
              console.log("Saved schedule:", selectedDays)
            }
          >
            Save schedule
          </button>
        </div>
      )}
    </div>
  );
}

function DogInfoTab() {
  return (
    <div>
      <p>Dog information</p>
      {/* Add a dog info form here */}
    </div>
  );
}

function ContactInfoTab() {
  return (
    <div>
      <p>Your contact information...</p>
      {/* Add contact info form here */}
    </div>
  );
}

export default function SchedulePetContact() {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    {
      label: "Schedule",
      component: <ScheduleTab />,
      icon: CalendarClock,
      title: "Schedule",
      description: "Add your dogs doggy daycare schedule here.",
    },
    {
      label: "Dog Info",
      component: <DogInfoTab />,
      icon: Dog,
      title: "Dog Info",
      description: "Check or edit your dog information here.",
    },
    {
      label: "Contact Info",
      component: <ContactInfoTab />,
      icon: User,
      title: "Contact Info",
      description: "Check or edit your contact information here",
    },
  ];

  const activeTab = tabs[activeIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Buttons to change tabs */}
      <section className="flex justify-center mt-5 space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? "" : "secondary"}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Card with active tab content */}
      <Card
        icon={activeTab.icon}
        title={activeTab.title}
        description={activeTab.description}
        className="mt-6"
      >
        {activeTab.component}
      </Card>
    </div>
  );
}
