/**
 * Wave Function Collapse - Tile Registry
 * 
 * Manages tile definitions and adjacency rules
 * 
 * Socket Matching:
 * - Simple: "s" matches "s"
 * - Composite: "s|gr" matches "s" OR "gr" (use pipe for multiple)
 */

import type { TileDefinition, Direction } from './types';
import { DIRECTIONS, OPPOSITE_DIRECTION } from './types';

export class TileRegistry {
    private tiles: Map<string, TileDefinition> = new Map();
    private adjacencyRules: Map<string, Map<Direction, Set<string>>> = new Map();
    private totalWeight: number = 0;

    constructor(tiles: TileDefinition[] = []) {
        tiles.forEach(tile => this.registerTile(tile));
        this.buildAdjacencyRules();
    }

    /**
     * Check if two sockets are compatible
     * Supports composite sockets with pipe separator: "s|gr" matches "s" or "gr"
     */
    private socketsMatch(socket1: string, socket2: string): boolean {
        // Split composite sockets
        const parts1 = socket1.split('|').map(s => s.trim());
        const parts2 = socket2.split('|').map(s => s.trim());

        // Check if any part of socket1 matches any part of socket2
        for (const p1 of parts1) {
            for (const p2 of parts2) {
                if (p1 === p2) return true;
            }
        }
        return false;
    }

    /**
     * Register a new tile definition
     */
    registerTile(tile: TileDefinition): void {
        const weight = tile.weight ?? 1;
        this.tiles.set(tile.id, { ...tile, weight });
        this.totalWeight += weight;
    }

    /**
     * Get a tile by ID
     */
    getTile(id: string): TileDefinition | undefined {
        return this.tiles.get(id);
    }

    /**
     * Get all registered tile IDs
     */
    getAllTileIds(): string[] {
        return Array.from(this.tiles.keys());
    }

    /**
     * Get all registered tiles
     */
    getAllTiles(): TileDefinition[] {
        return Array.from(this.tiles.values());
    }

    /**
     * Build adjacency rules based on socket matching
     * Two tiles can be adjacent if their sockets match on the connecting edge
     */
    buildAdjacencyRules(): void {
        this.adjacencyRules.clear();
        const tileIds = this.getAllTileIds();

        for (const tileId of tileIds) {
            const tile = this.tiles.get(tileId)!;
            const directionMap = new Map<Direction, Set<string>>();

            for (const direction of DIRECTIONS) {
                const compatibleTiles = new Set<string>();
                const oppositeDir = OPPOSITE_DIRECTION[direction];

                for (const otherTileId of tileIds) {
                    const otherTile = this.tiles.get(otherTileId)!;

                    // Check if sockets match (supports composite sockets with |)
                    if (this.socketsMatch(tile.sockets[direction], otherTile.sockets[oppositeDir])) {
                        compatibleTiles.add(otherTileId);
                    }
                }

                directionMap.set(direction, compatibleTiles);
            }

            this.adjacencyRules.set(tileId, directionMap);
        }
    }

    /**
     * Get compatible tiles for a given tile in a specific direction
     */
    getCompatibleTiles(tileId: string, direction: Direction): Set<string> {
        return this.adjacencyRules.get(tileId)?.get(direction) ?? new Set();
    }

    /**
     * Get all tiles that are compatible with ANY of the given tiles in a direction
     */
    getUnionCompatibleTiles(tileIds: Set<string>, direction: Direction): Set<string> {
        const result = new Set<string>();

        for (const tileId of tileIds) {
            const compatible = this.getCompatibleTiles(tileId, direction);
            for (const id of compatible) {
                result.add(id);
            }
        }

        return result;
    }

    /**
     * Get the weight of a tile
     */
    getWeight(tileId: string): number {
        return this.tiles.get(tileId)?.weight ?? 1;
    }

    /**
     * Get total weight of all tiles
     */
    getTotalWeight(): number {
        return this.totalWeight;
    }

    /**
     * Calculate Shannon entropy for a set of possible tiles
     */
    calculateEntropy(possibleTiles: Set<string>): number {
        if (possibleTiles.size === 0) return 0;
        if (possibleTiles.size === 1) return 0;

        let sumWeights = 0;
        let sumWeightLogWeight = 0;

        for (const tileId of possibleTiles) {
            const weight = this.getWeight(tileId);
            sumWeights += weight;
            sumWeightLogWeight += weight * Math.log(weight);
        }

        return Math.log(sumWeights) - (sumWeightLogWeight / sumWeights);
    }

    /**
     * Select a random tile from possibilities based on weights
     */
    selectWeightedRandom(possibleTiles: Set<string>, random: () => number): string {
        const tiles = Array.from(possibleTiles);
        let totalWeight = 0;

        for (const tileId of tiles) {
            totalWeight += this.getWeight(tileId);
        }

        let randomValue = random() * totalWeight;

        for (const tileId of tiles) {
            randomValue -= this.getWeight(tileId);
            if (randomValue <= 0) {
                return tileId;
            }
        }

        // Fallback (should not reach here)
        return tiles[tiles.length - 1];
    }
}
