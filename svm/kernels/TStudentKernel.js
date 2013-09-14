var TStudentKernel = (function () {
    function TStudentKernel(degree) {
        if (typeof degree === "undefined") { degree = 1; }
        this.degree = degree;
    }
    TStudentKernel.prototype.run = function (x, y) {
        var norm = 0.0;
        for (var i = 0; i < x.length; i++) {
            var d = x[i] - y[i];
            norm += d * d;
        }
        norm = Math.sqrt(norm);

        return 1.0 / (1.0 + Math.pow(norm, this.degree));
    };
    return TStudentKernel;
})();
//# sourceMappingURL=TStudentKernel.js.map
