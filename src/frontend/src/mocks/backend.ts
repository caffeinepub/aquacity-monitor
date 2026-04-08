import type { backendInterface } from "../backend";

const sampleAreas = [
  { area_id: BigInt(1), area_name: "Koramangala", population: BigInt(120000), latitude: 12.9352, longitude: 77.6245 },
  { area_id: BigInt(2), area_name: "Whitefield", population: BigInt(85000), latitude: 12.9698, longitude: 77.7499 },
  { area_id: BigInt(3), area_name: "Indiranagar", population: BigInt(95000), latitude: 12.9784, longitude: 77.6408 },
  { area_id: BigInt(4), area_name: "Jayanagar", population: BigInt(110000), latitude: 12.9250, longitude: 77.5938 },
  { area_id: BigInt(5), area_name: "HSR Layout", population: BigInt(78000), latitude: 12.9116, longitude: 77.6389 },
];

const samplePipes = [
  { pipe_id: BigInt(1), start_lat: 12.9352, start_lng: 77.6245, end_lat: 12.9698, end_lng: 77.7499, diameter: 0.3, status: "Normal" },
  { pipe_id: BigInt(2), start_lat: 12.9698, start_lng: 77.7499, end_lat: 12.9784, end_lng: 77.6408, diameter: 0.25, status: "Broken" },
  { pipe_id: BigInt(3), start_lat: 12.9784, start_lng: 77.6408, end_lat: 12.9352, end_lng: 77.6245, diameter: 0.4, status: "Normal" },
  { pipe_id: BigInt(4), start_lat: 12.9250, start_lng: 77.5938, end_lat: 12.9352, end_lng: 77.6245, diameter: 0.35, status: "Maintenance" },
  { pipe_id: BigInt(5), start_lat: 12.9116, start_lng: 77.6389, end_lat: 12.9250, end_lng: 77.5938, diameter: 0.3, status: "Normal" },
];

const sampleMeterReadings = [
  { reading_id: BigInt(1), meter_id: "MTR-001", area_id: BigInt(1), reading_value: 12500.0, reading_date: "2026-04-08" },
  { reading_id: BigInt(2), meter_id: "MTR-002", area_id: BigInt(1), reading_value: 15800.0, reading_date: "2026-04-07" },
  { reading_id: BigInt(3), meter_id: "MTR-003", area_id: BigInt(2), reading_value: 9200.0, reading_date: "2026-04-08" },
  { reading_id: BigInt(4), meter_id: "MTR-004", area_id: BigInt(3), reading_value: 22000.0, reading_date: "2026-04-06" },
  { reading_id: BigInt(5), meter_id: "MTR-005", area_id: BigInt(4), reading_value: 18400.0, reading_date: "2026-04-05" },
];

const samplePressureLogs = [
  { pressure_id: BigInt(1), pipe_id: BigInt(1), pressure_value: 3.2, recorded_at: "2026-04-08T06:00:00Z" },
  { pressure_id: BigInt(2), pipe_id: BigInt(2), pressure_value: 1.5, recorded_at: "2026-04-08T07:00:00Z" },
  { pressure_id: BigInt(3), pipe_id: BigInt(3), pressure_value: 4.1, recorded_at: "2026-04-08T06:30:00Z" },
  { pressure_id: BigInt(4), pipe_id: BigInt(4), pressure_value: 2.2, recorded_at: "2026-04-08T08:00:00Z" },
  { pressure_id: BigInt(5), pipe_id: BigInt(5), pressure_value: 3.7, recorded_at: "2026-04-08T07:30:00Z" },
];

const sampleLeaks = [
  { leak_id: BigInt(1), pipe_id: BigInt(2), area_id: BigInt(2), leak_severity: "Critical", reported_time: "2026-04-06T10:00:00Z", resolved_status: false, latitude: 12.9720, longitude: 77.7520 },
  { leak_id: BigInt(2), pipe_id: BigInt(6), area_id: BigInt(1), leak_severity: "Critical", reported_time: "2026-04-05T14:00:00Z", resolved_status: false, latitude: 12.9130, longitude: 77.6400 },
  { leak_id: BigInt(3), pipe_id: BigInt(4), area_id: BigInt(1), leak_severity: "Moderate", reported_time: "2026-04-02T09:00:00Z", resolved_status: false, latitude: 12.9370, longitude: 77.6260 },
  { leak_id: BigInt(4), pipe_id: BigInt(8), area_id: BigInt(2), leak_severity: "Moderate", reported_time: "2026-04-01T11:00:00Z", resolved_status: true, latitude: 12.9710, longitude: 77.7510 },
  { leak_id: BigInt(5), pipe_id: BigInt(1), area_id: BigInt(1), leak_severity: "Low", reported_time: "2026-03-28T08:00:00Z", resolved_status: true, latitude: 12.9360, longitude: 77.6255 },
];

