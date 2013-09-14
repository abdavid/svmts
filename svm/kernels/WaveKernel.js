var WaveKernel = (function () {
    function WaveKernel(sigma) {
        if (typeof sigma === "undefined") { sigma = 1; }
        this.sigma = sigma;
    }
    WaveKernel.prototype.run = function (x, y) {
        var norm = 0.0;
        for (var i = 0; i < x.length; i++) {
            var d = x[i] - y[i];
            norm += d * d;
        }

        if (this.sigma == 0 || norm == 0) {
            return 0;
        } else {
            return (this.sigma / norm) * Math.sin(norm / this.sigma);
        }
    };
    return WaveKernel;
})();
//# sourceMappingURL=WaveKernel.js.map
