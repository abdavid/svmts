///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, Kernel) {
    var Linear = (function (_super) {
        __extends(Linear, _super);
        /**
        * @param constant
        */
        function Linear(constant) {
            if (typeof constant === "undefined") { constant = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'constant',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.constant = constant;
        }
        Object.defineProperty(Linear.prototype, "constant", {
            /**
            * @returns {*}
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
        * Linear kernel function.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Dot product in feature (kernel) space
        */
        Linear.prototype.run = function (x, y) {
            var sum = this.constant;

            for (var i = 0; i < x.length; i++) {
                sum += x[i] * y[i];
            }

            return sum;
        };

        /**
        * Computes the distance in input space
        * between two points given in feature space.
        *
        * @param x Vector X in input space
        * @param y Vector Y in input space
        * @returns {number} Distance between x and y in input space.
        */
        Linear.prototype.distance = function (x, y) {
            return this.run(x, x) + this.run(y, y) - 2.0 * this.run(x, y);
        };
        return Linear;
    })(Kernel.Base);
    exports.Linear = Linear;
});
//# sourceMappingURL=Linear.js.map
