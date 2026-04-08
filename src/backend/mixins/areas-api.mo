import AreaTypes "../types/areas";
import AreasLib "../lib/areas";
import List "mo:core/List";

mixin (areas : List.List<AreaTypes.Area>, nextAreaId : Nat) {
  public query func getAreas() : async [AreaTypes.Area] {
    AreasLib.listAreas(areas)
  };

  public func addArea(name : Text, population : Nat, lat : Float, lng : Float) : async AreaTypes.Area {
    let (area, newId) = AreasLib.addArea(areas, nextAreaId, name, population, lat, lng);
    nextAreaId := newId;
    area
  };

  public func updateArea(id : Nat, name : Text, population : Nat, lat : Float, lng : Float) : async ?AreaTypes.Area {
    AreasLib.updateArea(areas, id, name, population, lat, lng)
  };

  public func deleteArea(id : Nat) : async Bool {
    AreasLib.deleteArea(areas, id)
  };
};
