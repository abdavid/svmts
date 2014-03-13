/**
* Created by davidatborresen on 9/3/13.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, Kernel) {
    /**
    * @class Sigmoid
    * Sigmoid kernel of the form k(x,z) = tanh(a * x'z + c).
    * Sigmoid _kernels are only conditionally positive definite for some values of a and c,
    * and therefore may not induce a reproducing kernel Hilbert space. However, they have been successfully
    * used in practice (Scholkopf and Smola, 2002).
    *
    * @TODO add estimation function for initialization of kernel correctly.
    */
    var Sigmoid = (function (_super) {
        __extends(Sigmoid, _super);
        /**
        * @param alpha
        * @param constant
        */
        function Sigmoid(alpha, constant) {
            if (typeof alpha === "undefined") { alpha = 0.01; }
            if (typeof constant === "undefined") { constant = -Math.E; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'constant',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'alpha',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.alpha = alpha;
            this.constant = constant;
        }
        Object.defineProperty(Sigmoid.prototype, "alpha", {
            /**
            * @returns {number}
            */
            get: function () {
                return this._alpha;
            },
            /**
            * @param value
            */
            set: function (value) {
                this._alpha = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sigmoid.prototype, "constant", {
            /**
            * @returns {number}
            */
            get: function () {
                return this._constant;
            },
            /**
            * @param value
            */
            set: function (value) {
                this._constant = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Sigmoid kernel function.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Dot product in feature (kernel) space
        */
        Sigmoid.prototype.run = function (x, y) {
            var sum = 0.0;

            for (var i = 0; i < x.length; i++) {
                sum += x[i] * y[i];
            }

            return this.tanh(this.alpha * sum + this.constant);
        };

        /**
        * TanH function.
        *
        * @todo review this. FF14 apparently handles this poorly,
        * while chrome handles it just fine.
        *
        * @param arg
        * @returns {number}
        */
        Sigmoid.prototype.tanh = function (arg) {
            var pos = Math.exp(arg), neg = Math.exp(-arg);

            return (pos - neg) / (pos + neg);
        };
        return Sigmoid;
    })(Kernel.Base);
    exports.Sigmoid = Sigmoid;
});
//# sourceMappingURL=Sigmoid.js.map
