/**
 * Terrain Manager
 * 
 * A modular wrapper for WFC terrain generation that can be
 * easily integrated into any container element.
 * 
 * Layer System:
 * 1. Ground Layer - WFC-generated base terrain (fully opaque tiles)
 * 2. Decoration Layer - Single tiles with transparency placed on top
 * 3. Sprite Layer - Multi-tile objects (trees, bushes) placed on top
 */

import { WFCSolver, WFCRenderer } from './wfc';
import type { WFCConfig, WFCResult, WFCEvent, TileDefinition } from './wfc';
import { groundTiles, TILE_SIZE } from './wfc/tilesets/natureTileset';

/** Decoration tile definition */
export interface DecorationTile {
    id: string;
    position: { x: number; y: number };
    weight: number;
}

/** Represents a placed decoration on the terrain */
export interface PlacedDecoration {
    decoration: DecorationTile;
    gridX: number;
    gridY: number;
}

export interface TerrainConfig {
    /** The container element to render terrain into */
    container: HTMLElement;
    /** Path to the tileset image */
    tilesetPath?: string;
    /** Custom tile definitions (defaults to nature tileset) */
    tiles?: TileDefinition[];
    /** Decoration tiles to randomly place on top of ground */
    decorations?: DecorationTile[];
    /** Density of decoration placement (0-1, defaults to 0.15) */
    decorationDensity?: number;
    /** Tile size in pixels (defaults to 16) */
    tileSize?: number;
    /** Render scale factor (defaults to 1) */
    scale?: number;
    /** Random seed for reproducible terrain */
    seed?: number;
    /** Callback when generation completes */
    onComplete?: (result: WFCResult) => void;
    /** Callback for progress updates */
    onProgress?: (event: WFCEvent) => void;
}

export class TerrainManager {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private config: TerrainConfig;
    private solver: WFCSolver | null = null;
    private renderer: WFCRenderer | null = null;
    private initialized: boolean = false;
    private currentResult: WFCResult | null = null;
    private placedDecorations: PlacedDecoration[] = [];
    private random: () => number = Math.random;

    constructor(config: TerrainConfig) {
        this.config = {
            tilesetPath: 'assets/tileset_nature.png',
            tiles: groundTiles,
            decorations: [],
            decorationDensity: 0.15,
            tileSize: TILE_SIZE,
            scale: 1,
            ...config
        };

        // Create canvas for terrain
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'terrain-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '0';
        this.canvas.style.imageRendering = 'pixelated';

        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas 2D context');
        }
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;

