import LeakTypes "../types/leaks";
import LeaksLib "../lib/leaks";
import List "mo:core/List";

mixin (leaks : List.List<LeakTypes.LeakIncident>, nextLeakId : Nat) {
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
};
