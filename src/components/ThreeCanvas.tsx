import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useThreeScene } from "../three/useThreeScene";
import { FloorState } from "../types/floor";
import { WallState } from "../types/wall";

interface Props {
  floorState: FloorState;
  wallState: WallState;
}

export interface ThreeCanvasHandle {
  exportImage: () => string | undefined;
}

const ThreeCanvas = forwardRef<ThreeCanvasHandle, Props>(
  ({ floorState, wallState }, ref) => {
    const { containerRef, sceneRef } = useThreeScene();

    useImperativeHandle(ref, () => ({
      exportImage: () => sceneRef.current?.exportImage(),
    }));

    useEffect(() => {
      sceneRef.current?.updateFloor(floorState);
    }, [floorState]);

    useEffect(() => {
      sceneRef.current?.updateWalls(wallState);
    }, [wallState]);

    return <div ref={containerRef} className="flex-1 bg-gray-200" />;
  }
);

export default ThreeCanvas;
