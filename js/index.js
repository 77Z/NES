'use strict';

// Requires
const fs = require("fs");
const ipc = require("electron").ipcRenderer;
//require("jsnes");

var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH*SCREEN_HEIGHT;

var image;
var framebuffer_u8, framebuffer_u32;

//Audio Data
var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4 * 1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0,
    audio_read_cursor = 0;

// Get Id's
var outCanvas = document.getElementById("out-canvas");
var opendevtoolsbtn = document.getElementById("opendevtoolsbtn");
var aboutbtn = document.getElementById("aboutbtn");
var romlocationinp = document.getElementById("romlocationinp");
var browseRoms = document.getElementById("browseRoms");
var runRomBtn = document.getElementById("runRomBtn");
var headlessbtn = document.getElementById("headlessbtn");
/* var screenshotButton = document.getElementById("screenshotbtn"); */

//Window Load Events

window.onload = function () {
    if (localStorage.length !== 0) {
        //Load recent rom into text box
        var recentItem = localStorage.getItem("recentItem");
        romlocationinp.value = recentItem;
        recentItem = null;
    }

};

// Body

var ctx = outCanvas.getContext("2d");

opendevtoolsbtn.addEventListener("click", function () {
    ipc.send("open-dev-tools");
});

aboutbtn.addEventListener("click", function () {
    ipc.send("about");
});

browseRoms.addEventListener("click", function () {
    ipc.send("browse-rom");
});

headlessbtn.addEventListener("click", function() {
    ipc.send("start-headless");
});


var nes = new jsnes.NES({
    onFrame: function (framebuffer_24) {
        for (var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
    },
    onAudioSample: function (l, r) {
        audio_samples_L[audio_write_cursor] = l;
        audio_samples_R[audio_write_cursor] = r;
        audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
    },
});

//Functions
function onAnimationFrame() {
    window.requestAnimationFrame(onAnimationFrame);

    image.data.set(framebuffer_u8);
    ctx.putImageData(image, 0, 0);
}

function audio_remain() {
    return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event) {
    var dst = event.outputBuffer;
    var len = dst.length;

    // Attempt to avoid buffer underruns.
    if (audio_remain() < AUDIO_BUFFERING) nes.frame();

    var dst_l = dst.getChannelData(0);
    var dst_r = dst.getChannelData(1);
    for (var i = 0; i < len; i++) {
        var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
        dst_l[i] = audio_samples_L[src_idx];
        dst_r[i] = audio_samples_R[src_idx];
    }

    audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

function keyboard(callback, event) {
    var player = 1;
    switch (event.keyCode) {
        case 38: // UP
            callback(player, jsnes.Controller.BUTTON_UP);
            break;
        case 40: // Down
            callback(player, jsnes.Controller.BUTTON_DOWN);
            break;
        case 37: // Left
            callback(player, jsnes.Controller.BUTTON_LEFT);
            break;
        case 39: // Right
            callback(player, jsnes.Controller.BUTTON_RIGHT);
            break;
        case 65: // 'a' - qwerty, dvorak
        case 81: // 'q' - azerty
            callback(player, jsnes.Controller.BUTTON_A);
            break;
        case 83: // 's' - qwerty, azerty
        case 79: // 'o' - dvorak
            callback(player, jsnes.Controller.BUTTON_B);
            break;
        case 9: // Tab
            callback(player, jsnes.Controller.BUTTON_SELECT);
            break;
        case 13: // Return
            callback(player, jsnes.Controller.BUTTON_START);
            break;
        default:
            break;
    }
}

runRomBtn.addEventListener("click", function () {
    //Save the file location for easy
    //access in the future
    localStorage.setItem("recentItem", romlocationinp.value);

    //THIS IS WHERE THE CHAIN STARTS !!!!

    nes_load_file(romlocationinp.value);




    /* nes = new jsnes.NES({
        onFrame: function(frameBuffer) {
            console.log(frameBuffer);
        },
        onAudioSample: function(left, right) {
            //
        }
    });

    var romData = fs.readFileSync(romlocationinp.value, { encoding: "binary" });

    nes.loadROM(romData);


    function frameTick() {
        nes.frame();
        requestAnimationFrame(frameTick);
    }
    requestAnimationFrame(frameTick); */
});

function nes_init() {
    image = ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Allocate framebuffer array.
	var buffer = new ArrayBuffer(image.data.length);
	framebuffer_u8 = new Uint8ClampedArray(buffer);
    framebuffer_u32 = new Uint32Array(buffer);
    
    // Setup audio.
	var audio_ctx = new window.AudioContext();
	var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
	script_processor.onaudioprocess = audio_callback;
	script_processor.connect(audio_ctx.destination);
}

function nes_boot(rom_data) {
    nes.loadROM(rom_data);
    window.requestAnimationFrame(onAnimationFrame);
}

function nes_load_data(rom_data) {
    nes_init();
    nes_boot(rom_data);
}

function nes_load_file(path) {
    nes_init();

    nes_boot(fs.readFileSync(path, { encoding: "binary" }));
}

document.addEventListener('keydown', (event) => {keyboard(nes.buttonDown, event)});
document.addEventListener('keyup', (event) => {keyboard(nes.buttonUp, event)});

/* screenshotButton.addEventListener("click", function() {
    var img = new Image();
    var date = new Date();
    img.src = outCanvas.toDataURL("image/png");
    fs.writeFile(`${__dirname}/screenshot${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}.png`, img, (err) => {
        if (err) throw err;
    })
}); */

//IPC EVENTS

ipc.on("main.browse-rom", (e, loc) => {
    if (!null) {
        console.log("setting value");
        romlocationinp.value = loc;
    }
});