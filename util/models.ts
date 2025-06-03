import {LogData} from "@/util/interfaces";

export interface User {
    id?: string;
    username?: string;
    biometric_key?: boolean;
    password?: string; //needs to be hashed
    created_at?: string;
    updated_at?: string;
    default_period_length?: number;
    default_cycle_length?: number;
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

export interface DailyLog {
    id: string,
    log_date: Date,
    log_data: LogData,
    created_at: string,
    updated_at: string,
    user_id: string,
    cycle_id: string
}