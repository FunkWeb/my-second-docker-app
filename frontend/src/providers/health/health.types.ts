export type Health = {
  status: string;
  uptime: number;
};

export type HealthContextValue = {
  health: Health | null;
  refresh: () => Promise<void>;
  loading: boolean;
  error: string | null;
};