        // Insert canvas at the beginning of container (behind other elements)
        this.config.container.insertBefore(this.canvas, this.config.container.firstChild);
    }

    /**
     * Initialize the terrain system (loads tileset)
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        const { width, height } = this.calculateGridDimensions();

        const wfcConfig: WFCConfig = {
            width,
            height,
            tileSize: this.config.tileSize!,
            tiles: this.config.tiles!,
            seed: this.config.seed,
            wrapEdges: false
        };

        this.solver = new WFCSolver(wfcConfig, (event) => {
            this.config.onProgress?.(event);
        });

        this.renderer = new WFCRenderer({
            tilesetSrc: this.config.tilesetPath!,
            tileSize: this.config.tileSize!,
            scale: this.config.scale!,
            registry: this.solver.getRegistry()
        });

        await this.renderer.waitForLoad();
        this.initialized = true;
    }

    /**
     * Calculate grid dimensions based on container size
     */
    private calculateGridDimensions(): { width: number; height: number } {
        const container = this.config.container;
        const tileRenderSize = this.config.tileSize! * this.config.scale!;

        const width = Math.floor(container.clientWidth / tileRenderSize);
        const height = Math.floor(container.clientHeight / tileRenderSize);

        return {
            width: Math.max(1, width),
            height: Math.max(1, height)
        };
    }

    /**
     * Update canvas size to match container
     */
    private updateCanvasSize(): void {
        const { width, height } = this.calculateGridDimensions();
        const tileRenderSize = this.config.tileSize! * this.config.scale!;

        this.canvas.width = width * tileRenderSize;
        this.canvas.height = height * tileRenderSize;
    }

    /**
     * Create a seeded random function
     */
    private createSeededRandom(seed: number): () => number {
        return () => {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed / 0x7fffffff;
        };
    }

    /**
     * Select a random decoration based on weights
     */
    private selectWeightedDecoration(decorations: DecorationTile[]): DecorationTile {
        const totalWeight = decorations.reduce((sum, d) => sum + d.weight, 0);
        let r = this.random() * totalWeight;

        for (const decor of decorations) {
            r -= decor.weight;
            if (r <= 0) return decor;
        }
        return decorations[decorations.length - 1];
    }

    /**
     * Place decoration tiles on the terrain
     * Returns a set of occupied cells for sprite placement to avoid
     */
    private placeDecorations(gridWidth: number, gridHeight: number): Set<string> {
        this.placedDecorations = [];
        const occupied = new Set<string>();

        const decorations = this.config.decorations;
        if (!decorations || decorations.length === 0) return occupied;

        const density = this.config.decorationDensity ?? 0.15;
        const targetCount = Math.floor(gridWidth * gridHeight * density);

        for (let i = 0; i < targetCount * 2; i++) {
            if (this.placedDecorations.length >= targetCount) break;

            const gridX = Math.floor(this.random() * gridWidth);
            const gridY = Math.floor(this.random() * gridHeight);
            const key = `${gridX},${gridY}`;

            if (!occupied.has(key)) {
                const decoration = this.selectWeightedDecoration(decorations);
                this.placedDecorations.push({ decoration, gridX, gridY });
                occupied.add(key);
            }
        }

        return occupied;
    }

    /**
     * Render all placed decoration tiles
     */
    private renderDecorations(): void {
        if (!this.renderer) return;

        const tileSize = this.config.tileSize!;
        const scale = this.config.scale!;
        const tileset = this.renderer.getTileset();

        for (const placed of this.placedDecorations) {
            const srcX = placed.decoration.position.x * tileSize;
            const srcY = placed.decoration.position.y * tileSize;
            const destX = placed.gridX * tileSize * scale;
            const destY = placed.gridY * tileSize * scale;

            this.ctx.drawImage(
                tileset,
                srcX, srcY, tileSize, tileSize,
                destX, destY, tileSize * scale, tileSize * scale
            );
        }
    }

    /**
     * Generate new terrain
     */
    async generate(seed?: number): Promise<WFCResult> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Initialize seeded random
        const useSeed = seed ?? this.config.seed ?? Math.floor(Math.random() * 1000000);
        this.random = this.createSeededRandom(useSeed);

        // Recalculate dimensions in case container resized
        const { width, height } = this.calculateGridDimensions();

        // Create new solver with updated dimensions
        const wfcConfig: WFCConfig = {
            width,
            height,
            tileSize: this.config.tileSize!,
            tiles: this.config.tiles!,
            seed: useSeed,
            wrapEdges: false
        };

        this.solver = new WFCSolver(wfcConfig, (event) => {
            this.config.onProgress?.(event);
        });

        // Update renderer's registry
        this.renderer = new WFCRenderer({
            tilesetSrc: this.config.tilesetPath!,
            tileSize: this.config.tileSize!,
            scale: this.config.scale!,
            registry: this.solver.getRegistry()
        });

        await this.renderer.waitForLoad();

        // Update canvas size
        this.updateCanvasSize();

        // Run WFC for ground layer
        const result = this.solver.solve();
        this.currentResult = result;

        // Render result
        if (result.success) {
            // Layer 1: Render ground tiles (base layer)
            this.renderer.renderToCanvas(this.canvas, result);

            // Layer 2: Place and render decoration tiles on top of ground
            this.placeDecorations(width, height);
            this.renderDecorations();
        }

        this.config.onComplete?.(result);
        return result;
    }

    /**
     * Regenerate terrain with optional new seed
     */
    async regenerate(seed?: number): Promise<WFCResult> {
        return this.generate(seed ?? Math.floor(Math.random() * 1000000));
    }

    /**
     * Handle container resize - regenerate terrain to fit
     */
    async handleResize(): Promise<void> {
        if (this.currentResult) {
            await this.generate(this.config.seed);
        }
    }

    /**
     * Get the terrain canvas element
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Get the last generation result
     */
    getResult(): WFCResult | null {
        return this.currentResult;
    }

    /**
     * Get current grid dimensions
     */
    getDimensions(): { width: number; height: number } {
        return this.calculateGridDimensions();
    }

    /**
     * Get placed decorations
     */
    getPlacedDecorations(): PlacedDecoration[] {
        return this.placedDecorations;
    }

    /**
     * Check if terrain is initialized
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Clean up resources
     */
    destroy(): void {
        this.canvas.remove();
        this.solver = null;
        this.renderer = null;
        this.initialized = false;
    }
}

/**
 * Factory function to create and initialize terrain
 */
export async function createTerrain(config: TerrainConfig): Promise<TerrainManager> {
    const terrain = new TerrainManager(config);
    await terrain.initialize();
    await terrain.generate();
    return terrain;
}

export default TerrainManager;
