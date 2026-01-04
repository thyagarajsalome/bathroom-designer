import { useEffect, useRef } from "react";
import { BathroomScene } from "./BathroomScene";

export function useThreeScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<BathroomScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    sceneRef.current = new BathroomScene(containerRef.current);
  }, []);

  return { containerRef, sceneRef };
}
