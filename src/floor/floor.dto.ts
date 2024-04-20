type SceneObject = {
  modelPath: string;
  matrix: number[];
  topImagePath?: string;
};

type FloorData = {
  label: string;
  objects: SceneObject[];
};

export class FloorDto {
  floors: FloorData[];
  viewerKey: string;
}
