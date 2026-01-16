/**
 * Wave Function Collapse - Grid Management
 * 
 * Manages the 2D grid of cells for WFC
 */

import type { Cell, Direction, WFCConfig } from './types';
import { DIRECTIONS, DIRECTION_OFFSETS } from './types';
import { TileRegistry } from './TileRegistry';

export class WFCGrid {
    private cells: Cell[][];
    private width: number;
    private height: number;
    private wrapEdges: boolean;
    private registry: TileRegistry;

    constructor(config: WFCConfig, registry: TileRegistry) {
        this.width = config.width;
        this.height = config.height;
        this.wrapEdges = config.wrapEdges ?? false;
        this.registry = registry;
        this.cells = this.initializeGrid();
    }

    /**
     * Initialize the grid with all possibilities
     */
    private initializeGrid(): Cell[][] {
        const allTileIds = this.registry.getAllTileIds();
        const grid: Cell[][] = [];

        for (let y = 0; y < this.height; y++) {
            const row: Cell[] = [];
            for (let x = 0; x < this.width; x++) {
                const possibleTiles = new Set(allTileIds);
                row.push({
                    x,
                    y,
                    possibleTiles,
                    collapsedTile: null,
                    entropy: this.registry.calculateEntropy(possibleTiles)
                });
            }
            grid.push(row);
        }

        return grid;
    }

    /**
     * Reset the grid to initial state
     */
    reset(): void {
        this.cells = this.initializeGrid();
    }

    /**
     * Get a cell at position
     */
    getCell(x: number, y: number): Cell | null {
        if (this.wrapEdges) {
            x = ((x % this.width) + this.width) % this.width;
            y = ((y % this.height) + this.height) % this.height;
        } else if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.cells[y][x];
    }

    /**
     * Get neighboring cell in a direction
     */
    getNeighbor(x: number, y: number, direction: Direction): Cell | null {
        const offset = DIRECTION_OFFSETS[direction];
        return this.getCell(x + offset.x, y + offset.y);
    }

    /**
     * Get all neighbors of a cell
     */
    getNeighbors(x: number, y: number): { direction: Direction; cell: Cell }[] {
        const neighbors: { direction: Direction; cell: Cell }[] = [];

        for (const direction of DIRECTIONS) {
            const cell = this.getNeighbor(x, y, direction);
            if (cell) {
                neighbors.push({ direction, cell });
            }
        }

        return neighbors;
    }

    /**
     * Find the cell with lowest entropy (that hasn't been collapsed)
     * Returns null if all cells are collapsed or grid is in contradiction
     */
    findLowestEntropyCell(): Cell | null {
        let lowestEntropy = Infinity;
        let candidates: Cell[] = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];

                // Skip already collapsed cells
                if (cell.collapsedTile !== null) continue;

                // Check for contradiction
                if (cell.possibleTiles.size === 0) {
                    return null; // Contradiction detected
                }

                if (cell.entropy < lowestEntropy) {
                    lowestEntropy = cell.entropy;
                    candidates = [cell];
                } else if (cell.entropy === lowestEntropy) {
                    candidates.push(cell);
                }
            }
        }

        if (candidates.length === 0) return null;

        // Return random candidate if there are ties
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Collapse a cell to a specific tile
     */
    collapseCell(x: number, y: number, tileId: string): boolean {
        const cell = this.getCell(x, y);
        if (!cell) return false;

        if (!cell.possibleTiles.has(tileId)) {
            return false; // Invalid tile for this cell
        }

        cell.possibleTiles = new Set([tileId]);
        cell.collapsedTile = tileId;
        cell.entropy = 0;

        return true;
    }

    /**
     * Constrain a cell's possibilities
     * Returns true if the cell was changed, false otherwise
     */
    constrainCell(x: number, y: number, allowedTiles: Set<string>): boolean {
        const cell = this.getCell(x, y);
        if (!cell || cell.collapsedTile !== null) return false;

        const originalSize = cell.possibleTiles.size;
        const newPossibilities = new Set<string>();

        for (const tileId of cell.possibleTiles) {
            if (allowedTiles.has(tileId)) {
                newPossibilities.add(tileId);
            }
        }

        if (newPossibilities.size === originalSize) {
            return false; // No change
        }

        cell.possibleTiles = newPossibilities;
        cell.entropy = this.registry.calculateEntropy(newPossibilities);

        // Auto-collapse if only one possibility
        if (newPossibilities.size === 1) {
            cell.collapsedTile = Array.from(newPossibilities)[0];
        }

        return true;
    }

    /**
     * Check if the grid is fully collapsed
     */
    isFullyCollapsed(): boolean {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.cells[y][x].collapsedTile === null) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if there's a contradiction (any cell with 0 possibilities)
     */
    hasContradiction(): boolean {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                if (cell.collapsedTile === null && cell.possibleTiles.size === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Get the result grid (tile IDs or null)
     */
    getResultGrid(): (string | null)[][] {
        return this.cells.map(row => row.map(cell => cell.collapsedTile));
    }

    /**
     * Get grid dimensions
     */
    getDimensions(): { width: number; height: number } {
        return { width: this.width, height: this.height };
    }

    /**
     * Clone the current grid state (for backtracking)
     */
    clone(): Cell[][] {
        return this.cells.map(row =>
            row.map(cell => ({
                ...cell,
                possibleTiles: new Set(cell.possibleTiles)
            }))
        );
    }

    /**
     * Restore grid state from a snapshot
     */
    restore(snapshot: Cell[][]): void {
        this.cells = snapshot.map(row =>
            row.map(cell => ({
                ...cell,
                possibleTiles: new Set(cell.possibleTiles)
            }))
        );
    }
}
