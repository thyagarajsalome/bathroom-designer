export type TileType = "ceramic" | "wood" | "marble";
export type TilePattern = "grid" | "brick" | "diagonal";

export interface FloorState {
  tileType: TileType;
  scale: number;
  rotation: number;
  pattern: TilePattern;
}
