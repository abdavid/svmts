var SVM;
(function (SVM) {
    (function (Util) {
        function zeroes(delta) {
            return Array.apply(null, new Array(delta)).map(Number.prototype.valueOf, 0);
        }
        Util.zeroes = zeroes;
    })(SVM.Util || (SVM.Util = {}));
    var Util = SVM.Util;
})(SVM || (SVM = {}));
//# sourceMappingURL=helpers.js.map
