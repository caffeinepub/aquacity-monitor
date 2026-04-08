import Common "common";

module {
  public type ReadingId = Common.ReadingId;
  public type AreaId = Common.AreaId;

  // reading_date: ISO date string YYYY-MM-DD
  public type MeterReading = {
    reading_id : ReadingId;
    meter_id : Text;
    area_id : AreaId;
    reading_value : Float;
    reading_date : Text;
  };
};
