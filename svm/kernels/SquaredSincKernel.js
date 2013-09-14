var SquaredSincKernel = (function () {
    function SquaredSincKernel(gamma) {
        if (typeof gamma === "undefined") { gamma = 1.0; }
        this.gamma = gamma;
    }
    SquaredSincKernel.prototype.run = function (x, y) {
        var norm = 0.0, d;
        for (var i = 0; i < x.length; i++) {
            d = x[i] - y[i];
            norm += d * d;
        }

        var num = this.gamma * Math.sqrt(norm);
        var den = this.gamma * this.gamma * norm;

        return Math.sin(num) / den;
    };
    return SquaredSincKernel;
})();
//# sourceMappingURL=SquaredSincKernel.js.map
