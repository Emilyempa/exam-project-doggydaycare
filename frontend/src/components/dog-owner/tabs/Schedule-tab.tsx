"use client";

import { useState, useMemo, useEffect } from "react";
import { format, startOfWeek, addDays, isWeekend } from "date-fns";
import NextAndPrevious from "@/components/buttons/Next-and-previous";
import { getUser } from "@/lib/auth-utils";
import { bookingApi, BookingResponse } from "@/lib/endpoints/bookingapi";
import { userApi, Dog } from "@/lib/endpoints/userapi";

interface MultiDogDaySchedule {
  date: string;
  dogs: {
    dogId: string;
    dogName: string;
    dropOff: string;
    pickUp: string;
    bookingId?: string;
  }[];
}

export default function ScheduleTab() {
  const user = getUser();
  const userId = user?.id;

  const [mounted, setMounted] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<MultiDogDaySchedule[]>([]);
  const [originalSchedule, setOriginalSchedule] = useState<MultiDogDaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load dogs + bookings
  useEffect(() => {
    if (userId && mounted) {
      async function loadData() {
        try {
          // 1. Get all dogs
          const dogList = await userApi.getDogsByUserId(userId as string);
          setDogs(dogList);
          setSelectedDogIds(dogList.map((d) => d.id));

          // 2. Get all bookings
          const bookings = await bookingApi.getByUserId(userId as string);

          // 3. Group bookings by date
          const grouped: Record<string, MultiDogDaySchedule> = {};

          bookings.forEach((b: BookingResponse) => {
            if (!grouped[b.date]) {
              grouped[b.date] = {
                date: b.date,
                dogs: [],
              };
            }

            grouped[b.date].dogs.push({
              dogId: b.dogId,
              dogName: b.dogName,
              dropOff: b.expectedCheckInTime.slice(0, 5),
              pickUp: b.expectedCheckOutTime.slice(0, 5),
              bookingId: b.id,
            });
          });

          const scheduleData = Object.values(grouped);
          setSchedule(scheduleData);
          setOriginalSchedule(structuredClone(scheduleData));
        } catch (error) {
          console.error("Failed to load data:", error);
        } finally {
          setLoading(false);
        }
      }

      void loadData();
    } else if (mounted) {
      setLoading(false);
    }
  }, [userId, mounted]);

  // Week navigation
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const weekNumber = Number.parseInt(format(currentDate, "I"), 10);
  const year = format(currentDate, "yyyy");

  // Toggle dog selection
  const toggleDog = (dogId: string) => {
    setSelectedDogIds((prev) => {
      const newIds = prev?.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...(prev ?? []), dogId];
      console.log('Selected dogs:', newIds);
      return newIds;
    });
  };

  // Helper to create dog schedule entry
  const createDogScheduleEntry = (id: string) => {
    const dog = dogs.find((d) => d.id === id)!;
    return {
      dogId: id,
      dogName: dog.name,
      dropOff: "08:00",
      pickUp: "16:00",
    };
  };

  // Add/remove day
  const toggleDay = (dateStr: string) => {
    if (!isEditing) return;

    const exists = schedule.find((d) => d.date === dateStr);

    if (exists) {
      setSchedule((prev) => prev.filter((d) => d.date !== dateStr));
    } else {
      setSchedule((prev) => [
        ...prev,
        {
          date: dateStr,
          dogs: selectedDogIds.map(createDogScheduleEntry),
        },
      ]);
    }
  };

  // Update time for a specific dog
  const updateTime = (
    date: string,
    dogId: string,
    field: "dropOff" | "pickUp",
    value: string
  ) => {
    if (!isEditing) return;

    setSchedule((prev) =>
      prev.map((day) => {
        if (day.date !== date) return day;

        const updatedDogs = day.dogs.map((dog) =>
          dog.dogId === dogId ? { ...dog, [field]: value } : dog
        );

        return { ...day, dogs: updatedDogs };
      })
    );
  };

  // Save → create/update/delete bookings
  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      // Find what changed
      const toDelete: string[] = [];
      const toUpdate: Array<{ id: string; data: any }> = [];
      const toCreate: any[] = [];

      // Helper to check for deletions and updates
      originalSchedule.forEach((origDay) => {
        const currentDay = schedule.find((d) => d.date === origDay.date);

        if (!currentDay) {
          // Entire day removed - delete all bookings
          origDay.dogs.forEach((dog) => {
            if (dog.bookingId) toDelete.push(dog.bookingId);
          });
          return;
        }

        checkDogsInDay(origDay, currentDay, toDelete, toUpdate);
      });

      // Check for new bookings
      schedule.forEach((day) => {
        const origDay = originalSchedule.find((d) => d.date === day.date);
        checkNewDogsInDay(day, origDay, userId, toCreate);
      });

      // Execute changes
      await Promise.all([
        ...toDelete.map((id) => bookingApi.delete(id)),
        ...toUpdate.map(({ id, data }) => bookingApi.update(id, data)),
        ...toCreate.map((data) => bookingApi.create(data)),
      ]);

      // Reload data to sync
      const bookings = await bookingApi.getByUserId(userId);
      const grouped: Record<string, MultiDogDaySchedule> = {};

      bookings.forEach((b: BookingResponse) => {
        if (!grouped[b.date]) {
          grouped[b.date] = { date: b.date, dogs: [] };
        }

        grouped[b.date].dogs.push({
          dogId: b.dogId,
          dogName: b.dogName,
          dropOff: b.expectedCheckInTime.slice(0, 5),
          pickUp: b.expectedCheckOutTime.slice(0, 5),
          bookingId: b.id,
        });
      });

      const scheduleData = Object.values(grouped);
      setSchedule(scheduleData);
      setOriginalSchedule(structuredClone(scheduleData));

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSchedule(structuredClone(originalSchedule));
    setIsEditing(false);
  };

  return renderContent();

  function checkDogsInDay(
    origDay: MultiDogDaySchedule,
    currentDay: MultiDogDaySchedule,
    toDelete: string[],
    toUpdate: Array<{ id: string; data: any }>
  ) {
    origDay.dogs.forEach((origDog) => {
      const currentDog = currentDay.dogs.find((d) => d.dogId === origDog.dogId);

      if (!currentDog) {
        if (origDog.bookingId) toDelete.push(origDog.bookingId);
        return;
      }

      const timesChanged = origDog.dropOff !== currentDog.dropOff || origDog.pickUp !== currentDog.pickUp;
      if (timesChanged && origDog.bookingId) {
        toUpdate.push({
          id: origDog.bookingId,
          data: {
            expectedCheckInTime: currentDog.dropOff + ":00",
            expectedCheckOutTime: currentDog.pickUp + ":00",
          },
        });
      }
    });
  }

  function checkNewDogsInDay(
    day: MultiDogDaySchedule,
    origDay: MultiDogDaySchedule | undefined,
    userId: string,
    toCreate: any[]
  ) {
    day.dogs.forEach((dog) => {
      const isNew = !origDay || !origDay.dogs.some((d) => d.dogId === dog.dogId);

      if (isNew) {
        toCreate.push({
          dogId: dog.dogId,
          bookedById: userId,
          date: day.date,
          expectedCheckInTime: dog.dropOff + ":00",
          expectedCheckOutTime: dog.pickUp + ":00",
        });
      }
    });
  }

  function renderContent() {
    if (!mounted) {
      return <p>Loading schedule…</p>;
    }

    if (!userId) {
      return <p>Please log in to view your schedule.</p>;
    }

    if (loading) {
      return <p>Loading schedule…</p>;
    }

    return (
      <div className="space-y-4">
        {/* Dog selection */}
        <div className="flex gap-2 flex-wrap">
          {dogs.map((dog) => (
            <button
              key={dog.id}
              onClick={() => toggleDog(dog.id)}
              disabled={!isEditing}
              className={`px-3 py-1 rounded border ${
                selectedDogIds?.includes(dog.id)
                  ? "bg-brand-primary text-white"
                  : "bg-white text-gray-700"
              } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {dog.name}
            </button>
          ))}
        </div>

        {/* Week navigation */}
        <NextAndPrevious
          currentIndex={weekNumber}
          label={`Week ${weekNumber}, ${year}`}
          onPrevious={() => setCurrentDate((d) => addDays(d, -7))}
          onNext={() => setCurrentDate((d) => addDays(d, 7))}
        />

        {/* Edit buttons */}
        {isEditing ? (
          <div className="flex gap-2">
            <button
              className="btn-primary flex-1"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              className="secondary flex-1"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="secondary w-full"
                  onClick={() => {
                    setIsEditing(true);
                    // All dogs chosen as standard
                    setSelectedDogIds(dogs.map((d) => d.id));
                  }}
          >
            Edit Schedule
          </button>
        )}
        {isEditing && (
          <p className="text-s text-brand-secondary">
            {selectedDogIds.length} of {dogs.length} dogs selected
          </p>
        )}

        {/* Schedule */}
        <ul className="space-y-2">
          {weekDays.map(renderDay)}
        </ul>
      </div>
    );
  }

  function renderDay(day: any) {
    const entry = schedule.find((d) => d.date === day.dateStr);
    const isSelected = !!entry;
    const isBookable = !day.isWeekend;

    return (
      <li key={day.dateStr} className="space-y-2">
        <div
          className={`p-4 rounded-lg ${
            isSelected
              ? "bg-brand-primary text-white"
              : "bg-feature-primary text-brand-secondary"
          } ${isBookable ? "" : "opacity-50"}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{day.dayName}</p>
              <p className="text-sm">{day.fullDate}</p>
            </div>

            {isEditing && isBookable && (
              <button
                onClick={() => toggleDay(day.dateStr)}
                className="text-xs px-3 py-1 rounded bg-white text-gray-700"
              >
                {isSelected ? "Remove" : "Add"}
              </button>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="bg-gray-50 p-3 rounded space-y-3">
            {entry.dogs.map((dog) => (
              <div key={dog.dogId} className="space-y-1">
                <p className="font-medium">{dog.dogName}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`drop-${day.dateStr}-${dog.dogId}`} className="text-sm">
                      Drop-off
                    </label>
                    {isEditing ? (
                      <input
                        id={`drop-${day.dateStr}-${dog.dogId}`}
                        type="time"
                        value={dog.dropOff}
                        onChange={(e) =>
                          updateTime(entry.date, dog.dogId, "dropOff", e.target.value)
                        }
                        className="input"
                      />
                    ) : (
                      <div className="input bg-white">{dog.dropOff}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`pick-${day.dateStr}-${dog.dogId}`} className="text-sm">
                      Pick-up
                    </label>
                    {isEditing ? (
                      <input
                        id={`pick-${day.dateStr}-${dog.dogId}`}
                        type="time"
                        value={dog.pickUp}
                        onChange={(e) =>
                          updateTime(entry.date, dog.dogId, "pickUp", e.target.value)
                        }
                        className="input"
                      />
                    ) : (
                      <div className="input bg-white">{dog.pickUp}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </li>
    );
  }
}
