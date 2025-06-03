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

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}