import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DashboardStats {
    today_usage: number;
    avg_pressure: number;
    active_leaks: bigint;
    shortage_risk: boolean;
}
export type ReportId = bigint;
export type LeakId = bigint;
export interface Area {
    latitude: number;
    area_name: string;
    longitude: number;
    area_id: AreaId;
    population: bigint;
}
export interface PipeNetwork {
    status: string;
    start_lat: number;
    start_lng: number;
    diameter: number;
    end_lat: number;
    end_lng: number;
    pipe_id: PipeId;
}
export type PressureId = bigint;
export interface MeterReading {
    reading_id: ReadingId;
    meter_id: string;
    area_id: AreaId;
    reading_date: string;
    reading_value: number;
}
export interface LeakIncident {
    resolved_status: boolean;
    latitude: number;
    leak_id: LeakId;
    leak_severity: string;
    longitude: number;
    area_id: AreaId;
    pipe_id: PipeId;
    reported_time: string;
}
export interface DailyReport {
    report_id: ReportId;
    reading_count: bigint;
    generated_at: string;
    report_date: string;
    total_usage: number;
    area_id: AreaId;
}
export type AreaId = bigint;
export type PipeId = bigint;
export type ReadingId = bigint;
export interface PressureLog {
    pressure_id: PressureId;
    recorded_at: string;
    pressure_value: number;
    pipe_id: PipeId;
}
export interface backendInterface {
    addArea(name: string, population: bigint, lat: number, lng: number): Promise<Area>;
    addLeakIncident(pipe_id: bigint, area_id: bigint, severity: string, reported_time: string, resolved: boolean, lat: number, lng: number): Promise<LeakIncident>;
    addMeterReading(meter_id: string, area_id: bigint, value: number, date: string): Promise<MeterReading>;
    addPipe(start_lat: number, start_lng: number, end_lat: number, end_lng: number, diameter: number, status: string): Promise<PipeNetwork>;
    addPressureLog(pipe_id: bigint, value: number, recorded_at: string): Promise<PressureLog>;
    deleteArea(id: bigint): Promise<boolean>;
    deleteLeakIncident(id: bigint): Promise<boolean>;
    deleteMeterReading(id: bigint): Promise<boolean>;
    deletePipe(id: bigint): Promise<boolean>;
    deletePressureLog(id: bigint): Promise<boolean>;
    getAreas(): Promise<Array<Area>>;
    getDailyReports(): Promise<Array<DailyReport>>;
    getDashboardStats(): Promise<DashboardStats>;
    getLeakIncidents(): Promise<Array<LeakIncident>>;
    getMeterReadings(): Promise<Array<MeterReading>>;
    getMeterReadingsByArea(area_id: bigint): Promise<Array<MeterReading>>;
    getPipes(): Promise<Array<PipeNetwork>>;
    getPressureLogs(): Promise<Array<PressureLog>>;
    getPressureLogsByPipe(pipe_id: bigint): Promise<Array<PressureLog>>;
    runDailyAggregation(): Promise<bigint>;
    toggleLeakResolved(id: bigint): Promise<LeakIncident | null>;
    updateArea(id: bigint, name: string, population: bigint, lat: number, lng: number): Promise<Area | null>;
    updateLeakIncident(id: bigint, pipe_id: bigint, area_id: bigint, severity: string, reported_time: string, resolved: boolean, lat: number, lng: number): Promise<LeakIncident | null>;
    updateMeterReading(id: bigint, meter_id: string, area_id: bigint, value: number, date: string): Promise<MeterReading | null>;
    updatePipe(id: bigint, start_lat: number, start_lng: number, end_lat: number, end_lng: number, diameter: number, status: string): Promise<PipeNetwork | null>;
    updatePressureLog(id: bigint, pipe_id: bigint, value: number, recorded_at: string): Promise<PressureLog | null>;
}
