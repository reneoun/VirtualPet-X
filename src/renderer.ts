/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

const pngFiles = [
  "black_0.png",
  "black_1.png",
  "black_2.png",
  "black_3.png",
  "black_4.png",
  "blue_0.png",
  "blue_1.png",
  "blue_2.png",
  "blue_3.png",
  "brown_0.png",
  "brown_1.png",
  "brown_2.png",
  "brown_3.png",
  "brown_4.png",
  "brown_5.png",
  "brown_6.png",
  "brown_7.png",
  "brown_8.png",
  "calico_0.png",
  "cotton_candy_blue_0.png",
  "cotton_candy_pink_0.png",
  "creme_0.png",
  "creme_1.png",
  "dark_0.png",
  "game_boy_0.png",
  "game_boy_1.png",
  "game_boy_2.png",
  "ghost_0.png",
  "gold_0.png",
  "grey_0.png",
  "grey_1.png",
  "grey_2.png",
  "hairless_0.png",
  "hairless_1.png",
  "icon2.png",
  "indigo_0.png",
  "orange_0.png",
  "orange_1.png",
  "orange_2.png",
  "orange_3.png",
  "peach_0.png",
  "pink_0.png",
  "radioactive_0.png",
  "red_0.png",
  "red_1.png",
  "seal_point_0.png",
  "teal_0.png",
  "white_0.png",
  "white_grey_0.png",
  "white_grey_1.png",
  "yellow_0.png"
];


// console.log('👋 This message is being logged by "renderer.ts", included via Vite');
window.addEventListener('DOMContentLoaded', () => {
  let globalState: NodeJS.Timeout | null = null;
  let globalStateString: string = "";

  const canvasCat = document.getElementById('cat') as HTMLCanvasElement;
  const submitButton = document.getElementById('submit') as HTMLButtonElement;
  const optionsList = document.getElementById('options-list') as HTMLUListElement;
  const ctx = canvasCat.getContext('2d');
  const cat = new Image();
  cat.src = './assets/black_4.png';
  const bodyElement = document.querySelector('body');

  const textInputContainer = document.querySelector("div#cmd-input");
  const textInput = document.querySelector("input#cmd") as HTMLInputElement;

  submitButton.addEventListener('click', () => {
    let inputValue = textInput.value;
    (window as any).electronAPI.sendData(inputValue);
  });

  canvasCat.addEventListener('click', () => { 
    showSpeechBubble(canvasCat, globalStateString);
  });

  textInput.addEventListener('input', () => { 
    let inputValue:string = textInput.value;
    if (inputValue.toLowerCase().startsWith('animal')) {
      for (let pngFile of pngFiles) {
        let optionEl = document.createElement('option');
        optionEl.value = "animal " + pngFile.replace('.png', '');
        optionsList.appendChild(optionEl);
      }
    } else {
      optionsList.innerHTML = '';
    }
  });

  textInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
      let inputValue = textInput.value;
      if (inputValue.toLowerCase().startsWith('animal')) {
        let animal = inputValue.split(' ')[1];
        cat.src = `./assets/${animal}.png`;
        optionsList.innerHTML = '';
        textInput.value = '';
        return;
      }

      (window as any).electronAPI.sendData(inputValue);
    }
  });

  (window as any).electron.onMenuNav((customData:any) => {
    if (customData === 'shortcut') bodyElement.classList.toggle('overlay');
    if (customData === 'shortcut-escape') bodyElement.classList.remove('overlay');

    textInputContainer.removeAttribute('hidden');
    textInput.focus();

    if (!bodyElement.classList.contains('overlay')) {
      textInputContainer.setAttribute('hidden', null);
    }
  });

  const getAnimationPart = (x: number = 0, y: number = 0) => {
    const upperAnimationIMGBound = -33;
    const animationStep = -32;
    const sourceX = x * animationStep;
    const sourceY = upperAnimationIMGBound + y * animationStep;
    return [sourceX, sourceY];
  };

  const runAnimation = (startX:number=0, startY:number=0, steps:number=7, state:string="") => {
    let step = 0;
    let bodyElement = document.querySelector('body');
    const screenStep = '5px';
    const animationId = setInterval(() => {
      let tmpX = startX + step % 4;
      let tmpY = startY + Math.floor(step / 4);
      const [sourceX, sourceY] = getAnimationPart(tmpX, tmpY);
      ctx.clearRect(0, 0, canvasCat.width, canvasCat.height);
      ctx.drawImage(cat, sourceX, sourceY, cat.width, cat.height);
      step++;
      if (step === steps) {
        step = 0;
      }

      if (state === "walk-right") {
        canvasCat.style.left = !!canvasCat.style.left ? `calc(${canvasCat.style.left} + ${screenStep})` : `100px`;
        if (canvasCat.offsetLeft + 200 > bodyElement.clientWidth) {
          animationState("walk-left");
        }
      }
      if (state === "walk-left") {
        canvasCat.style.left = !!canvasCat.style.left ? `calc(${canvasCat.style.left} - ${screenStep})` : `100px`;
        if (canvasCat.offsetLeft < 0) {
          animationState("walk-right");
        }
      }

      const timeNow = new Date();
      // When it's 12:00:00, show the speech bubble
      if (timeNow.getHours() <= 23 && (timeNow.getMinutes() <= 2 || timeNow.getMinutes() >= 59)) {
        showSpeechBubble(canvasCat, globalStateString, "./assets/pixel-speech-bubble [WORK OUT TIME !!].gif");
      }
    }, 150);

    return animationId;
  };

  const animationState = (state: string) => { 
    globalStateString = state;
    if (globalState) {
      clearInterval(globalState);
    }
    switch (state) {
      case "walk-right":
        globalState = runAnimation(12, 12, 4, "walk-right");
        break;
      case "walk-left":
        globalState = runAnimation(12, 4, 4, "walk-left");
        break;
      default:
        globalState = runAnimation();
        break;
    }
  };


  ctx.scale(4, 4);
  ctx.imageSmoothingEnabled = false;
  cat.onload = () => {
    animationState("walk-right");
  };
});

function showSpeechBubble(canvasCat: HTMLCanvasElement, globalStateString: string, src: string = "./assets/pixel-speech-bubble [Meoww !].gif") {
  const imageElement = document.createElement('img');
  imageElement.src = src;
  imageElement.style.position = 'absolute';
  let posCanvas = canvasCat.getBoundingClientRect();
  imageElement.style.top = `${posCanvas.top - 150}px`;
  imageElement.style.left = `${posCanvas.left + 50}px`;
  const imageMove = setInterval(() => {
    imageElement.remove();
    let step = globalStateString === "walk-right" ? 5 : -5;
    imageElement.style.left = `${parseInt(imageElement.style.left) + step}px`;
    document.body.appendChild(imageElement);
  }, 150);

  setTimeout(() => {
    clearInterval(imageMove);
    imageElement.remove();
  }, 3000);
}
