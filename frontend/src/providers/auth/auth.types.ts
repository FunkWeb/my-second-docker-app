import type {User} from "../../types/user.ts";

export type AuthContextValue = {
  user: User;
  login: (name: string) => void;
  logout: () => void;
};
