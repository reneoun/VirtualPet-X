/**
 * Wave Function Collapse - Renderer
 * 
 * Renders the WFC grid to a canvas using a tileset image
 */

import type { WFCResult } from './types';
import { TileRegistry } from './TileRegistry';

export interface WFCRendererConfig {
    /** The tileset image source */
    tilesetSrc: string;
    /** Size of each tile in the tileset (pixels) */
    tileSize: number;
    /** Scale factor for rendering (default: 1) */
    scale?: number;
    /** Tile registry for looking up tile positions */
    registry: TileRegistry;
}

export class WFCRenderer {
    private tileset: HTMLImageElement;
    private tileSize: number;
    private scale: number;
    private registry: TileRegistry;
    private loaded: boolean = false;
    private loadPromise: Promise<void>;

    constructor(config: WFCRendererConfig) {
        this.tileSize = config.tileSize;
        this.scale = config.scale ?? 1;
        this.registry = config.registry;

        this.tileset = new Image();
        this.loadPromise = new Promise((resolve, reject) => {
            this.tileset.onload = () => {
                this.loaded = true;
                resolve();
            };
            this.tileset.onerror = reject;
        });
        this.tileset.src = config.tilesetSrc;
    }

    /**
     * Wait for tileset to load
     */
    async waitForLoad(): Promise<void> {
        return this.loadPromise;
    }

    /**
     * Check if tileset is loaded
     */
    isLoaded(): boolean {
        return this.loaded;
    }

    /**
     * Render a single tile to a canvas at position
     */
    renderTile(
        ctx: CanvasRenderingContext2D,
        tileId: string,
        destX: number,
        destY: number
    ): void {
        const tile = this.registry.getTile(tileId);
        if (!tile) return;

        const srcX = tile.position.x * this.tileSize;
        const srcY = tile.position.y * this.tileSize;
        const destSize = this.tileSize * this.scale;

        ctx.drawImage(
            this.tileset,
            srcX, srcY, this.tileSize, this.tileSize,
            destX * destSize, destY * destSize, destSize, destSize
        );
    }

    /**
     * Render the entire WFC result to a canvas
     */
    renderGrid(
        ctx: CanvasRenderingContext2D,
        result: WFCResult,
        offsetX: number = 0,
        offsetY: number = 0
    ): void {
        if (!this.loaded) {
            console.warn('Tileset not yet loaded');
            return;
        }

        const destSize = this.tileSize * this.scale;

        for (let y = 0; y < result.grid.length; y++) {
            for (let x = 0; x < result.grid[y].length; x++) {
                const tileId = result.grid[y][x];
                if (tileId) {
                    const tile = this.registry.getTile(tileId);
                    if (tile) {
                        const srcX = tile.position.x * this.tileSize;
                        const srcY = tile.position.y * this.tileSize;

                        ctx.drawImage(
                            this.tileset,
                            srcX, srcY, this.tileSize, this.tileSize,
                            offsetX + x * destSize, offsetY + y * destSize, destSize, destSize
                        );
                    }
                } else {
                    // Draw placeholder for failed cells
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                    ctx.fillRect(
                        offsetX + x * destSize,
                        offsetY + y * destSize,
                        destSize,
                        destSize
                    );
                }
            }
        }
    }

    /**
     * Render to a new canvas element
     */
    renderToNewCanvas(result: WFCResult): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const destSize = this.tileSize * this.scale;

        canvas.width = result.grid[0].length * destSize;
        canvas.height = result.grid.length * destSize;

        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering

        this.renderGrid(ctx, result);

        return canvas;
    }

    /**
     * Render to an existing canvas, fitting to its dimensions
     */
    renderToCanvas(canvas: HTMLCanvasElement, result: WFCResult): void {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.renderGrid(ctx, result);
    }

    /**
     * Create an offscreen buffer for partial updates
     */
    createBuffer(width: number, height: number): {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
    } {
        const canvas = document.createElement('canvas');
        const destSize = this.tileSize * this.scale;

        canvas.width = width * destSize;
        canvas.height = height * destSize;

        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = false;

        return { canvas, ctx };
    }

    /**
     * Get rendering dimensions
     */
    getTileRenderSize(): number {
        return this.tileSize * this.scale;
    }

    /**
     * Update scale factor
     */
    setScale(scale: number): void {
        this.scale = scale;
    }

    /**
     * Get the tileset image (for direct sprite rendering)
     */
    getTileset(): HTMLImageElement {
        return this.tileset;
    }

    /**
     * Get the tile size
     */
    getTileSize(): number {
        return this.tileSize;
    }

    /**
     * Get the scale
     */
    getScale(): number {
        return this.scale;
    }
}
