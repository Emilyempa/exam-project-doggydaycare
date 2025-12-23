"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/card/Card";
import { CalendarCheck2, Info, X } from "lucide-react";

// =========================
// Component: DogAttendance
// Purpose: Staff view to manage daily/weekly dog attendance and show owner info
// =========================
export default function DogAttendance() {
  // ---------- UI state ----------
  const [view, setView] = useState("day");
  const [openInfoDogId, setOpenInfoDogId] = useState<number | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

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

  // Days displayed in week view
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // ---------- Handlers ----------
  const toggleInfo = (dogId: number) => {
    // Toggle owner info panel for a given dog
    setOpenInfoDogId(prev => (prev === dogId ? null : dogId));
  };

  // Close the info panel when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoRef.current &&
        !infoRef.current.contains(event.target as Node)
      ) {
        setOpenInfoDogId(null);
      }
    };

    if (openInfoDogId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openInfoDogId]);


  // Toggle check-in/out by dog name
  const toggleCheckIn = (dogName: string) => {
    if (checkedIn.includes(dogName)) {
      setCheckedIn(checkedIn.filter(name => name !== dogName));
    } else {
      setCheckedIn([...checkedIn, dogName]);
    }
  };

  return (
    <section className="flex flex-col items-center text-center" aria-labelledby="staff-heading">
      <Card
        title={"Dog Schedule"}
        icon={CalendarCheck2}
        className="card-lg"
      >
        {/* View toggle buttons */}
        <div className="flex gap-3 m-6 justify-center">
          <button
            className={view === "day" ? "btn-primary" : "bg-secondary text-brand-secondary"}
            onClick={() => setView("day")}
          >
            Day view
          </button>
          <button
            className={view === "week" ? "btn-primary" : "bg-secondary text-brand-secondary"}
            onClick={() => setView("week")}
          >
            Week view
          </button>
        </div>

        {view === "day" ? (
          <>
            {/* Day view header: checked-in count */}
            <div className="mb-4 p-3 bg-brand-secondary rounded-lg">
              <p className="text-lg font-semibold text-beige-light">
                Checked in dogs: {checkedIn.length} / {dogs.length}
              </p>
            </div>

            {/* Day view: list of dogs */}
            <div className="space-y-4">
              {dogs.map((dog) => {
                const isCheckedIn = checkedIn.includes(dog.name);

                return (
                  <article
                    key={dog.id}
                    className="relative mt-4 bg-feature-primary p-4 rounded-lg shadow-lg border"
                  >
                    {/* Open owner info panel */}
                    <button
                      onClick={() => toggleInfo(dog.id)}
                      className="absolute top-2 right-2 p-2 rounded-lg m-2"
                      aria-label="Info about dog owner"
                    >
                      <Info size={20} />
                    </button>
                    {/* Owner info panel */}
                    {openInfoDogId === dog.id && (
                      <div
                        ref={infoRef}
                        className="
        relative
        mt-4
        rounded-2xl
        border
        bg-feature-secondary
        shadow-lg
        p-4
        text-left
        animate-in
        fade-in
        slide-in-from-top-2
      "
                      >
                        {/* Close owner info */}
                        <button
                          onClick={() => setOpenInfoDogId(null)}
                          className="absolute top-2 right-2 p-1 rounded-lg hover:bg-feature-primary"
                          aria-label="Close owner info"
                        >
                          <X size={18} />
                        </button>

                        <h3 className="font-semibold text-lg mb-2">
                          Dog owner info
                        </h3>

                        <ul className="space-y-1 text-sm">
                          <li>
                            <span className="font-semibold">Name:</span> {dog.owner.name}
                          </li>
                          <li>
                            <span className="font-semibold">Phone:</span> {dog.owner.phone}
                          </li>
                          <li>
                            <span className="font-semibold">Emergency:</span> {dog.owner.emergencyContact}
                          </li>
                          <li>
                            <span className="font-semibold">Extra info:</span> {dog.owner.notes}
                          </li>
                        </ul>
                      </div>
                    )}
                    <h2 className="text-lg font-bold pt-10">{dog.name}</h2>
                    <p className="p-2 text-lg">{dog.breed}</p>
                    <p className="p-2 font-bold text-xl">{dog.startTime} - {dog.endTime}</p>

                    <button
                      className={`w-full mt-4 ${isCheckedIn ? "btn-primary" : "bg-secondary text-brand-secondary"}`}
                      onClick={() => toggleCheckIn(dog.name)}
                    >
                      {isCheckedIn ? "Check out" : "Check in"}
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          // Week view: table with scheduled days and times
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-brand-secondary text-beige-light font-bold text-left">Dog</th>
                {weekDays.map((day) => (
                  <th key={day} className="border border-gray-300 p-3 bg-brand-secondary text-beige-light font-bold">
                    {day}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {dogs.map((dog) => (
                <tr key={dog.id} className="hover:bg-feature-primary">
                  <td className="border border-secondary p-3 font-semibold bg-feature-primary">
                    <div>{dog.name}</div>
                    <div className="text-sm text-gray-600">{dog.breed}</div>
                  </td>
                  {weekDays.map((day) => (
                    <td key={day} className="border border-secondary p-3 text-center bg-feature-primary">
                      {dog.schedule.includes(day) ? (
                        <div className="bg-brand-secondary text-beige-light px-2 py-1 rounded text-sm font-medium">
                          {dog.startTime} - {dog.endTime}
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
