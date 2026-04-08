import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Area,
  DailyReport,
  DashboardStats,
  LeakIncident,
  MeterReading,
  PipeNetwork,
  PressureLog,
} from "../types";

function useBackend() {
  return useActor(createActor);
}

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useAreas() {
  const { actor, isFetching } = useBackend();
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAreas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePipes() {
  const { actor, isFetching } = useBackend();
  return useQuery<PipeNetwork[]>({
    queryKey: ["pipes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMeterReadings(areaId?: bigint) {
  const { actor, isFetching } = useBackend();
  return useQuery<MeterReading[]>({
    queryKey: areaId != null ? ["readings", areaId.toString()] : ["readings"],
    queryFn: async () => {
      if (!actor) return [];
      if (areaId != null) return actor.getMeterReadingsByArea(areaId);
      return actor.getMeterReadings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePressureLogs(pipeId?: bigint) {
  const { actor, isFetching } = useBackend();
  return useQuery<PressureLog[]>({
    queryKey: pipeId != null ? ["pressure", pipeId.toString()] : ["pressure"],
    queryFn: async () => {
      if (!actor) return [];
      if (pipeId != null) return actor.getPressureLogsByPipe(pipeId);
      return actor.getPressureLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeakIncidents() {
  const { actor, isFetching } = useBackend();
  return useQuery<LeakIncident[]>({
    queryKey: ["leaks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeakIncidents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useBackend();
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      if (!actor) {
        return { today_usage: 0, avg_pressure: 0, active_leaks: 0n, shortage_risk: false };
      }
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useDailyReports() {
  const { actor, isFetching } = useBackend();
  return useQuery<DailyReport[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyReports();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Area Mutations ───────────────────────────────────────────────────────────

export function useAddArea() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; population: bigint; lat: number; lng: number }) =>
      actor!.addArea(data.name, data.population, data.lat, data.lng),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["areas"] }),
  });
}

export function useUpdateArea() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      name: string;
      population: bigint;
      lat: number;
      lng: number;
    }) => actor!.updateArea(data.id, data.name, data.population, data.lat, data.lng),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["areas"] }),
  });
}

export function useDeleteArea() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteArea(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["areas"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ─── Pipe Mutations ───────────────────────────────────────────────────────────

export function useAddPipe() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      start_lat: number;
      start_lng: number;
      end_lat: number;
      end_lng: number;
      diameter: number;
      status: string;
    }) =>
      actor!.addPipe(
        data.start_lat,
        data.start_lng,
        data.end_lat,
        data.end_lng,
        data.diameter,
        data.status,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pipes"] }),
  });
}

export function useUpdatePipe() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      start_lat: number;
      start_lng: number;
      end_lat: number;
      end_lng: number;
      diameter: number;
      status: string;
    }) =>
      actor!.updatePipe(
        data.id,
        data.start_lat,
        data.start_lng,
        data.end_lat,
        data.end_lng,
        data.diameter,
        data.status,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pipes"] }),
  });
}

export function useDeletePipe() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deletePipe(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipes"] });
      qc.invalidateQueries({ queryKey: ["pressure"] });
    },
  });
}

// ─── Meter Reading Mutations ──────────────────────────────────────────────────

export function useAddMeterReading() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      meter_id: string;
      area_id: bigint;
      value: number;
      date: string;
    }) => actor!.addMeterReading(data.meter_id, data.area_id, data.value, data.date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["readings"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateMeterReading() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      meter_id: string;
      area_id: bigint;
      value: number;
      date: string;
    }) =>
      actor!.updateMeterReading(data.id, data.meter_id, data.area_id, data.value, data.date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["readings"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteMeterReading() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteMeterReading(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["readings"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ─── Pressure Log Mutations ───────────────────────────────────────────────────

export function useAddPressureLog() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { pipe_id: bigint; value: number; recorded_at: string }) =>
      actor!.addPressureLog(data.pipe_id, data.value, data.recorded_at),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pressure"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdatePressureLog() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      pipe_id: bigint;
      value: number;
      recorded_at: string;
    }) => actor!.updatePressureLog(data.id, data.pipe_id, data.value, data.recorded_at),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pressure"] }),
  });
}

export function useDeletePressureLog() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deletePressureLog(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pressure"] }),
  });
}

// ─── Leak Incident Mutations ──────────────────────────────────────────────────

export function useAddLeakIncident() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      pipe_id: bigint;
      area_id: bigint;
      severity: string;
      reported_time: string;
      resolved: boolean;
      lat: number;
      lng: number;
    }) =>
      actor!.addLeakIncident(
        data.pipe_id,
        data.area_id,
        data.severity,
        data.reported_time,
        data.resolved,
        data.lat,
        data.lng,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateLeakIncident() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      pipe_id: bigint;
      area_id: bigint;
      severity: string;
      reported_time: string;
      resolved: boolean;
      lat: number;
      lng: number;
    }) =>
      actor!.updateLeakIncident(
        data.id,
        data.pipe_id,
        data.area_id,
        data.severity,
        data.reported_time,
        data.resolved,
        data.lat,
        data.lng,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useToggleLeakResolved() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.toggleLeakResolved(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteLeakIncident() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteLeakIncident(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ─── ETL Mutation ─────────────────────────────────────────────────────────────

export function useRunAggregation() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actor!.runDailyAggregation(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
