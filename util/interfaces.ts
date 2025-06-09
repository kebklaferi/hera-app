import {User} from "@/util/models";

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
    biometric_key?: boolean;
    default_period_length?: number;
    default_cycle_length?: number;
    notes_enabled?: boolean;
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
    created_at: string;
    updated_at: string;
    user_id: string;
}

export interface CycleContextType {
    cycle: CycleContextData | null;
    setCycle: (cycle: CycleContextData | null) => void;
    updateCycle: (partial: Partial<CycleContextData>) => void;
}