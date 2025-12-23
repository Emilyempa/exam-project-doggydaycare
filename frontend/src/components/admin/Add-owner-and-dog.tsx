"use client"

import {Card} from "@/components/card/Card";
import {UserRoundPlus, Dog} from "lucide-react";
import { useState} from "react";

export default function AddOwnerAndDog() {

  const [userId, setUserId] = useState<string | null>(null);

  return (
    <section className="flex flex-col items-center text-center space-y-8">
      {/* Dog Owner Card */}
      <Card
        icon={UserRoundPlus}
        title="Add New Dog Owner"
        className="card-lg">
        <form method="POST" action="/api/v1/admin/users" className="space-y-4">
          <div>
            <label htmlFor="ownerEmail">Email</label>
            <input
              id="ownerEmail"
              name="email"
              type="email"
              required
              className="input"
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
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-8">Add Owner</button>
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
