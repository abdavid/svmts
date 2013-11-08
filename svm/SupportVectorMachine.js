var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    var _kernel = null;
    var _machine = null;
    var _teacher = null;
    var _renderer = null;

    var _width = window.innerWidth;
    var _height = window.innerHeight;
    var _scale = 50.0;
    var _density = 2.5;

    function setWidth(width) {
        _width = width;
        return SVM;
    }
    SVM.setWidth = setWidth;

    function getWidth() {
        return _width;
    }
    SVM.getWidth = getWidth;

    function setHeight(height) {
        _height = height;
        return SVM;
    }
    SVM.setHeight = setHeight;

    function getHeight() {
        return _height;
    }
    SVM.getHeight = getHeight;

    function setComplexity(c) {
        _teacher.setComplexity(c);
        return SVM;
    }
    SVM.setComplexity = setComplexity;

    function setScale(scale) {
        _scale = scale;
        return SVM;
    }
    SVM.setScale = setScale;

    function getScale() {
        return _scale;
    }
    SVM.getScale = getScale;

    function setDensity(delta) {
        _density = delta;
        return SVM;
    }
    SVM.setDensity = setDensity;

    function getDensity() {
        return _density;
    }
    SVM.getDensity = getDensity;

    function setTeacher(teacher) {
        _teacher = teacher;
        return SVM;
    }
    SVM.setTeacher = setTeacher;

    function setKernel(kernel) {
        if (kernel instanceof SVM.Kernels.BaseKernel) {
            console.log(kernel.getProperties());
        }

        _kernel = kernel;
        return SVM;
    }
    SVM.setKernel = setKernel;

    function getKernel() {
        return _kernel;
    }
    SVM.getKernel = getKernel;

    function setKernelProperties(properties) {
        properties.forEach(function (kernelProperty) {
            _kernel.setProperty(kernelProperty.name, kernelProperty.value);
        });

        return SVM;
    }
    SVM.setKernelProperties = setKernelProperties;

    function setKernelProperty(name, value) {
        _kernel.setProperty(name, value);

        return SVM;
    }
    SVM.setKernelProperty = setKernelProperty;

    function train(inputs, labels) {
        if (!_kernel) {
            _kernel = new SVM.Kernels.LinearKernel();
        }

        if (!_machine) {
            _machine = new SVM.Engine.KernelSupportVectorMachine(_kernel, inputs[0].length);
        }

        if (!_teacher) {
            _teacher = new SVM.Learning.SequentialMinimalOptimization(_machine, inputs, labels);
        }

        _teacher.run();

        return SVM;
    }
    SVM.train = train;

    function retrain() {
        _teacher.run();

        return SVM.render();
    }
    SVM.retrain = retrain;

    function setRenderer(renderer) {
        _renderer = renderer;
        return SVM;
    }
    SVM.setRenderer = setRenderer;

    function render() {
        if (!_renderer) {
            _renderer = new SVM.Renderer.Canvas(_teacher);
        }

        return _renderer.render();
    }
    SVM.render = render;
})(SVM || (SVM = {}));

var SVM;
(function (SVM) {
    (function (Engine) {
        var SupportVectorMachine = (function () {
            function SupportVectorMachine(inputs) {
                this.inputCount = inputs;
            }
            SupportVectorMachine.prototype.getInputCount = function () {
                return this.inputCount;
            };

            SupportVectorMachine.prototype.isProbabilistic = function () {
                return false;
            };

            SupportVectorMachine.prototype.isCompact = function () {
                return this.supportVectors === null;
            };

            SupportVectorMachine.prototype.getSupportVectors = function () {
                return this.supportVectors;
            };

            SupportVectorMachine.prototype.getSupportVector = function (index) {
                return this.supportVectors[index];
            };

            SupportVectorMachine.prototype.setSupportVectors = function (value) {
                this.supportVectors = value;
            };

            SupportVectorMachine.prototype.setSupportVector = function (index, value) {
                this.supportVectors[index] = value;
            };

            SupportVectorMachine.prototype.setWeight = function (index, value) {
                this.weights[index] = value;
            };

            SupportVectorMachine.prototype.getWeight = function (index) {
                return this.weights[index];
            };

            SupportVectorMachine.prototype.setWeights = function (value) {
                this.weights = value;
            };

            SupportVectorMachine.prototype.getWeights = function () {
                return this.weights;
            };

            SupportVectorMachine.prototype.setThreshold = function (value) {
                this.threshold = value;
            };

            SupportVectorMachine.prototype.getThreshold = function () {
                return this.threshold;
            };

            SupportVectorMachine.prototype.compute = function (inputs, output) {
                if (typeof output === "undefined") { output = 0; }
                output = this.threshold;

                if (this.supportVectors === null) {
                    for (var i = 0; i < this.weights.length; i++) {
                        output += this.weights[i] * inputs[i];
                    }
                } else {
                    for (var i = 0; i < this.supportVectors.length; i++) {
                        var sum = 0;
                        for (var j = 0; j < inputs.length; j++) {
                            sum += this.supportVectors[i][j] * inputs[j];
                        }

                        output += this.weights[i] * sum;
                    }
                }

                return !isNaN(output) && output >= 0 ? 1 : -1;
            };

            SupportVectorMachine.prototype.getKernel = function () {
                return new SVM.Kernels.LinearKernel();
            };

            SupportVectorMachine.prototype.toJSON = function () {
                return JSON.stringify({
                    supportVectors: this.getSupportVectors(),
                    weights: this.getWeights(),
                    inputCount: this.getInputCount(),
                    threshold: this.getThreshold()
                });
            };
            return SupportVectorMachine;
        })();
        Engine.SupportVectorMachine = SupportVectorMachine;

        var KernelSupportVectorMachine = (function (_super) {
            __extends(KernelSupportVectorMachine, _super);
            function KernelSupportVectorMachine(kernel, inputs) {
                if (typeof kernel === "undefined") { kernel = null; }
                if (typeof inputs === "undefined") { inputs = 0; }
                _super.call(this, inputs);

                if (kernel === null) {
                    throw new Error('No kernel specified. Please select a kernel to use.');
                }

                this.setKernel(kernel);
            }
            KernelSupportVectorMachine.prototype.setKernel = function (kernel) {
                this.kernel = kernel;
            };

            KernelSupportVectorMachine.prototype.getKernel = function () {
                return this.kernel;
            };

            KernelSupportVectorMachine.prototype.compute = function (inputs) {
                var output = this.getThreshold();

                if (this.isCompact()) {
                    for (var i = 0; i < this.weights.length; i++) {
                        output += this.getWeight(i) * inputs[i];
                    }
                } else {
                    for (var i = 0; i < this.supportVectors.length; i++) {
                        output += this.getWeight(i) * this.kernel.run(this.getSupportVector(i), inputs);
                    }
                }

                return !isNaN(output) && output >= 0 ? 1 : -1;
            };
            return KernelSupportVectorMachine;
        })(SupportVectorMachine);
        Engine.KernelSupportVectorMachine = KernelSupportVectorMachine;
    })(SVM.Engine || (SVM.Engine = {}));
    var Engine = SVM.Engine;
})(SVM || (SVM = {}));
//# sourceMappingURL=SupportVectorMachine.js.map
