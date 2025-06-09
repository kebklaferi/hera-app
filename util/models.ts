import {LogData} from "@/util/interfaces";

export interface User {
    id: string;
    biometric_key: boolean;
    password: string;
    created_at: string;
    updated_at: string;
    default_period_length: number;
    default_cycle_length: number;
    notes_enabled: boolean;
}

export interface Cycle {
    id: string,
    cycle_start_date: Date,
    cycle_end_date: Date,
    period_end_date: Date,
    follicular_end_date: Date,
    ovulation_end_date: Date,
    cycle_length: number,
    period_length: number,
    created_at: string,
    updated_at: string,
    user_id: string

}
export interface CycleModel {
    id: string,
    cycle_start_date: string,
    cycle_end_date: string,
    period_end_date: string,
    follicular_end_date: string,
    ovulation_end_date: string,
    cycle_length: string,
    period_length: string,
    created_at: string,
    updated_at: string,
    user_id: string

}

export interface DailyLog {
    id: string,
    log_date: Date,
    log_data: LogData,
    created_at: string,
    updated_at: string,
    user_id: string,
    cycle_id: string
}