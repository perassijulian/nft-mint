"use client";

import { useSubscribe } from "@/hooks/useSubscrite";
import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const { subscribe, status, loading } = useSubscribe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribe(email);
    setEmail("");
  };

  return (
    <section className="bg-white py-24">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Join the <span className="text-indigo-600">Newsletter</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Subscribe and receive a free NFT!
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <input
            type="email"
            placeholder="you@example.com"
            className="border border-gray-300 rounded-md px-4 py-3 w-full sm:w-80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6 py-3"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {status && (
          <p
            className={`mt-4 text-sm ${
              status.includes("failed") ? "text-red-500" : "text-green-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
