import Types "../types/areas";
import List "mo:core/List";

module {
  public type Area = Types.Area;

  public func listAreas(areas : List.List<Area>) : [Area] {
    areas.toArray()
  };

  public func addArea(
    areas : List.List<Area>,
    nextId : Nat,
    name : Text,
    population : Nat,
    lat : Float,
    lng : Float,
  ) : (Area, Nat) {
    let area : Area = {
      area_id = nextId;
      area_name = name;
      population = population;
      latitude = lat;
      longitude = lng;
    };
    areas.add(area);
    (area, nextId + 1)
  };

  public func updateArea(
    areas : List.List<Area>,
    id : Nat,
    name : Text,
    population : Nat,
    lat : Float,
    lng : Float,
  ) : ?Area {
    var updated : ?Area = null;
    areas.mapInPlace(func(a) {
      if (a.area_id == id) {
        let u : Area = { a with area_name = name; population = population; latitude = lat; longitude = lng };
        updated := ?u;
        u
      } else { a }
    });
    updated
  };

  public func deleteArea(areas : List.List<Area>, id : Nat) : Bool {
    let before = areas.size();
    let filtered = areas.filter(func(a) { a.area_id != id });
    areas.clear();
    areas.append(filtered);
    areas.size() < before
  };
};
