"use client"

import {Card} from "@/components/card/Card";
import {UserRoundPlus, Dog} from "lucide-react";
import React, { useState} from "react";
import { userApi, UserCreateRequest} from "@/lib/endpoints/userapi";
import { dogApi, DogCreateRequest } from "@/lib/endpoints/dogapi";

export default function AddOwnerAndDog() {

  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDog, setIsSubmittingDog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dogError, setDogError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOwnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

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
      setSuccessMessage(`Owner ${response.fullName} created successfully! You can now add a dog.`);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingDog(true);
    setDogError(null);

    if (!userId) {
      setDogError('Please create an owner first');
      setIsSubmittingDog(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const dogRequest: DogCreateRequest = {
      name: formData.get('dogName') as string,
      age: Number.parseInt(formData.get('dogAge') as string),
      breed: formData.get('breed') as string,
      dogInfo: formData.get('dogInfo') as string || undefined,
      userId: userId
    };

    try {
      await dogApi.create(dogRequest);
      setSuccessMessage(`Dog ${dogRequest.name} added successfully!`);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setDogError(err instanceof Error ? err.message : 'Failed to create dog');
    } finally {
      setIsSubmittingDog(false);
    }
  };

  return (
    <section className="flex flex-col items-center text-center space-y-8">
      {successMessage && (
        <div className="w-full max-w-md bg-green-100 text-green-800 p-4 rounded">
          {successMessage}
        </div>
      )}

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
          onSubmit={handleDogSubmit}
          className="space-y-4"
        >
          {dogError && (
            <div className="text-red-600 text-sm">{dogError}</div>
          )}

          <div>
            <label htmlFor="dogName">Dog Name</label>
            <input
              id="dogName"
              name="dogName"
              type="text"
              required
              className="input"
              disabled={isSubmittingDog || !userId}
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
              disabled={isSubmittingDog || !userId}
            />
          </div>
          <div>
            <label htmlFor="breed">Breed (Optional)</label>
            <input
              id="breed"
              name="breed"
              type="text"
              className="input"
              disabled={isSubmittingDog || !userId}
            />
          </div>
          <div>
            <label htmlFor="dogInfo">Dog Info (Optional)</label>
            <textarea
              id="dogInfo"
              name="dogInfo"
              className="input"
              rows={3}
              disabled={isSubmittingDog || !userId}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full mt-8"
            disabled={isSubmittingDog || !userId}
          >
            {isSubmittingDog ? 'Adding...' : 'Add Dog'}
          </button>
        </form>
      </Card>
    </section>
  );
}
