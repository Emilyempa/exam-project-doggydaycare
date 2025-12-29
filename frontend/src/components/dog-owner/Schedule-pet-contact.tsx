"use client";

import { useState } from "react";
import { Card } from "@/components/card/Card";
import { CalendarClock, Dog, User } from "lucide-react";
import { format, startOfWeek, addDays, isWeekend } from 'date-fns';
import NextAndPrevious from "@/components/buttons/Next-and-previous";

// Separate for each tab
function ScheduleTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Get the week's days
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday = 1

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dayName: format(date, 'EEEE'), // Monday, Tuesday, etc.
        dayNumber: format(date, 'd'),
        fullDate: format(date, 'MMM d'), // Dec 30
        dateStr: format(date, 'yyyy-MM-dd'),
        isWeekend: isWeekend(date)
      };
    });
  };

  const weekDays = getWeekDays();
  const weekNumber = Number.parseInt(format(currentDate, 'I'));
  const year = format(currentDate, 'yyyy');

  const handleDayToggle = (dateStr: string, isBookable: boolean) => {
    if (!isBookable) return;

    setSelectedDays(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
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
        {weekDays.map(day => {
          const isSelected = selectedDays.includes(day.dateStr);
          const isBookable = !day.isWeekend; // Weekends not bookable

          return (
            <button
              key={day.dateStr}
              onClick={() => handleDayToggle(day.dateStr, isBookable)}
              disabled={!isBookable}
              className={`
                w-full p-4 rounded-lg text-left transition-all
                ${isSelected ? 'bg-brand-primary text-beige-light' : 'bg-feature-primary'}
                ${!isBookable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-feature-secondary'}
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
                      Not available
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
          );
        })}
      </div>

      {/* Summary */}
      {selectedDays.length > 0 && (
        <div className="p-4 bg-brand-secondary text-beige-light rounded-lg">
          <p className="font-semibold">Selected days: {selectedDays.length}</p>
          <button className="mt-2 btn-primary w-full">
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
      description: "Add your dogs doggy daycare schedule here."
    },
    {
      label: "Dog Info",
      component: <DogInfoTab />,
      icon: Dog,
      title: "Dog Info",
      description: "Check or edit your dog information here."
    },
    {
      label: "Contact Info",
      component: <ContactInfoTab />,
      icon: User,
      title: "Contact Info",
      description: "Check or edit your contact information here"
    }
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
