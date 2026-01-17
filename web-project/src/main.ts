import './style.css'
import { createTerrain, TerrainManager } from './TerrainManager';

const TILE_SIZE = 16;
const TILE_SCALE = 3;
const CELL_SIZE = TILE_SIZE * TILE_SCALE; // 48px rendered tiles
let terrainManager: TerrainManager | null = null;

function calculateGridSize() {
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;

  const columns = Math.floor(maxWidth / CELL_SIZE);
  const rows = Math.floor(maxHeight / CELL_SIZE);

  return {
    columns,
    rows,
    width: columns * CELL_SIZE,
    height: rows * CELL_SIZE
  };
}

function initContainer() {
  const grid = calculateGridSize();
  const container = document.getElementById('walking-pet-container') as HTMLDivElement;

  container.style.width = `${grid.width}px`;
  container.style.height = `${grid.height}px`;
  container.style.gridTemplateColumns = `repeat(${grid.columns}, ${CELL_SIZE}px)`;
  container.style.gridTemplateRows = `repeat(${grid.rows}, ${CELL_SIZE}px)`;

  const canvas = document.getElementById('petCanvas') as HTMLCanvasElement;
  if (canvas) {
    const currentLeft = parseFloat(canvas.style.left) || 0;
    const currentTop = parseFloat(canvas.style.top) || 0;
    const maxLeft = grid.width - canvas.width;
    const maxTop = grid.height - canvas.height;

    canvas.style.left = `${Math.max(0, Math.min(currentLeft, maxLeft))}px`;
    canvas.style.top = `${Math.max(0, Math.min(currentTop, maxTop))}px`;
  }
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="walking-pet-container">
  </div>
`;

initContainer();
window.addEventListener('resize', () => {
  initContainer();
  // Regenerate terrain on resize
  terrainManager?.handleResize();
});

// Initialize terrain and pet
async function initApp() {
  const container = document.getElementById('walking-pet-container') as HTMLDivElement;

  // Initialize terrain (modular - can be removed/swapped easily)
  // Scale matches TILE_SCALE for consistent sizing (16px tiles → 48px rendered)
  terrainManager = await createTerrain({
    container,
    tilesetPath: 'assets/tileset_nature.png',
    scale: TILE_SCALE,
    onComplete: (result) => {
      console.log(`Terrain generated: ${result.success ? 'success' : 'failed'} in ${result.iterations} iterations`);
    }
  });

  // Initialize pets
  const virtualPet = new VirtualPet('assets/png_pets/black_4.png', container);
  const virtualPet2 = new VirtualPet('assets/png_pets/black_2.png', container);
  const virtualPet3 = new VirtualPet('assets/png_pets/orange_0.png', container);
  virtualPet.setPetState({ action: 'running_fast', direction: 'right', randomActions: true });
  virtualPet2.setPetState({ action: 'walking', direction: 'down-right', randomActions: true });
  virtualPet3.setPetState({ action: 'looking_around', direction: 'down-right', randomActions: true });
}

initApp();

type FrameProgress = {
  currentFrame: number;
  totalFrames: number;
  intervalId?: number;
  frameLocked?: Date;
  revertCycle: number;
  currentMs: number;
};
type PetState = {
  action: ACTION;
  direction: Direction;
  randomActions?: boolean;
}
type ACTION = 'walking' | 'running' | 'running_fast' | 'sitting' | 'looking_around' | 'laying_down';
type Direction = 'down' | 'left' | 'right' | 'up' | 'down-left' | 'down-right' | 'up-left' | 'up-right';
type FrameProperties = {
  startingFrameSourceX: number;
  startingFrame?: number;
  totalFrames: number;
  msInterval: number;
  possibleActions?: ACTION[];
  singleCycle?: boolean;
  reverseCycle?: boolean;
  lockLastFrame?: {
    minMs?: number;
    maxMs?: number;
  };
  actionsBeforeReverse?: ACTION[];
  actionsAfterReverse?: ACTION[];
};

class FrameLocationState {
  public static DIRECTIONS: Record<Direction, number> = {
    'down': 0,
    'down-left': 2,
    'left': 4,
    'up-left': 6,
    'up': 8,
    'up-right': 10,
    'right': 12,
    'down-right': 14
  };

  public static ACTIONS: Record<ACTION, FrameProperties> = {
    walking: {
      startingFrameSourceX: 12,
      totalFrames: 4,
      msInterval: 140,
      possibleActions: ['walking', 'walking', 'running', 'sitting', 'sitting', 'sitting']
    },
    running: {
      startingFrameSourceX: 16,
      totalFrames: 5,
      msInterval: 120,
      possibleActions: ['walking', 'running_fast']
    },
    running_fast: {
      startingFrameSourceX: 20,
      totalFrames: 8,
      msInterval: 80,
      possibleActions: ['running']
    },
    sitting: {
      startingFrameSourceX: 0,
      totalFrames: 6,
      msInterval: 320,
      possibleActions: ['sitting', 'looking_around', 'laying_down', 'walking'],
      actionsBeforeReverse: ['sitting', 'looking_around', 'laying_down'],
      actionsAfterReverse: ['walking'],
      singleCycle: true,
    },
    looking_around: {
      startingFrameSourceX: 4,
      startingFrame: 2,
      totalFrames: 5,
      msInterval: 220,
      possibleActions: ['sitting', 'looking_around', 'laying_down'],
      reverseCycle: true,
    },
    laying_down: {
      startingFrameSourceX: 8,
      totalFrames: 8,
      msInterval: 220,
      possibleActions: ['sitting'],
      actionsBeforeReverse: ['laying_down'],
      actionsAfterReverse: ['sitting'],
      singleCycle: true,
      lockLastFrame: { minMs: 3000, maxMs: 4000 }
    }
  };

  public static SPEEDS: Record<ACTION, Record<Direction, { x: number; y: number }>> = {
    walking: {
      'down': { x: 0, y: 3 },
      'down-left': { x: -2, y: 2 },
      'left': { x: -3, y: 0 },
      'up-left': { x: -2, y: -2 },
      'up': { x: 0, y: -3 },
      'up-right': { x: 2, y: -2 },
      'right': { x: 3, y: 0 },
      'down-right': { x: 2, y: 2 }
    },
    running: {
      'down': { x: 0, y: 6 },
      'down-left': { x: -4, y: 4 },
      'left': { x: -6, y: 0 },
      'up-left': { x: -4, y: -4 },
      'up': { x: 0, y: -6 },
      'up-right': { x: 4, y: -4 },
      'right': { x: 6, y: 0 },
      'down-right': { x: 4, y: 4 }
    },
    running_fast: {
      'down': { x: 0, y: 9 },
      'down-left': { x: -6, y: 6 },
      'left': { x: -9, y: 0 },
      'up-left': { x: -6, y: -6 },
      'up': { x: 0, y: -9 },
      'up-right': { x: 6, y: -6 },
      'right': { x: 9, y: 0 },
      'down-right': { x: 6, y: 6 }
    },
    sitting: {
      'down': { x: 0, y: 0 },
      'down-left': { x: 0, y: 0 },
      'left': { x: 0, y: 0 },
      'up-left': { x: 0, y: 0 },
      'up': { x: 0, y: 0 },
      'up-right': { x: 0, y: 0 },
      'right': { x: 0, y: 0 },
      'down-right': { x: 0, y: 0 }
    },
    looking_around: {
      'down': { x: 0, y: 0 },
      'down-left': { x: 0, y: 0 },
      'left': { x: 0, y: 0 },
      'up-left': { x: 0, y: 0 },
      'up': { x: 0, y: 0 },
      'up-right': { x: 0, y: 0 },
      'right': { x: 0, y: 0 },
      'down-right': { x: 0, y: 0 }
    },
    laying_down: {
      'down': { x: 0, y: 0 },
      'down-left': { x: 0, y: 0 },
      'left': { x: 0, y: 0 },
      'up-left': { x: 0, y: 0 },
      'up': { x: 0, y: 0 },
      'up-right': { x: 0, y: 0 },
      'right': { x: 0, y: 0 },
      'down-right': { x: 0, y: 0 }
    }
  };

  public static POSSIBLE_DIRECTIONS_WHEN_BOUNDARY_HIT: Record<Direction, Direction[]> = {
    'down': ['up', 'up-left', 'up-right', 'left', 'right'],
    'down-left': ['up-right', 'up', 'right'],
    'left': ['right', 'up-right', 'down-right', 'up', 'down'],
    'up-left': ['down-right', 'down', 'right'],
    'up': ['down', 'down-left', 'down-right', 'left', 'right'],
    'up-right': ['down-left', 'down', 'left'],
    'right': ['left', 'up-left', 'down-left', 'up', 'down'],
    'down-right': ['up-left', 'up', 'left']
  };
}

class VirtualPet {
  private image_src: string;
  private petImage: HTMLImageElement;
  private ctx: CanvasRenderingContext2D;
  private frameProgress: FrameProgress = { currentFrame: 0, totalFrames: 4, revertCycle: 0, currentMs: 0 };
  private petState: PetState = { action: 'walking', direction: 'down' };
  private randomDuration: number = 0;

  constructor(image_src: string, container: HTMLDivElement) {
    this.image_src = image_src;
    this.petImage = new Image();
    this.petImage.src = this.image_src;
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    canvas.id = 'petCanvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;
    this.drawFrame();
  }

  setPetState(newState: Partial<PetState>) {
    this.petState = {
      ...this.petState,
      ...newState
    };

    if (this.frameProgress.intervalId) {
      clearInterval(this.frameProgress.intervalId);
    }

    //  // Start Random Action Changes outside of main interval
    // if (this.petState.randomActions && !this.randomIntervalId) {
    //   this.randomIntervalId = setInterval(() => {
    //     if (this.frameProgress.frameLocked || this.frameProgress.revertCycle > 0) return; // Do not change action if frame is locked
    //     const possibleActions = FrameLocationState.ACTIONS[this.petState.action].possibleActions || [];
    //     const randomIndex = Math.floor(Math.random() * possibleActions.length);
    //     this.petState.action = possibleActions[randomIndex];
    //     console.log(`Randomly changed action to: ${this.petState.action}`);
    //   }, 5000);
    // }

    this.frameProgress.intervalId = setInterval(() => {
      // Check if we've reached the action's msInterval before advancing frame
      if (this.frameProgress.currentMs < FrameLocationState.ACTIONS[this.petState.action].msInterval) {
        this.frameProgress.currentMs += 20;
        return;
      }
      this.frameProgress.currentMs = 0;

      let { currentFrame, totalWalkingFrames } = this.retrieveWalkingAnimationFrames();
      // console.log('current:', currentFrame, totalWalkingFrames);

      if (this.petState.randomActions && this.randomDuration < Date.now()) {
        const duration = Math.floor(Math.random() * 3000) + 2000; // Random duration between 2-5 seconds
        this.randomDuration = new Date(Date.now() + duration).getTime();
        console.log(`Next random action change in ${duration} ms`);

        const possibleActions = FrameLocationState.ACTIONS[this.petState.action].actionsBeforeReverse
          || FrameLocationState.ACTIONS[this.petState.action].possibleActions || [];
        const randomIndex = Math.floor(Math.random() * possibleActions.length);
        const newPossibleState = { ...this.petState };
        newPossibleState.action = possibleActions[randomIndex];

        if (FrameLocationState.ACTIONS[newPossibleState.action].actionsBeforeReverse &&
          FrameLocationState.ACTIONS[newPossibleState.action].actionsBeforeReverse!.includes(this.petState.action)) {
          const newAction = possibleActions[randomIndex];
          this.frameProgress.revertCycle = FrameLocationState.ACTIONS[newAction].totalFrames;
          currentFrame = FrameLocationState.ACTIONS[newAction].totalFrames;
          totalWalkingFrames = FrameLocationState.ACTIONS[newAction].totalFrames;
          console.log(`Reversing animation for action: ${this.petState.action}`);
        }

        this.petState = newPossibleState;
        console.log(`Randomly changed action to: ${this.petState.action}`);
      }

      if (FrameLocationState.ACTIONS[this.petState.action].singleCycle && currentFrame + 1 >= totalWalkingFrames && this.frameProgress.revertCycle === 0) {
        if (FrameLocationState.ACTIONS[this.petState.action].lockLastFrame && !this.frameProgress.frameLocked) {
          const lockConfig = FrameLocationState.ACTIONS[this.petState.action].lockLastFrame!;
          const minMs = lockConfig.minMs || 1000;
          const maxMs = lockConfig.maxMs || 3000;
          const lockDuration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
          console.log(`Locking last frame for ${lockDuration} ms`);
          this.frameProgress.frameLocked = new Date(Date.now() + lockDuration);
        }

        if (this.frameProgress.frameLocked) {
          if (new Date() < this.frameProgress.frameLocked) {
            return; // Still locked, do not proceed
          } else {
            this.frameProgress.frameLocked = undefined; // Unlock
          }
        }

        const possibleActions = FrameLocationState.ACTIONS[this.petState.action].actionsBeforeReverse
          || FrameLocationState.ACTIONS[this.petState.action].possibleActions || [];
        const randomIndex = Math.floor(Math.random() * possibleActions.length);
        const newPossibleState = { ...this.petState };
        newPossibleState.action = possibleActions[randomIndex];

        if (FrameLocationState.ACTIONS[newPossibleState.action].actionsBeforeReverse &&
          FrameLocationState.ACTIONS[newPossibleState.action].actionsBeforeReverse!.includes(this.petState.action)) {
          const newAction = possibleActions[randomIndex];
          this.frameProgress.revertCycle = FrameLocationState.ACTIONS[newAction].totalFrames;
          currentFrame = FrameLocationState.ACTIONS[newAction].totalFrames;
          totalWalkingFrames = FrameLocationState.ACTIONS[newAction].totalFrames;
          console.log(`Reversing animation for action: ${this.petState.action}`);
        } else {
          this.frameProgress.revertCycle = 0;
          if (this.petState.action !== newPossibleState.action) currentFrame = (FrameLocationState.ACTIONS[this.petState.action].startingFrame ?? 0) - 1;
        }

        this.petState = newPossibleState;
        this.setRandomDuration(2500, 5000);
        console.log(`Action ${this.petState.action} completed its cycle. Changing to ${newPossibleState.action}`);
      }


      // Line of Setting the Next frame
      if (this.frameProgress.revertCycle > 0) {
        this.frameProgress.currentFrame = (currentFrame - 1) % totalWalkingFrames;
        if (this.frameProgress.currentFrame == 0) {
          this.handleActionAfterReverseCompletion();
        }
        this.frameProgress.revertCycle--;
        if (FrameLocationState.ACTIONS[this.petState.action].reverseCycle == false) {
          this.frameProgress.revertCycle = 0;
        }
      } else {
        this.frameProgress.currentFrame = (currentFrame + 1) % totalWalkingFrames;
      }


      this.movePet();
      const collisionDirection = this.hitBoundary();
      if (collisionDirection) {
        console.log(`Hit boundary at direction: ${collisionDirection}, changing direction`);
        const possibleDirections = FrameLocationState.POSSIBLE_DIRECTIONS_WHEN_BOUNDARY_HIT[collisionDirection];
        const randomIndex = Math.floor(Math.random() * possibleDirections.length);
        this.petState.direction = possibleDirections[randomIndex];
      }
      // Apparantly interval will not change.. even if msInterval is changed dynamically
    }, 20);
  }

  private setRandomDuration(minMs: number, maxMs: number) {
    const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    this.randomDuration = new Date(Date.now() + duration).getTime();
    console.log(`Next random action change in ${duration} ms`);
  }

  private handleActionAfterReverseCompletion() {
    const possibleActionsAfterReverse = FrameLocationState.ACTIONS[this.petState.action].actionsAfterReverse || [];
    if (possibleActionsAfterReverse.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleActionsAfterReverse.length);
      this.petState.action = possibleActionsAfterReverse[randomIndex];
      this.frameProgress.currentFrame = FrameLocationState.ACTIONS[this.petState.action].startingFrame
        ?? (FrameLocationState.ACTIONS[this.petState.action].totalFrames - 1);
    }
  }

  private retrieveWalkingAnimationFrames() {
    let currentFrame = this.frameProgress.currentFrame;
    let directionY = FrameLocationState.DIRECTIONS[this.petState.direction];
    if (currentFrame >= 4) directionY += 1; // Move to next row for walking animation
    const startFrame = FrameLocationState.ACTIONS[this.petState.action].startingFrameSourceX;
    const totalWalkingFrames = FrameLocationState.ACTIONS[this.petState.action].totalFrames;
    if (currentFrame >= totalWalkingFrames) {
      currentFrame = 0;
    }
    this.drawFrame(startFrame + (currentFrame % 4), directionY);
    return { currentFrame, totalWalkingFrames };
  }

  hitBoundary(): Direction | null {
    const canvas = this.ctx.canvas;
    const speeds = FrameLocationState.SPEEDS[this.petState.action][this.petState.direction];
    const xSpeed = speeds.x;
    const ySpeed = speeds.y;

    const currentLeft = parseFloat(canvas.style.left) || 0;
    const currentTop = parseFloat(canvas.style.top) || 0;
    const newLeft = currentLeft + xSpeed;
    const newTop = currentTop + ySpeed;
    const newRight = newLeft + canvas.width;
    const newBottom = newTop + canvas.height;

    const parent = canvas.parentElement;
    const parentWidth = parent ? parent.clientWidth : window.innerWidth;
    const parentHeight = parent ? parent.clientHeight : window.innerHeight;

    const hitHorizontal = newLeft < 0 ? 'left' :
      newRight > parentWidth ? 'right' : null;
    const hitVertical = newTop < 0 ? 'up' :
      newBottom > parentHeight ? 'down' : null;

    let hitDirection: Direction | null = hitVertical;
    if (hitHorizontal) {
      if (hitDirection) {
        hitDirection += '-' + hitHorizontal;
      } else {
        hitDirection = hitHorizontal;
      }
    }

    return hitDirection as Direction | null;
  }

  movePet() {
    // console.log(`State: ${this.petState.action} & Direction: ${this.petState.direction}`);
    const speeds = FrameLocationState.SPEEDS[this.petState.action][this.petState.direction];
    const xSpeed = speeds.x;
    const ySpeed = speeds.y;

    // Move canvas position relative to parent
    const canvas = this.ctx.canvas;
    const currentLeft = parseFloat(canvas.style.left) || 0;
    const currentTop = parseFloat(canvas.style.top) || 0;
    canvas.style.position = 'absolute';
    canvas.style.left = `${currentLeft + xSpeed}px`;
    canvas.style.top = `${currentTop + ySpeed}px`;

  }

  drawFrame(x: number = 0, y: number = 0) {
    const frameX = 32 * x;
    const frameY = 32 + (32 * y);

    this.petImage.onload = () => {
      this.ctx.imageSmoothingEnabled = false; // Disable image smoothing for pixel art
      this.ctx.scale(3, 3); // Scale the context to make the pet larger
    };

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.petImage, frameX, frameY, 32, 32, 0, 0, 32, 32); // Draw the pet image
  }
}