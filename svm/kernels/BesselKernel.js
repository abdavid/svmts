var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BesselKernel = (function (_super) {
    __extends(BesselKernel, _super);
    function BesselKernel(order, sigma) {
        if (typeof order === "undefined") { order = 1; }
        if (typeof sigma === "undefined") { sigma = 1; }
        _super.call(this);

        this.order = order;
        this.sigma = sigma;
    }
    BesselKernel.prototype.run = function (x, y) {
        var norm = 0.0;

        for (var i = 0; i < x.length; i++) {
            var d = x[i] - y[i];
            norm += d * d;
        }

        norm = Math.sqrt(norm);

        return this.J(this.order, this.sigma * norm) / Math.pow(norm, -norm * this.order);
    };
    return BesselKernel;
})(BaseBessel);
//# sourceMappingURL=BesselKernel.js.map
