/**
* Created by davidatborresen on 9/3/13.
*/
///<reference path='./IKernel.ts' />
var GaussianKernel = (function () {
    function GaussianKernel(sigma) {
        if (typeof sigma === "undefined") { sigma = 1; }
        this.sigma(sigma);
    }
    /**
    * Gaussian Kernel function.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Dot product in feature (kernel) space
    */
    GaussianKernel.prototype.kernel = function (x, y) {
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

    /**
    * Computes the distance in input space
    * between two points given in feature space.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Distance between x and y in input space.
    */
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

    /**
    * Gets or sets the sigma value for the kernel.
    * When setting sigma, gamma gets updated accordingly (gamma = 0.5/sigma^2).
    *
    * @param sigma
    */
    GaussianKernel.prototype.sigma = function (sigma) {
        if (typeof sigma === "undefined") { sigma = null; }
        if (!sigma) {
            return this._sigma;
        }

        this._sigma = Math.sqrt(sigma);
        this._gamma = 1.0 / (2.0 * sigma * sigma);
    };

    /**
    * Gets or sets the sigma² value for the kernel.
    * When setting sigma², gamma gets updated accordingly (gamma = 0.5/sigma²).
    *
    * @param sigma
    * @returns {number}
    */
    GaussianKernel.prototype.sigmaSquared = function (sigma) {
        if (typeof sigma === "undefined") { sigma = null; }
        if (!sigma) {
            return this._sigma * this._sigma;
        }

        this._sigma = Math.sqrt(sigma);
        this._gamma = 1.0 / (2.0 * sigma);
    };

    /**
    * Gets or sets the gamma value for the kernel.
    * When setting gamma, sigma gets updated accordingly (gamma = 0.5/sigma^2).
    *
    * @param gamma
    * @returns {number}
    */
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
