import {createContext, ReactNode, useContext, useState} from "react";
import {UserContextData, UserContextType} from "@/util/interfaces";
import {User} from "@/util/models";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {
        throw new Error("setUser must be used within a UserProvider");
    },
    updateUser: () => {
        throw new Error("updateUser must be used within a UserProvider");
    }
});
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextData | null>(null);
    const updateUser = (partialUser: Partial<UserContextData>) => {
        setUser((prev) => prev ? { ...prev, ...partialUser } : prev);
    };
    return (
        <UserContext.Provider value={{ user, setUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};