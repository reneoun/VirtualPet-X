/**
 * Wave Function Collapse - Demo/Test File
 * 
 * This file demonstrates how to use the WFC module with the nature tileset.
 * It can be imported and run to test the WFC generation on the existing grid.
 */

import { WFCSolver, WFCRenderer } from './index';
import type { WFCConfig, WFCEvent } from './index';
import { simpleNatureTiles, NATURE_TILE_SIZE } from './tilesets/natureTileset';

export interface WFCDemoConfig {
    /** Container element or selector */
    container: HTMLElement | string;
    /** Path to the tileset image */
    tilesetPath: string;
    /** Width in tiles */
    width?: number;
    /** Height in tiles */
    height?: number;
    /** Render scale */
    scale?: number;
    /** Animation delay (0 for instant) */
    animationDelay?: number;
    /** Random seed for reproducible results */
    seed?: number;
}

export class WFCDemo {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private solver: WFCSolver | null = null;
    private renderer: WFCRenderer | null = null;
    private config: WFCDemoConfig;
    private gridWidth: number;
    private gridHeight: number;

    constructor(config: WFCDemoConfig) {
        this.config = config;

        // Get or create container
        const container = typeof config.container === 'string'
            ? document.querySelector(config.container) as HTMLElement
            : config.container;

        if (!container) {
            throw new Error('Container element not found');
        }

        // Calculate grid size based on container or defaults
        const scale = config.scale ?? 1;
        const tileRenderSize = NATURE_TILE_SIZE * scale;

        this.gridWidth = config.width ?? Math.floor(container.clientWidth / tileRenderSize);
        this.gridHeight = config.height ?? Math.floor(container.clientHeight / tileRenderSize);

        // Ensure minimum size
        this.gridWidth = Math.max(5, this.gridWidth);
        this.gridHeight = Math.max(5, this.gridHeight);

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.gridWidth * tileRenderSize;
        this.canvas.height = this.gridHeight * tileRenderSize;
        this.canvas.style.imageRendering = 'pixelated';
        this.canvas.id = 'wfc-canvas';

        // Get context
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;

        // Add canvas to container
        container.appendChild(this.canvas);

        console.log(`WFC Demo initialized: ${this.gridWidth}x${this.gridHeight} tiles`);
    }

    /**
     * Initialize the WFC solver and renderer
     */
    async initialize(): Promise<void> {
        const wfcConfig: WFCConfig = {
            width: this.gridWidth,
            height: this.gridHeight,
            tileSize: NATURE_TILE_SIZE,
            tiles: simpleNatureTiles,
            seed: this.config.seed,
            wrapEdges: false
        };

        // Create solver with progress callback
        this.solver = new WFCSolver(wfcConfig, (event: WFCEvent) => {
            this.onProgress(event);
        });

        // Create renderer
        this.renderer = new WFCRenderer({
            tilesetSrc: this.config.tilesetPath,
            tileSize: NATURE_TILE_SIZE,
            scale: this.config.scale ?? 1,
            registry: this.solver.getRegistry()
        });

        // Wait for tileset to load
        await this.renderer.waitForLoad();
        console.log('Tileset loaded');
    }

    /**
     * Handle progress events
     */
    private onProgress(event: WFCEvent): void {
        switch (event.type) {
            case 'collapse':
                // console.log(`Collapsed (${event.x}, ${event.y}) to ${event.tileId}`);
                break;
            case 'propagate':
                // console.log(`Propagated to (${event.x}, ${event.y}), entropy: ${event.entropy?.toFixed(2)}`);
                break;
            case 'backtrack':
                console.log(`Backtracking at iteration ${event.iteration}`);
                break;
            case 'complete':
                console.log(`Generation complete after ${event.iteration} iterations`);
                break;
            case 'error':
                console.error(`Generation failed at iteration ${event.iteration}`);
                break;
        }
    }

    /**
     * Generate and render the map
     */
    async generate(): Promise<boolean> {
        if (!this.solver || !this.renderer) {
            await this.initialize();
        }

        // Reset solver
        this.solver!.reset();

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Run generation
        const delay = this.config.animationDelay ?? 0;
        let result;

        if (delay > 0) {
            // Animated generation
            result = await this.solver!.solveAsync(delay);

            // Render as we go would require modifying the solver
            // For now, just render final result
        } else {
            // Instant generation
            result = this.solver!.solve();
        }

        // Render result
        if (result.success) {
            this.renderer!.renderToCanvas(this.canvas, result);
            console.log(`Map generated successfully in ${result.iterations} iterations`);
            return true;
        } else {
            console.error(`Map generation failed: ${result.error}`);
            // Render partial result
            this.renderer!.renderToCanvas(this.canvas, result);
            return false;
        }
    }

    /**
     * Regenerate with new seed
     */
    async regenerate(seed?: number): Promise<boolean> {
        if (seed !== undefined) {
            this.config.seed = seed;
            // Recreate solver with new seed
            const wfcConfig: WFCConfig = {
                width: this.gridWidth,
                height: this.gridHeight,
                tileSize: NATURE_TILE_SIZE,
                tiles: simpleNatureTiles,
                seed: seed,
                wrapEdges: false
            };

            this.solver = new WFCSolver(wfcConfig, (event: WFCEvent) => {
                this.onProgress(event);
            });
        }

        return this.generate();
    }

    /**
     * Get the canvas element
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Get current grid dimensions
     */
    getDimensions(): { width: number; height: number } {
        return { width: this.gridWidth, height: this.gridHeight };
    }

    /**
     * Cleanup
     */
    destroy(): void {
        this.canvas.remove();
        this.solver = null;
        this.renderer = null;
    }
}

/**
 * Quick start function to run WFC demo
 */
export async function runWFCDemo(
    containerId: string = '#walking-pet-container',
    tilesetPath: string = 'assets/tileset_nature.png'
): Promise<WFCDemo> {
    const demo = new WFCDemo({
        container: containerId,
        tilesetPath: tilesetPath,
        scale: 1,
        animationDelay: 0
    });

    await demo.initialize();
    await demo.generate();

    return demo;
}

export default WFCDemo;
