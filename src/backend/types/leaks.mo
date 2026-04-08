import Common "common";

module {
  public type LeakId = Common.LeakId;
  public type PipeId = Common.PipeId;
  public type AreaId = Common.AreaId;

  // leak_severity: "Critical" | "Moderate" | "Low"
  public type LeakIncident = {
    leak_id : LeakId;
    pipe_id : PipeId;
    area_id : AreaId;
    leak_severity : Text;
    reported_time : Text;
    resolved_status : Bool;
    latitude : Float;
    longitude : Float;
  };
};
