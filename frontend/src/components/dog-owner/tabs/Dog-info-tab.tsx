"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { userApi, Dog } from "@/lib/endpoints/userapi";

export default function DogInfoTab() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get logged-in user
  const user = getUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }

    userApi
      .getDogsByUserId(userId)
      .then((data) => {
        setDogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dogs", err);
        setError("Could not load dog information.");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <p>Loading dog information…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dog Information</h2>

      {dogs.length === 0 && <p>No dogs found.</p>}

      <div className="space-y-4">
        {dogs.map((dog) => (
          <div
            key={dog.id}
            className="border p-4 rounded-md shadow-sm bg-white"
          >
            <p className="font-bold text-lg">{dog.name}</p>
            <p className="font-semibold m-1">Breed: {dog.breed}</p>
            <p className="font-semibold m-1">Age: {dog.age}</p>
            <p className="font-semibold m-1">Info: {dog.dogInfo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
