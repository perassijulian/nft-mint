"use client";

import { useState } from "react";

export function useSubscribe() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error(await res.text());

      setStatus("Subscribed! Check your wallet.");
    } catch (err) {
      setStatus("Subscription failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, subscribe };
}
