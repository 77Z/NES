const {app, BrowserWindow, ipcMain} = require("electron");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        autoHideMenuBar: true,
        icon: "icon.png",
        darkTheme: true,
        title: "NES",
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

    ipcMain.on("open-dev-tools", (e) => {
        mainWindow.webContents.openDevTools();
    });
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