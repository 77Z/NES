(function() {
    var CPU = require("./cpu");
    var Program = require("./program");

    function NES() {
        this.cpu = new CPU(this);
        this.program = null;
    }

    NES.prototype.loadProgram = function(data) {
        this.program = new Program(this);
        this.program.load(data);
        
    }

    module.exports = NES;
})();