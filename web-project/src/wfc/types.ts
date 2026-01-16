/**
 * Wave Function Collapse - Type Definitions
 * 
 * Core types for the WFC implementation
 */

/** Direction enum for tile adjacency rules */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** All directions for iteration */
export const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

/** Direction offsets for grid navigation */
export const DIRECTION_OFFSETS: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

/** Opposite direction mapping */
export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
};

/** Represents a single tile type in the tileset */
export interface TileDefinition {
    /** Unique identifier for this tile */
    id: string;
    /** Position in the tileset image (x, y in tile units) */
    position: { x: number; y: number };
    /** Weight/probability of this tile being selected (default: 1) */
    weight?: number;
    /** Socket identifiers for each edge (for adjacency matching) */
    sockets: Record<Direction, string>;
    /** Optional rotation variants (0, 90, 180, 270 degrees) */
    rotations?: number[];
}

/** A cell in the WFC grid */
export interface Cell {
    /** X position in the grid */
    x: number;
    /** Y position in the grid */
    y: number;
    /** Set of possible tile IDs that can occupy this cell */
    possibleTiles: Set<string>;
    /** The collapsed tile ID (null if not yet collapsed) */
    collapsedTile: string | null;
    /** Entropy value (lower = fewer possibilities) */
    entropy: number;
}

/** Configuration for the WFC algorithm */
export interface WFCConfig {
    /** Width of the grid in cells */
    width: number;
    /** Height of the grid in cells */
    height: number;
    /** Size of each tile in pixels */
    tileSize: number;
    /** Available tile definitions */
    tiles: TileDefinition[];
    /** Optional seed for reproducible generation */
    seed?: number;
    /** Whether to wrap edges (toroidal topology) */
    wrapEdges?: boolean;
}

/** Result of the WFC generation */
export interface WFCResult {
    /** Whether generation succeeded */
    success: boolean;
    /** The resulting grid (tile IDs or null for failed cells) */
    grid: (string | null)[][];
    /** Number of iterations taken */
    iterations: number;
    /** Error message if failed */
    error?: string;
}

/** Event types for WFC progress callbacks */
export type WFCEventType = 'collapse' | 'propagate' | 'backtrack' | 'complete' | 'error';

/** Event data for WFC progress callbacks */
export interface WFCEvent {
    type: WFCEventType;
    x?: number;
    y?: number;
    tileId?: string;
    iteration?: number;
    entropy?: number;
}

/** Callback for WFC progress updates */
export type WFCProgressCallback = (event: WFCEvent) => void;
