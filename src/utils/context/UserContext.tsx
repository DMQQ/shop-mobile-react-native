import React, { useContext, createContext, useState } from "react";
import type {
  UserContextProviderType,
  UserContextType,
  UserType,
} from "/@types/types";

import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

export const USER_PREFIX = "react-native-shop-user";

export const init: UserType = {
  token: "",
  user_id: 0,
  name: "",
  isLoggedIn: false,
  isLoading: true,
};

const User = createContext<UserContextType>({
  user: init,
  ReadUser: () => new Promise((r, j) => {}),
  RemoveUser: () => {},
  SaveUser: (props: UserType) => {},
  setUser: (prop) => {},
  updateToken: (token: string) => {},
});

export const UserContextProvider = ({
  children,
  onSplashScreen,
}: UserContextProviderType) => {
  const [user, setUser] = useState<UserType>(init);

  const setLoggedIn = () => setUser((p) => ({ ...p, isLoggedIn: true }));

  async function SaveUser(props: UserType) {
    try {
      const value = await setItemAsync(USER_PREFIX, JSON.stringify(props));

      if (value !== null) {
        setUser(props);
        setLoggedIn();
      }
    } catch (error) {
      console.warn(error);
    }
  }

  async function updateToken(token: string) {
    await setItemAsync(USER_PREFIX, JSON.stringify({ ...user, token }));

    setUser((prev) => ({ ...prev, token }));
  }

  async function ReadUser() {
    try {
      const value = await getItemAsync(USER_PREFIX);

      if (value !== null) {
        setUser({ ...JSON.parse(value), isLoading: false, isLoggedIn: true });
      }

      return JSON.parse(value ?? "{}");
    } catch (error) {
    } finally {
      onSplashScreen?.();
    }
  }

  async function RemoveUser() {
    await deleteItemAsync(USER_PREFIX);
    setUser({ ...init, isLoading: false });
  }

  return (
    <User.Provider
      value={{ user, setUser, SaveUser, updateToken, ReadUser, RemoveUser }}
    >
      {children}
    </User.Provider>
  );
};

export const useUser = () => {
  return useContext(User);
};
