import {useState, useEffect, type ReactNode} from "react";
import {HealthContext} from "./health.context";
import type {Health} from "./health.types";

export function HealthProvider({children}: { children: ReactNode }) {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchHealth() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/v1/health");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setHealth(data);
    } catch (err) {
      setError((err as Error).message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchHealth()
  }, []);

  return (
    <HealthContext.Provider value={{health, refresh: fetchHealth, loading, error}}>
      {children}
    </HealthContext.Provider>
  );
}
