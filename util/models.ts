import {LogData} from "@/util/interfaces";

export interface UserModel {
    id: string;
    biometric_key: number;
    password: string;
    created_at: string;
    updated_at: string | null;
    default_period_length: string | null;
    default_cycle_length: string | null;
    notes_enabled: number;
}

export interface CycleModel {
    id: string,
    cycle_start_date: string,
    cycle_start_date_plain: string,
    cycle_end_date: string,
    period_end_date: string,
    follicular_end_date: string,
    ovulation_end_date: string,
    cycle_length: string,
    period_length: string,
    created_at: string,
    updated_at: string | null,
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