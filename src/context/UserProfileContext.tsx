import { createContext, ReactNode, useContext, useState } from "react";
import { mockUserProfile } from "../data/userProfile";
import { UserFitnessProfile } from "../types/fitness";

type UserProfileContextData = {
  profile: UserFitnessProfile;
  updateProfile: (profile: UserFitnessProfile) => void;
};

const UserProfileContext = createContext<UserProfileContextData | undefined>(undefined);

type UserProfileProviderProps = {
  children: ReactNode;
};

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const [profile, setProfile] = useState<UserFitnessProfile>(mockUserProfile);

  function updateProfile(newProfile: UserFitnessProfile) {
    setProfile(newProfile);
  }

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error("useUserProfile precisa estar dentro de UserProfileProvider");
  }

  return context;
}