"use client";

import { useState } from "react";
import { Card } from "@/components/card/Card";
import { Users, Trash2, Pencil, Mail, Phone } from "lucide-react";

interface Dog {
  id: number;
  name: string;
}

interface Owner {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  dogs: Dog[];
}

export default function EditDeleteDogOwner() {
  /* Temporary users for UI */
  const [owners, setOwners] = useState<Owner[]>([
    {
      id: 1,
      fullname: "Ove Lindström",
      email: "ove@example.com",
      phone: "070-123 45 67",
      dogs: [
        { id: 101, name: "Bella" },
        { id: 102, name: "Max" }
      ]
    },
    {
      id: 2,
      fullname: "Anna Bergqvist",
      email: "anna.bergqvist@mail.se",
      phone: "073-987 65 43",
      dogs: [
        { id: 103, name: "Molly" },
        { id: 104, name: "Charlie" },
        { id: 105, name: "Luna" }
      ]
    }
  ]);

  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null);
  const [ownerToEdit, setOwnerToEdit] = useState<Owner | null>(null);

  /* -------- Handlers -------- */

  const handleDeleteConfirm = () => {
    if (!ownerToDelete) return;

    setOwners(prev =>
      prev.filter(owner => owner.id !== ownerToDelete.id)
    );

    setOwnerToDelete(null);
  };

  const handleSaveEdit = () => {
    if (!ownerToEdit) return;

    setOwners(prev =>
      prev.map(owner =>
        owner.id === ownerToEdit.id ? ownerToEdit : owner
      )
    );

    setOwnerToEdit(null);
  };

  return (
    <section className="flex flex-col items-center text-center">
      <Card
        icon={Users}
        title="Registered Dog Owners"
        description="Dog owners in the system"
        className="card-lg"
      >
        <ul className="space-y-6">
          {owners.map(owner => (
            <li
              key={owner.id}
              className="bg-feature-primary rounded-lg p-5 border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 text-left space-y-3">
                  <h3 className="text-lg font-bold text-brand-secondary">
                    {owner.fullname}
                  </h3>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span>{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{owner.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                      Dogs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {owner.dogs.map(dog => (
                        <span
                          key={dog.id}
                          className="bg-brand-secondary text-beige-light px-3 py-1 rounded-full text-sm"
                        >
                          {dog.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 p-3">
                  <button
                    onClick={() => setOwnerToEdit({ ...owner })}
                    className="p-2 rounded-lg hover:bg-feature-secondary"
                    aria-label="Edit dog owner"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={() => setOwnerToDelete(owner)}
                    className="p-2 rounded-lg"
                    aria-label="Delete dog owner"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/*  Edit modal  */}
      {ownerToEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="
          bg-white
          rounded-lg
          w-full
          max-w-sm sm:max-w-md
          p-4 sm:p-6
          mx-4
          shadow-lg
          text-left
          ">
            <h2 className="text-lg font-bold mb-4">
              Edit dog owner
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="owner-fullname"
                  className="text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  id="owner-fullname"
                  type="text"
                  value={ownerToEdit.fullname}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      fullname: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="owner-email"
                  className="text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="owner-email"
                  type="email"
                  value={ownerToEdit.email}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      email: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="owner-phone"
                  className="text-sm font-medium"
                >
                  Phone
                </label>
                <input
                  id="owner-phone"
                  type="text"
                  value={ownerToEdit.phone}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      phone: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOwnerToEdit(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-brand-secondary text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Delete confirmation modal  */}
      {ownerToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="
          bg-white
          rounded-lg
          w-full
          max-w-sm sm:max-w-md
          p-4 sm:p-6
          mx-4
          shadow-lg
          text-left
          ">
            <h2 className="text-lg font-bold mb-3">
              Delete dog owner
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{ownerToDelete.fullname}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOwnerToDelete(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
