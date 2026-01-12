import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="walking-pet-container">
    <canvas id="petCanvas" width="96" height="96"></canvas>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('petCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const virtualPet = new VirtualPet('assets/png_pets/black_4.png', ctx);
  virtualPet.setPetState({ action: 'running_fast', direction: 'right', randomActions: true });
});

type FrameProgress = {
  currentFrame: number;
  totalFrames: number;
  intervalId?: number;
  frameLocked?: Date;
  revertCycle: number;
};
type PetState = {
  action: ACTION;
  direction: Direction;
  randomActions?: boolean;
}
type ACTION = 'walking' | 'running' | 'running_fast' | 'sitting' | 'looking_around' | 'laying_down';
type Direction = 'down' | 'left' | 'right' | 'up' | 'down-left' | 'down-right' | 'up-left' | 'up-right';
type FrameProperties = {
  startingFrameX: number;
  totalFrames: number;
  msInterval: number;
  possibleActions?: ACTION[];
  singleCycle?: boolean;
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
      startingFrameX: 12,
      totalFrames: 4,
      msInterval: 300,
      possibleActions: ['walking', 'walking', 'running', 'sitting', 'sitting', 'sitting']
    },
    running: {
      startingFrameX: 16,
      totalFrames: 5,
      msInterval: 150,
      possibleActions: ['walking', 'running_fast']
    },
    running_fast: {
      startingFrameX: 20,
      totalFrames: 8,
      msInterval: 120,
      possibleActions: ['running']
    },
    sitting: {
      startingFrameX: 0,
      totalFrames: 6,
      msInterval: 320,
      possibleActions: ['sitting','looking_around', 'laying_down', 'walking'],
      actionsBeforeReverse: ['sitting','looking_around', 'laying_down'],
      actionsAfterReverse: ['walking'],
      singleCycle: true,
      lockLastFrame: { minMs: 1000, maxMs: 4000 }
    },
    looking_around: {
      startingFrameX: 4,
      totalFrames: 5,
      msInterval: 320,
      possibleActions: ['sitting']
    },
    laying_down: {
      startingFrameX: 8,
      totalFrames: 8,
      msInterval: 320,
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
  private frameProgress: FrameProgress = { currentFrame: 0, totalFrames: 4, revertCycle: 0 };
  private petState: PetState = { action: 'walking', direction: 'down' };
  private randomIntervalId?: number;

  constructor(image_src: string, ctx: CanvasRenderingContext2D) {
    this.image_src = image_src;
    this.petImage = new Image();
    this.petImage.src = this.image_src;
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

    if (this.petState.randomActions && !this.randomIntervalId) {
      this.randomIntervalId = setInterval(() => {
        if (this.frameProgress.frameLocked || this.frameProgress.revertCycle > 0) return; // Do not change action if frame is locked
        const possibleActions = FrameLocationState.ACTIONS[this.petState.action].possibleActions || [];
        const randomIndex = Math.floor(Math.random() * possibleActions.length);
        this.petState.action = possibleActions[randomIndex];
        console.log(`Randomly changed action to: ${this.petState.action}`);
      }, 5000);
    }

    this.frameProgress.intervalId = setInterval(() => {
      let { currentFrame, totalWalkingFrames } = this.retrieveWalkingAnimationFrames();
      // console.log('current:', currentFrame, totalWalkingFrames);
      
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
        }
        
        this.petState = newPossibleState;
        console.log(`Action ${this.petState.action} completed its cycle. Changing to ${newPossibleState.action}`);
      }
      
      // Line of Setting the Next frame
      if (this.frameProgress.revertCycle > 0) {
        console.log("revertCycle:", this.frameProgress.revertCycle);
        this.frameProgress.currentFrame = (currentFrame - 1) % totalWalkingFrames;
        if (this.frameProgress.currentFrame == 0) {
          const possibleActionsAfterReverse = FrameLocationState.ACTIONS[this.petState.action].actionsAfterReverse || [];
          if (possibleActionsAfterReverse.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleActionsAfterReverse.length);
            this.petState.action = possibleActionsAfterReverse[randomIndex];
            this.frameProgress.currentFrame = FrameLocationState.ACTIONS[this.petState.action].totalFrames - 1;
            console.log(`Reversal complete. Changing action to: ${this.petState.action}`);
          }
        }
        this.frameProgress.revertCycle--;
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
    }, FrameLocationState.ACTIONS[this.petState.action].msInterval);
  }


  private retrieveWalkingAnimationFrames() {
    const currentFrame = this.frameProgress.currentFrame;
    let directionY = FrameLocationState.DIRECTIONS[this.petState.direction];
    if (currentFrame >= 4) directionY += 1; // Move to next row for walking animation
    const startFrame = FrameLocationState.ACTIONS[this.petState.action].startingFrameX;
    const totalWalkingFrames = FrameLocationState.ACTIONS[this.petState.action].totalFrames;
    this.drawFrame(startFrame + (currentFrame % 4), directionY);
    return { currentFrame, totalWalkingFrames };
  }

  hitBoundary(): Direction | null {
    const canvas = this.ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const speeds = FrameLocationState.SPEEDS[this.petState.action][this.petState.direction];
    const xSpeed = speeds.x;
    const ySpeed = speeds.y;

    const newLeft = rect.left + xSpeed;
    const newTop = rect.top + ySpeed;
    const newRight = newLeft + rect.width;
    const newBottom = newTop + rect.height;

    const parentRect = canvas.parentElement?.getBoundingClientRect();
    const parentLeft = parentRect ? parentRect.left : 0;
    const parentTop = parentRect ? parentRect.top : 0;
    const parentRight = parentRect ? parentRect.right : window.innerWidth;
    const parentBottom = parentRect ? parentRect.bottom : window.innerHeight;

    const hitHorizontal = newLeft < parentLeft ? 'left' :
                          newRight > parentRight ? 'right' : null;
    const hitVertical = newTop < parentTop ? 'up' :
                        newBottom > parentBottom ? 'down' : null;

    let hitDirection: Direction | null = hitVertical;
    if (hitHorizontal) {
      if (hitDirection) {
        hitDirection += '-'+hitHorizontal;
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

    // Move canvas position
    const canvas = this.ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    canvas.style.position = 'absolute';
    canvas.style.left = `${rect.left + xSpeed}px`;
    canvas.style.top = `${rect.top + ySpeed}px`;
    
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