const sampleDailyReports = [
  { report_id: BigInt(1), area_id: BigInt(1), report_date: "2026-04-08", total_usage: 178700.0, reading_count: BigInt(10), generated_at: "2026-04-08T23:00:00Z" },
  { report_id: BigInt(2), area_id: BigInt(2), report_date: "2026-04-08", total_usage: 160200.0, reading_count: BigInt(10), generated_at: "2026-04-08T23:00:00Z" },
];

export const mockBackend: backendInterface = {
  getAreas: async () => sampleAreas,
  addArea: async (name, population, lat, lng) => ({
    area_id: BigInt(6), area_name: name, population, latitude: lat, longitude: lng,
  }),
  updateArea: async (id, name, population, lat, lng) => ({
    area_id: id, area_name: name, population, latitude: lat, longitude: lng,
  }),
  deleteArea: async () => true,

  getPipes: async () => samplePipes,
  addPipe: async (start_lat, start_lng, end_lat, end_lng, diameter, status) => ({
    pipe_id: BigInt(11), start_lat, start_lng, end_lat, end_lng, diameter, status,
  }),
  updatePipe: async (id, start_lat, start_lng, end_lat, end_lng, diameter, status) => ({
    pipe_id: id, start_lat, start_lng, end_lat, end_lng, diameter, status,
  }),
  deletePipe: async () => true,

  getMeterReadings: async () => sampleMeterReadings,
  getMeterReadingsByArea: async (area_id) => sampleMeterReadings.filter(r => r.area_id === area_id),
  addMeterReading: async (meter_id, area_id, reading_value, reading_date) => ({
    reading_id: BigInt(51), meter_id, area_id, reading_value, reading_date,
  }),
  updateMeterReading: async (id, meter_id, area_id, reading_value, reading_date) => ({
    reading_id: id, meter_id, area_id, reading_value, reading_date,
  }),
  deleteMeterReading: async () => true,

  getPressureLogs: async () => samplePressureLogs,
  getPressureLogsByPipe: async (pipe_id) => samplePressureLogs.filter(p => p.pipe_id === pipe_id),
  addPressureLog: async (pipe_id, pressure_value, recorded_at) => ({
    pressure_id: BigInt(31), pipe_id, pressure_value, recorded_at,
  }),
  updatePressureLog: async (id, pipe_id, pressure_value, recorded_at) => ({
    pressure_id: id, pipe_id, pressure_value, recorded_at,
  }),
  deletePressureLog: async () => true,

  getLeakIncidents: async () => sampleLeaks,
  addLeakIncident: async (pipe_id, area_id, leak_severity, reported_time, resolved_status, latitude, longitude) => ({
    leak_id: BigInt(16), pipe_id, area_id, leak_severity, reported_time, resolved_status, latitude, longitude,
  }),
  updateLeakIncident: async (id, pipe_id, area_id, leak_severity, reported_time, resolved_status, latitude, longitude) => ({
    leak_id: id, pipe_id, area_id, leak_severity, reported_time, resolved_status, latitude, longitude,
  }),
  toggleLeakResolved: async (id) => ({
    leak_id: id, pipe_id: BigInt(1), area_id: BigInt(1), leak_severity: "Critical",
    reported_time: "2026-04-06T10:00:00Z", resolved_status: true, latitude: 12.972, longitude: 77.752,
  }),
  deleteLeakIncident: async () => true,

  getDailyReports: async () => sampleDailyReports,
  runDailyAggregation: async () => BigInt(5),

  getDashboardStats: async () => ({
    today_usage: 41800.0,
    avg_pressure: 3.14,
    active_leaks: BigInt(3),
    shortage_risk: true,
  }),
};
