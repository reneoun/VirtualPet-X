// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from "electron";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const exposedAPI = {
  // `(customData: string) => void` is just the typing here
  dataFromMain: (cb: (customData: string) => void) => {
    // Deliberately strip event as it includes `sender` (note: Not sure about that, I partly pasted it from somewhere)
    // Note: The first argument is always event, but you can have as many arguments as you like, one is enough for me.
    ipcRenderer.on('data', (event, customData) => cb(customData));
  }
};

contextBridge.exposeInMainWorld("electron", exposedAPI);

contextBridge.exposeInMainWorld('electronAPI', {
  sendData: (data:string) => ipcRenderer.send('data-back', data)
})

let isMouseOverInteractiveElement = false;

window.addEventListener('DOMContentLoaded', () => {
  const interactiveElements =
    document.querySelectorAll('.interactive');

  interactiveElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      isMouseOverInteractiveElement = true;
      ipcRenderer.send('set-ignore-mouse-events', false);
    });

    element.addEventListener('mouseleave', () => {
      isMouseOverInteractiveElement = false;
      ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
    });
  });
});