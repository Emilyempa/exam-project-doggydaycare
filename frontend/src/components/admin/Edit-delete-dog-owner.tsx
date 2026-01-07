"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/card/Card";
import { Users, Trash2, Pencil, Mail, Phone, AlertCircle } from "lucide-react";
import { userApi, UserResponse, UserUpdateRequest } from "@/lib/endpoints/userapi";
import { ApiError } from "@/lib/api";

export default function EditDeleteDogOwner() {
  const [owners, setOwners] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [ownerToDelete, setOwnerToDelete] = useState<UserResponse | null>(null);
  const [ownerToEdit, setOwnerToEdit] = useState<UserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* -------- Fetch data on mount -------- */
  useEffect(() => {
    handleFetchOwners();

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (ownerToEdit && !isSaving) {
          setOwnerToEdit(null);
          setError(null);
        }
        if (ownerToDelete && !isDeleting) {
          setOwnerToDelete(null);
          setError(null);
        }
      }
    };

    globalThis.addEventListener('keydown', handleGlobalKeyDown);
    return () => globalThis.removeEventListener('keydown', handleGlobalKeyDown);
  }, [ownerToEdit, isSaving, ownerToDelete, isDeleting]);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);

      const users = await userApi.getAll();

      // Fetch dogs for each owner
      const usersWithDogs = await Promise.all(
        users.map(async (user) => {
          try {
            const dogs = await userApi.getDogsByUserId(user.id);
            return { ...user, dogs };
          } catch (err) {
            console.error(`Failed to fetch dogs for user ${user.id}:`, err);
            return { ...user, dogs: [] };
          }
        })
      );

      setOwners(usersWithDogs);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to load owners: ${err.message}`);
      } else {
        setError('An unexpected error occurred while loading owners');
      }
      console.error('Error fetching owners:', err);
    } finally {
      setLoading(false);
    }
  };

  /* -------- Delete Handler -------- */
  const handleDeleteConfirm = async () => {
    if (!ownerToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);
      setStatusMessage(`Deleting ${ownerToDelete.fullName}...`);
      await userApi.delete(ownerToDelete.id);

      setOwners(prev =>
        prev.filter(owner => owner.id !== ownerToDelete.id)
      );

      setStatusMessage(`${ownerToDelete.fullName} deleted successfully.`);
      setOwnerToDelete(null);
    } catch (err) {
      setStatusMessage(null);
      if (err instanceof ApiError) {
        setError(`Failed to delete owner: ${err.message}`);
      } else {
        setError('An unexpected error occurred while deleting owner');
      }
      console.error('Error deleting owner:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  /* -------- Update Handler -------- */
  const handleSaveEdit = async () => {
    if (!ownerToEdit) return;

    try {
      setIsSaving(true);
      setError(null);
      setStatusMessage(`Saving changes for ${ownerToEdit.fullName}...`);

      const updateData: UserUpdateRequest = {
        firstName: ownerToEdit.firstName,
        lastName: ownerToEdit.lastName,
        email: ownerToEdit.email,
        mobileNumber: ownerToEdit.mobileNumber,
        emergencyContact: ownerToEdit.emergencyContact,
        enabled: ownerToEdit.enabled
      };

      const updatedOwner = await userApi.update(ownerToEdit.id, updateData);

      setOwners(prev =>
        prev.map(owner =>
          owner.id === updatedOwner.id
            ? { ...updatedOwner, dogs: owner.dogs }
            : owner
        )
      );

      setStatusMessage(`Changes for ${ownerToEdit.fullName} saved successfully.`);
      setOwnerToEdit(null);
    } catch (err) {
      setStatusMessage(null);
      if (err instanceof ApiError) {
        setError(`Failed to update owner: ${err.message}`);
      } else {
        setError('An unexpected error occurred while updating owner');
      }
      console.error('Error updating owner:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchOwners = () => {
    void fetchOwners();
  };

  const handleSaveEditPromise = () => {
    void handleSaveEdit();
  };

  const handleDeleteConfirmPromise = () => {
    void handleDeleteConfirm();
  };

  /* -------- Loading State -------- */
  if (loading) {
    return (
      <section className="flex flex-col items-center text-center" aria-live="polite">
        <Card
          icon={Users}
          title="Loading Dog Owners"
          description="Please wait while we fetch the data"
          className="card-lg"
        >
          <div className="flex flex-col items-center gap-4 py-8">
            <output className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary"
                 aria-label="Loading">
            </output>
            <p className="text-gray-600">Loading owners...</p>
          </div>
        </Card>
      </section>
    );
  }

  /* -------- Error State -------- */
  if (error) {
    return (
      <section className="flex flex-col items-center text-center" role="alert" aria-live="assertive">
        <Card
          icon={AlertCircle}
          title="Error Loading Data"
          description="We encountered a problem"
          className="card-lg"
        >
          <div className="space-y-4">
            <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
            <button
              onClick={() => {
                setError(null);
                handleFetchOwners();
              }}
              className="px-6 py-2 bg-brand-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </Card>
      </section>
    );
  }

  /* -------- Empty State -------- */
  if (owners.length === 0) {
    return (
      <section className="flex flex-col items-center text-center">
        <Card
          icon={Users}
          title="No Dog Owners Found"
          description="There are currently no registered dog owners"
          className="card-lg"
        >
          <p className="text-gray-600 py-8">Add your first dog owner to get started.</p>
        </Card>
      </section>
    );
  }

  /* -------- Main Content -------- */
  return (
    <section className="flex flex-col items-center text-center">
      {/* Screen reader announcements */}
      <output className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </output>

      <Card
        icon={Users}
        title="Registered Dog Owners"
        description={`${owners.length} dog owner${owners.length === 1 ? '' : 's'} in the system`}
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
                    {owner.fullName}
                  </h3>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} aria-hidden="true" />
                      <span>{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} aria-hidden="true" />
                      <span>{owner.mobileNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                      Dogs {owner.dogs && owner.dogs.length > 0 && `(${owner.dogs.length})`}
                  </p>
                    {owner.dogs && owner.dogs.length > 0 ? (
                      <ul className="flex flex-wrap gap-2" aria-label={`Dogs owned by ${owner.fullName}`}>
                        {owner.dogs.map(dog => (
                          <li
                            key={dog.id}
                            className="bg-brand-secondary text-beige-light px-3 py-1 rounded-full text-sm"
                          >
                            {dog.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No dogs registered</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 p-3">
                  <button
                    onClick={() => setOwnerToEdit({ ...owner })}
                    className="p-2 rounded-lg hover:bg-feature-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2"
                    aria-label={`Edit ${owner.fullName}`}
                  >
                    <Pencil size={20} aria-hidden="true" />
                  </button>

                  <button
                    onClick={() => setOwnerToDelete(owner)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Delete ${owner.fullName}`}
                  >
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Edit Modal */}
      {ownerToEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 w-full h-full border-none p-0 cursor-default"
            onClick={() => {
              if (!isSaving) {
                setOwnerToEdit(null);
                setError(null);
              }
            }}
            aria-label="Close modal"
          />
          <dialog
            open
            className="relative bg-white rounded-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6 mx-4 shadow-lg text-left block"
            aria-labelledby="edit-dialog-title"
          >
            <h2 id="edit-dialog-title" className="text-lg font-bold mb-4">
              Edit Dog Owner
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditPromise();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="owner-firstname"
                  className="block text-sm font-medium mb-1"
                >
                  First Name
                </label>
                <input
                  id="owner-firstname"
                  type="text"
                  value={ownerToEdit.firstName}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      firstName: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="owner-lastname"
                  className="block text-sm font-medium mb-1"
                >
                  Last Name
                </label>
                <input
                  id="owner-lastname"
                  type="text"
                  value={ownerToEdit.lastName}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      lastName: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="owner-email"
                  className="block text-sm font-medium mb-1"
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="owner-phone"
                  className="block text-sm font-medium mb-1"
                >
                  Mobile Number
                </label>
                <input
                  id="owner-phone"
                  type="tel"
                  value={ownerToEdit.mobileNumber}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      mobileNumber: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="emergency-contact"
                  className="block text-sm font-medium mb-1"
                >
                  Emergency Contact
                </label>
                <input
                  id="emergency-contact"
                  type="tel"
                  value={ownerToEdit.emergencyContact}
                  onChange={(e) =>
                    setOwnerToEdit({
                      ...ownerToEdit,
                      emergencyContact: e.target.value
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>

              <div className="pt-2">
                <label
                  htmlFor="owner-enabled"
                  className="flex items-center gap-3 text-sm font-medium cursor-pointer select-none"
                >
                  <input
                    id="owner-enabled"
                    type="checkbox"
                    checked={ownerToEdit.enabled}
                    onChange={(e) =>
                      setOwnerToEdit({
                        ...ownerToEdit,
                        enabled: e.target.checked,
                      })
                    }
                    className="
                    h-4 w-4
                    rounded
                    border-gray-300
                    focus:ring-2
                    focus:ring-brand-secondary
                    focus:ring-offset-2
      "
                  />
                  <span>Account enabled</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setOwnerToEdit(null);
                    setError(null);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-brand-secondary text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {ownerToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 w-full h-full border-none p-0 cursor-default"
            onClick={() => {
              if (!isDeleting) {
                setOwnerToDelete(null);
                setError(null);
              }
            }}
            aria-label="Close modal"
          />
          <dialog
            open
            className="relative bg-white rounded-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6 mx-4 shadow-lg text-left block"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <h2 id="delete-dialog-title" className="text-lg font-bold mb-3">
              Delete Dog Owner
            </h2>
            <p id="delete-dialog-description" className="mb-6 text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{ownerToDelete.fullName}</strong>?
              This action cannot be undone.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setOwnerToDelete(null);
                  setError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmPromise}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                autoFocus
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </dialog>
        </div>
      )}
    </section>
  );
}
