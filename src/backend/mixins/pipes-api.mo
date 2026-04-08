import PipeTypes "../types/pipes";
import PipesLib "../lib/pipes";
import List "mo:core/List";

mixin (pipes : List.List<PipeTypes.PipeNetwork>, nextPipeId : Nat) {
  public query func getPipes() : async [PipeTypes.PipeNetwork] {
    PipesLib.listPipes(pipes)
  };

  public func addPipe(
    start_lat : Float,
    start_lng : Float,
    end_lat : Float,
    end_lng : Float,
    diameter : Float,
    status : Text,
  ) : async PipeTypes.PipeNetwork {
    let (pipe, newId) = PipesLib.addPipe(pipes, nextPipeId, start_lat, start_lng, end_lat, end_lng, diameter, status);
    nextPipeId := newId;
    pipe
  };

  public func updatePipe(
    id : Nat,
    start_lat : Float,
    start_lng : Float,
    end_lat : Float,
    end_lng : Float,
    diameter : Float,
    status : Text,
  ) : async ?PipeTypes.PipeNetwork {
    PipesLib.updatePipe(pipes, id, start_lat, start_lng, end_lat, end_lng, diameter, status)
  };

  public func deletePipe(id : Nat) : async Bool {
    PipesLib.deletePipe(pipes, id)
  };
};
