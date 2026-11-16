declare module 'gifenc' {
  export interface GIFEncoderOptions {
    initialCapacity?: number;
    auto?: boolean;
  }

  export interface WriteFrameOptions {
    transparent?: boolean;
    transparentIndex?: number;
    delay?: number;
    palette?: any;
    repeat?: number;
    colorDepth?: number;
    dispose?: number;
    first?: boolean;
  }

  export interface GIFEncoderInstance {
    reset(): void;
    finish(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
    buffer: ArrayBuffer;
    stream: any;
    writeHeader(): void;
    writeFrame(index: Uint8Array | number[], width: number, height: number, opts?: WriteFrameOptions): void;
  }

  export function GIFEncoder(opt?: GIFEncoderOptions): GIFEncoderInstance;
  export function quantize(rgba: Uint8ClampedArray | Uint8Array | number[], maxColors?: number, options?: any): number[][];
  export function applyPalette(rgba: Uint8ClampedArray | Uint8Array | number[], palette: any, format?: string): Uint8Array;
  export function nearestColorIndex(palette: any, r: number, g: number, b: number): number;
  export function nearestColor(palette: any, r: number, g: number, b: number): number[];
}
