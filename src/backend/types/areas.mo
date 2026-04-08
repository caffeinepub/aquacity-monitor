import Common "common";

module {
  public type AreaId = Common.AreaId;

  public type Area = {
    area_id : AreaId;
    area_name : Text;
    population : Nat;
    latitude : Float;
    longitude : Float;
  };
};
