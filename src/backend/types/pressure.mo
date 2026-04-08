import Common "common";

module {
  public type PressureId = Common.PressureId;
  public type PipeId = Common.PipeId;

  // recorded_at: ISO datetime string
  public type PressureLog = {
    pressure_id : PressureId;
    pipe_id : PipeId;
    pressure_value : Float;
    recorded_at : Text;
  };
};
