import PressureTypes "../types/pressure";
import PressureLib "../lib/pressure";
import List "mo:core/List";

mixin (pressureLogs : List.List<PressureTypes.PressureLog>, nextPressureId : Nat) {
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
};
