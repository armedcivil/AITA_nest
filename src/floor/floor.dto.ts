type SceneObject = {
  modelPath: string;
  matrix: number[];
};

type FloorData = {
  label: string;
  objects: SceneObject[];
};

export class FloorDto {
  floors: FloorData[];
}
