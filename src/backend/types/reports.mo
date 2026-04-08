import Common "common";

module {
  public type ReportId = Common.ReportId;
  public type AreaId = Common.AreaId;

  // report_date: ISO date string YYYY-MM-DD
  // generated_at: ISO datetime string
  public type DailyReport = {
    report_id : ReportId;
    area_id : AreaId;
    report_date : Text;
    total_usage : Float;
    reading_count : Nat;
    generated_at : Text;
  };

  public type DashboardStats = {
    today_usage : Float;
    avg_pressure : Float;
    active_leaks : Nat;
    shortage_risk : Bool;
  };
};
