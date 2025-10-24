import {useState, type ReactNode} from "react";
import type {User} from "../../../types/user.ts";
import {AuthContext} from "./auth.context";

export function AuthProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = (name: string) => setUser({id: Date.now(), name});
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}
