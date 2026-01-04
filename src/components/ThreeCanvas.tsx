import { useEffect } from "react";
import { useThreeScene } from "../three/useThreeScene";
import { FloorState } from "../types/floor";
import { WallState } from "../types/wall";

interface Props {
  floorState: FloorState;
  wallState: WallState;
}

export default function ThreeCanvas({ floorState, wallState }: Props) {
  const { containerRef, sceneRef } = useThreeScene();

  useEffect(() => {
    sceneRef.current?.updateFloor(floorState);
  }, [floorState]);

  useEffect(() => {
    sceneRef.current?.updateWalls(wallState);
  }, [wallState]);

  return <div ref={containerRef} className="flex-1 bg-gray-200" />;
}
