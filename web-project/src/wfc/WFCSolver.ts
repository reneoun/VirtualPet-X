/**
 * Wave Function Collapse - Solver
 * 
 * Core WFC algorithm implementation with constraint propagation
 */

import type {
    WFCConfig,
    WFCResult,
    WFCEvent,
    WFCProgressCallback,
    Cell
} from './types';
import { TileRegistry } from './TileRegistry';
import { WFCGrid } from './WFCGrid';

// Simple seeded random number generator
function createSeededRandom(seed: number): () => number {
    return function () {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
}

export class WFCSolver {
    private readonly _config: WFCConfig;
    private registry: TileRegistry;
    private grid: WFCGrid;
    private random: () => number;
    private progressCallback?: WFCProgressCallback;
    private maxIterations: number = 100000;

    /** Get the current configuration */
    get config(): WFCConfig {
        return this._config;
    }

    constructor(config: WFCConfig, progressCallback?: WFCProgressCallback) {
        this._config = config;
        this.registry = new TileRegistry(config.tiles);
        this.grid = new WFCGrid(config, this.registry);
        this.progressCallback = progressCallback;

        // Initialize random function
        if (config.seed !== undefined) {
            this.random = createSeededRandom(config.seed);
        } else {
            this.random = Math.random;
        }
    }

    /**
     * Emit a progress event
     */
    private emit(event: WFCEvent): void {
        if (this.progressCallback) {
            this.progressCallback(event);
        }
    }

    /**
     * Propagate constraints from a collapsed cell
     */
    private propagate(startX: number, startY: number): boolean {
        const stack: { x: number; y: number }[] = [{ x: startX, y: startY }];
        const visited = new Set<string>();

        while (stack.length > 0) {
            const { x, y } = stack.pop()!;
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            const cell = this.grid.getCell(x, y);
            if (!cell) continue;

            const neighbors = this.grid.getNeighbors(x, y);

            for (const { direction, cell: neighbor } of neighbors) {
                if (neighbor.collapsedTile !== null) continue;

                // Calculate allowed tiles for neighbor based on current cell's possibilities
                const allowedTiles = this.registry.getUnionCompatibleTiles(
                    cell.possibleTiles,
                    direction
                );

                // Constrain the neighbor
                const changed = this.grid.constrainCell(neighbor.x, neighbor.y, allowedTiles);

                if (changed) {
                    this.emit({
                        type: 'propagate',
                        x: neighbor.x,
                        y: neighbor.y,
                        entropy: neighbor.entropy
                    });

                    // Check for contradiction
                    if (neighbor.possibleTiles.size === 0) {
                        return false;
                    }

                    // Add to stack for further propagation
                    stack.push({ x: neighbor.x, y: neighbor.y });
                }
            }
        }

        return true;
    }

    /**
     * Collapse a cell by selecting a random tile from possibilities
     */
    private collapseRandomCell(cell: Cell): string {
        const selectedTile = this.registry.selectWeightedRandom(
            cell.possibleTiles,
            this.random
        );

        this.grid.collapseCell(cell.x, cell.y, selectedTile);
        return selectedTile;
    }

    /**
     * Run the WFC algorithm
     */
    solve(): WFCResult {
        let iterations = 0;
        const maxBacktracks = 10;
        let backtracks = 0;

        while (iterations < this.maxIterations) {
            iterations++;

            // Check if fully collapsed
            if (this.grid.isFullyCollapsed()) {
                this.emit({ type: 'complete', iteration: iterations });
                return {
                    success: true,
                    grid: this.grid.getResultGrid(),
                    iterations
                };
            }

            // Find lowest entropy cell
            const cell = this.grid.findLowestEntropyCell();

            if (!cell) {
                // Either contradiction or complete
                if (this.grid.hasContradiction()) {
                    backtracks++;
                    if (backtracks > maxBacktracks) {
                        this.emit({ type: 'error', iteration: iterations });
                        return {
                            success: false,
                            grid: this.grid.getResultGrid(),
                            iterations,
                            error: 'Maximum backtrack attempts exceeded'
                        };
                    }

                    this.emit({ type: 'backtrack', iteration: iterations });
                    // Reset and try again
                    this.grid.reset();
                    continue;
                }

                this.emit({ type: 'complete', iteration: iterations });
                return {
                    success: true,
                    grid: this.grid.getResultGrid(),
                    iterations
                };
            }

            // Collapse the cell
            const selectedTile = this.collapseRandomCell(cell);

            this.emit({
                type: 'collapse',
                x: cell.x,
                y: cell.y,
                tileId: selectedTile,
                iteration: iterations
            });

            // Propagate constraints
            const propagationSuccess = this.propagate(cell.x, cell.y);

            if (!propagationSuccess) {
                backtracks++;
                if (backtracks > maxBacktracks) {
                    this.emit({ type: 'error', iteration: iterations });
                    return {
                        success: false,
                        grid: this.grid.getResultGrid(),
                        iterations,
                        error: 'Contradiction detected, maximum backtrack attempts exceeded'
                    };
                }

                this.emit({ type: 'backtrack', iteration: iterations });
                this.grid.reset();
            }
        }

        this.emit({ type: 'error', iteration: iterations });
        return {
            success: false,
            grid: this.grid.getResultGrid(),
            iterations,
            error: 'Maximum iterations exceeded'
        };
    }

    /**
     * Solve with async iteration for visualization
     */
    async solveAsync(delayMs: number = 0): Promise<WFCResult> {
        let iterations = 0;
        const maxBacktracks = 10;
        let backtracks = 0;

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        while (iterations < this.maxIterations) {
            iterations++;

            if (delayMs > 0) {
                await delay(delayMs);
            }

            if (this.grid.isFullyCollapsed()) {
                this.emit({ type: 'complete', iteration: iterations });
                return {
                    success: true,
                    grid: this.grid.getResultGrid(),
                    iterations
                };
            }

            const cell = this.grid.findLowestEntropyCell();

            if (!cell) {
                if (this.grid.hasContradiction()) {
                    backtracks++;
                    if (backtracks > maxBacktracks) {
                        this.emit({ type: 'error', iteration: iterations });
                        return {
                            success: false,
                            grid: this.grid.getResultGrid(),
                            iterations,
                            error: 'Maximum backtrack attempts exceeded'
                        };
                    }

                    this.emit({ type: 'backtrack', iteration: iterations });
                    this.grid.reset();
                    continue;
                }

                this.emit({ type: 'complete', iteration: iterations });
                return {
                    success: true,
                    grid: this.grid.getResultGrid(),
                    iterations
                };
            }

            const selectedTile = this.collapseRandomCell(cell);

            this.emit({
                type: 'collapse',
                x: cell.x,
                y: cell.y,
                tileId: selectedTile,
                iteration: iterations
            });

            const propagationSuccess = this.propagate(cell.x, cell.y);

            if (!propagationSuccess) {
                backtracks++;
                if (backtracks > maxBacktracks) {
                    this.emit({ type: 'error', iteration: iterations });
                    return {
                        success: false,
                        grid: this.grid.getResultGrid(),
                        iterations,
                        error: 'Contradiction detected, maximum backtrack attempts exceeded'
                    };
                }

                this.emit({ type: 'backtrack', iteration: iterations });
                this.grid.reset();
            }
        }

        this.emit({ type: 'error', iteration: iterations });
        return {
            success: false,
            grid: this.grid.getResultGrid(),
            iterations,
            error: 'Maximum iterations exceeded'
        };
    }

    /**
     * Pre-collapse specific cells (for seeding the generation)
     */
    preCollapse(x: number, y: number, tileId: string): boolean {
        const success = this.grid.collapseCell(x, y, tileId);
        if (success) {
            this.propagate(x, y);
        }
        return success;
    }

    /**
     * Get the current grid state
     */
    getGrid(): WFCGrid {
        return this.grid;
    }

    /**
     * Get the tile registry
     */
    getRegistry(): TileRegistry {
        return this.registry;
    }

    /**
     * Reset the solver
     */
    reset(): void {
        this.grid.reset();
    }
}
