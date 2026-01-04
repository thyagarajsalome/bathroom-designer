import { FloorState } from "../types/floor";
import { WallState } from "../types/wall";

interface Props {
  floorState: FloorState;
  setFloorState: React.Dispatch<React.SetStateAction<FloorState>>;
  wallState: WallState;
  setWallState: React.Dispatch<React.SetStateAction<WallState>>;
}

export default function LeftPanel({
  floorState,
  setFloorState,
  wallState,
  setWallState,
}: Props) {
  return (
    <div className="w-72 bg-gray-50 border-r p-4 overflow-y-auto">
      {/* FLOOR */}
      <h2 className="font-semibold mb-4">Floor</h2>

      <select
        className="w-full border p-2 mb-4"
        value={floorState.tileType}
        onChange={(e) =>
          setFloorState({
            ...floorState,
            tileType: e.target.value as FloorState["tileType"],
          })
        }
      >
        <option value="ceramic">Ceramic</option>
        <option value="wood">Wood</option>
        <option value="marble">Marble</option>
      </select>

      {/* WALLS */}
      <h2 className="font-semibold mt-6 mb-2">Walls</h2>

      <select
        className="w-full border p-2 mb-2"
        value={wallState.mode}
        onChange={(e) =>
          setWallState({
            ...wallState,
            mode: e.target.value as WallState["mode"],
          })
        }
      >
        <option value="half-tile">Half Tile</option>
        <option value="full-tile">Full Tile</option>
      </select>

      <input
        type="color"
        value={wallState.paintColor}
        onChange={(e) =>
          setWallState({
            ...wallState,
            paintColor: e.target.value,
          })
        }
      />
    </div>
  );
}
