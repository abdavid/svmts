var GaussianKernel = (function () {
    function GaussianKernel(sigma) {
        if (typeof sigma === "undefined") { sigma = 1; }
        this.sigma(sigma);
    }
    GaussianKernel.prototype.run = function (x, y) {
        if (x === y) {
            return 1.0;
        }

        var norm = 0.0, d;
        for (var i = 0; i < x.length; i++) {
            d = x[i] - y[i];
            norm += d * d;
        }

        return Math.exp(-this.gamma() * norm);
    };

    GaussianKernel.prototype.distance = function (x, y) {
        if (typeof x === 'number') {
            return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * x);
        } else if (x === y) {
            return 0.0;
        }

        var norm = 0.0, d;
        for (var i = 0; i < x.length; i++) {
            d = x[i] - y[i];
            norm += d * d;
        }

        return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * norm);
    };

    GaussianKernel.prototype.sigma = function (sigma) {
        if (typeof sigma === "undefined") { sigma = null; }
        if (!sigma) {
            return this._sigma;
        }

        this._sigma = Math.sqrt(sigma);
        this._gamma = 1.0 / (2.0 * sigma * sigma);
    };

    GaussianKernel.prototype.sigmaSquared = function (sigma) {
        if (typeof sigma === "undefined") { sigma = null; }
        if (!sigma) {
            return this._sigma * this._sigma;
        }

        this._sigma = Math.sqrt(sigma);
        this._gamma = 1.0 / (2.0 * sigma);
    };

    GaussianKernel.prototype.gamma = function (gamma) {
        if (typeof gamma === "undefined") { gamma = null; }
        if (!gamma) {
            return this._gamma;
        }

        this._gamma = gamma;
        this._sigma = Math.sqrt(1.0 / (gamma * 2.0));
    };
    return GaussianKernel;
})();
//# sourceMappingURL=GaussianKernel.js.map
