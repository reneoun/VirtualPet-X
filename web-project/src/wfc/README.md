# Wave Function Collapse (WFC) Module

A modular implementation of the Wave Function Collapse algorithm for procedural tile-based map generation.

## Overview

This module provides a flexible WFC implementation that can be used with any tileset. It uses socket-based adjacency rules to determine which tiles can be placed next to each other.

## Structure

```
wfc/
├── index.ts           # Main entry point, exports all modules
├── types.ts           # TypeScript type definitions
├── TileRegistry.ts    # Manages tiles and adjacency rules
├── WFCGrid.ts         # 2D grid management for the algorithm
├── WFCSolver.ts       # Core WFC algorithm implementation
├── WFCRenderer.ts     # Canvas rendering utilities
├── demo.ts            # Demo/test implementation
└── tilesets/
    └── natureTileset.ts   # Example tileset definitions
```

## Quick Start

```typescript
import { WFCSolver, WFCRenderer, WFCConfig } from './wfc';
import { simpleNatureTiles, NATURE_TILE_SIZE } from './wfc/tilesets/natureTileset';

// Configure the WFC
const config: WFCConfig = {
  width: 20,
  height: 15,
  tileSize: NATURE_TILE_SIZE,
  tiles: simpleNatureTiles,
  seed: 12345, // Optional: for reproducible results
};

// Create solver
const solver = new WFCSolver(config);

// Run the algorithm
const result = solver.solve();

if (result.success) {
  // Create renderer
  const renderer = new WFCRenderer({
    tilesetSrc: 'assets/tileset_nature.png',
    tileSize: NATURE_TILE_SIZE,
    scale: 1,
    registry: solver.getRegistry()
  });

  // Wait for tileset to load, then render
  await renderer.waitForLoad();
  renderer.renderToCanvas(canvas, result);
}
```

## Using the Demo

```typescript
import { WFCDemo } from './wfc/demo';

// Create and run demo
const demo = new WFCDemo({
  container: '#walking-pet-container',
  tilesetPath: 'assets/tileset_nature.png',
  scale: 1,
  animationDelay: 0, // Set > 0 for animated generation
});

await demo.initialize();
await demo.generate();

// Regenerate with new seed
await demo.regenerate(54321);
```

## Core Concepts

### Tiles

Each tile is defined with:
- `id`: Unique identifier
- `position`: Location in tileset image (x, y in tile units)
- `weight`: Probability weight (higher = more likely to be selected)
- `sockets`: Edge identifiers for adjacency matching

### Sockets

Sockets define what can connect to each edge. Two tiles can be adjacent if their connecting sockets match:
- Tile A's `right` socket matches Tile B's `left` socket → they can be horizontal neighbors

```typescript
const tile: TileDefinition = {
  id: 'grass',
  position: { x: 0, y: 0 },
  weight: 10,
  sockets: {
    up: 'grass',
    down: 'grass',
    left: 'grass',
    right: 'grass'
  }
};
```

### Progress Callbacks

Monitor the generation process:

```typescript
const solver = new WFCSolver(config, (event) => {
  switch (event.type) {
    case 'collapse':
      console.log(`Collapsed (${event.x}, ${event.y}) to ${event.tileId}`);
      break;
    case 'propagate':
      console.log(`Propagated, entropy: ${event.entropy}`);
      break;
    case 'backtrack':
      console.log('Contradiction detected, restarting...');
      break;
    case 'complete':
      console.log(`Done in ${event.iteration} iterations`);
      break;
  }
});
```

## Creating Custom Tilesets

1. Create a tileset image with consistent tile sizes
2. Define tiles with socket rules:

```typescript
import { TileDefinition } from '../types';

export const myTiles: TileDefinition[] = [
  {
    id: 'floor',
    position: { x: 0, y: 0 },
    weight: 10,
    sockets: { up: 'f', down: 'f', left: 'f', right: 'f' }
  },
  {
    id: 'wall_top',
    position: { x: 1, y: 0 },
    weight: 2,
    sockets: { up: 'e', down: 'f', left: 'wt', right: 'wt' }
  },
  // ... more tiles
];
```

3. Use symmetric socket names for tiles that connect identically in all directions
4. Use asymmetric socket names for directional tiles (walls, edges, etc.)

## Integration with Existing Grid

To integrate with the existing pet container:

```typescript
// In main.ts
import { WFCDemo } from './wfc/demo';

// After initializing the container
const wfcDemo = new WFCDemo({
  container: document.getElementById('walking-pet-container')!,
  tilesetPath: 'assets/tileset_nature.png',
  scale: 1
});

await wfcDemo.initialize();
await wfcDemo.generate();

// The WFC canvas will be added to the container
// The pet canvas can be positioned on top of it
```

## API Reference

### WFCSolver

- `constructor(config: WFCConfig, progressCallback?: WFCProgressCallback)`
- `solve(): WFCResult` - Run synchronously
- `solveAsync(delayMs: number): Promise<WFCResult>` - Run with delay for visualization
- `preCollapse(x, y, tileId): boolean` - Pre-set a cell before solving
- `reset(): void` - Reset to initial state
- `getGrid(): WFCGrid` - Get the grid instance
- `getRegistry(): TileRegistry` - Get the tile registry

### WFCRenderer

- `constructor(config: WFCRendererConfig)`
- `waitForLoad(): Promise<void>` - Wait for tileset image
- `renderTile(ctx, tileId, x, y): void` - Render single tile
- `renderGrid(ctx, result, offsetX?, offsetY?): void` - Render full grid
- `renderToCanvas(canvas, result): void` - Render to existing canvas
- `renderToNewCanvas(result): HTMLCanvasElement` - Create and render to new canvas

### TileRegistry

- `constructor(tiles: TileDefinition[])`
- `registerTile(tile): void` - Add a tile
- `getTile(id): TileDefinition | undefined`
- `getCompatibleTiles(tileId, direction): Set<string>`
- `calculateEntropy(possibleTiles): number`
- `selectWeightedRandom(possibleTiles, randomFn): string`
