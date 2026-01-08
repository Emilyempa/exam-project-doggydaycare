"use client"

import {Card} from "@/components/card/Card";
import {UserRoundPlus, Dog} from "lucide-react";
import { useState} from "react";
import { userApi, UserCreateRequest} from "@/lib/endpoints/userapi";

export default function AddOwnerAndDog() {

  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOwnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const userRequest: UserCreateRequest = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      mobileNumber: formData.get('mobileNumber') as string,
      emergencyContact: formData.get('emergencyContact') as string,
    };

    try {
      const response = await userApi.create(userRequest);
      setUserId(response.id);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col items-center text-center space-y-8">
      {/* Dog Owner Card */}
      <Card
        icon={UserRoundPlus}
        title="Add New Dog Owner"
        className="card-lg">
        <form onSubmit={handleOwnerSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="ownerEmail">Email</label>
            <input
              id="ownerEmail"
              name="email"
              type="email"
              required
              className="input"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="ownerPassword">Password</label>
            <input
              id="ownerPassword"
              name="password"
              type="password"
              required
              className="input"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="input"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="input"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              required
              className="input"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="emergencyContact">Emergency Contact</label>
            <input
              id="emergencyContact"
              name="emergencyContact"
              type="tel"
              required
              className="input"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Owner'}
          </button>
        </form>
      </Card>

      {/* Dog Card */}
      <Card
        icon={Dog}
        title="Add New Dog"
        className={`card-lg ${
          !userId ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {!userId && (
          <p className="text-sm text-muted mb-4">
            Create an owner before adding a dog
          </p>
        )}
        <form
          method="POST"
          action="/api/v1/admin/users/{userId}/dogs"
          className="space-y-4"
        >
          <input type="hidden" name="userId" value={userId ?? ""} />

          <div>
            <label htmlFor="dogName">Dog Name</label>
            <input
              id="dogName"
              name="dogName"
              type="text"
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="dogAge">Dog Age</label>
            <input
              id="dogAge"
              name="dogAge"
              type="number"
              min={0}
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="breed">Breed</label>
            <input
              id="breed"
              name="breed"
              type="text"
              required
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-8">Add Dog</button>
        </form>
      </Card>
    </section>
  );
}
