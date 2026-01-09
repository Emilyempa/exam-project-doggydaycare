"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/card/Card";
import { CalendarCheck2, Info, X } from "lucide-react";
import NextAndPrevious from "@/components/buttons/Next-and-previous";
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';
import { bookingApi, BookingResponse } from "@/lib/endpoints/bookingapi";
import { userApi, UserResponse } from "@/lib/endpoints/userapi";
import { dogApi, DogResponse } from "@/lib/endpoints/dogapi";

// =========================
// Component: DogAttendance
// Purpose: Staff view to manage daily/weekly dog attendance
//          with expandable owner info per dog
// =========================
export default function DogAttendance() {
  // ---------- UI state ----------
  const [view, setView] = useState<"day" | "week">("day");
  const [openInfoDogId, setOpenInfoDogId] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // ---------- Data state ----------
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [users, setUsers] = useState<Map<string, UserResponse>>(new Map());
  const [dogs, setDogs] = useState<Map<string, DogResponse>>(new Map());
  const [loading, setLoading] = useState(true);

  // ---------- Fetch data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all bookings, users, and dogs in parallel
        const [bookingsRes, usersRes, dogsRes] = await Promise.all([
          bookingApi.getAll(),
          userApi.getAll(),
          dogApi.getAll()
        ]);

        // Create maps for quick lookups
        const usersMap = new Map(usersRes.map(u => [u.id, u]));
        const dogsMap = new Map(dogsRes.map(d => [d.id, d]));

        setBookings(bookingsRes);
        setUsers(usersMap);
        setDogs(dogsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  const currentDateStr = format(currentDate, 'yyyy-MM-dd');

  // Filter bookings for the current day
  const bookingsForToday = bookings.filter(booking =>
    booking.date === currentDateStr &&
    booking.status !== 'CANCELLED'
  );

  // Transform bookings into dog data format for display
  const dogsForToday = bookingsForToday.map(booking => {
    const dog = dogs.get(booking.dogId);
    const owner = users.get(booking.bookedById);

    return {
      id: booking.id,
      dogId: booking.dogId,
      name: booking.dogName,
      breed: dog?.breed || 'Unknown',
      startTime: booking.expectedCheckInTime.slice(0, 5), // HH:mm from HH:mm:ss
      endTime: booking.expectedCheckOutTime.slice(0, 5),
      schedule: [currentDayName], // Not used in day view
      booking: booking,
      owner: {
        name: owner?.fullName || 'Unknown',
        phone: owner?.mobileNumber || 'N/A',
        email: owner?.email || 'N/A',
        emergencyContact: owner?.emergencyContact || 'N/A',
        notes: booking.notes || 'No notes'
      }
    };
  });

  // Get all unique dogs with their bookings for the week view
  const getDogsForWeek = () => {
    const dogMap = new Map<string, {
      id: string;
      name: string;
      breed: string;
      bookings: Map<string, BookingResponse>;
    }>();

    // Get bookings for the current week
    const weekStart = weekDays.at(0)!.dateStr;
    const weekEnd = weekDays.at(-1)!.dateStr;

    bookings
      .filter(b => b.date >= weekStart && b.date <= weekEnd && b.status !== 'CANCELLED')
      .forEach(booking => {
        if (!dogMap.has(booking.dogId)) {
          const dog = dogs.get(booking.dogId);
          dogMap.set(booking.dogId, {
            id: booking.dogId,
            name: booking.dogName,
            breed: dog?.breed || 'Unknown',
            bookings: new Map()
          });
        }
        dogMap.get(booking.dogId)!.bookings.set(booking.date, booking);
      });

    return Array.from(dogMap.values());
  };

  const dogsForWeek = getDogsForWeek();

  // ---------- Handlers ----------
  const toggleInfo = (bookingId: string) => {
    setOpenInfoDogId(prev => (prev === bookingId ? null : bookingId));
  };

  const toggleCheckIn = async (bookingId: string, dogName: string) => {
    const isCheckedIn = checkedIn.includes(bookingId);

    try {
      if (isCheckedIn) {
        // Check out
        await bookingApi.checkOut(bookingId);
        setCheckedIn(prev => prev.filter(id => id !== bookingId));
      } else {
        // Check in
        await bookingApi.checkIn(bookingId);
        setCheckedIn(prev => [...prev, bookingId]);
      }

      // Refresh bookings
      const bookingsRes = await bookingApi.getAll();
      setBookings(bookingsRes);
    } catch (error) {
      console.error('Error toggling check-in:', error);
    }
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

  if (loading) {
    return (
      <section className="flex flex-col items-center text-center">
        <Card title="Dog Schedule" icon={CalendarCheck2} className="card-lg">
          <div className="p-8">Loading...</div>
        </Card>
      </section>
    );
  }

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
              <div className="p-8 text-brand-secondary">
                <p>No dogs scheduled for {currentDayName}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dogsForToday.map(dog => {
                  const status = dog.booking.status;
                  const isOpen = openInfoDogId === dog.id;

                  const getStatusClasses = () => {
                    if (status === 'CHECKED_IN') return "btn-primary";
                    if (status === 'CHECKED_OUT') return "bg-brand-secondary text-secondary opacity-60 cursor-not-allowed";
                    return "bg-secondary text-brand-secondary";
                  };

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
                              <strong>Email:</strong> {dog.owner.email}
                            </li>
                            <li>
                              <strong>Emergency:</strong> {dog.owner.emergencyContact}
                            </li>
                            <li>
                              <strong>Dog info:</strong> {dog.owner.notes}
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
                        disabled={status === 'CHECKED_OUT'}
                        className={`w-full mt-4 ${getStatusClasses()}`}
                        onClick={() => {
                          if (status === 'CONFIRMED') toggleCheckIn(dog.id, dog.name);
                          if (status === 'CHECKED_IN') toggleCheckIn(dog.id, dog.name);
                        }}
                      >
                        {status === 'CONFIRMED' && "Check in"}
                        {status === 'CHECKED_IN' && "Check out"}
                        {status === 'CHECKED_OUT' && "Gone home"}
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
                {dogsForWeek.map(dog => (
                  <tr key={dog.id} className="hover:bg-feature-secondary transition-colors">
                    <td className="border border-secondary p-3 font-semibold text-left">
                      <div>{dog.name}</div>
                      <div className="text-sm text-gray-600">{dog.breed}</div>
                    </td>

                    {weekDays.map(day => {
                      const booking = dog.bookings.get(day.dateStr);
                      const isScheduled = !!booking;
                      return (
                        <td
                          key={day.dateStr}
                          className={`border border-secondary p-3 text-center ${
                            isScheduled
                              ? "bg-brand-primary text-beige-light font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {isScheduled
                            ? `${booking.expectedCheckInTime.slice(0, 5)} – ${booking.expectedCheckOutTime.slice(0, 5)}`
                            : "—"}
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
              {dogsForWeek.map(dog => (
                <div
                  key={dog.id}
                  className="bg-feature-primary rounded-lg shadow p-4 text-left"
                >
                  <h3 className="font-semibold text-lg">{dog.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{dog.breed}</p>

                  <ul className="space-y-1 text-sm">
                    {weekDays.map(day => {
                      const booking = dog.bookings.get(day.dateStr);
                      return (
                        <li
                          key={day.dateStr}
                          className="flex justify-between border-b py-1"
                        >
                          <div>
                            <span className="font-medium">{day.dayName}</span>
                            <span className="text-xs text-gray-500 ml-2">{day.shortDate}</span>
                          </div>
                          {booking ? (
                            <span className="bg-brand-primary text-beige-light px-2 py-0.5 rounded text-xs">
                              {booking.expectedCheckInTime.slice(0, 5)} – {booking.expectedCheckOutTime.slice(0, 5)}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </li>
                      );
                    })}
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
