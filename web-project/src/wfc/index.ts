/**
 * Wave Function Collapse - Module Entry Point
 * 
 * A modular implementation of the Wave Function Collapse algorithm
 * for procedural tile-based map generation.
 * 
 * @example
 * ```typescript
 * import { WFCSolver, WFCRenderer, TileRegistry } from './wfc';
 * 
 * const config = {
 *   width: 10,
 *   height: 10,
 *   tileSize: 16,
 *   tiles: [
 *     { id: 'grass', position: { x: 0, y: 0 }, sockets: { up: 'g', down: 'g', left: 'g', right: 'g' } },
 *     // ... more tiles
 *   ]
 * };
 * 
 * const solver = new WFCSolver(config);
 * const result = solver.solve();
 * 
 * if (result.success) {
 *   const renderer = new WFCRenderer({ tilesetSrc: 'tileset.png', tileSize: 16, registry: solver.getRegistry() });
 *   await renderer.waitForLoad();
 *   renderer.renderToCanvas(canvas, result);
 * }
 * ```
 */

// Export types
export * from './types';

// Export classes
export { TileRegistry } from './TileRegistry';
export { WFCGrid } from './WFCGrid';
export { WFCSolver } from './WFCSolver';
export { WFCRenderer } from './WFCRenderer';

// Export tileset data
export { groundTiles, TILE_SIZE } from './tilesets/natureTileset';

// Convenience function to create and run WFC
import type { WFCConfig, WFCResult, WFCProgressCallback } from './types';
import { WFCSolver } from './WFCSolver';

/**
 * Convenience function to run WFC with a config
 */
export function generateWFC(
    config: WFCConfig,
    progressCallback?: WFCProgressCallback
): WFCResult {
    const solver = new WFCSolver(config, progressCallback);
    return solver.solve();
}

/**
 * Async version with visualization delay
 */
export async function generateWFCAsync(
    config: WFCConfig,
    delayMs: number = 0,
    progressCallback?: WFCProgressCallback
): Promise<WFCResult> {
    const solver = new WFCSolver(config, progressCallback);
    return solver.solveAsync(delayMs);
}
