"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { userApi, UserUpdateRequest, UserResponse } from "@/lib/endpoints/userapi";

export default function ContactInfoTab() {
  const authUser = getUser();
  const userId = authUser?.id;

  const [user, setUser] = useState<UserResponse | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<UserUpdateRequest>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    emergencyContact: "",
    enabled: true,
  });

  // Load user info
  useEffect(() => {
    if (!userId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }

    userApi
      .getById(userId)
      .then((data) => {
        setUser(data);
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          emergencyContact: data.emergencyContact,
          enabled: data.enabled,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load contact information.");
        setLoading(false);
      });
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await userApi.update(userId, form);
      setUser(updated);
      setEditing(false);
    } catch (err) {
      setError("Failed to update contact information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading contact information…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Contact Information</h2>

      {!editing && (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobileNumber}</p>
          <p><strong>Emergency Contact:</strong> {user.emergencyContact}</p>

          <button
            className="btn-primary mt-4"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}

      {editing && (
        <div className="space-y-4">
          <div>
            <label>First Name</label>
            <input
              className="input"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              className="input"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label>Mobile Number</label>
            <input
              className="input"
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
            />
          </div>

          <div>
            <label>Emergency Contact</label>
            <input
              className="input"
              value={form.emergencyContact}
              onChange={(e) =>
                setForm({ ...form, emergencyContact: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>

            <button
              className="btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
