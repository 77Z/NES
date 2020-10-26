//For building on windows machines only
//Because windows doesn't accept wildcard expanding/globbing

const fs = require("fs");
const child_process = require("child_process");

if (process.platform !== "win32") {
    throw new Error("This will only run on Windows, if you're on Linux, just run make");
}

//Get all c++ source files in Source
var cppfiles = [];
fs.readdir("Source", (err, files) => {
    if (err) throw err;
    for (var i = 0; i < files.length; i++) {
        if (files[i].split(".")[files[i].split(".").length - 1] == "cpp") {
            cppfiles.push(files[i]);
        }
    }

    console.log(cppfiles);

    var compiler    = "g++";
    var cFlags      = "-Iinclude -Llib-vc2015 -lglfw3 -lopengl32";
    var sourceFiles = ""; //DON'T MODIFY
    var outputFile  = "dist/out.exe";

    for (var i = 0; i < cppfiles.length; i++) {
        sourceFiles += "Source/" + cppfiles[i] + " ";
    }

    fs.writeFile(".\\Makefile.win", `all:\n\t${compiler} ${cFlags} ${sourceFiles}-o ${outputFile}`, (err) => {
        if (err) throw err;
        child_process.exec("make -f .\\Makefile.win", (err, stdout, stderr) => {
            if (err) throw err;
            console.log(stdout);
            console.log(stderr);
        });
    });
});