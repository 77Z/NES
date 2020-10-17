// Requires
const fs = require("fs");
const ipc = require("electron").ipcRenderer;

// Get Id's
var outCanvas = document.getElementById("out-canvas");
var opendevtoolsbtn = document.getElementById("opendevtoolsbtn");
var aboutbtn = document.getElementById("aboutbtn");
var romlocationinp = document.getElementById("romlocationinp");
var browseRoms = document.getElementById("browseRoms");
var runRomBtn = document.getElementById("runRomBtn");

//Window Load Events

window.onload = function() {
    if (localStorage.length !== 0) {
        //Load recent rom into text box
        var recentItem = localStorage.getItem("recentItem");
        romlocationinp.value = recentItem;
        delete recentItem;
    }
};

// Body

var ctx = outCanvas.getContext("2d");

//Set Color to black and fill
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, outCanvas.clientWidth, outCanvas.clientHeight);

ctx.fillStyle = "#f00";
ctx.fillRect(0, 0, 20, 20);

opendevtoolsbtn.addEventListener("click", function() {
    ipc.send("open-dev-tools");
});

aboutbtn.addEventListener("click", function() {
    ipc.send("about");
});

browseRoms.addEventListener("click", function() {
    ipc.send("browse-rom");
});

runRomBtn.addEventListener("click", function() {
    //Save the file location for easy
    //access in the future
    localStorage.setItem("recentItem", romlocationinp.value);


});

//IPC EVENTS

ipc.on("main.browse-rom", (e, loc) => {
    if (!null) {
        console.log("setting value");
        romlocationinp.value = loc;
    }
});