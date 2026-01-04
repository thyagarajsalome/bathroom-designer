import type { FloorState } from "../types/floor";
import type { WallState } from "../types/wall";

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
      <h2 className="font-semibold mb-4 text-gray-700">Floor Settings</h2>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">Material</label>
        <select
          className="w-full border p-2 rounded"
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
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">Tile Pattern</label>
        <select
          className="w-full border p-2 rounded"
          value={floorState.pattern}
          onChange={(e) =>
            setFloorState({ ...floorState, pattern: e.target.value as any })
          }
        >
          <option value="grid">Grid</option>
          <option value="brick">Brick</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">
          Scale: {floorState.scale}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={floorState.scale}
          className="w-full"
          onChange={(e) =>
            setFloorState({ ...floorState, scale: parseFloat(e.target.value) })
          }
        />
      </div>

      {/* WALLS */}
      <h2 className="font-semibold mt-6 mb-4 text-gray-700">Wall Settings</h2>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Style</label>
        <select
          className="w-full border p-2 rounded"
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
      </div>

      {wallState.mode === "half-tile" && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Tile Height: {wallState.tileHeight}m
          </label>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={wallState.tileHeight}
            className="w-full"
            onChange={(e) =>
              setWallState({
                ...wallState,
                tileHeight: parseFloat(e.target.value),
              })
            }
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Paint Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="h-10 w-10 border rounded cursor-pointer"
            value={wallState.paintColor}
            onChange={(e) =>
              setWallState({
                ...wallState,
                paintColor: e.target.value,
              })
            }
          />
          <span className="text-sm text-gray-500 uppercase">
            {wallState.paintColor}
          </span>
        </div>
      </div>
    </div>
  );
}
