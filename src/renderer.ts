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

// <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
// <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>

import { c, s } from 'vite/dist/node/types.d-aGj9QkWt';
import './index.css';
// import 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css';
// @ts-ignore
// import SimpleMDE from 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js';

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

const pixelSymbols:any = {
  'A': [
    [0,1,1,0],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1]
  ],
  'B': [
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0]
  ],
  'C': [
    [0,1,1,1],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [0,1,1,1]
  ],
  'D': [
    [1,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,0]
  ],
  'E': [
    [1,1,1,1],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [1,1,1,1]
  ],
  'F': [
    [1,1,1,1],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [1,0,0,0]
  ],
  'G': [
    [0,1,1,1],
    [1,0,0,0],
    [1,0,1,1],
    [1,0,0,1],
    [0,1,1,1]
  ],
  'H': [
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1]
  ],
  'I': [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1]
  ],
  'J': [
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  'K': [
    [1,0,0,1],
    [1,0,1,0],
    [1,1,0,0],
    [1,0,1,0],
    [1,0,0,1]
  ],
  'L': [
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,1,1,1]
  ],
  'M': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'N': [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1]
  ],
  'O': [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  'P': [
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0],
    [1,0,0,0],
    [1,0,0,0]
  ],
  'Q': [
    [0,1,1,0,0],
    [1,0,0,1,0],
    [1,0,0,1,0],
    [0,1,1,0,0],
    [0,0,0,1,0]
  ],
  'R': [
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0],
    [1,0,1,0],
    [1,0,0,1]
  ],
  'S': [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,0],
    [0,0,0,1],
    [1,1,1,0]
  ],
  'T': [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0]
  ],
  'U': [
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  'V': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0]
  ],
  'W': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1]
  ], 
  'X': [
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1]
  ],
  'Y': [
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
    [0,1,0,0],
    [0,1,0,0]
  ],
  'Z': [
    [1,1,1,1],
    [0,0,0,1],
    [0,0,1,0],
    [0,1,0,0],
    [1,1,1,1]
  ],
  ' ': [
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0]
  ],
  '.': [
    [0],
    [0],
    [0],
    [0],
    [1]
  ],
  ',': [
    [0],
    [0],
    [0],
    [1],
    [1]
  ],
  '!': [
    [1],
    [1],
    [1],
    [0],
    [1]
  ],
  '?': [
    [1,1,1],
    [0,0,1],
    [0,1,0],
    [0,0,0],
    [0,1,0]
  ],
}

