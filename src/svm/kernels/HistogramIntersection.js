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
    * Generalized Histogram Intersection Kernel.
    *
    * The Generalized Histogram Intersection kernel is built based on the
    * Histogram Intersection Kernel for image classification but applies
    * in a much larger variety of contexts (Boughorbel, 2005).
    */
    var HistogramIntersection = (function (_super) {
        __extends(HistogramIntersection, _super);
        /**
        * @param alpha
        * @param beta
        */
        function HistogramIntersection(alpha, beta) {
            if (typeof alpha === "undefined") { alpha = 1; }
            if (typeof beta === "undefined") { beta = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'alpha',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'beta',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.alpha = alpha;
            this.beta = beta;
        }
        Object.defineProperty(HistogramIntersection.prototype, "alpha", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._alpha;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._alpha = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(HistogramIntersection.prototype, "beta", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._beta;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._beta = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * @param x
        * @param y
        * @returns {number}
        */
        HistogramIntersection.prototype.run = function (x, y) {
            var sum = 0.0;
            for (var i = 0; i < x.length; i++) {
                sum += Math.min(Math.pow(Math.abs(x[i]), this.alpha), Math.pow(Math.abs(y[i]), this.beta));
            }

            return sum;
        };
        return HistogramIntersection;
    })(Kernel.Base);
    exports.HistogramIntersection = HistogramIntersection;
});
//# sourceMappingURL=HistogramIntersection.js.map
