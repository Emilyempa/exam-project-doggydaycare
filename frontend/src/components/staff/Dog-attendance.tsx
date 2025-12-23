"use client"

import { useState } from "react";
import { Card } from "@/components/card/Card";
import { CalendarCheck2, Info } from "lucide-react";

export default function DogAttendance() {
  const [view, setView] = useState("day");
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

  // Mock data - replace with your database data later
  const dogs = [
    {
      id: 1,
      name: "Peggy",
      breed: "Border Collie",
      startTime: "8:00",
      endTime: "16:00",
      schedule: ["Monday", "Wednesday", "Friday"]
    },
    {
      id: 2,
      name: "Bella",
      breed: "Golden Retriever",
      startTime: "9:00",
      endTime: "15:00",
      schedule: ["Tuesday", "Thursday"]
    },
    {
      id: 3,
      name: "Max",
      breed: "Labrador",
      startTime: "7:30",
      endTime: "17:00",
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
            <div className="mb-4 p-3 bg-brand-secondary rounded-lg">
              <p className="text-lg font-semibold text-beige-light">
                Checked in dogs: {checkedIn.length} / {dogs.length}
              </p>
            </div>

            <div className="space-y-4">
              {dogs.map((dog) => {
                const isCheckedIn = checkedIn.includes(dog.name);

                return (
                  <article
                    key={dog.id}
                    className="relative mt-4 bg-feature-primary p-4 rounded-lg shadow-lg border"
                  >
                    <button
                      className="absolute top-2 right-2 p-2 rounded-lg m-2"
                      aria-label="Info about dog owner"
                    >
                      <Info size={20} />
                    </button>
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
                  <td className="border border-gray-300 p-3 font-semibold bg-feature-primary">
                    <div>{dog.name}</div>
                    <div className="text-sm text-gray-600">{dog.breed}</div>
                  </td>
                  {weekDays.map((day) => (
                    <td key={day} className="border border-gray-300 p-3 text-center bg-feature-primary">
                      {dog.schedule.includes(day) ? (
                        <div className="bg-brand-secondary text-beige-light px-2 py-1 rounded text-sm font-medium">
                          {dog.startTime} - {dog.endTime}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
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
