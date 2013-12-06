///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, __Kernel__) {
    var Kernel = __Kernel__;

    /**
    * @class Gaussian
    *
    * @summary
    * The Gaussian kernel requires tuning for the proper value of σ. Different approaches
    * to this problem includes the use of brute force (i.e. using a grid-search algorithm)
    * or a gradient ascent optimization.
    *
    * P. F. Evangelista, M. J. Embrechts, and B. K. Szymanski. Some Properties of the
    * Gaussian Kernel for One Class Learning.
    * Available on: http://www.cs.rpi.edu/~szymansk/papers/icann07.pdf
    */
    var Gaussian = (function (_super) {
        __extends(Gaussian, _super);
        function Gaussian(sigma) {
            if (typeof sigma === "undefined") { sigma = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'gamma',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'sigma',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.sigma = sigma;
        }
        Object.defineProperty(Gaussian.prototype, "gamma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._gamma;
            },
            set: /**
            * When setting _gamma, _sigma gets updated accordingly (_gamma = 0.5/_sigma^2).
            * @param value
            */
            function (value) {
                this._sigma = Math.sqrt(1.0 / (value * 2.0));
                this._gamma = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Gaussian.prototype, "sigma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._sigma;
            },
            set: /**
            * When setting _sigma, _gamma gets updated accordingly (_gamma = 0.5/_sigma^2).
            * @param value
            */
            function (value) {
                this._sigma = Math.sqrt(value);
                this._gamma = 1.0 / (2.0 * value * value);
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Gaussian function.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Dot product in feature (kernel) space
        */
        Gaussian.prototype.run = function (x, y) {
            if (x === y) {
                return 1.0;
            }

            var norm = 0.0, d;

            for (var i = 0; i < x.length; i++) {
                d = x[i] - y[i];
                norm += d * d;
            }

            return Math.exp(-this.gamma * norm);
        };

        /**
        * Computes the distance in input space
        * between two points given in feature space.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Distance between x and y in input space.
        */
        Gaussian.prototype.distance = function (x, y) {
            if (typeof x === Kernel.PropertyType.NUMBER) {
                return (1.0 / -this.gamma) * Math.log(1.0 - 0.5 * x);
            } else if (x === y) {
                return 0.0;
            }

            var norm = 0.0, d;
            for (var i = 0; i < x.length; i++) {
                d = x[i] - y[i];
                norm += d * d;
            }

            return (1.0 / -this.gamma) * Math.log(1.0 - 0.5 * norm);
        };

        /**
        * Gets or sets the _sigma² value for the kernel.
        * When setting _sigma², _gamma gets updated accordingly (_gamma = 0.5/_sigma²).
        *
        * @param value
        * @returns {number}
        */
        Gaussian.prototype.sigmaSquared = function (value) {
            if (typeof value === "undefined") { value = null; }
            if (!value) {
                return this.sigma * this.sigma;
            }

            this.sigma = Math.sqrt(value);
            this.gamma = 1.0 / (2.0 * value);
        };
        return Gaussian;
    })(Kernel.Base);
    exports.Gaussian = Gaussian;
});
//# sourceMappingURL=Gaussian.js.map
