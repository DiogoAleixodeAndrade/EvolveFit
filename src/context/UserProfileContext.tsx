import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { mockUserProfile } from "../data/userProfile";
import { fetchProfile, upsertProfile } from "../services/profileService";
import { UserFitnessProfile } from "../types/fitness";

type UserProfileContextData = {
  profile: UserFitnessProfile;
  isLoadingProfile: boolean;
  updateProfile: (profile: UserFitnessProfile) => Promise<void>;
  reloadProfile: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextData | undefined>(undefined);

type UserProfileProviderProps = {
  children: ReactNode;
};

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const [profile, setProfile] = useState<UserFitnessProfile>(mockUserProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  async function reloadProfile() {
    try {
      setIsLoadingProfile(true);

      const profileFromSupabase = await fetchProfile();

      if (profileFromSupabase) {
        setProfile(profileFromSupabase);
        return;
      }

      await upsertProfile(mockUserProfile);
      setProfile(mockUserProfile);
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function updateProfile(newProfile: UserFitnessProfile) {
    await upsertProfile(newProfile);
    setProfile(newProfile);
  }

  useEffect(() => {
    reloadProfile();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoadingProfile,
        updateProfile,
        reloadProfile,
      }}
    >
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