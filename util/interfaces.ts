import {UserModel} from "@/util/models";
import {Dispatch, SetStateAction} from "react";

export interface LogData {
    notes: string,
    symptoms: string
}

export interface InputFieldProps {
    title: string,
    value: string,
    styling?: string,
    placeholder?: string,
    handleChangeText: (text: string) => void
}

export interface ISignUpForm {
    password: string,
    biometricSetUp: boolean
}

export interface BiometricSetUpProps {
    onSetupComplete: () => void;
}


export interface UserContextType {
    user: UserContextData | null;
    setUser: (user: UserContextData | null) => void;
    updateUser: (partialUser: Partial<UserContextData>) => void;
}

export interface UserContextData {
    id: string;
    biometric_key: boolean;
    default_period_length: number;
    default_cycle_length: number;
    notes_enabled: boolean;
}

export interface ProfileData {
    default_period_length: number;
    default_cycle_length: number;
    notes_enabled: boolean;
}
export interface CycleContextData {
    id: string;
    cycle_start_date: Date;
    cycle_end_date: Date;
    period_end_date: Date;
    follicular_end_date: Date;
    ovulation_end_date: Date;
    cycle_length: number;
    period_length: number;
}

export interface CycleContextType {
    cycles: CycleContextData[];
    setCycles: Dispatch<SetStateAction<CycleContextData[]>>;
    addCycle: (cycle: CycleContextData) => void;
    updateCycle: (id: string, updates: Partial<CycleContextData>) => void;
    currentCycle: CycleContextData | null;
}

export interface GeneratedCycle {
    contextCycle: CycleContextData;
    dbCycleValues: (string | number | null)[];
}
