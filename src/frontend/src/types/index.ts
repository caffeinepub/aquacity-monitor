// Frontend TypeScript interfaces aligned with backend types
// Note: backend uses bigint for IDs — we keep bigint here to match backend.d.ts

export interface Area {
  area_id: bigint;
  area_name: string;
  population: bigint;
  latitude: number;
  longitude: number;
}

export interface PipeNetwork {
  pipe_id: bigint;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  diameter: number;
  status: string;
}

export interface MeterReading {
  reading_id: bigint;
  meter_id: string;
  area_id: bigint;
  reading_value: number;
  reading_date: string;
}

export interface PressureLog {
  pressure_id: bigint;
  pipe_id: bigint;
  pressure_value: number;
  recorded_at: string;
}

export interface LeakIncident {
  leak_id: bigint;
  pipe_id: bigint;
  area_id: bigint;
  leak_severity: string;
  reported_time: string;
  resolved_status: boolean;
  latitude: number;
  longitude: number;
}

export interface DailyReport {
  report_id: bigint;
  area_id: bigint;
  report_date: string;
  total_usage: number;
  reading_count: bigint;
  generated_at: string;
}

export interface DashboardStats {
  today_usage: number;
  avg_pressure: number;
  active_leaks: bigint;
  shortage_risk: boolean;
}

export type StatusType =
  | "Normal"
  | "Critical"
  | "Low"
  | "Moderate"
  | "Broken"
  | "Maintenance"
  | boolean;
