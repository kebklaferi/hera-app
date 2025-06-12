import {CycleContextData, CycleContextType} from "@/util/interfaces";
import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {compareDesc, parseISO} from "date-fns";

const CycleContext = createContext<CycleContextType>({
    cycles: [],
    setCycles: () => {},
    addCycle: () => {},
    updateCycle: () => {},
    currentCycle: null
});

export const useCycle = () => useContext(CycleContext);

export const CycleProvider = ({ children }: { children: ReactNode }) => {
    const [cycles, setCycles] = useState<CycleContextData[]>([]);

    const addCycle = (newCycle: CycleContextData) => {
        setCycles((prev) => [newCycle, ...prev]);
    };

    const updateCycle = (id: string, updates: Partial<CycleContextData>) => {
        setCycles((prev) =>
            prev.map((cycle) => (cycle.id === id ? { ...cycle, ...updates } : cycle))
        );
    };

    const currentCycle = useMemo(() => {
        const today = new Date();

        // sorting cycles by most recent start date
        const sortedCycles = [...cycles].sort(
            (a, b) => b.cycle_start_date.getTime() - a.cycle_start_date.getTime()
        );
        // set most recent cycle as current cycle
        return (
            sortedCycles.find((cycle) =>
                today >= cycle.cycle_start_date
            ) ?? null
        );
    }, [cycles]);

    return (
        <CycleContext.Provider value={{ cycles, setCycles, addCycle, updateCycle, currentCycle }}>
            {children}
        </CycleContext.Provider>
    );
};
