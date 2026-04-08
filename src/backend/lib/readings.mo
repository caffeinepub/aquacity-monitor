import Types "../types/readings";
import List "mo:core/List";

module {
  public type MeterReading = Types.MeterReading;

  public func listReadings(readings : List.List<MeterReading>) : [MeterReading] {
    readings.toArray()
  };

  public func listReadingsByArea(readings : List.List<MeterReading>, area_id : Nat) : [MeterReading] {
    readings.filter(func(r) { r.area_id == area_id }).toArray()
  };

  public func addReading(
    readings : List.List<MeterReading>,
    nextId : Nat,
    meter_id : Text,
    area_id : Nat,
    value : Float,
    date : Text,
  ) : (MeterReading, Nat) {
    let reading : MeterReading = {
      reading_id = nextId;
      meter_id = meter_id;
      area_id = area_id;
      reading_value = value;
      reading_date = date;
    };
    readings.add(reading);
    (reading, nextId + 1)
  };

  public func updateReading(
    readings : List.List<MeterReading>,
    id : Nat,
    meter_id : Text,
    area_id : Nat,
    value : Float,
    date : Text,
  ) : ?MeterReading {
    var updated : ?MeterReading = null;
    readings.mapInPlace(func(r) {
      if (r.reading_id == id) {
        let u : MeterReading = { r with meter_id = meter_id; area_id = area_id; reading_value = value; reading_date = date };
        updated := ?u;
        u
      } else { r }
    });
    updated
  };

  public func deleteReading(readings : List.List<MeterReading>, id : Nat) : Bool {
    let before = readings.size();
    let filtered = readings.filter(func(r) { r.reading_id != id });
    readings.clear();
    readings.append(filtered);
    readings.size() < before
  };
};
