"use client";

import { useState } from "react";
import { Card } from "@/components/card/Card";
import { CalendarCheck2, Info, X } from "lucide-react";
import NextAndPrevious from "@/components/buttons/Next-and-previous";
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';

// =========================
// Component: DogAttendance
// Purpose: Staff view to manage daily/weekly dog attendance
//          with expandable owner info per dog
// =========================
export default function DogAttendance() {
  // ---------- UI state ----------
  const [view, setView] = useState<"day" | "week">("day");
  const [openInfoDogId, setOpenInfoDogId] = useState<number | null>(null);
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data (replace with backend data later)
  const dogs = [
    {
      id: 1,
      name: "Peggy",
      breed: "Border Collie",
      startTime: "8:00",
      endTime: "16:00",
      schedule: ["Monday", "Wednesday", "Friday"],
      owner: {
        name: "Emily Pettersson",
        phone: "070-123 45 67",
        emergencyContact: "Jonas Pettersson – 070-987 65 43",
        notes: "Är på diet"
      }
    },
    {
      id: 2,
      name: "Bella",
      breed: "Golden Retriever",
      startTime: "9:00",
      endTime: "15:00",
      schedule: ["Tuesday", "Thursday"],
      owner: {
        name: "Anna Jansson",
        phone: "070-123 45 67",
        emergencyContact: "Jonas Jansson – 070-987 67 45",
        notes: "Rädd för höga ljud"
      }
    },
    {
      id: 3,
      name: "Max",
      breed: "Labrador",
      startTime: "7:30",
      endTime: "17:00",
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      owner: {
        name: "Hans Persson",
        phone: "070-123 45 67",
        emergencyContact: "Joline Jussi – 070-987 65 43",
        notes: "Nyopererad och ska ta lugna promenader"
      }
    }
  ];

  // Get current week days
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday = 1
    return Array.from({ length: 5 }, (_, i) => { // Only weekdays (Mon-Fri)
      const date = addDays(start, i);
      return {
        date,
        dayName: format(date, 'EEEE'), // Monday, Tuesday, etc.
        shortDate: format(date, 'MMM d'), // Dec 30
        dateStr: format(date, 'yyyy-MM-dd')
      };
    });
  };

  const weekDays = getWeekDays();
  const weekNumber = Number.parseInt(format(currentDate, 'I'));
  const year = format(currentDate, 'yyyy');
  const currentDayName = format(currentDate, 'EEEE');
  const currentDayFormatted = format(currentDate, 'EEEE, MMM d');
  const currentDayIndex = currentDate.getTime();


  // Filter dogs for current day
  const dogsForToday = dogs.filter(dog => dog.schedule.includes(currentDayName));

  // ---------- Handlers ----------
  const toggleInfo = (dogId: number) => {
    setOpenInfoDogId(prev => (prev === dogId ? null : dogId));
  };

  const toggleCheckIn = (dogName: string) => {
    setCheckedIn(prev =>
      prev.includes(dogName)
        ? prev.filter(name => name !== dogName)
        : [...prev, dogName]
    );
  };

  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const goToPreviousDay = () => {
    setCurrentDate(prev => addDays(prev, -1));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const goToPreviousWeek = () => {
    setCurrentDate(prev => addWeeks(prev, -1));
  };

  return (
    <section className="flex flex-col items-center text-center">
      <Card
        title="Dog Schedule"
        icon={CalendarCheck2}
        className="card-lg">
        {/* View toggle */}
        <div className="flex gap-4 m-6 justify-center">
          <button
            className={view === "day" ? "button" : "bg-secondary text-brand-secondary"}
            onClick={() => setView("day")}
          >
            Day view
          </button>
          <button
            className={view === "week" ? "button" : "bg-secondary text-brand-secondary"}
            onClick={() => setView("week")}
          >
            Week view
          </button>
        </div>

        {/* Navigation */}
        {view === "day" ? (
          <NextAndPrevious
            currentIndex={currentDayIndex}
            label={currentDayFormatted}
            onPrevious={goToPreviousDay}
            onNext={goToNextDay}
          />
        ) : (
          <NextAndPrevious
            currentIndex={weekNumber}
            label={`Week ${weekNumber}, ${year}`}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
          />
        )}

        {/* ===== Day View ===== */}
        {view === "day" && (
          <>
            {/* Checked-in summary */}
            <div className="mb-4 p-3 bg-brand-secondary rounded-lg">
              <p className="text-lg font-semibold text-beige-light">
                Checked in dogs: {checkedIn.length} / {dogsForToday.length}
              </p>
            </div>

            {/* Dog cards */}
            {dogsForToday.length === 0 ? (
              <div className="p-8 text-gray-500">
                <p>No dogs scheduled for {currentDayName}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dogsForToday.map(dog => {
                  const isCheckedIn = checkedIn.includes(dog.name);
                  const isOpen = openInfoDogId === dog.id;

                  return (
                    <article
                      key={dog.id}
                      className="relative bg-feature-primary p-4 rounded-lg shadow-lg border"
                    >
                      {/* Toggle owner info */}
                      <button
                        onClick={() => toggleInfo(dog.id)}
                        className="absolute top-2 right-2 p-2 rounded-lg hover:bg-feature-secondary"
                        aria-label="Toggle owner info"
                      >
                        {isOpen ? <X size={20} /> : <Info size={20} />}
                      </button>

                      {/* Owner info */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 mt-8" : "max-h-0"
                        }`}
                      >
                        <div className="rounded-2xl border bg-feature-secondary shadow-lg p-4 text-left">
                          <h3 className="font-semibold text-lg mb-2">
                            Dog owner info
                          </h3>

                          <ul className="space-y-1 text-sm">
                            <li>
                              <strong>Name:</strong> {dog.owner.name}
                            </li>
                            <li>
                              <strong>Phone:</strong> {dog.owner.phone}
                            </li>
                            <li>
                              <strong>Emergency:</strong> {dog.owner.emergencyContact}
                            </li>
                            <li>
                              <strong>Extra info:</strong> {dog.owner.notes}
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Main dog info */}
                      <h2 className="text-lg font-bold pt-10">{dog.name}</h2>
                      <p className="p-2 text-lg">{dog.breed}</p>
                      <p className="p-2 font-bold text-xl">
                        {dog.startTime} – {dog.endTime}
                      </p>

                      <button
                        className={`w-full mt-4 ${
                          isCheckedIn
                            ? "btn-primary"
                            : "bg-secondary text-brand-secondary"
                        }`}
                        onClick={() => toggleCheckIn(dog.name)}
                      >
                        {isCheckedIn ? "Check out" : "Check in"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ===== Week View ===== */}
        {view === "week" && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                <tr>
                  <th className="border p-3 bg-brand-secondary text-beige-light font-bold text-left">
                    Dog
                  </th>
                  {weekDays.map(day => (
                    <th
                      key={day.dateStr}
                      className="border border-gray-300 p-3 bg-brand-secondary text-beige-light font-bold text-center"
                    >
                      <div>{day.dayName}</div>
                      <div className="text-xs font-normal">{day.shortDate}</div>
                    </th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {dogs.map(dog => (
                  <tr key={dog.id} className="hover:bg-feature-secondary transition-colors">
                    <td className="border border-secondary p-3 font-semibold text-left">
                      <div>{dog.name}</div>
                      <div className="text-sm text-gray-600">{dog.breed}</div>
                    </td>

                    {weekDays.map(day => {
                      const isScheduled = dog.schedule.includes(day.dayName);
                      return (
                        <td
                          key={day.dateStr}
                          className={`border border-secondary p-3 text-center ${
                            isScheduled
                              ? "bg-brand-primary text-beige-light font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {isScheduled ? `${dog.startTime} – ${dog.endTime}` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Week Cards */}
            <div className="md:hidden space-y-4">
              {dogs.map(dog => (
                <div
                  key={dog.id}
                  className="bg-feature-primary rounded-lg shadow p-4 text-left"
                >
                  <h3 className="font-semibold text-lg">{dog.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{dog.breed}</p>

                  <ul className="space-y-1 text-sm">
                    {weekDays.map(day => (
                      <li
                        key={day.dateStr}
                        className="flex justify-between border-b py-1"
                      >
                        <div>
                          <span className="font-medium">{day.dayName}</span>
                          <span className="text-xs text-gray-500 ml-2">{day.shortDate}</span>
                        </div>
                        {dog.schedule.includes(day.dayName) ? (
                          <span className="bg-brand-primary text-beige-light px-2 py-0.5 rounded text-xs">
                            {dog.startTime} – {dog.endTime}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