// console.log('👋 This message is being logged by "renderer.ts", included via Vite');
window.addEventListener('DOMContentLoaded', () => {
  let global_StateIntervalID: NodeJS.Timeout | null = null;
  let global_StateString: string = "";
  let global_PrevStateString: string = "";

  const canvasCat = document.getElementById('cat') as HTMLCanvasElement;
  const submitButton = document.getElementById('submit') as HTMLButtonElement;
  const optionsList = document.getElementById('options-list') as HTMLUListElement;
  
  const divCmd = document.getElementById('cmd-input') as HTMLDivElement;
  const textBalloon = document.getElementById('text-balloon') as HTMLCanvasElement;

  let mdPreview = document.getElementById('md-preview') as HTMLDivElement;
  let mdTextAreaPreview = document.getElementById('md-textarea-preview') as HTMLTextAreaElement;
  let mdEdit = document.getElementById('md-edit') as HTMLDivElement;
  let mdTextAreaEditor = document.getElementById('md-editor') as HTMLTextAreaElement;
  
  let simplemde:any = null;

  const ctx = canvasCat.getContext('2d');
  const cat = new Image();
  cat.src = './assets/black_4.png';
  const bodyElement = document.querySelector('body');

  const textInputContainer = document.querySelector("div#cmd-input");
  const textInput = document.querySelector("input#cmd") as HTMLInputElement;

  const makeTextBalloon = (text: string, maxCharLine: number = 16) => {
    const pixelSize = 4;

    textBalloon.style.display = 'block';
    textBalloon.style.backgroundColor = 'white';
    textBalloon.height = 64;
    textBalloon.width = text.length * 5 * pixelSize;
    textBalloon.style.marginBottom = '5px';
    const ctx2 = textBalloon.getContext('2d');

    let positionX = 2;
    let positionY = 2;

    let words = text.split(' ');
    let lines:string[] = [""];
    let wordIndex = 0;
    while (wordIndex < words.length) {
      let currentWord = words[wordIndex];
      let lastLine = lines.at(-1);
      if (lastLine.length + currentWord.length <= maxCharLine) {
        lastLine = lastLine === "" ? currentWord : `${lastLine} ${currentWord}`;
        lines[lines.length - 1] = lastLine;
        wordIndex++;
      } else if (currentWord.length > maxCharLine) {
        lines.push(currentWord);
        wordIndex++;
      } else {
        lines.push("");
      }
    }

    let linesLength = lines.map(line => {
      let lineLength = 0;
      for (let i = 0; i < line.length; i++) {
        let [x,y] = makePixelLetter(line[i], 0, 0, null);
        lineLength += x;
      }
      return lineLength;
    });



    let maxPositionX = 0
    for (let textLine of lines) {
      for (let i = 0; i < textLine.length; i++) {
        let letter = textLine[i];
        [positionX, positionY] = makePixelLetter(letter, positionX, positionY, ctx2);
        positionX += 1;
        if (positionX > maxPositionX) maxPositionX = positionX;
      }
      positionX = 2;
      positionY += 8;
    }

    // textBalloon.width = maxPositionX * pixelSize;
  };

  const makePixelLetter = (letter: string, startX: number, startY: number, ctx3:CanvasRenderingContext2D|null) => {
    let upperLetter = letter.toUpperCase();
    if (Object.keys(pixelSymbols).indexOf(upperLetter) === -1) return [startX, startY];
    const letterMatrix = pixelSymbols[upperLetter];
    const letterSize = letterMatrix[0].length;
    const letterHeight = letterMatrix.length;
    const pixelSize = 4;

    let endX = startX + letterSize + 1;
    let endY = startY;

    if (ctx3 === null) return [endX, endY]

    for (let i = 0; i < letterHeight; i++) {
      for (let j = 0; j < letterSize; j++) {
        if (letterMatrix[i][j] === 1) {
          ctx3.fillStyle = 'black';
          ctx3.fillRect((j + startX) * pixelSize, (i + startY) * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    return [endX, endY];
  }
  makeTextBalloon("Hello World ! Yalla ?!");

  submitButton.addEventListener('click', () => {
    let inputValue = textInput.value;
    (window as any).electronAPI.sendData(inputValue);
  });

  // CLICK ON CAT LISTENER
  canvasCat.addEventListener('click', () => { 
    showSpeechBubble(canvasCat, global_StateString);
  });

  textInput.addEventListener('blur', () => {
    optionsList.style.display = 'none';
  }); // DO NOTHING

  // TEXT INPUT LISTENERS
  textInput.addEventListener('input', () => { 
    let inputValue:string = textInput.value;
    if (inputValue.toLowerCase().startsWith('animal')) {
      let filteredFiles = pngFiles
        .filter((file) => file.includes(inputValue.split(' ')[1]));
      let optionsListValues = Array.from(optionsList.children).map((el:HTMLOptionElement) => el.value);
      for (let pngFile of filteredFiles) {
        if (optionsListValues.includes("animal " + pngFile.replace('.png', ''))) {
          continue;
        }
        let optionEl = document.createElement('option');
        optionEl.value = "animal " + pngFile.replace('.png', '');
        optionEl.classList.add('interactive');
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

    if (e.key === "ArrowLeft") {
      if (!simplemde) simplemde = new SimpleMDE({ 
        element: mdTextAreaPreview,
        initialValue: localStorage.getItem('mdEditorValue') || '',
        toolbar: false,
      });
      mdTextAreaPreview.removeAttribute('hidden');
      mdPreview.removeAttribute('hidden');
      if (!simplemde.isPreviewActive()) {
        simplemde.togglePreview();
      }
    }

    if (e.key === "ArrowRight") {
      if (!simplemde) simplemde = new SimpleMDE({ 
        element: mdTextAreaEditor,
        initialValue: localStorage.getItem('mdEditorValue') || '',
      });
      mdEdit.removeAttribute('hidden');
      mdTextAreaEditor.removeAttribute('hidden');
    }

    setTimeout(() => {
      simplemde.value(localStorage.getItem('mdEditorValue') || '');
      simplemde.codemirror.refresh();
      simplemde.codemirror.focus();
      // simplemde.codemirror.setCursor();
    }, 100);
  });

  // CUSTOM DATA FROM MAIN
  (window as any).electron.dataFromMain((customData:any) => {
    if (customData === 'shortcut') bodyElement.classList.toggle('overlay');
    if (customData === 'shortcut-escape') bodyElement.classList.remove('overlay');

    textInputContainer.removeAttribute('hidden');
    textInput.focus();
    setTimeout(() => {
      textInput.focus();
    }, 100);

    if (!bodyElement.classList.contains('overlay')) {
      textInputContainer.setAttribute('hidden', null);
      let mdEditorValue = simplemde.value();
      localStorage.setItem('mdEditorValue', mdEditorValue);
      simplemde.toTextArea();
      simplemde = null;
      mdTextAreaPreview.setAttribute('hidden', null);
      mdPreview.setAttribute('hidden', null);

      mdEdit.setAttribute('hidden', null);
      mdTextAreaEditor.setAttribute('hidden', null);
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
    const screenStep = '5px'; // WALKING SPEED
    const animationId = setInterval(() => {
      // ANIMATION
      let tmpX = startX + step % 4;
      let tmpY = startY + Math.floor(step / 4);
      const [sourceX, sourceY] = getAnimationPart(tmpX, tmpY);
      ctx.clearRect(0, 0, canvasCat.width, canvasCat.height);
      ctx.drawImage(cat, sourceX, sourceY, cat.width, cat.height);
      step++;
      if (step === steps) {
        step = 0;
      }

      // SCREEN BOUNDARY CHECK + MOVING HORZONTALLY
      if (state === "walk-right") {
        canvasCat.style.left = !!canvasCat.style.left 
          ? `calc(${canvasCat.style.left} + ${screenStep})` 
          : `100px`;
        if (canvasCat.offsetLeft + 200 > bodyElement.clientWidth) {
          animationState("walk-left");
        }
      }
      if (state === "walk-left") {
        canvasCat.style.left = !!canvasCat.style.left 
          ? `calc(${canvasCat.style.left} - ${screenStep})` 
          : `100px`;
        if (canvasCat.offsetLeft < 0) {
          animationState("walk-right");
        }
      }

      // SPEECH BUBBLE
      const timeNow = new Date();
      // When it's 12:00:00, show the speech bubble
      if (timeNow.getHours() <= 23 && (timeNow.getMinutes() <= 1 || timeNow.getMinutes() >= 59)) {
        showSpeechBubble(canvasCat, global_StateString, "./assets/pixel-speech-bubble [WORK OUT TIME !!].gif");
      }

      // RANDOM ACTIONS

    }, 150);

    return animationId;
  };

  const animationState = (state: string) => { 
    global_PrevStateString = global_StateString;
    global_StateString = state;
    if (global_StateIntervalID) {
      clearInterval(global_StateIntervalID);
    }
    switch (state) {
      case "walk-right":
        global_StateIntervalID = runAnimation(12, 12, 4, "walk-right");
        break;
      case "walk-left":
        global_StateIntervalID = runAnimation(12, 4, 4, "walk-left");
        break;
      case "sitting-right":
        global_StateIntervalID = runAnimation(0, 12, 6, "sitting-right");
        break;
      default:
        global_StateIntervalID = runAnimation();
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
