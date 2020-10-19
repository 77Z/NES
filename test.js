const child_process = require("child_process");

if (process.platform == "linux") {
    console.log("Running tests for linux");
    child_process.exec('./linuxTests', (err, stdout, stderr) => {
        if (err) throw err;
        console.log(stderr);
        console.log(stdout);
    });
} else if (process.platform == "win32") {
    console.log("Running tests for win32");
    child_process.exec("NesTests.exe", (error, stdout, stderr) => {
        if (error) console.error(error);
        console.log(stdout);
        console.log(stderr);
    });
} else {
    console.log("platform not supported for testing... :(");
}