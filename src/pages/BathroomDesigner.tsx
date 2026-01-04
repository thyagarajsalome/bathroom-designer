import { useState, useRef } from "react";
import TopBar from "../components/TopBar";
import LeftPanel from "../components/LeftPanel";
import BottomBar from "../components/BottomBar";
import ThreeCanvas, { ThreeCanvasHandle } from "../components/ThreeCanvas";
// FIX: Use 'import type'
import type { FloorState } from "../types/floor";
import type { WallState } from "../types/wall";

export default function BathroomDesigner(): JSX.Element {
  const canvasRef = useRef<ThreeCanvasHandle>(null);

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
    tileHeight: 1.2,
  });

  const handleExport = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.exportImage();
      if (dataUrl) {
        const link = document.createElement("a");
        link.download = "bathroom-design.png";
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar onExport={handleExport} />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          floorState={floorState}
          setFloorState={setFloorState}
          wallState={wallState}
          setWallState={setWallState}
        />

        <ThreeCanvas
          ref={canvasRef}
          floorState={floorState}
          wallState={wallState}
        />
      </div>

      <BottomBar />
    </div>
  );
}
