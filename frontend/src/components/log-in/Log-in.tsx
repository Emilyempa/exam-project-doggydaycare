"use client";

import { Card } from "@/components/card/Card";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        email: data.email,
        role: data.role
      }));

      // Redirect based on the role
      switch (data.role) {
        case "ADMIN":
          router.push("/admin-dashboard");
          break;
        case "STAFF":
          router.push("/staff-dashboard");
          break;
        case "OWNER":
          router.push("/dog-owner-dashboard");
          break;
        default:
          router.push("/home");
      }

    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex flex-col items-center text-center"
      aria-labelledby="login-heading"
    >
      <a href="/home" className="p-4 text-xl font-medium">
        Back to Home page
      </a>

      <Card
        className="card-lg"
        icon={CircleUserRound}
        title="Log in"
        id="login-heading"
      >
        <p className="p-2 mb-6">Use your credentials to log in</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="
                w-full
                border
                border-primary
                rounded-md
                mb-6
                px-3
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-primary
                focus:border-primary
              "
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mb-8"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

        </form>
      </Card>
    </section>
  );
};
