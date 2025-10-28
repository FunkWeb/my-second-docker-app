import {createContext, useContext} from "react";
import type {HealthContextValue} from "./health.types";

export const HealthContext = createContext<HealthContextValue | undefined>(undefined);

export function useHealth() {
  const ctx = useContext(HealthContext);

  if (!ctx) throw new Error("useHealth must be used within <HealthProvider>");

  return ctx;
}
