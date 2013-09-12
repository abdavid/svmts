var CauchyKernel = (function () {
    function CauchyKernel(sigma) {
        this.sigma = sigma;
    }
    CauchyKernel.prototype.run = function (x, y) {
        if (x == y) {
            return 1.0;
        }

        var norm = 0.0;
        for (var i = 0; i < x.length; i++) {
            var d = x[i] - y[i];
            norm += d * d;
        }

        return (1.0 / (1.0 + norm / this.sigma));
    };
    return CauchyKernel;
})();
//# sourceMappingURL=CauchyKernel.js.map