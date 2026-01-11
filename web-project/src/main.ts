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
  virtualPet.setPetState({ action: 'running_fast', direction: 'right' });
});

type FrameProgress = {
  currentFrame: number;
  totalFrames: number;
  intervalId?: number;
};
type PetState = {
  action: ACTIONS | "random";
  direction: Directions;
}
type ACTIONS = 'walking' | 'running' | 'running_fast' | 'sitting' | 'looking_around' | 'laying_down';
type Directions = 'down' | 'left' | 'right' | 'up' | 'down-left' | 'down-right' | 'up-left' | 'up-right';

class FrameLocationState {
  public static DIRECTIONS: Record<Directions, number> = {
    'down': 0,
    'down-left': 2,
    'left': 4,
    'up-left': 6,
    'up': 8,
    'up-right': 10,
    'right': 12,
    'down-right': 14
  };

  public static ACTIONS: Record<ACTIONS, { startingFrameX: number; totalFrames: number; msInterval: number }> = {
    walking: {
      startingFrameX: 12,
      totalFrames: 4,
      msInterval: 300
    },
    running: {
      startingFrameX: 16,
      totalFrames: 5,
      msInterval: 150
    },
    running_fast: {
      startingFrameX: 20,
      totalFrames: 8,
      msInterval: 120
    },
    sitting: {
      startingFrameX: 0,
      totalFrames: 7,
      msInterval: 320
    },
    looking_around: {
      startingFrameX: 4,
      totalFrames: 5,
      msInterval: 420
    },
    laying_down: {
      startingFrameX: 8,
      totalFrames: 8,
      msInterval: 420
    }
  };

  public static SPEEDS: Record<ACTIONS, Record<Directions, { x: number; y: number }>> = {
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

  public static POSSIBLE_DIRECTIONS_WHEN_BOUNDARY_HIT: Record<Directions, Directions[]> = {
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
  private frameProgress: FrameProgress = { currentFrame: 0, totalFrames: 4 };
  private petState: PetState = { action: 'walking', direction: 'down' };

  constructor(image_src: string, ctx: CanvasRenderingContext2D) {
    this.image_src = image_src;
    this.petImage = new Image();
    this.petImage.src = this.image_src;
    this.ctx = ctx;
    this.drawFrame();
  }

  setPetState(newState: PetState) {
    this.petState = newState;

    if (this.frameProgress.intervalId) {
      clearInterval(this.frameProgress.intervalId);
    }
    const action = newState.action as ACTIONS;

    this.frameProgress.intervalId = setInterval(() => {
      const currentFrame = this.frameProgress.currentFrame;
      let directionY = FrameLocationState.DIRECTIONS[newState.direction];
      if (currentFrame >= 4) directionY += 1; // Move to next row for walking animation
      const startFrame = FrameLocationState.ACTIONS[action].startingFrameX;
      const totalWalkingFrames = FrameLocationState.ACTIONS[action].totalFrames;
      this.drawFrame(startFrame + (currentFrame % 4), directionY);
      this.frameProgress.currentFrame = (currentFrame + 1) % totalWalkingFrames;
      
      this.movePet();

      if (this.hitBoundary()) {
        console.log('Hit boundary, changing direction');
        // Simple logic to reverse direction upon hitting boundary
        const possibleDirections = FrameLocationState.POSSIBLE_DIRECTIONS_WHEN_BOUNDARY_HIT[this.petState.direction];
        const randomIndex = Math.floor(Math.random() * possibleDirections.length);
        this.petState.direction = possibleDirections[randomIndex];
      }
    }, FrameLocationState.ACTIONS[action].msInterval);
  }

  hitBoundary(): boolean {
    const canvas = this.ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const speeds = FrameLocationState.SPEEDS[this.petState.action][this.petState.direction];
    const xSpeed = speeds.x;
    const ySpeed = speeds.y;

    const newLeft = rect.left + xSpeed;
    const newTop = rect.top + ySpeed;

    const parentRect = canvas.parentElement?.getBoundingClientRect();

    if (newLeft < 0 || newLeft + rect.width > parentRect!.width ||
        newTop < 0 || newTop + rect.height > parentRect!.height) {
      return true;
    }
    return false;
  }

  movePet() {
    console.log(`State: ${this.petState.action} & Direction: ${this.petState.direction}`);
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