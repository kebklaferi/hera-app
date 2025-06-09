import {CycleContextData, CycleContextType} from "@/util/interfaces";
import {createContext, ReactNode, useContext, useState} from "react";

const CycleContext = createContext<CycleContextType>({
    cycle: null,
    setCycle: () => {},
    updateCycle: () => {},
});

export const useCycle = () => useContext(CycleContext);

export const CycleProvider = ({ children }: { children: ReactNode }) => {
    const [cycle, setCycle] = useState<CycleContextData | null>(null);

    const updateCycle = (partial: Partial<CycleContextData>) => {
        setCycle((prev) => (prev ? { ...prev, ...partial } : prev));
    };

    return (
        <CycleContext.Provider value={{ cycle, setCycle, updateCycle }}>
            {children}
        </CycleContext.Provider>
    );
};
