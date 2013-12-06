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

    var Wave = (function (_super) {
        __extends(Wave, _super);
        /**
        * @param sigma
        */
        function Wave(sigma) {
            if (typeof sigma === "undefined") { sigma = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'sigma',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.sigma = sigma;
        }
        Object.defineProperty(Wave.prototype, "sigma", {
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
        Wave.prototype.run = function (x, y) {
            var norm = 0.0;
            for (var i = 0; i < x.length; i++) {
                var d = x[i] - y[i];
                norm += d * d;
            }

            if (this.sigma == 0 || norm == 0) {
                return 0;
            } else {
                return (this.sigma / norm) * Math.sin(norm / this.sigma);
            }
        };
        return Wave;
    })(Kernel.Base);
    exports.Wave = Wave;
});
//# sourceMappingURL=Wave.js.map
