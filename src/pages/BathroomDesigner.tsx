import { useState } from "react";
import TopBar from "../components/TopBar";
import LeftPanel from "../components/LeftPanel";
import BottomBar from "../components/BottomBar";
import ThreeCanvas from "../components/ThreeCanvas";
import { FloorState } from "../types/floor";
import { WallState } from "../types/wall";

export default function BathroomDesigner(): JSX.Element {
  const [floorState, setFloorState] = useState<FloorState>({
    tileType: "ceramic",
    scale: 4,
    rotation: 0,
    pattern: "grid",
  });

  const [wallState, setWallState] = useState<WallState>({
    mode: "half-tile",
    tileScale: 3,
    tileTexture: "ceramic",
    paintColor: "#f5f5f4",
  });

  return (
    <div className="flex flex-col h-screen">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          floorState={floorState}
          setFloorState={setFloorState}
          wallState={wallState}
          setWallState={setWallState}
        />

        <ThreeCanvas floorState={floorState} wallState={wallState} />
      </div>

      <BottomBar />
    </div>
  );
}
