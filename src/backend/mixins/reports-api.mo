import ReportTypes "../types/reports";
import ReadingTypes "../types/readings";
import PressureTypes "../types/pressure";
import LeakTypes "../types/leaks";
import AreaTypes "../types/areas";
import ReportsLib "../lib/reports";
import List "mo:core/List";

mixin (
  reports : List.List<ReportTypes.DailyReport>,
  nextReportId : Nat,
  areas : List.List<AreaTypes.Area>,
  readings : List.List<ReadingTypes.MeterReading>,
  pressureLogs : List.List<PressureTypes.PressureLog>,
  leaks : List.List<LeakTypes.LeakIncident>,
) {
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
