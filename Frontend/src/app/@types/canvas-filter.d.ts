declare module 'canvas-filter' {
  export class ImageData {
    constructor(src: string, filter: Filter);
    apply(): ImageData;
    src: string;
  }

  export interface Filter {
    (imageData: ImageData): ImageData;
  }

  export const Filters: {
    [key: string]: Filter;
  };
}