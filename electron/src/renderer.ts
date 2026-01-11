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

import { c, s } from "vite/dist/node/types.d-aGj9QkWt";
import "./index.css";
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
  "yellow_0.png",
];

const pixelSymbols: any = {
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  C: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  G: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  J: [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  P: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  Q: [
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  S: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  X: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  Y: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  Z: [
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  " ": [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  ".": [[0], [0], [0], [0], [1]],
  ",": [[0], [0], [0], [1], [1]],
  "!": [[1], [1], [1], [0], [1]],
  "?": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ],
};

const PIXEL_SIZE = 5;

// console.log('👋 This message is being logged by "renderer.ts", included via Vite');
window.addEventListener("DOMContentLoaded", () => {
  let global_StateIntervalID: NodeJS.Timeout | null = null;
  let global_StateString: string = "";
  let global_PrevStateString: string = "";

  const canvasCat = document.getElementById("cat") as HTMLCanvasElement;
  const submitButton = document.getElementById("submit") as HTMLButtonElement;
  const optionsList = document.getElementById(
    "options-list",
  ) as HTMLUListElement;

  const divCmd = document.getElementById("cmd-input") as HTMLDivElement;
  const mainTextBalloon = document.getElementById(
    "text-balloon",
  ) as HTMLCanvasElement;
  const tailTextBalloon = document.createElement("canvas");

  let mdPreview = document.getElementById("md-preview") as HTMLDivElement;
  let mdTextAreaPreview = document.getElementById(
    "md-textarea-preview",
  ) as HTMLTextAreaElement;
  let mdEdit = document.getElementById("md-edit") as HTMLDivElement;
  let mdTextAreaEditor = document.getElementById(
    "md-editor",
  ) as HTMLTextAreaElement;

  let simplemde: any = null;

  const ctx = canvasCat.getContext("2d");
  const cat = new Image();
  cat.src = "./assets/black_4.png";
  const bodyElement = document.querySelector("body");

  const textInputContainer = document.querySelector("div#cmd-input");
  const textInput = document.querySelector("input#cmd") as HTMLInputElement;

  const makeMainTextBalloon = (
    text: string,
    maxCharLine: number = 32,
    absX = "50px",
    absY = "50px",
  ) => {
    mainTextBalloon.style.display = "block";
    tailTextBalloon.style.display = "block";
    mainTextBalloon.style.marginBottom = "5px";
    const ctx2 = mainTextBalloon.getContext("2d");

    let positionX = 5;
    let positionY = 3;

    let words = text.split(" ");
    let lines: string[] = [""];
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

    // CALCULATE TEXT BALLOON SIZE
    let linesLength = lines.map((line) => {
      let lineLength = 0;
      for (let i = 0; i < line.length; i++) {
        let [x, y] = makePixelLetter(line[i], 0, 0, null);
        lineLength += i === 0 ? x : x + 1;
      }
      return lineLength;
    });
    let maxLineLength = Math.max(...linesLength);
    mainTextBalloon.width = (maxLineLength + 5) * PIXEL_SIZE + 4 * PIXEL_SIZE;
    mainTextBalloon.height = lines.length * 8 * PIXEL_SIZE + 4 + 2 * PIXEL_SIZE;
    ctx2.fillStyle = "white";
    ctx2.fillRect(0, 0, mainTextBalloon.width, mainTextBalloon.height);

    // DRAW BALLOON
    ctx2.fillStyle = "black";
    ctx2.fillRect(
      3 * PIXEL_SIZE,
      0,
      mainTextBalloon.width - 6 * PIXEL_SIZE,
      PIXEL_SIZE,
    ); // TOP
    // LEFT TOP
    ctx2.fillRect(2 * PIXEL_SIZE, 1 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx2.fillRect(1 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

    ctx2.fillRect(
      0,
      3 * PIXEL_SIZE,
      PIXEL_SIZE,
      mainTextBalloon.height - 6 * PIXEL_SIZE,
    ); // LEFT
    // LEFT BOTTOM
    ctx2.fillRect(
      1 * PIXEL_SIZE,
      mainTextBalloon.height - 3 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.fillRect(
      2 * PIXEL_SIZE,
      mainTextBalloon.height - 2 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );

    ctx2.fillRect(
      3 * PIXEL_SIZE,
      mainTextBalloon.height - PIXEL_SIZE,
      mainTextBalloon.width - 6 * PIXEL_SIZE,
      PIXEL_SIZE,
    ); // BOTTOM
    // RIGHT BOTTOM
    ctx2.fillRect(
      mainTextBalloon.width - 3 * PIXEL_SIZE,
      mainTextBalloon.height - 2 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.fillRect(
      mainTextBalloon.width - 2 * PIXEL_SIZE,
      mainTextBalloon.height - 3 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );

    ctx2.fillRect(
      mainTextBalloon.width - PIXEL_SIZE,
      3 * PIXEL_SIZE,
      PIXEL_SIZE,
      mainTextBalloon.height - 6 * PIXEL_SIZE,
    ); // RIGHT
    // RIGHT TOP
    ctx2.fillRect(
      mainTextBalloon.width - 2 * PIXEL_SIZE,
      2 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.fillRect(
      mainTextBalloon.width - 3 * PIXEL_SIZE,
      1 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );

    // MAKE OUTSIDE CORNER TRANSPARENT
    ctx2.clearRect(0, 0, 3 * PIXEL_SIZE, PIXEL_SIZE);
    ctx2.clearRect(0, PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE);
    ctx2.clearRect(0, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

    ctx2.clearRect(
      0,
      mainTextBalloon.height - PIXEL_SIZE,
      3 * PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.clearRect(
      0,
      mainTextBalloon.height - 2 * PIXEL_SIZE,
      2 * PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.clearRect(
      0,
      mainTextBalloon.height - 3 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );

    ctx2.clearRect(
      mainTextBalloon.width - PIXEL_SIZE,
      0,
      PIXEL_SIZE,
      3 * PIXEL_SIZE,
    );
    ctx2.clearRect(
      mainTextBalloon.width - 2 * PIXEL_SIZE,
      0,
      PIXEL_SIZE,
      2 * PIXEL_SIZE,
    );
    ctx2.clearRect(
      mainTextBalloon.width - 3 * PIXEL_SIZE,
      0,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );

    ctx2.clearRect(
      mainTextBalloon.width - 3 * PIXEL_SIZE,
      mainTextBalloon.height - PIXEL_SIZE,
      3 * PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.clearRect(
      mainTextBalloon.width - 2 * PIXEL_SIZE,
      mainTextBalloon.height - 2 * PIXEL_SIZE,
      2 * PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx2.clearRect(
      mainTextBalloon.width - PIXEL_SIZE,
      mainTextBalloon.height - 3 * PIXEL_SIZE,
      PIXEL_SIZE,
      PIXEL_SIZE,
    );

    // DRAW TEXT
    let maxPositionX = 0;
    for (let textLine of lines) {
      for (let i = 0; i < textLine.length; i++) {
        let letter = textLine[i];
        [positionX, positionY] = makePixelLetter(
          letter,
          positionX,
          positionY,
          ctx2,
        );
        positionX += 1;
        if (positionX > maxPositionX) maxPositionX = positionX;
      }
      positionX = 3;
      positionY += 8;
    }

    mainTextBalloon.style.position = "absolute";
    mainTextBalloon.style.bottom = absY;
    mainTextBalloon.style.left = absX;

    tailTextBalloon.width = 6 * PIXEL_SIZE;
    tailTextBalloon.height = 8 * PIXEL_SIZE;
    tailTextBalloon.style.position = "absolute";
    tailTextBalloon.style.bottom = `${parseInt(absY) - 29}px`;
    tailTextBalloon.style.left = `${parseInt(absX) + 40}px`;

    const ctx3 = tailTextBalloon.getContext("2d");
    ctx3.fillStyle = "white";
    ctx3.fillRect(0, 0, tailTextBalloon.width, tailTextBalloon.height);
    ctx3.fillStyle = "black";
    ctx3.fillRect(0, 1, PIXEL_SIZE, PIXEL_SIZE);
    ctx3.fillRect(PIXEL_SIZE, 1, PIXEL_SIZE, 3 * PIXEL_SIZE);
    ctx3.fillRect(0, 1 + 3 * PIXEL_SIZE, PIXEL_SIZE, 2 * PIXEL_SIZE);
    ctx3.fillRect(PIXEL_SIZE, 1 + 5 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE);
    ctx3.fillRect(3 * PIXEL_SIZE, 1 + 4 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx3.fillRect(4 * PIXEL_SIZE, 1 + 3 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx3.fillRect(5 * PIXEL_SIZE, 1, PIXEL_SIZE, 3 * PIXEL_SIZE);
    ctx3.clearRect(0, 1 + PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx3.clearRect(0, 1 + 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx3.clearRect(0, 1 + 5 * PIXEL_SIZE, PIXEL_SIZE, 3 * PIXEL_SIZE);
    ctx3.clearRect(
      PIXEL_SIZE,
      1 + 6 * PIXEL_SIZE,
      5 * PIXEL_SIZE,
      2 * PIXEL_SIZE,
    );
    ctx3.clearRect(
      3 * PIXEL_SIZE,
      1 + 5 * PIXEL_SIZE,
      4 * PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx3.clearRect(
      4 * PIXEL_SIZE,
      1 + 4 * PIXEL_SIZE,
      4 * PIXEL_SIZE,
      PIXEL_SIZE,
    );
    ctx3.clearRect(
      5 * PIXEL_SIZE,
      1 + 3 * PIXEL_SIZE,
      4 * PIXEL_SIZE,
      PIXEL_SIZE,
    );

    document.body.appendChild(tailTextBalloon);
  };

  const makePixelLetter = (
    letter: string,
    startX: number,
    startY: number,
    ctx3: CanvasRenderingContext2D | null,
  ) => {
    let upperLetter = letter.toUpperCase();
    if (Object.keys(pixelSymbols).indexOf(upperLetter) === -1)
      return [startX, startY];
    const letterMatrix = pixelSymbols[upperLetter];
    const letterSize = letterMatrix[0].length;
    const letterHeight = letterMatrix.length;
    const pixelSize = 5;

    let endX = startX + letterSize + 1;
    let endY = startY;

    if (ctx3 === null) return [endX, endY];

    for (let i = 0; i < letterHeight; i++) {
      for (let j = 0; j < letterSize; j++) {
        if (letterMatrix[i][j] === 1) {
          ctx3.fillStyle = "black";
          ctx3.fillRect(
            (j + startX) * pixelSize,
            (i + startY) * pixelSize,
            pixelSize,
            pixelSize,
          );
        }
      }
    }

    return [endX, endY];
  };

  const showTextBalloon = (text: string, durationMS: number) => {
    const intervalId = setInterval(() => {
      const posCanvas = canvasCat.getBoundingClientRect();
      let absX = posCanvas.left + window.scrollX + 50;
      let absY = 140;
      makeMainTextBalloon(text, 32, `${absX}px`, `${absY}px`);
    }, 100);
    setTimeout(() => {
      mainTextBalloon.style.display = "none";
      tailTextBalloon.style.display = "none";
      clearInterval(intervalId);
    }, durationMS);
  };

  // makeMainTextBalloon("Hello World ! ", 32, "150px", "150px");

  submitButton.addEventListener("click", () => {
    const inputValue = textInput.value;
    (window as any).electronAPI.sendData(inputValue);
  });

  // CLICK ON CAT LISTENER
  canvasCat.addEventListener("click", () => {
    const catSounds = ["Meoww !", "Purr Purr"];
    const randomIndex = Math.floor(Math.random() * catSounds.length);
    showTextBalloon(catSounds[randomIndex], 3000);
  });

  textInput.addEventListener("blur", () => {
    optionsList.style.display = "none";
  }); // DO NOTHING

  // TEXT INPUT LISTENERS
  textInput.addEventListener("input", () => {
    let inputValue: string = textInput.value;
    if (inputValue.toLowerCase().startsWith("animal")) {
      let filteredFiles = pngFiles.filter((file) =>
        file.includes(inputValue.split(" ")[1]),
      );
      let optionsListValues = Array.from(optionsList.children).map(
        (el: HTMLOptionElement) => el.value,
      );
      for (let pngFile of filteredFiles) {
        if (
          optionsListValues.includes("animal " + pngFile.replace(".png", ""))
        ) {
          continue;
        }
        let optionEl = document.createElement("option");
        optionEl.value = "animal " + pngFile.replace(".png", "");
        optionEl.classList.add("interactive");
        optionsList.appendChild(optionEl);
      }
    } else {
      optionsList.innerHTML = "";
    }
  });

  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let inputValue = textInput.value;
      if (inputValue.toLowerCase().startsWith("animal")) {
        let animal = inputValue.split(" ")[1];
        cat.src = `./assets/${animal}.png`;
        optionsList.innerHTML = "";
        textInput.value = "";
        return;
      }

      (window as any).electronAPI.sendData(inputValue);
    }

    if (e.key === "ArrowLeft") {
      // @ts-ignore
      if (!simplemde)
        simplemde = new SimpleMDE({
          element: mdTextAreaPreview,
          initialValue: localStorage.getItem("mdEditorValue") || "",
          toolbar: false,
        });
      mdTextAreaPreview.removeAttribute("hidden");
      mdPreview.removeAttribute("hidden");
      if (!simplemde.isPreviewActive()) {
        simplemde.togglePreview();
      }
    }

    if (e.key === "ArrowRight") {
      // @ts-ignore
      if (!simplemde)
        simplemde = new SimpleMDE({
          element: mdTextAreaEditor,
          initialValue: localStorage.getItem("mdEditorValue") || "",
        });
      mdEdit.removeAttribute("hidden");
      mdTextAreaEditor.removeAttribute("hidden");
    }

    setTimeout(() => {
      simplemde.value(localStorage.getItem("mdEditorValue") || "");
      simplemde.codemirror.refresh();
      simplemde.codemirror.focus();
      // simplemde.codemirror.setCursor();
    }, 100);
  });

  // CUSTOM DATA FROM MAIN
  (window as any).electron.dataFromMain((customData: any) => {
    if (customData === "shortcut") bodyElement.classList.toggle("overlay");
    if (customData === "shortcut-escape")
      bodyElement.classList.remove("overlay");

    textInputContainer.removeAttribute("hidden");
    textInput.focus();
    setTimeout(() => {
      textInput.focus();
    }, 100);

    if (!bodyElement.classList.contains("overlay")) {
      textInputContainer.setAttribute("hidden", null);
      let mdEditorValue = simplemde.value();
      localStorage.setItem("mdEditorValue", mdEditorValue);
      simplemde.toTextArea();
      simplemde = null;
      mdTextAreaPreview.setAttribute("hidden", null);
      mdPreview.setAttribute("hidden", null);

      mdEdit.setAttribute("hidden", null);
      mdTextAreaEditor.setAttribute("hidden", null);
    }
  });

  const getAnimationPart = (x: number = 0, y: number = 0) => {
    const upperAnimationIMGBound = -33;
    const animationStep = -32;
    const sourceX = x * animationStep;
    const sourceY = upperAnimationIMGBound + y * animationStep;
    return [sourceX, sourceY];
  };

  const runAnimation = (
    startX: number = 0,
    startY: number = 0,
    steps: number = 7,
    state: string = "",
  ) => {
    let step = 0;
    let bodyElement = document.querySelector("body");
    const screenStep = "5px"; // WALKING SPEED
    const animationId = setInterval(() => {
      // ANIMATION
      let tmpX = startX + (step % 4);
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
      if (
        timeNow.getHours() <= 23 &&
        (timeNow.getMinutes() <= 1 || timeNow.getMinutes() >= 59)
      ) {
        showTextBalloon("WORK OUT TIME !!", 1000);
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
