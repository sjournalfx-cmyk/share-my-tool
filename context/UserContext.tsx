
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  joinDate: string;
  rating: number;
  reviews: number;
  profession?: string;
  skills?: string[];
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  name: "Alex Johnson",
  email: "alex.j@example.com",
  phone: "+1 (555) 123-4567",
  bio: "DIY enthusiast and weekend warrior. Always looking for the right tool for the job.",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
  joinDate: "Sep 2023",
  rating: 5.0,
  reviews: 4,
  profession: "General Handyman",
  skills: ["Carpentry", "Assembly", "Painting"]
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
