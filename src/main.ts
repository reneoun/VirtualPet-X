import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Tray } from 'electron';
import path from 'path';
import spawn from 'child_process';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create Tray
  const iconPath = path.join(__dirname, 'assets', 'icon.ico');
  const trayIcon = nativeImage.createFromPath(iconPath);
  const tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip('Virtual Pet Electron App 🔥⚡🚀');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  
  ipcMain.on('data-back', (event, data:string) => {
    // const webContents = event.sender
    // console.log("webContents", webContents);
    console.log("data-back", data);
    
    if (data === '#$#ignoreMouseEvents') {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
    }
    
    if (data.toLowerCase().startsWith('cmd')) {
      const cmd = data.split(' ')[1];
      const command = spawn.exec(cmd);
      
      command.stdout.on('data', (data) => {
        console.log('stdout: ' + data);
      });
      command.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
      });
      
    }
  })
  
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.setIgnoreMouseEvents(ignore, options)
  })
  
  
  // and load the index.html of the app.
  globalShortcut.register('CommandOrControl+Q', () => {
    const customData = 'shortcut';
    mainWindow.webContents.send('data', customData);
    if (!mainWindow.isFocused()) {
      mainWindow.webContents.send('data', 'focus');
      mainWindow.setIgnoreMouseEvents(false);
      setTimeout(() => { 
        mainWindow.focus();
      }, 200);
      return;
    } else {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
      mainWindow.blur();
    }
  });
  
  globalShortcut.register('escape', () => {
    const customData = 'shortcut-escape';
    mainWindow.webContents.send('data', customData);
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  });
  
  mainWindow.on('focus', () => { 
    const customData = 'focus';
    mainWindow.webContents.send('data', customData);
  });
  
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  // mainWindow.setFocusable(false); // Input events will not be dispatched
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
