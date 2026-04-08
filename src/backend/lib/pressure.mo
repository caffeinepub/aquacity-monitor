import Types "../types/pressure";
import List "mo:core/List";

module {
  public type PressureLog = Types.PressureLog;

  public func listLogs(logs : List.List<PressureLog>) : [PressureLog] {
    logs.toArray()
  };

  public func listLogsByPipe(logs : List.List<PressureLog>, pipe_id : Nat) : [PressureLog] {
    logs.filter(func(l) { l.pipe_id == pipe_id }).toArray()
  };

  public func addLog(
    logs : List.List<PressureLog>,
    nextId : Nat,
    pipe_id : Nat,
    value : Float,
    recorded_at : Text,
  ) : (PressureLog, Nat) {
    let log : PressureLog = {
      pressure_id = nextId;
      pipe_id = pipe_id;
      pressure_value = value;
      recorded_at = recorded_at;
    };
    logs.add(log);
    (log, nextId + 1)
  };

  public func updateLog(
    logs : List.List<PressureLog>,
    id : Nat,
    pipe_id : Nat,
    value : Float,
    recorded_at : Text,
  ) : ?PressureLog {
    var updated : ?PressureLog = null;
    logs.mapInPlace(func(l) {
      if (l.pressure_id == id) {
        let u : PressureLog = { l with pipe_id = pipe_id; pressure_value = value; recorded_at = recorded_at };
        updated := ?u;
        u
      } else { l }
    });
    updated
  };

  public func deleteLog(logs : List.List<PressureLog>, id : Nat) : Bool {
    let before = logs.size();
    let filtered = logs.filter(func(l) { l.pressure_id != id });
    logs.clear();
    logs.append(filtered);
    logs.size() < before
  };
};
