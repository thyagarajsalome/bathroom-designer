export type WallMode = "full-tile" | "half-tile";

export interface WallState {
  mode: WallMode;
  tileScale: number;
  tileTexture: "ceramic" | "marble";
  paintColor: string;
  tileHeight: number;
}
