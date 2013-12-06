/**
* Created by davidatborresen on 9/3/13.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, __Kernel__) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./Base.ts' />
    var Kernel = __Kernel__;

    /**
    * Laplacian Kernel.
    */
    var Laplacian = (function (_super) {
        __extends(Laplacian, _super);
        /**
        * @param gamma
        * @param sigma
        */
        function Laplacian(gamma, sigma) {
            if (typeof gamma === "undefined") { gamma = 1; }
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

            this.gamma = gamma;
            this.sigma = sigma;
        }
        Object.defineProperty(Laplacian.prototype, "gamma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._gamma;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._gamma = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Laplacian.prototype, "sigma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._sigma;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._sigma = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * @param x
        * @param y
        * @returns {number}
        */
        Laplacian.prototype.run = function (x, y) {
            if (x == y) {
                return 1.0;
            }

            var norm = 0.0, d;
            for (var i = 0; i < x.length; i++) {
                d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

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
        Laplacian.prototype.distance = function (x, y) {
            if (x == y) {
                return 0.0;
            }

            var norm = 0.0, d;
            for (var i = 0; i < x.length; i++) {
                d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

            return (1.0 / -this.gamma) * Math.log(1.0 - 0.5 * norm);
        };
        return Laplacian;
    })(Kernel.Base);
    exports.Laplacian = Laplacian;
});
//# sourceMappingURL=Laplacian.js.map
