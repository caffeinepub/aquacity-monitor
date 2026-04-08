import ReadingTypes "../types/readings";
import ReadingsLib "../lib/readings";
import List "mo:core/List";

mixin (readings : List.List<ReadingTypes.MeterReading>, nextReadingId : Nat) {
  public query func getMeterReadings() : async [ReadingTypes.MeterReading] {
    ReadingsLib.listReadings(readings)
  };

  public query func getMeterReadingsByArea(area_id : Nat) : async [ReadingTypes.MeterReading] {
    ReadingsLib.listReadingsByArea(readings, area_id)
  };

  public func addMeterReading(meter_id : Text, area_id : Nat, value : Float, date : Text) : async ReadingTypes.MeterReading {
    let (reading, newId) = ReadingsLib.addReading(readings, nextReadingId, meter_id, area_id, value, date);
    nextReadingId := newId;
    reading
  };

  public func updateMeterReading(id : Nat, meter_id : Text, area_id : Nat, value : Float, date : Text) : async ?ReadingTypes.MeterReading {
    ReadingsLib.updateReading(readings, id, meter_id, area_id, value, date)
  };

  public func deleteMeterReading(id : Nat) : async Bool {
    ReadingsLib.deleteReading(readings, id)
  };
};
