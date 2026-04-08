import AreaTypes "types/areas";
import PipeTypes "types/pipes";
import ReadingTypes "types/readings";
import PressureTypes "types/pressure";
import LeakTypes "types/leaks";
import ReportTypes "types/reports";
import AreasLib "lib/areas";
import PipesLib "lib/pipes";
import ReadingsLib "lib/readings";
import PressureLib "lib/pressure";
import LeaksLib "lib/leaks";
import ReportsLib "lib/reports";
import List "mo:core/List";

actor {
  // --- State ---
  let areas = List.empty<AreaTypes.Area>();
  var nextAreaId : Nat = 1;

  let pipes = List.empty<PipeTypes.PipeNetwork>();
  var nextPipeId : Nat = 1;

  let readings = List.empty<ReadingTypes.MeterReading>();
  var nextReadingId : Nat = 1;

  let pressureLogs = List.empty<PressureTypes.PressureLog>();
  var nextPressureId : Nat = 1;

  let leaks = List.empty<LeakTypes.LeakIncident>();
  var nextLeakId : Nat = 1;

  let reports = List.empty<ReportTypes.DailyReport>();
  var nextReportId : Nat = 1;

  var initialized : Bool = false;

  // --- Sample data initialization ---
  func loadSampleData() {
    // 5 Areas (Indian city zones in Bengaluru)
    areas.add({ area_id = 1; area_name = "Koramangala"; population = 120000; latitude = 12.9352; longitude = 77.6245 });
    areas.add({ area_id = 2; area_name = "Whitefield"; population = 85000; latitude = 12.9698; longitude = 77.7499 });
    areas.add({ area_id = 3; area_name = "Indiranagar"; population = 95000; latitude = 12.9784; longitude = 77.6408 });
    areas.add({ area_id = 4; area_name = "Jayanagar"; population = 110000; latitude = 12.9250; longitude = 77.5938 });
    areas.add({ area_id = 5; area_name = "HSR Layout"; population = 78000; latitude = 12.9116; longitude = 77.6389 });
    nextAreaId := 6;

    // 10 Pipe segments
    pipes.add({ pipe_id = 1; start_lat = 12.9352; start_lng = 77.6245; end_lat = 12.9698; end_lng = 77.7499; diameter = 0.3; status = "Normal" });
    pipes.add({ pipe_id = 2; start_lat = 12.9698; start_lng = 77.7499; end_lat = 12.9784; end_lng = 77.6408; diameter = 0.25; status = "Broken" });
    pipes.add({ pipe_id = 3; start_lat = 12.9784; start_lng = 77.6408; end_lat = 12.9352; end_lng = 77.6245; diameter = 0.4; status = "Normal" });
    pipes.add({ pipe_id = 4; start_lat = 12.9250; start_lng = 77.5938; end_lat = 12.9352; end_lng = 77.6245; diameter = 0.35; status = "Maintenance" });
    pipes.add({ pipe_id = 5; start_lat = 12.9116; start_lng = 77.6389; end_lat = 12.9250; end_lng = 77.5938; diameter = 0.3; status = "Normal" });
    pipes.add({ pipe_id = 6; start_lat = 12.9116; start_lng = 77.6389; end_lat = 12.9352; end_lng = 77.6245; diameter = 0.2; status = "Broken" });
    pipes.add({ pipe_id = 7; start_lat = 12.9784; start_lng = 77.6408; end_lat = 12.9698; end_lng = 77.7499; diameter = 0.45; status = "Normal" });
    pipes.add({ pipe_id = 8; start_lat = 12.9250; start_lng = 77.5938; end_lat = 12.9116; end_lng = 77.6389; diameter = 0.3; status = "Maintenance" });
    pipes.add({ pipe_id = 9; start_lat = 12.9698; start_lng = 77.7499; end_lat = 12.9250; end_lng = 77.5938; diameter = 0.25; status = "Normal" });
    pipes.add({ pipe_id = 10; start_lat = 12.9352; start_lng = 77.6245; end_lat = 12.9116; end_lng = 77.6389; diameter = 0.35; status = "Normal" });
    nextPipeId := 11;

    // 50 Meter readings over last 30 days
    readings.add({ reading_id = 1; meter_id = "MTR-001"; area_id = 1; reading_value = 12500.0; reading_date = "2026-03-10" });
    readings.add({ reading_id = 2; meter_id = "MTR-002"; area_id = 1; reading_value = 15800.0; reading_date = "2026-03-15" });
    readings.add({ reading_id = 3; meter_id = "MTR-003"; area_id = 1; reading_value = 9200.0; reading_date = "2026-03-20" });
    readings.add({ reading_id = 4; meter_id = "MTR-004"; area_id = 1; reading_value = 22000.0; reading_date = "2026-03-25" });
    readings.add({ reading_id = 5; meter_id = "MTR-005"; area_id = 1; reading_value = 18400.0; reading_date = "2026-04-01" });
    readings.add({ reading_id = 6; meter_id = "MTR-006"; area_id = 1; reading_value = 31000.0; reading_date = "2026-04-05" });
    readings.add({ reading_id = 7; meter_id = "MTR-007"; area_id = 1; reading_value = 27500.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 8; meter_id = "MTR-008"; area_id = 1; reading_value = 14300.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 9; meter_id = "MTR-009"; area_id = 1; reading_value = 8700.0; reading_date = "2026-03-28" });
    readings.add({ reading_id = 10; meter_id = "MTR-010"; area_id = 1; reading_value = 19600.0; reading_date = "2026-04-03" });
    readings.add({ reading_id = 11; meter_id = "MTR-011"; area_id = 2; reading_value = 7800.0; reading_date = "2026-03-09" });
    readings.add({ reading_id = 12; meter_id = "MTR-012"; area_id = 2; reading_value = 11200.0; reading_date = "2026-03-14" });
    readings.add({ reading_id = 13; meter_id = "MTR-013"; area_id = 2; reading_value = 16500.0; reading_date = "2026-03-19" });
    readings.add({ reading_id = 14; meter_id = "MTR-014"; area_id = 2; reading_value = 9800.0; reading_date = "2026-03-24" });
    readings.add({ reading_id = 15; meter_id = "MTR-015"; area_id = 2; reading_value = 24300.0; reading_date = "2026-03-29" });
    readings.add({ reading_id = 16; meter_id = "MTR-016"; area_id = 2; reading_value = 18700.0; reading_date = "2026-04-04" });
    readings.add({ reading_id = 17; meter_id = "MTR-017"; area_id = 2; reading_value = 32100.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 18; meter_id = "MTR-018"; area_id = 2; reading_value = 6500.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 19; meter_id = "MTR-019"; area_id = 2; reading_value = 21400.0; reading_date = "2026-03-22" });
    readings.add({ reading_id = 20; meter_id = "MTR-020"; area_id = 2; reading_value = 13600.0; reading_date = "2026-04-06" });
    readings.add({ reading_id = 21; meter_id = "MTR-021"; area_id = 3; reading_value = 5200.0; reading_date = "2026-03-11" });
    readings.add({ reading_id = 22; meter_id = "MTR-022"; area_id = 3; reading_value = 28900.0; reading_date = "2026-03-16" });
    readings.add({ reading_id = 23; meter_id = "MTR-023"; area_id = 3; reading_value = 17300.0; reading_date = "2026-03-21" });
    readings.add({ reading_id = 24; meter_id = "MTR-024"; area_id = 3; reading_value = 11800.0; reading_date = "2026-03-26" });
    readings.add({ reading_id = 25; meter_id = "MTR-025"; area_id = 3; reading_value = 23500.0; reading_date = "2026-04-02" });
    readings.add({ reading_id = 26; meter_id = "MTR-026"; area_id = 3; reading_value = 19200.0; reading_date = "2026-04-07" });
    readings.add({ reading_id = 27; meter_id = "MTR-027"; area_id = 3; reading_value = 41000.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 28; meter_id = "MTR-028"; area_id = 3; reading_value = 8900.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 29; meter_id = "MTR-029"; area_id = 3; reading_value = 33700.0; reading_date = "2026-03-30" });
    readings.add({ reading_id = 30; meter_id = "MTR-030"; area_id = 3; reading_value = 14100.0; reading_date = "2026-04-04" });
    readings.add({ reading_id = 31; meter_id = "MTR-031"; area_id = 4; reading_value = 26800.0; reading_date = "2026-03-12" });
    readings.add({ reading_id = 32; meter_id = "MTR-032"; area_id = 4; reading_value = 10500.0; reading_date = "2026-03-17" });
    readings.add({ reading_id = 33; meter_id = "MTR-033"; area_id = 4; reading_value = 37200.0; reading_date = "2026-03-22" });
    readings.add({ reading_id = 34; meter_id = "MTR-034"; area_id = 4; reading_value = 15900.0; reading_date = "2026-03-27" });
    readings.add({ reading_id = 35; meter_id = "MTR-035"; area_id = 4; reading_value = 29400.0; reading_date = "2026-04-03" });
    readings.add({ reading_id = 36; meter_id = "MTR-036"; area_id = 4; reading_value = 22600.0; reading_date = "2026-04-06" });
    readings.add({ reading_id = 37; meter_id = "MTR-037"; area_id = 4; reading_value = 35800.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 38; meter_id = "MTR-038"; area_id = 4; reading_value = 12400.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 39; meter_id = "MTR-039"; area_id = 4; reading_value = 48200.0; reading_date = "2026-03-31" });
    readings.add({ reading_id = 40; meter_id = "MTR-040"; area_id = 4; reading_value = 7100.0; reading_date = "2026-04-05" });
    readings.add({ reading_id = 41; meter_id = "MTR-041"; area_id = 5; reading_value = 6300.0; reading_date = "2026-03-13" });
    readings.add({ reading_id = 42; meter_id = "MTR-042"; area_id = 5; reading_value = 19800.0; reading_date = "2026-03-18" });
    readings.add({ reading_id = 43; meter_id = "MTR-043"; area_id = 5; reading_value = 13200.0; reading_date = "2026-03-23" });
    readings.add({ reading_id = 44; meter_id = "MTR-044"; area_id = 5; reading_value = 28600.0; reading_date = "2026-03-28" });
    readings.add({ reading_id = 45; meter_id = "MTR-045"; area_id = 5; reading_value = 17400.0; reading_date = "2026-04-02" });
    readings.add({ reading_id = 46; meter_id = "MTR-046"; area_id = 5; reading_value = 9500.0; reading_date = "2026-04-05" });
    readings.add({ reading_id = 47; meter_id = "MTR-047"; area_id = 5; reading_value = 24700.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 48; meter_id = "MTR-048"; area_id = 5; reading_value = 11000.0; reading_date = "2026-04-08" });
    readings.add({ reading_id = 49; meter_id = "MTR-049"; area_id = 5; reading_value = 39500.0; reading_date = "2026-04-01" });
    readings.add({ reading_id = 50; meter_id = "MTR-050"; area_id = 5; reading_value = 16200.0; reading_date = "2026-04-07" });
    nextReadingId := 51;

    // 30 Pressure logs
    pressureLogs.add({ pressure_id = 1; pipe_id = 1; pressure_value = 3.2; recorded_at = "2026-04-08T06:00:00Z" });
    pressureLogs.add({ pressure_id = 2; pipe_id = 1; pressure_value = 2.8; recorded_at = "2026-04-08T12:00:00Z" });
    pressureLogs.add({ pressure_id = 3; pipe_id = 1; pressure_value = 3.5; recorded_at = "2026-04-07T08:00:00Z" });
    pressureLogs.add({ pressure_id = 4; pipe_id = 2; pressure_value = 1.5; recorded_at = "2026-04-08T07:00:00Z" });
    pressureLogs.add({ pressure_id = 5; pipe_id = 2; pressure_value = 1.8; recorded_at = "2026-04-08T13:00:00Z" });
    pressureLogs.add({ pressure_id = 6; pipe_id = 2; pressure_value = 1.6; recorded_at = "2026-04-07T09:00:00Z" });
    pressureLogs.add({ pressure_id = 7; pipe_id = 3; pressure_value = 4.1; recorded_at = "2026-04-08T06:30:00Z" });
    pressureLogs.add({ pressure_id = 8; pipe_id = 3; pressure_value = 3.9; recorded_at = "2026-04-08T14:00:00Z" });
    pressureLogs.add({ pressure_id = 9; pipe_id = 3; pressure_value = 4.3; recorded_at = "2026-04-07T10:00:00Z" });
    pressureLogs.add({ pressure_id = 10; pipe_id = 4; pressure_value = 2.2; recorded_at = "2026-04-08T08:00:00Z" });
    pressureLogs.add({ pressure_id = 11; pipe_id = 4; pressure_value = 2.5; recorded_at = "2026-04-08T15:00:00Z" });
    pressureLogs.add({ pressure_id = 12; pipe_id = 4; pressure_value = 2.1; recorded_at = "2026-04-07T11:00:00Z" });
    pressureLogs.add({ pressure_id = 13; pipe_id = 5; pressure_value = 3.7; recorded_at = "2026-04-08T07:30:00Z" });
    pressureLogs.add({ pressure_id = 14; pipe_id = 5; pressure_value = 3.4; recorded_at = "2026-04-08T16:00:00Z" });
    pressureLogs.add({ pressure_id = 15; pipe_id = 5; pressure_value = 3.8; recorded_at = "2026-04-07T12:00:00Z" });
    pressureLogs.add({ pressure_id = 16; pipe_id = 6; pressure_value = 1.7; recorded_at = "2026-04-08T09:00:00Z" });
    pressureLogs.add({ pressure_id = 17; pipe_id = 6; pressure_value = 1.9; recorded_at = "2026-04-08T17:00:00Z" });
    pressureLogs.add({ pressure_id = 18; pipe_id = 6; pressure_value = 1.6; recorded_at = "2026-04-07T13:00:00Z" });
    pressureLogs.add({ pressure_id = 19; pipe_id = 7; pressure_value = 4.5; recorded_at = "2026-04-08T06:00:00Z" });
    pressureLogs.add({ pressure_id = 20; pipe_id = 7; pressure_value = 4.2; recorded_at = "2026-04-08T12:00:00Z" });
    pressureLogs.add({ pressure_id = 21; pipe_id = 7; pressure_value = 4.4; recorded_at = "2026-04-07T07:00:00Z" });
    pressureLogs.add({ pressure_id = 22; pipe_id = 8; pressure_value = 2.6; recorded_at = "2026-04-08T10:00:00Z" });
    pressureLogs.add({ pressure_id = 23; pipe_id = 8; pressure_value = 2.3; recorded_at = "2026-04-08T18:00:00Z" });
    pressureLogs.add({ pressure_id = 24; pipe_id = 8; pressure_value = 2.7; recorded_at = "2026-04-07T14:00:00Z" });
    pressureLogs.add({ pressure_id = 25; pipe_id = 9; pressure_value = 3.1; recorded_at = "2026-04-08T08:30:00Z" });
    pressureLogs.add({ pressure_id = 26; pipe_id = 9; pressure_value = 3.3; recorded_at = "2026-04-08T19:00:00Z" });
    pressureLogs.add({ pressure_id = 27; pipe_id = 9; pressure_value = 2.9; recorded_at = "2026-04-07T15:00:00Z" });
    pressureLogs.add({ pressure_id = 28; pipe_id = 10; pressure_value = 3.6; recorded_at = "2026-04-08T09:30:00Z" });
    pressureLogs.add({ pressure_id = 29; pipe_id = 10; pressure_value = 3.4; recorded_at = "2026-04-08T20:00:00Z" });
    pressureLogs.add({ pressure_id = 30; pipe_id = 10; pressure_value = 3.8; recorded_at = "2026-04-07T16:00:00Z" });
    nextPressureId := 31;

    // 15 Leak incidents
    leaks.add({ leak_id = 1; pipe_id = 2; area_id = 2; leak_severity = "Critical"; reported_time = "2026-04-06T10:00:00Z"; resolved_status = false; latitude = 12.9720; longitude = 77.7520 });
    leaks.add({ leak_id = 2; pipe_id = 6; area_id = 1; leak_severity = "Critical"; reported_time = "2026-04-05T14:00:00Z"; resolved_status = false; latitude = 12.9130; longitude = 77.6400 });
    leaks.add({ leak_id = 3; pipe_id = 2; area_id = 3; leak_severity = "Critical"; reported_time = "2026-04-07T08:00:00Z"; resolved_status = false; latitude = 12.9800; longitude = 77.6420 });
    leaks.add({ leak_id = 4; pipe_id = 6; area_id = 4; leak_severity = "Critical"; reported_time = "2026-04-04T16:00:00Z"; resolved_status = true; latitude = 12.9260; longitude = 77.5950 });
    leaks.add({ leak_id = 5; pipe_id = 4; area_id = 5; leak_severity = "Critical"; reported_time = "2026-04-03T12:00:00Z"; resolved_status = true; latitude = 12.9100; longitude = 77.6370 });
    leaks.add({ leak_id = 6; pipe_id = 4; area_id = 1; leak_severity = "Moderate"; reported_time = "2026-04-02T09:00:00Z"; resolved_status = false; latitude = 12.9370; longitude = 77.6260 });
    leaks.add({ leak_id = 7; pipe_id = 8; area_id = 2; leak_severity = "Moderate"; reported_time = "2026-04-01T11:00:00Z"; resolved_status = true; latitude = 12.9710; longitude = 77.7510 });
    leaks.add({ leak_id = 8; pipe_id = 4; area_id = 3; leak_severity = "Moderate"; reported_time = "2026-03-31T15:00:00Z"; resolved_status = false; latitude = 12.9790; longitude = 77.6415 });
    leaks.add({ leak_id = 9; pipe_id = 8; area_id = 4; leak_severity = "Moderate"; reported_time = "2026-03-30T10:00:00Z"; resolved_status = true; latitude = 12.9240; longitude = 77.5945 });
    leaks.add({ leak_id = 10; pipe_id = 8; area_id = 5; leak_severity = "Moderate"; reported_time = "2026-03-29T13:00:00Z"; resolved_status = true; latitude = 12.9105; longitude = 77.6380 });
    leaks.add({ leak_id = 11; pipe_id = 1; area_id = 1; leak_severity = "Low"; reported_time = "2026-03-28T08:00:00Z"; resolved_status = true; latitude = 12.9360; longitude = 77.6255 });
    leaks.add({ leak_id = 12; pipe_id = 9; area_id = 2; leak_severity = "Low"; reported_time = "2026-03-27T14:00:00Z"; resolved_status = false; latitude = 12.9705; longitude = 77.7505 });
    leaks.add({ leak_id = 13; pipe_id = 3; area_id = 3; leak_severity = "Low"; reported_time = "2026-03-26T09:00:00Z"; resolved_status = true; latitude = 12.9795; longitude = 77.6418 });
    leaks.add({ leak_id = 14; pipe_id = 10; area_id = 4; leak_severity = "Low"; reported_time = "2026-03-25T16:00:00Z"; resolved_status = false; latitude = 12.9255; longitude = 77.5940 });
    leaks.add({ leak_id = 15; pipe_id = 5; area_id = 5; leak_severity = "Low"; reported_time = "2026-03-24T11:00:00Z"; resolved_status = true; latitude = 12.9112; longitude = 77.6392 });
    nextLeakId := 16;
  };

  // Initialize sample data once on first deploy
  if (not initialized) {
    loadSampleData();
    initialized := true;
  };

  // --- Areas API ---
  public query func getAreas() : async [AreaTypes.Area] {
    AreasLib.listAreas(areas)
  };

  public func addArea(name : Text, population : Nat, lat : Float, lng : Float) : async AreaTypes.Area {
    let (area, newId) = AreasLib.addArea(areas, nextAreaId, name, population, lat, lng);
    nextAreaId := newId;
    area
  };

  public func updateArea(id : Nat, name : Text, population : Nat, lat : Float, lng : Float) : async ?AreaTypes.Area {
    AreasLib.updateArea(areas, id, name, population, lat, lng)
  };

  public func deleteArea(id : Nat) : async Bool {
    AreasLib.deleteArea(areas, id)
  };

  // --- Pipes API ---
  public query func getPipes() : async [PipeTypes.PipeNetwork] {
    PipesLib.listPipes(pipes)
  };

  public func addPipe(
    start_lat : Float,
    start_lng : Float,
    end_lat : Float,
    end_lng : Float,
    diameter : Float,
    status : Text,
  ) : async PipeTypes.PipeNetwork {
    let (pipe, newId) = PipesLib.addPipe(pipes, nextPipeId, start_lat, start_lng, end_lat, end_lng, diameter, status);
    nextPipeId := newId;
    pipe
  };

  public func updatePipe(
    id : Nat,
    start_lat : Float,
    start_lng : Float,
    end_lat : Float,
    end_lng : Float,
    diameter : Float,
    status : Text,
  ) : async ?PipeTypes.PipeNetwork {
    PipesLib.updatePipe(pipes, id, start_lat, start_lng, end_lat, end_lng, diameter, status)
  };

  public func deletePipe(id : Nat) : async Bool {
    PipesLib.deletePipe(pipes, id)
  };

  // --- Readings API ---
  public query func getMeterReadings() : async [ReadingTypes.MeterReading] {
    ReadingsLib.listReadings(readings)
  };

  public query func getMeterReadingsByArea(area_id : Nat) : async [ReadingTypes.MeterReading] {
    ReadingsLib.listReadingsByArea(readings, area_id)
  };

  public func addMeterReading(meter_id : Text, area_id : Nat, value : Float, date : Text) : async ReadingTypes.MeterReading {
    let (reading, newId) = ReadingsLib.addReading(readings, nextReadingId, meter_id, area_id, value, date);
    nextReadingId := newId;
    reading
  };

  public func updateMeterReading(id : Nat, meter_id : Text, area_id : Nat, value : Float, date : Text) : async ?ReadingTypes.MeterReading {
    ReadingsLib.updateReading(readings, id, meter_id, area_id, value, date)
  };

  public func deleteMeterReading(id : Nat) : async Bool {
    ReadingsLib.deleteReading(readings, id)
  };

  // --- Pressure API ---
  public query func getPressureLogs() : async [PressureTypes.PressureLog] {
    PressureLib.listLogs(pressureLogs)
  };

  public query func getPressureLogsByPipe(pipe_id : Nat) : async [PressureTypes.PressureLog] {
    PressureLib.listLogsByPipe(pressureLogs, pipe_id)
  };

  public func addPressureLog(pipe_id : Nat, value : Float, recorded_at : Text) : async PressureTypes.PressureLog {
    let (log, newId) = PressureLib.addLog(pressureLogs, nextPressureId, pipe_id, value, recorded_at);
    nextPressureId := newId;
    log
  };

  public func updatePressureLog(id : Nat, pipe_id : Nat, value : Float, recorded_at : Text) : async ?PressureTypes.PressureLog {
    PressureLib.updateLog(pressureLogs, id, pipe_id, value, recorded_at)
  };

  public func deletePressureLog(id : Nat) : async Bool {
    PressureLib.deleteLog(pressureLogs, id)
  };

  // --- Leaks API ---
  public query func getLeakIncidents() : async [LeakTypes.LeakIncident] {
    LeaksLib.listLeaks(leaks)
  };

  public func addLeakIncident(
    pipe_id : Nat,
    area_id : Nat,
    severity : Text,
    reported_time : Text,
    resolved : Bool,
    lat : Float,
    lng : Float,
  ) : async LeakTypes.LeakIncident {
    let (leak, newId) = LeaksLib.addLeak(leaks, nextLeakId, pipe_id, area_id, severity, reported_time, resolved, lat, lng);
    nextLeakId := newId;
    leak
  };

  public func updateLeakIncident(
    id : Nat,
    pipe_id : Nat,
    area_id : Nat,
    severity : Text,
    reported_time : Text,
    resolved : Bool,
    lat : Float,
    lng : Float,
  ) : async ?LeakTypes.LeakIncident {
    LeaksLib.updateLeak(leaks, id, pipe_id, area_id, severity, reported_time, resolved, lat, lng)
  };

  public func toggleLeakResolved(id : Nat) : async ?LeakTypes.LeakIncident {
    LeaksLib.toggleResolved(leaks, id)
  };

  public func deleteLeakIncident(id : Nat) : async Bool {
    LeaksLib.deleteLeak(leaks, id)
  };

  // --- Reports API ---
  public query func getDailyReports() : async [ReportTypes.DailyReport] {
    ReportsLib.listReports(reports)
  };

  public func runDailyAggregation() : async Nat {
    let count = ReportsLib.runAggregation(reports, nextReportId, areas, readings);
    nextReportId := nextReportId + count;
    count
  };

  public query func getDashboardStats() : async ReportTypes.DashboardStats {
    ReportsLib.getDashboardStats(readings, pressureLogs, leaks)
  };
};
