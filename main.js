const {app, BrowserWindow, ipcMain, dialog, clipboard} = require("electron");
const fs = require("fs");
const os = require("os");

const PRODUCT = {
    version: "0.1.0",
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    v8version: process.versions.v8,
    nodeVersion: process.version,
    osVersion: function() {
        switch(process.platform) {
            case "win32":
                return `WINDOWS_NT ${process.arch} ${os.release()}`;
            case "linux":
                return `LINUX ${process.arch} ${os.release()}`;
            case "darwin":
                return `DARWIN ${process.arch} ${os.release()}`;
            default:
                return `${process.platform}`
        }
    }
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        autoHideMenuBar: true,
        icon: "icon.png",
        darkTheme: true,
        title: "VNES",
        resizable: false,
        maximizable: false,
        backgroundColor: "#222",
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/dom/index.html`);
    mainWindow.on("close", function() {
        mainWindow = null;
    });

    ipcMain.on("start-headless", () => {

        let headlessMode = new BrowserWindow({
            height: 800,
            width: 800,
            title: "VNES",
            icon: "icon.png",
            webPreferences: {
                nodeIntegration: true
            },
            darkTheme: true,
            fullscreen: true,
            autoHideMenuBar: true
        });
        headlessMode.loadURL(`file://${__dirname}/dom/headless.html`);
        headlessMode.on("close", function() {
            mainWindow = null;
        });

        mainWindow.close();
    });

    ipcMain.on("open-dev-tools", (e) => {
        mainWindow.webContents.openDevTools();
    });

    ipcMain.on("browse-rom", () => {
        // The async version of this code doesn't callback :/
        var fileName = dialog.showOpenDialogSync(mainWindow, {
            properties: ["openFile"],
            title: "Select A ROM",
            filters: [
                {
                    name: "NES ROM",
                    extentions: ["nes"]
                },
            ]
        });
        if (!fileName) fileName = null;
        mainWindow.webContents.send("main.browse-rom", fileName);
    });

    ipcMain.on("about", (e) => {
        var message = `VNES
Version: ${PRODUCT.version}
Electron: ${PRODUCT.electronVersion}
Chrome: ${PRODUCT.chromeVersion}
V8: ${PRODUCT.v8version}
Node: ${PRODUCT.nodeVersion}
OS: ${PRODUCT.osVersion()}`;
        dialog.showMessageBox(mainWindow, {
            type: "info",
            title: "VNES About",
            message: message,
            buttons: ["OK", "Copy"]
        }, (responce) => {
            if (responce === 1) {
                clipboard.write(message);
            }
        });
    })
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow === null) {
        createWindow();
    }
});