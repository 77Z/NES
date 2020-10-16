// Requires
const fs = require("fs");
const ipc = require("electron").ipcRenderer;

// Get Id's
var outCanvas = document.getElementById("out-canvas");
var opendevtoolsbtn = document.getElementById("opendevtoolsbtn");

// Body

var ctx = outCanvas.getContext("2d");

//Set Color to black and fill
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, outCanvas.clientWidth, outCanvas.clientHeight);

opendevtoolsbtn.addEventListener("click", function() {
    ipc.send("open-dev-tools");
});