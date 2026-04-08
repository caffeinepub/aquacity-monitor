import Common "common";

module {
  public type PipeId = Common.PipeId;

  // status: "Normal" | "Broken" | "Maintenance"
  public type PipeNetwork = {
    pipe_id : PipeId;
    start_lat : Float;
    start_lng : Float;
    end_lat : Float;
    end_lng : Float;
    diameter : Float;
    status : Text;
  };
};
