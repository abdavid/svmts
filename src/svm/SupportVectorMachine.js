/**
* Created by davidatborresen on 9/3/13.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='./base/Generic.ts' />
///<reference path='./interfaces/ICollection.ts' />
///<reference path='./interfaces/IRenderer.ts' />
///<reference path='./kernels/LinearKernel.ts' />
///<reference path='./learning/SequentialMinimalOptimization.ts' />
///<reference path='./utils/helpers.ts' />
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

    /**
    * @param width
    * @returns {SVM}
    */
    function setWidth(width) {
        _width = width;
        return SVM;
    }
    SVM.setWidth = setWidth;

    /**
    * @returns {number}
    */
    function getWidth() {
        return _width;
    }
    SVM.getWidth = getWidth;

    /**
    * @param height
    * @returns {SVM}
    */
    function setHeight(height) {
        _height = height;
        return SVM;
    }
    SVM.setHeight = setHeight;

    /**
    * @returns {number}
    */
    function getHeight() {
        return _height;
    }
    SVM.getHeight = getHeight;

    /**
    * @param c
    * @returns {SVM}
    */
    function setComplexity(c) {
        _teacher.setComplexity(c);
        return SVM;
    }
    SVM.setComplexity = setComplexity;

    /**
    * @param scale
    * @returns {SVM}
    */
    function setScale(scale) {
        _scale = scale;
        return SVM;
    }
    SVM.setScale = setScale;

    /**
    * @returns {number}
    */
    function getScale() {
        return _scale;
    }
    SVM.getScale = getScale;

    /**
    * @param delta
    * @returns {SVM}
    */
    function setDensity(delta) {
        _density = delta;
        return SVM;
    }
    SVM.setDensity = setDensity;

    /**
    * @returns {number}
    */
    function getDensity() {
        return _density;
    }
    SVM.getDensity = getDensity;

    /**
    * @param teacher
    * @returns {SVM}
    */
    function setTeacher(teacher) {
        _teacher = teacher;
        return SVM;
    }
    SVM.setTeacher = setTeacher;

    /**
    * @param kernel
    * @returns {SVM}
    */
    function setKernel(kernel) {
        if (kernel instanceof SVM.Kernels.BaseKernel) {
            console.log(kernel.getProperties());
        }

        _kernel = kernel;
        return SVM;
    }
    SVM.setKernel = setKernel;

    /**
    * @returns {IKernel}
    */
    function getKernel() {
        return _kernel;
    }
    SVM.getKernel = getKernel;

    /**
    * @param properties
    * @returns {SVM}
    */
    function setKernelProperties(properties) {
        properties.forEach(function (kernelProperty) {
            _kernel[kernelProperty.name] = kernelProperty.value;
        });

        return SVM;
    }
    SVM.setKernelProperties = setKernelProperties;

    /**
    * @param name
    * @param value
    * @returns {SVM}
    */
    function setKernelProperty(name, value) {
        _kernel[name] = value;

        return SVM;
    }
    SVM.setKernelProperty = setKernelProperty;

    /**
    * @param inputs
    * @param labels
    * @returns {SVM}
    */
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

        var resultsA = [], resultsB = [];
        for (var x = 0.0; x <= SVM.getWidth(); x += SVM.getDensity()) {
            for (var y = 0.0; y <= SVM.getHeight(); y += SVM.getDensity()) {
                var vector = [
                    (x - SVM.getWidth() / 2) / SVM.getScale(),
                    (y - SVM.getHeight() / 2) / SVM.getScale()
                ], decision = this.teacher.machine.compute(vector);

                if (decision > 0) {
                    resultsA.push(vector);
                } else {
                    resultsB.push(vector);
                }
            }
        }
        return [
            resultsA,
            resultsB
        ];
    }
    SVM.train = train;

    /**
    * @returns {IRenderer}
    */
    function retrain() {
        _teacher.run();

        return SVM.render();
    }
    SVM.retrain = retrain;

    /**
    * @param renderer
    * @returns {SVM}
    */
    function setRenderer(renderer) {
        _renderer = renderer;
        return SVM;
    }
    SVM.setRenderer = setRenderer;

    /**
    * @returns {IRenderer}
    */
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
        /**
        * @summary
        * Sparse Linear Support Vector Machine (SVM)
        *
        * @remark
        * Support vector machines (SVMs) are a set of related supervised learning methods
        * used for classification and regression. In simple words, given a set of training
        * examples, each marked as belonging to one of two categories, a SVM training algorithm
        * builds a model that predicts whether a new example falls into one category or the other.
        *
        * Intuitively, an SVM model is a representation of the examples as points in space,
        * mapped so that the examples of the separate categories are divided by a clear gap
        * that is as wide as possible. New examples are then mapped into that same space and
        * predicted to belong to a category based on which side of the gap they fall on.
        *
        * @references:
        *  - http://en.wikipedia.org/wiki/Support_vector_machine
        *
        * @example AND problem
        *
        *  var inputs =
        *  [
        *      [0,0] //0 and 0: 0 (label -1)
        *      [0,1] //0 and 1: 0 (label -1)
        *      [1,0] //1 and 0: 0 (label -1)
        *      [1,1] //1 and 1: 1 (label 1)
        *  ];
        *
        *  var labels =
        *  [
        *      //0, 0, 0, 1
        *      -1, -1, -1, 1
        *  ];
        *
        *  // Create a Support Vector Machine for the given inputs
        *  var machine = new SupportVectorMachine(inputs[0].length);
        *
        *  // Instantiate a new learning algorithm for SVMs
        *  var smo = new SequentialMinimalOptimization(machine, inputs, labels);
        *
        *  // Set up the learning algorithm
        *  smo.setComplexity(1.0);
        *
        *  // Run the learning algorithm
        *  var error = smo.run();
        *
        *  // Compute the decision output for one of the input vectors
        *  var decision = svm.compute(inputs[0]);
        *
        */
        var SupportVectorMachine = (function () {
            /**
            * @param inputs
            */
            function SupportVectorMachine(inputs) {
                this.inputCount = inputs;
            }
            /**
            * @returns {number}
            */
            SupportVectorMachine.prototype.getInputCount = function () {
                return this.inputCount;
            };

            /**
            * @returns {boolean}
            */
            SupportVectorMachine.prototype.isProbabilistic = function () {
                return false;
            };

            /**
            * @returns {boolean}
            */
            SupportVectorMachine.prototype.isCompact = function () {
                return this.supportVectors === null;
            };

            /**
            * @returns {number[][]}
            */
            SupportVectorMachine.prototype.getSupportVectors = function () {
                return this.supportVectors;
            };

            /**
            * @param index
            * @returns {number[]}
            */
            SupportVectorMachine.prototype.getSupportVector = function (index) {
                return this.supportVectors[index];
            };

            /**
            * @param value
            */
            SupportVectorMachine.prototype.setSupportVectors = function (value) {
                this.supportVectors = value;
            };

            /**
            * @param index
            * @param value
            */
            SupportVectorMachine.prototype.setSupportVector = function (index, value) {
                this.supportVectors[index] = value;
            };

            /**
            * @param index
            * @param value
            */
            SupportVectorMachine.prototype.setWeight = function (index, value) {
                this.weights[index] = value;
            };

            /**
            * @param index
            * @param value
            */
            SupportVectorMachine.prototype.getWeight = function (index) {
                return this.weights[index];
            };

            /**
            * Sets the collection of weights used by this machine.
            * @param value
            */
            SupportVectorMachine.prototype.setWeights = function (value) {
                this.weights = value;
            };

            /**
            * Gets the collection of weights used by this machine.
            * @returns {number[]}
            */
            SupportVectorMachine.prototype.getWeights = function () {
                return this.weights;
            };

            /**
            * Sets the threshold (bias) term for this machine.
            * @param value
            */
            SupportVectorMachine.prototype.setThreshold = function (value) {
                this.threshold = value;
            };

            /**
            * Gets the threshold (bias) term for this machine.
            * @returns {number}
            */
            SupportVectorMachine.prototype.getThreshold = function () {
                return this.threshold;
            };

            /**
            * @summary Computes the given input to produce the corresponding output.
            *
            * @remark For a binary decision problem, the decision for the negative
            * or positive class is typically computed by taking the sign of
            * the machine's output.
            *
            * @param inputs An input vector.
            * @param output The output of the machine.
            * If this is a probabilistic machine, the
            * output is the probability of the positive class. If this is
            * a standard machine, the output is the distance to the decision
            * hyperplane in feature space.
            *
            * @returns {number}
            */
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

            /**
            * @returns {LinearKernel}
            */
            SupportVectorMachine.prototype.getKernel = function () {
                return new SVM.Kernels.LinearKernel();
            };

            /**
            * @returns {string}
            */
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

        /**
        *
        */
        var KernelSupportVectorMachine = (function (_super) {
            __extends(KernelSupportVectorMachine, _super);
            /**
            * Creates a new Kernel Support Vector Machine.
            * @param kernel The chosen kernel for the machine.
            * @param inputs The number of inputs for the machine
            *
            * @remark If the number of inputs is zero, this means the machine
            * accepts a indefinite number of inputs. This is often the
            * case for kernel vector machines using a sequence kernel.
            */
            function KernelSupportVectorMachine(kernel, inputs) {
                if (typeof kernel === "undefined") { kernel = null; }
                if (typeof inputs === "undefined") { inputs = 0; }
                _super.call(this, inputs);

                if (kernel === null) {
                    throw new Error('No kernel specified. Please select a kernel to use.');
                }

                this.setKernel(kernel);
            }
            /**
            *  Sets the kernel used by this machine.
            * @param kernel
            */
            KernelSupportVectorMachine.prototype.setKernel = function (kernel) {
                this.kernel = kernel;
            };

            /**
            *  Gets the kernel used by this machine.
            * @returns {IKernel}
            */
            KernelSupportVectorMachine.prototype.getKernel = function () {
                return this.kernel;
            };

            /**
            * @param inputs
            * @returns {number}
            */
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
