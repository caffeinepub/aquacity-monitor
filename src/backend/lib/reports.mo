import ReportTypes "../types/reports";
import ReadingTypes "../types/readings";
import PressureTypes "../types/pressure";
import LeakTypes "../types/leaks";
import AreaTypes "../types/areas";
import List "mo:core/List";

module {
  public type DailyReport = ReportTypes.DailyReport;
  public type DashboardStats = ReportTypes.DashboardStats;

  let TODAY = "2026-04-08";
  let GENERATED_AT = "2026-04-08T00:00:00Z";

  public func listReports(reports : List.List<DailyReport>) : [DailyReport] {
    reports.toArray()
  };

  func sumReadings(rs : List.List<ReadingTypes.MeterReading>) : Float {
    var total : Float = 0.0;
    rs.forEach(func(r) { total += r.reading_value });
    total
  };

  func sumPressure(ps : List.List<PressureTypes.PressureLog>) : Float {
    var total : Float = 0.0;
    ps.forEach(func(p) { total += p.pressure_value });
    total
  };

  public func runAggregation(
    reports : List.List<DailyReport>,
    nextId : Nat,
    areas : List.List<AreaTypes.Area>,
    readings : List.List<ReadingTypes.MeterReading>,
  ) : Nat {
    var processedCount : Nat = 0;
    var currentId = nextId;

    areas.forEach(func(area) {
      let areaReadings = readings.filter(func(r) {
        r.area_id == area.area_id and
        r.reading_date == TODAY and
        r.reading_value >= 0.0 and
        r.reading_value <= 10000000.0
      });

      let count = areaReadings.size();
      if (count > 0) {
        let total = sumReadings(areaReadings);

        let filtered = reports.filter(func(rep) {
          not (rep.area_id == area.area_id and rep.report_date == TODAY)
        });
        reports.clear();
        reports.append(filtered);

        let report : DailyReport = {
          report_id = currentId;
          area_id = area.area_id;
          report_date = TODAY;
          total_usage = total;
          reading_count = count;
          generated_at = GENERATED_AT;
        };
        reports.add(report);
        currentId += 1;
        processedCount += 1;
      };
    });

    processedCount
  };

  public func getDashboardStats(
    readings : List.List<ReadingTypes.MeterReading>,
    pressureLogs : List.List<PressureTypes.PressureLog>,
    leaks : List.List<LeakTypes.LeakIncident>,
  ) : DashboardStats {
    let todayReadings = readings.filter(func(r) { r.reading_date == TODAY });
    let todayUsage = sumReadings(todayReadings);

    let logCount = pressureLogs.size();
    let avgPressure : Float = if (logCount == 0) {
      0.0
    } else {
      sumPressure(pressureLogs) / logCount.toFloat()
    };

    let activeLeaks = leaks.filter(func(l) { not l.resolved_status }).size();
    let shortageRisk = activeLeaks > 5 or avgPressure < 2.0;

    {
      today_usage = todayUsage;
      avg_pressure = avgPressure;
      active_leaks = activeLeaks;
      shortage_risk = shortageRisk;
    }
  };
};
