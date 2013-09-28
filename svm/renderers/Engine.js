var SVM;
(function (SVM) {
    (function (Renderer) {
        var _width = window.innerWidth;
        var _height = window.innerHeight;
        var _scale = 50.0;
        var _density = 4.0;

        function setWidth(width) {
            _width = width;
        }
        Renderer.setWidth = setWidth;

        function getWidth() {
            return _width;
        }
        Renderer.getWidth = getWidth;

        function setHeight(height) {
            _height = height;
        }
        Renderer.setHeight = setHeight;

        function getHeight() {
            return _height;
        }
        Renderer.getHeight = getHeight;

        function setScale(scale) {
            _scale = scale;
        }
        Renderer.setScale = setScale;

        function getScale() {
            return _scale;
        }
        Renderer.getScale = getScale;

        function setDensity(delta) {
            _density = delta;
        }
        Renderer.setDensity = setDensity;

        function getDensity() {
            return _density;
        }
        Renderer.getDensity = getDensity;

        var Engine = (function () {
            function Engine() {
            }
            return Engine;
        })();
        Renderer.Engine = Engine;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=Engine.js.map
