import Types "../types/leaks";
import List "mo:core/List";

module {
  public type LeakIncident = Types.LeakIncident;

  public func listLeaks(leaks : List.List<LeakIncident>) : [LeakIncident] {
    leaks.toArray()
  };

  public func addLeak(
    leaks : List.List<LeakIncident>,
    nextId : Nat,
    pipe_id : Nat,
    area_id : Nat,
    severity : Text,
    reported_time : Text,
    resolved : Bool,
    lat : Float,
    lng : Float,
  ) : (LeakIncident, Nat) {
    let leak : LeakIncident = {
      leak_id = nextId;
      pipe_id = pipe_id;
      area_id = area_id;
      leak_severity = severity;
      reported_time = reported_time;
      resolved_status = resolved;
      latitude = lat;
      longitude = lng;
    };
    leaks.add(leak);
    (leak, nextId + 1)
  };

  public func updateLeak(
    leaks : List.List<LeakIncident>,
    id : Nat,
    pipe_id : Nat,
    area_id : Nat,
    severity : Text,
    reported_time : Text,
    resolved : Bool,
    lat : Float,
    lng : Float,
  ) : ?LeakIncident {
    var updated : ?LeakIncident = null;
    leaks.mapInPlace(func(l) {
      if (l.leak_id == id) {
        let u : LeakIncident = { l with pipe_id = pipe_id; area_id = area_id; leak_severity = severity; reported_time = reported_time; resolved_status = resolved; latitude = lat; longitude = lng };
        updated := ?u;
        u
      } else { l }
    });
    updated
  };

  public func toggleResolved(leaks : List.List<LeakIncident>, id : Nat) : ?LeakIncident {
    var updated : ?LeakIncident = null;
    leaks.mapInPlace(func(l) {
      if (l.leak_id == id) {
        let u : LeakIncident = { l with resolved_status = not l.resolved_status };
        updated := ?u;
        u
      } else { l }
    });
    updated
  };

  public func deleteLeak(leaks : List.List<LeakIncident>, id : Nat) : Bool {
    let before = leaks.size();
    let filtered = leaks.filter(func(l) { l.leak_id != id });
    leaks.clear();
    leaks.append(filtered);
    leaks.size() < before
  };
};
