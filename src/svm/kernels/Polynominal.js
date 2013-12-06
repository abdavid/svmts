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

    var Polynominal = (function (_super) {
        __extends(Polynominal, _super);
        /**
        * @param degree
        * @param constant
        */
        function Polynominal(degree, constant) {
            if (typeof degree === "undefined") { degree = 1.0; }
            if (typeof constant === "undefined") { constant = 1.0; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'degree',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'constant',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.degree = degree;
            this.constant = constant;
        }
        Object.defineProperty(Polynominal.prototype, "degree", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._degree;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._degree = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Polynominal.prototype, "constant", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._constant;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._constant = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Polynomial kernel function.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Dot product in feature (kernel) space
        */
        Polynominal.prototype.run = function (x, y) {
            var sum = this.constant;
            for (var i = 0; i < x.length; i++) {
                sum += x[i] * y[i];
            }
            return Math.pow(sum, this.degree);
        };

        /**
        * Computes the distance in input space
        * between two points given in feature space.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Distance between x and y in input space.
        */
        Polynominal.prototype.distance = function (x, y) {
            var q = 1.0 / this.degree;

            return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
        };
        return Polynominal;
    })(Kernel.Base);
    exports.Polynominal = Polynominal;
});
//# sourceMappingURL=Polynominal.js.map
