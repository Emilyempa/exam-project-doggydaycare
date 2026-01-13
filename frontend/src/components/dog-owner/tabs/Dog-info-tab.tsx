"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { dogApi, DogResponse, DogUpdateRequest } from "@/lib/endpoints/dogapi";

export default function DogInfoTab() {
  const [dogs, setDogs] = useState<DogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<DogUpdateRequest>({
    name: "",
    breed: "",
    age: 0,
    dogInfo: "",
  });

  const user = getUser();
  const userId = user?.id;

  // Load dogs
  useEffect(() => {
    if (!userId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/v1/users/${userId}/dogs`)
      .then((res) => res.json())
      .then((data) => {
        setDogs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load dog information.");
        setLoading(false);
      });
  }, [userId]);

  const startEditing = (dog: DogResponse) => {
    setEditingDogId(dog.id);
    setForm({
      name: dog.name,
      breed: dog.breed,
      age: dog.age,
      dogInfo: dog.dogInfo,
    });
  };

  const cancelEditing = () => {
    setEditingDogId(null);
  };

  const saveDog = async () => {
    if (!editingDogId) return;

    setSaving(true);

    try {
      const updated = await dogApi.update(editingDogId, form);

      setDogs((prev) =>
        prev.map((d) => (d.id === editingDogId ? updated : d))
      );

      setEditingDogId(null);
    } catch (err) {
      console.error("Failed to update dog", err);
      setError("Failed to update dog information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading dog information…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

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
            {editingDogId !== dog.id && (
              <>
                <p className="font-bold text-lg mb-2">{dog.name}</p>
                <p><strong>Breed:</strong> {dog.breed}</p>
                <p><strong>Age:</strong> {dog.age}</p>
                <p><strong>Info:</strong> {dog.dogInfo}</p>

                <button
                  className="btn-primary mt-4"
                  onClick={() => startEditing(dog)}
                >
                  Edit
                </button>
              </>
            )}

            {editingDogId === dog.id && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    className="input"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="breed">Breed</label>
                  <input
                    id="breed"
                    className="input"
                    value={form.breed}
                    onChange={(e) =>
                      setForm({ ...form, breed: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    className="input"
                    value={form.age}
                    onChange={(e) =>
                      setForm({ ...form, age: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="doginfo">Info</label>
                  <textarea
                    id="doginfo"
                    className="input"
                    value={form.dogInfo}
                    onChange={(e) =>
                      setForm({ ...form, dogInfo: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    className="btn-primary"
                    onClick={saveDog}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
