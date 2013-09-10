var SigmoidKernel = (function () {
    function SigmoidKernel(alpha, constant) {
        if (typeof alpha === "undefined") { alpha = 0.01; }
        if (typeof constant === "undefined") { constant = -Math.E; }
        this.alpha = alpha;
        this.constant = constant;
    }
    SigmoidKernel.prototype.run = function (x, y) {
        var sum = 0.0;

        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }

        return this.tanh(this.alpha * sum + this.constant);
    };

    SigmoidKernel.prototype.tanh = function (arg) {
        var pos = Math.exp(arg), neg = Math.exp(-arg);

        return (pos - neg) / (pos + neg);
    };
    return SigmoidKernel;
})();
//# sourceMappingURL=SigmoidKernel.js.map
