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

    var TStudent = (function (_super) {
        __extends(TStudent, _super);
        /**
        * @param degree
        */
        function TStudent(degree) {
            if (typeof degree === "undefined") { degree = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'degree',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.degree = degree;
        }
        Object.defineProperty(TStudent.prototype, "degree", {
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


        /**
        * @param x
        * @param y
        * @returns {number}
        */
        TStudent.prototype.run = function (x, y) {
            var norm = 0.0;
            for (var i = 0; i < x.length; i++) {
                var d = x[i] - y[i];
                norm += d * d;
            }
            norm = Math.sqrt(norm);

            return 1.0 / (1.0 + Math.pow(norm, this.degree));
        };
        return TStudent;
    })(Kernel.Base);
    exports.TStudent = TStudent;
});
//# sourceMappingURL=TStudent.js.map
