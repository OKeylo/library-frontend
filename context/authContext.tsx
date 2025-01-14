"use client";

import { ReactNode, useEffect, useState } from "react";
import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { UserProps } from "@/http/httpClient";
import httpClient from "@/http/index";

type AuthContext = {
  user: UserProps | undefined;
  setUser: Dispatch<SetStateAction<UserProps | undefined>>;
};

export const AuthContext = createContext<AuthContext | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | undefined>();

  useEffect(() => {
    const token: string | null = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    httpClient.token = token;

    const getUser = async () => {
      await httpClient.getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        setUser(undefined);
        localStorage.removeItem("access_token");
      });
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Use only within a AuthContextProvider");
  }
  return context;
};