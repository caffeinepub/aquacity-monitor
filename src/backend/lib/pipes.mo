import Types "../types/pipes";
import List "mo:core/List";

module {
  public type PipeNetwork = Types.PipeNetwork;

  public func listPipes(pipes : List.List<PipeNetwork>) : [PipeNetwork] {
    pipes.toArray()
  };

  public func addPipe(
    pipes : List.List<PipeNetwork>,
    nextId : Nat,
    start_lat : Float,
    start_lng : Float,
    end_lat : Float,
    end_lng : Float,
    diameter : Float,
    status : Text,
  ) : (PipeNetwork, Nat) {
    let pipe : PipeNetwork = {
      pipe_id = nextId;
      start_lat = start_lat;
      start_lng = start_lng;
      end_lat = end_lat;
      end_lng = end_lng;
      diameter = diameter;
      status = status;
    };
    pipes.add(pipe);
    (pipe, nextId + 1)
  };

  public func updatePipe(
    pipes : List.List<PipeNetwork>,
    id : Nat,
    start_lat : Float,
    start_lng : Float,
    end_lat : Float,
    end_lng : Float,
    diameter : Float,
    status : Text,
  ) : ?PipeNetwork {
    var updated : ?PipeNetwork = null;
    pipes.mapInPlace(func(p) {
      if (p.pipe_id == id) {
        let u : PipeNetwork = { p with start_lat = start_lat; start_lng = start_lng; end_lat = end_lat; end_lng = end_lng; diameter = diameter; status = status };
        updated := ?u;
        u
      } else { p }
    });
    updated
  };

  public func deletePipe(pipes : List.List<PipeNetwork>, id : Nat) : Bool {
    let before = pipes.size();
    let filtered = pipes.filter(func(p) { p.pipe_id != id });
    pipes.clear();
    pipes.append(filtered);
    pipes.size() < before
  };
};
