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

        return SVM;
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
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /** * Created by davidatborresen on 18.09.13. */
    ///<reference path='../interfaces/ICollection.ts' />
    ///<reference path='../../definitions/underscore.d.ts' />
    ///<reference path='../utils/helpers.ts' />
    (function (Generic) {
        var List = (function () {
            function List(elements) {
                if (typeof elements === "undefined") { elements = []; }
                var _this = this;
                this._elements = [];
                _.map(elements, function (value) {
                    _this.add(value);
                });
            }
            /**         * @param value         * @returns {boolean}         */
            List.prototype.contains = function (value) {
                return _.contains(this._elements, value);
            };

            /**         * @param key         * @param value         */
            List.prototype.add = function (value) {
                this._elements.push(value);
            };

            /**         * @param key         */
            List.prototype.remove = function (value) {
                this._elements = _.without(this._elements, value);
            };

            /**         * @returns {number}         */
            List.prototype.count = function () {
                return _.size(this._elements);
            };

            List.prototype.clear = function () {
                this._elements = [];
            };

            /**         * @returns {string}         */
            List.prototype.toString = function () {
                return '[object List]';
            };
            return List;
        })();
        Generic.List = List;

        var Dictionary = (function () {
            function Dictionary() {
                this._elements = {};
                this._length = 0;
            }
            /**         * @returns {*[]}         */
            Dictionary.prototype.values = function () {
                return _.values(this._elements);
            };

            /**         * @returns {string[]}         */
            Dictionary.prototype.keys = function () {
                return _.keys(this._elements);
            };

            /**         * @param collection         * @returns {boolean}         */
            Dictionary.prototype.equals = function (collection) {
                return _.isEqual(this, collection);
            };

            /**         * @returns {SVM.Generic.Dictionary}         */
            Dictionary.prototype.clone = function () {
                return _.clone(this);
            };

            /**         * @returns {string}         */
            Dictionary.prototype.toString = function () {
                return '[object Dictionary]';
            };

            /**         * @param list IList         */
            Dictionary.prototype.add = function (list) {
                this._elements[this._length] = list;
                this._length++;
            };

            /**         * @param value         * @returns {T[]}         */
            Dictionary.prototype.get = function (value) {
                return this._filterGet(value).first().value();
            };

            /**         * @param value         * @returns {boolean}         */
            Dictionary.prototype.contains = function (value) {
                return this._filterGet(value).size().value() > 0;
            };

            /**         * @param value         * @returns {_Chain}         * @private         */
            Dictionary.prototype._filterGet = function (value) {
                return _.chain(this._elements).reject(function (list) {
                    return list.contains(value);
                });
            };
            return Dictionary;
        })();
        Generic.Dictionary = Dictionary;

        var HashSet = (function () {
            /**         * @param elements         */
            function HashSet(elements) {
                if (typeof elements === "undefined") { elements = []; }
                this._elements = elements;
            }
            /**         * @param value         * @returns {boolean}         */
            HashSet.prototype.contains = function (value) {
                return [].indexOf.call(this._elements, value) > -1;
            };

            /**         * @param value         */
            HashSet.prototype.add = function (value) {
                if (!this.contains(value)) {
                    this._elements.push(value);
                }
            };

            /**         * @param value         * @returns {*}         */
            HashSet.prototype.get = function (value) {
                var index;
                if ((index = [].indexOf.call(this._elements, value)) !== -1) {
                    return this._elements[index];
                }

                return void (1);
            };

            HashSet.prototype.forEach = function (callback) {
                this._elements.forEach(callback);
                return this;
            };

            /**         * @param value         */
            HashSet.prototype.remove = function (value) {
                var index;
                if ((index = [].indexOf.call(this._elements, value)) !== -1) {
                    this._elements.splice(index, 1);
                }
            };

            /**         * @returns {*[]}         */
            HashSet.prototype.values = function () {
                return this._elements;
            };

            /**         * @returns {string}         */
            HashSet.prototype.toString = function () {
                return '[object HashSet]';
            };
            return HashSet;
        })();
        Generic.HashSet = HashSet;

        var CachedHashSet = (function (_super) {
            __extends(CachedHashSet, _super);
            function CachedHashSet() {
                _super.apply(this, arguments);
            }
            /**         * @returns {string}         */
            CachedHashSet.prototype.toString = function () {
                return '[object CachedHashSet]';
            };
            return CachedHashSet;
        })(HashSet);
        Generic.CachedHashSet = CachedHashSet;

        var Tuple = (function () {
            /**         * @param components         */
            function Tuple(components) {
                this._components = components;
            }
            Tuple.create = /**         * @param args         * @returns {SVM.Generic.Tuple}         */
            function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return SVM.Util.arrayPopulate(args.length, function () {
                    return args.splice(0, 1);
                });
            };

            /**         * @returns {*[]}         */
            Tuple.prototype.get = function () {
                return this._components;
            };

            /**         * @returns {number}         */
            Tuple.prototype.count = function () {
                return this._components.length;
            };
            return Tuple;
        })();
        Generic.Tuple = Tuple;
    })(SVM.Generic || (SVM.Generic = {}));
    var Generic = SVM.Generic;
})(SVM || (SVM = {}));
//# sourceMappingURL=Generic.js.map
;/**
* Created by davidatborresen on 12.10.13.
*/
//# sourceMappingURL=ICanvasRenderer.js.map
;/**
* Created by davidatborresen on 9/3/13.
*/
//# sourceMappingURL=ICollection.js.map
;//# sourceMappingURL=IKernel.js.map
;/**
* Created by davidatborresen on 12.10.13.
*/
//# sourceMappingURL=IRenderer.js.map
;//# sourceMappingURL=ISupportVectorMachine.js.map
;/**
* Created by davidatborresen on 12.10.13.
*/
//# sourceMappingURL=ISupportVectorMachineLearning.js.map
;//# sourceMappingURL=IVideoRenderer.js.map
;/**
* Created by davidatborresen on 29.09.13.
*/
///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/IKernel.ts' />
var PropertyType = (function () {
    function PropertyType() {
    }
    PropertyType.NUMBER = 'number';
    PropertyType.BOOLEAN = 'boolean';
    PropertyType.UNDEFINED = 'undefined';
    return PropertyType;
})();

var SVM;
(function (SVM) {
    (function (Kernels) {
        var BaseKernel = (function () {
            function BaseKernel() {
                this.properties = {};
            }
            BaseKernel.prototype.initialize = function (map) {
                this.properties = map;
                Object.defineProperties(this, this.properties);
                console.log('defining getters / setters for %O', this.properties);
            };

            /**
            * @returns {string[]}
            */
            BaseKernel.prototype.getProperties = function () {
                return Object.keys(this.properties);
            };

            /**
            * @param name
            * @returns {*}
            */
            BaseKernel.prototype.getProperty = function (name) {
                if (name in this.properties) {
                    return this.properties[name];
                }

                return null;
            };

            /**
            * @param name
            * @returns {any}
            */
            BaseKernel.prototype.getPropertyType = function (name) {
                return this.properties[name].type || void (name);
            };
            return BaseKernel;
        })();
        Kernels.BaseKernel = BaseKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=BaseKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * @class BesselKernel
        * @link http://en.wikipedia.org/wiki/Bessel_function
        *
        * @summary
        * Bessel's equation arises when finding separable solutions to Laplace's equation and the Helmholtz equation in cylindrical or spherical coordinates.
        * Bessel functions are therefore especially important for many problems of wave propagation and static potentials.
        * In solving problems in cylindrical coordinate systems, one obtains Bessel functions of integer order (α = n); in spherical problems,
        * one obtains half-integer orders (α = n+1/2).
        *
        * @problems
        * Electromagnetic waves in a cylindrical waveguide
        * Pressure amplitudes of inviscid rotational flows
        * Heat conduction in a cylindrical object
        * Modes of vibration of a thin circular (or annular) artificial membrane (such as a drum or other membranophone)
        * Diffusion problems on a lattice
        * Solutions to the radial Schrödinger equation (in spherical and cylindrical coordinates) for a free particle
        * Solving for patterns of acoustical radiation
        * Frequency-dependent friction in circular pipelines
        * Bessel functions also appear in other problems, such as signal processing (e.g., see FM synthesis, Kaiser window, or Bessel filter).
        */
        var BesselKernel = (function (_super) {
            __extends(BesselKernel, _super);
            /**
            * @param order
            * @param sigma
            */
            function BesselKernel(order, sigma) {
                if (typeof order === "undefined") { order = 1; }
                if (typeof sigma === "undefined") { sigma = 1; }
                _super.call(this);
                this.properties = {
                    order: {
                        type: PropertyType.NUMBER,
                        value: 0
                    },
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.setProperty('sigma', sigma).setProperty('order', order);

                this.baseBessel = new BesselHelper();
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            BesselKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                return this.baseBessel.J(this.properties.order.value, this.properties.sigma.value * norm) / Math.pow(norm, -norm * this.properties.order.value);
            };
            return BesselKernel;
        })(Kernels.BaseKernel);
        Kernels.BesselKernel = BesselKernel;

        var BesselHelper = (function () {
            function BesselHelper() {
            }
            /**
            * Bessel function of order 0.
            * @param x
            * @returns {number}
            * @constructor
            */
            BesselHelper.prototype.J0 = function (x) {
                var ax = Math.abs(x);

                if (ax < 8.0) {
                    var y = x * x;
                    var ans1 = 57568490574.0 + y * (-13362590354.0 + y * (651619640.7 + y * (-11214424.18 + y * (77392.33017 + y * (-184.9052456)))));
                    var ans2 = 57568490411.0 + y * (1029532985.0 + y * (9494680.718 + y * (59272.64853 + y * (267.8532712 + y * 1.0))));

                    return ans1 / ans2;
                } else {
                    var z = 8.0 / ax;
                    var y = z * z;
                    var xx = ax - 0.785398164;
                    var ans1 = 1.0 + y * (-0.1098628627e-2 + y * (0.2734510407e-4 + y * (-0.2073370639e-5 + y * 0.2093887211e-6)));
                    var ans2 = -0.1562499995e-1 + y * (0.1430488765e-3 + y * (-0.6911147651e-5 + y * (0.7621095161e-6 - y * 0.934935152e-7)));

                    return Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
                }
            };

            /**
            * Bessel function of order 1.
            * @param x
            * @constructor
            */
            BesselHelper.prototype.J1 = function (x) {
                var ax = Math.abs(x), y, ans1, ans2;

                if (ax < 8.0) {
                    y = x * x;
                    ans1 = x * (72362614232.0 + y * (-7895059235.0 + y * (242396853.1 + y * (-2972611.439 + y * (15704.48260 + y * (-30.16036606))))));
                    ans2 = 144725228442.0 + y * (2300535178.0 + y * (18583304.74 + y * (99447.43394 + y * (376.9991397 + y * 1.0))));
                    return ans1 / ans2;
                } else {
                    var z = 8.0 / ax;
                    var xx = ax - 2.356194491;
                    y = z * z;

                    ans1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * (-0.240337019e-6))));
                    ans2 = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
                    var ans = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
                    if (x < 0.0) {
                        ans = -ans;
                    }
                    return ans;
                }
            };

            BesselHelper.prototype.J = function (n, x) {
                var j, m;
                var ax, bj, bjm, bjp, sum, tox, ans;
                var jsum;

                var ACC = 40.0;
                var BIGNO = 1.0e+10;
                var BIGNI = 1.0e-10;

                if (n == 0) {
                    return this.J0(x);
                }
                if (n == 1) {
                    return this.J1(x);
                }

                ax = Math.abs(x);
                if (ax == 0.0) {
                    return 0.0;
                } else if (ax > n) {
                    tox = 2.0 / ax;
                    bjm = this.J0(ax);
                    bj = this.J1(ax);
                    for (j = 1; j < n; j++) {
                        bjp = j * tox * bj - bjm;
                        bjm = bj;
                        bj = bjp;
                    }
                    ans = bj;
                } else {
                    tox = 2.0 / ax;
                    m = 2 * ((n + Math.sqrt(ACC * n)) / 2);
                    jsum = false;
                    bjp = ans = sum = 0.0;
                    bj = 1.0;
                    for (j = m; j > 0; j--) {
                        bjm = j * tox * bj - bjp;
                        bjp = bj;
                        bj = bjm;
                        if (Math.abs(bj) > BIGNO) {
                            bj *= BIGNI;
                            bjp *= BIGNI;
                            ans *= BIGNI;
                            sum *= BIGNI;
                        }
                        if (jsum) {
                            sum += bj;
                        }
                        jsum = !jsum;
                        if (j == n) {
                            ans = bjp;
                        }
                    }
                    sum = 2.0 * sum - bj;
                    ans /= sum;
                }

                return x < 0.0 && n % 2 == 1 ? -ans : ans;
            };
            return BesselHelper;
        })();
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=BesselKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * @class CauchyKernel
        *
        * @summary
        * The Cauchy kernel comes from the Cauchy distribution (Basak, 2008). It is a
        * long-tailed kernel and can be used to give long-range influence and sensitivity
        * over the high dimension space.
        */
        var CauchyKernel = (function (_super) {
            __extends(CauchyKernel, _super);
            function CauchyKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1; }
                _super.call(this);
                this.properties = {
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.setProperty('sigma', sigma);

                _super.prototype.initialize.call(this);
            }
            CauchyKernel.prototype.run = function (x, y) {
                if (x == y) {
                    return 1.0;
                }

                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                return (1.0 / (1.0 + norm / this.getPropertyValue('sigma')));
            };
            return CauchyKernel;
        })(Kernels.BaseKernel);
        Kernels.CauchyKernel = CauchyKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=CauchyKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * @class GaussianKernel
        *
        * @summary
        * The Gaussian kernel requires tuning for the proper value of σ. Different approaches
        * to this problem includes the use of brute force (i.e. using a grid-search algorithm)
        * or a gradient ascent optimization.
        *
        * P. F. Evangelista, M. J. Embrechts, and B. K. Szymanski. Some Properties of the
        * Gaussian Kernel for One Class Learning.
        * Available on: http://www.cs.rpi.edu/~szymansk/papers/icann07.pdf
        */
        var GaussianKernel = (function (_super) {
            __extends(GaussianKernel, _super);
            /**
            * @param sigma
            */
            function GaussianKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1; }
                _super.call(this);
                this.properties = {
                    gamma: {
                        type: PropertyType.NUMBER,
                        value: 0
                    },
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.sigma(sigma);
            }
            /**
            * Gaussian Kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            GaussianKernel.prototype.run = function (x, y) {
                if (x === y) {
                    return 1.0;
                }

                var norm = 0.0, d;

                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                return Math.exp(-this.gamma() * norm);
            };

            /**
            * Computes the distance in input space
            * between two points given in feature space.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Distance between x and y in input space.
            */
            GaussianKernel.prototype.distance = function (x, y) {
                if (typeof x === PropertyType.NUMBER) {
                    return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * x);
                } else if (x === y) {
                    return 0.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * norm);
            };

            /**
            * Gets or sets the _sigma value for the kernel.
            * When setting _sigma, _gamma gets updated accordingly (_gamma = 0.5/_sigma^2).
            *
            * @param sigma
            */
            GaussianKernel.prototype.sigma = function (sigma) {
                if (typeof sigma === "undefined") { sigma = null; }
                if (!sigma) {
                    return this.properties.sigma.value;
                }

                this.setProperty('sigma', Math.sqrt(sigma)).setProperty('gamma', 1.0 / (2.0 * sigma * sigma));
            };

            /**
            * Gets or sets the _sigma² value for the kernel.
            * When setting _sigma², _gamma gets updated accordingly (_gamma = 0.5/_sigma²).
            *
            * @param sigma
            * @returns {number}
            */
            GaussianKernel.prototype.sigmaSquared = function (sigma) {
                if (typeof sigma === "undefined") { sigma = null; }
                if (!sigma) {
                    return this.properties.sigma.value * this.properties.sigma.value;
                }

                this.setProperty('sigma', Math.sqrt(sigma)).setProperty('gamma', 1.0 / (2.0 * sigma));
            };

            /**
            * Gets or sets the _gamma value for the kernel.
            * When setting _gamma, _sigma gets updated accordingly (_gamma = 0.5/_sigma^2).
            *
            * @param gamma
            * @returns {number}
            */
            GaussianKernel.prototype.gamma = function (gamma) {
                if (typeof gamma === "undefined") { gamma = null; }
                if (!gamma) {
                    return this.properties.gamma.value;
                }

                this.setProperty('sigma', Math.sqrt(1.0 / (gamma * 2.0))).setProperty('gamma', gamma);
            };
            return GaussianKernel;
        })(Kernels.BaseKernel);
        Kernels.GaussianKernel = GaussianKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=GaussianKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * Generalized Histogram Intersection Kernel.
        *
        * The Generalized Histogram Intersection kernel is built based on the
        * Histogram Intersection Kernel for image classification but applies
        * in a much larger variety of contexts (Boughorbel, 2005).
        */
        var HistogramIntersectionKernel = (function (_super) {
            __extends(HistogramIntersectionKernel, _super);
            /**
            * @param alpha
            * @param beta
            */
            function HistogramIntersectionKernel(alpha, beta) {
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof beta === "undefined") { beta = 1; }
                _super.call(this);
                this.properties = {
                    alpha: {
                        type: PropertyType.NUMBER,
                        value: 0
                    },
                    beta: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.setProperty('alpha', alpha).setProperty('beta', beta);
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            HistogramIntersectionKernel.prototype.run = function (x, y) {
                var sum = 0.0;
                for (var i = 0; i < x.length; i++) {
                    sum += Math.min(Math.pow(Math.abs(x[i]), this.getPropertyValue('alpha')), Math.pow(Math.abs(y[i]), this.getPropertyValue('beta')));
                }

                return sum;
            };
            return HistogramIntersectionKernel;
        })(Kernels.BaseKernel);
        Kernels.HistogramIntersectionKernel = HistogramIntersectionKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=HistogramIntersectionKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * Laplacian Kernel.
        */
        var LaplacianKernel = (function (_super) {
            __extends(LaplacianKernel, _super);
            /**
            * @param gamma
            * @param sigma
            */
            function LaplacianKernel(gamma, sigma) {
                if (typeof gamma === "undefined") { gamma = 1; }
                if (typeof sigma === "undefined") { sigma = 1; }
                _super.call(this);
                this.properties = {
                    gamma: {
                        type: PropertyType.NUMBER,
                        value: 0
                    },
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.setProperty('sigma', sigma);
                this.setProperty('gamma', gamma);
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            LaplacianKernel.prototype.run = function (x, y) {
                if (x == y) {
                    return 1.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                return Math.exp(-this.properties.gamma.value * norm);
            };

            /**
            * Computes the distance in input space
            * between two points given in feature space.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Distance between x and y in input space.
            */
            LaplacianKernel.prototype.distance = function (x, y) {
                if (x == y) {
                    return 0.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                return (1.0 / -this.properties.gamma.value) * Math.log(1.0 - 0.5 * norm);
            };
            return LaplacianKernel;
        })(Kernels.BaseKernel);
        Kernels.LaplacianKernel = LaplacianKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LaplacianKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var LinearKernel = (function (_super) {
            __extends(LinearKernel, _super);
            /**
            * @param constant
            */
            function LinearKernel(constant) {
                if (typeof constant === "undefined") { constant = 1; }
                _super.call(this);
                this.properties = {
                    constant: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.setProperty('constant', constant);
            }
            /**
            * Linear kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            LinearKernel.prototype.run = function (x, y) {
                var sum = this.properties.constant.value;

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
            LinearKernel.prototype.distance = function (x, y) {
                return this.run(x, x) + this.run(y, y) - 2.0 * this.run(x, y);
            };
            return LinearKernel;
        })(Kernels.BaseKernel);
        Kernels.LinearKernel = LinearKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LinearKernel.js.map
;;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var PolynominalKernel = (function (_super) {
            __extends(PolynominalKernel, _super);
            /**
            * @param degree
            * @param constant
            */
            function PolynominalKernel(degree, constant) {
                if (typeof degree === "undefined") { degree = 1.0; }
                if (typeof constant === "undefined") { constant = 1.0; }
                _super.call(this);
                this.properties = {
                    degree: {
                        type: PropertyType.NUMBER,
                        value: 0
                    },
                    constant: {
                        type: PropertyType.NUMBER,
                        value: 0
                    }
                };

                this.setProperty('degree', degree).setProperty('constant', constant);
            }
            /**
            * Polynomial kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            PolynominalKernel.prototype.run = function (x, y) {
                var sum = this.properties.constant.value;
                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }
                return Math.pow(sum, this.properties.degree.value);
            };

            /**
            * Computes the distance in input space
            * between two points given in feature space.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Distance between x and y in input space.
            */
            PolynominalKernel.prototype.distance = function (x, y) {
                var q = 1.0 / this.properties.degree.value;

                return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
            };
            return PolynominalKernel;
        })(Kernels.BaseKernel);
        Kernels.PolynominalKernel = PolynominalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=PolynominalKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * @class SigmoidKernel
        * Sigmoid kernel of the form k(x,z) = tanh(a * x'z + c).
        * Sigmoid _kernels are only conditionally positive definite for some values of a and c,
        * and therefore may not induce a reproducing kernel Hilbert space. However, they have been successfully
        * used in practice (Scholkopf and Smola, 2002).
        *
        * @TODO add estimation function for initialization of kernel correctly.
        */
        var SigmoidKernel = (function (_super) {
            __extends(SigmoidKernel, _super);
            function SigmoidKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    alpha: {
                        type: PropertyType.NUMBER,
                        value: 0.01
                    },
                    constant: {
                        type: PropertyType.NUMBER,
                        value: -Math.E
                    }
                });
            }
            /**
            * Sigmoid kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            SigmoidKernel.prototype.run = function (x, y) {
                var sum = 0.0;

                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }

                return this.tanh(this.alpha * sum + this.constant);
            };

            /**
            * TanH function.
            *
            * @todo review this. FF14 apparently handles this poorly,
            * while chrome handles it just fine.
            *
            * @param arg
            * @returns {number}
            */
            SigmoidKernel.prototype.tanh = function (arg) {
                var pos = Math.exp(arg), neg = Math.exp(-arg);

                return (pos - neg) / (pos + neg);
            };
            return SigmoidKernel;
        })(Kernels.BaseKernel);
        Kernels.SigmoidKernel = SigmoidKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SigmoidKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * The spherical kernel comes from a statistics perspective. It is an example
        * of an isotropic stationary kernel and is positive definite in R^3.
        */
        var SphericalKernel = (function (_super) {
            __extends(SphericalKernel, _super);
            function SphericalKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 1.0,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            SphericalKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                if (norm >= this.sigma) {
                    return 0;
                } else {
                    norm = norm / this.sigma;
                    return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
                }
            };
            return SphericalKernel;
        })(Kernels.BaseKernel);
        Kernels.SphericalKernel = SphericalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SphericalKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * Infinite Spline Kernel function.
        */
        var SplineKernel = (function (_super) {
            __extends(SplineKernel, _super);
            function SplineKernel() {
                _super.call(this);
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            SplineKernel.prototype.run = function (x, y) {
                var k = 1;
                for (var i = 0; i < x.length; i++) {
                    var min = Math.min(x[i], y[i]);
                    var xy = x[i] * y[i];

                    k *= 1.0 + xy + xy * min - ((x[i] + y[i]) / 2.0) * min * min + (min * min * min) / 3.0;
                }

                return k;
            };
            return SplineKernel;
        })(Kernels.BaseKernel);
        Kernels.SplineKernel = SplineKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SplineKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * Squared Sinc Kernel.
        */
        var SquaredSincKernel = (function (_super) {
            __extends(SquaredSincKernel, _super);
            function SquaredSincKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    gamma: {
                        type: 'number',
                        value: 1.0,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            SquaredSincKernel.prototype.run = function (x, y) {
                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                var num = this.gamma * Math.sqrt(norm);
                var den = this.gamma * this.gamma * norm;

                return Math.sin(num) / den;
            };
            return SquaredSincKernel;
        })(Kernels.BaseKernel);
        Kernels.SquaredSincKernel = SquaredSincKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SquaredSincKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * Symmetric Triangle Kernel.
        */
        var SymmetricTriangleKernel = (function (_super) {
            __extends(SymmetricTriangleKernel, _super);
            function SymmetricTriangleKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    gamma: {
                        type: 'number',
                        value: 1.0,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            SymmetricTriangleKernel.prototype.run = function (x, y) {
                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                var z = 1.0 - this.gamma * Math.sqrt(norm);

                return (z > 0) ? z : 0;
            };
            return SymmetricTriangleKernel;
        })(Kernels.BaseKernel);
        Kernels.SymmetricTriangleKernel = SymmetricTriangleKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SymmetricTriangleKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var TStudentKernel = (function (_super) {
            __extends(TStudentKernel, _super);
            function TStudentKernel() {
                _super.call(this);

                _super.prototype.initialize.call(this, {
                    degree: {
                        type: 'number',
                        value: 1,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
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
        })(Kernels.BaseKernel);
        Kernels.TStudentKernel = TStudentKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=TStudentKernel.js.map
;var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    (function (Kernels) {
        /**
        * Tensor Product combination of Kernels.
        */
        var TensorKernel = (function () {
            /**
            * @param kernels
            */
            function TensorKernel(kernels) {
                this._kernels = kernels;
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            TensorKernel.prototype.run = function (x, y) {
                var product = 1.0;
                for (var i = 0; i < this._kernels.length; i++) {
                    product *= this._kernels[i].run(x, y);
                }

                return product;
            };
            return TensorKernel;
        })();
        Kernels.TensorKernel = TensorKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=TensorKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var WaveKernel = (function (_super) {
            __extends(WaveKernel, _super);
            function WaveKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    sigma: {
                        type: 'number',
                        value: 1,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            WaveKernel.prototype.run = function (x, y) {
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
            return WaveKernel;
        })(Kernels.BaseKernel);
        Kernels.WaveKernel = WaveKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveKernel.js.map
;var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var WaveletKernel = (function (_super) {
            __extends(WaveletKernel, _super);
            function WaveletKernel() {
                _super.call(this);

                _super.prototype.initialize.call(this, {
                    dilation: {
                        type: 'number',
                        value: 1.0,
                        writable: true
                    },
                    translation: {
                        type: 'number',
                        value: 1.0,
                        writable: true
                    },
                    invariant: {
                        type: 'boolean',
                        value: false,
                        writable: false
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            WaveletKernel.prototype.run = function (x, y) {
                var prod = 1.0;

                if (this.invariant) {
                    for (var i = 0; i < x.length; i++) {
                        prod *= (this.mother((x[i] - this.translation) / this.dilation)) * (this.mother((y[i] - this.translation) / this.dilation));
                    }
                } else {
                    for (var i = 0; i < x.length; i++) {
                        prod *= this.mother((x[i] - y[i] / this.dilation));
                    }
                }

                return prod;
            };

            /**
            * @param x
            * @returns {number}
            */
            WaveletKernel.prototype.mother = function (x) {
                return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
            };
            return WaveletKernel;
        })(Kernels.BaseKernel);
        Kernels.WaveletKernel = WaveletKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveletKernel.js.map
;var SVM;
(function (SVM) {
    ///<reference path='./../interfaces/ISupportVectorMachineLearning.ts' />
    ///<reference path='./../interfaces/IKernel.ts' />
    ///<reference path='../base/Generic.ts' />
    ///<reference path='../SupportVectorMachine.ts' />
    ///<reference path='../utils/helpers.ts' />
    /**
    * @summary
    * Sequential Minimal Optimization (SMO) Algorithm
    *
    * @remark
    * The SMO algorithm is an algorithm for solving large quadratic programming (QP)
    * optimization problems, widely used for the training of support vector machines.
    * First developed by John C. Platt in 1998, SMO breaks up large QP problems into
    * a series of smallest possible QP problems, which are then solved analytically.
    *
    * @para
    * This class incorporates modifications in the original SMO algorithm to solve
    * regression problems as suggested by Alex J. Smola and Bernhard Scholkopf and
    * further modifications for better performance by Shevade et al.
    *
    * @para
    * Portions of this implementation has been based on the GPL code by Sylvain Roy in SMOreg.java, a
    * part of the Weka software package. It is, thus, available under the same GPL license. This file is
    * not linked against the rest of the Accord.NET Framework and can only be used in GPL aplications.
    * This class is only available in the special Accord.MachineLearning.GPL assembly, which has to be
    * explictly selected in the framework installation. Before linking against this assembly, please
    * read the http://www.gnu.org/copyleft/gpl.html license for more details. This
    * assembly also should have been distributed with a copy of the GNU GPLv3 alongside with it.
    *
    * @references
    * A. J. Smola and B. Scholkopf. A Tutorial on Support Vector Regression. NeuroCOLT2 Technical Report Series, 1998.
    * - http://www.kernel-machines.org/publications/SmoSch98c
    *
    * S.K. Shevade et al. Improvements to SMO Algorithm for SVM Regression, 1999.
    * - http://drona.csa.iisc.ernet.in/~chiru/papers/ieee_smo_reg.ps.gz
    *
    * S. S. Keerthi et al. Improvements to Platt's SMO Algorithm for SVM Classifier Design.* Technical Report CD-99-14.
    * - http://www.cs.iastate.edu/~honavar/keerthi-svm.pdf
    *
    * G. W. Flake, S. Lawrence. Efficient SVM Regression Training with SMO.
    * - http://www.keerthis.com/smoreg_ieee_shevade_00.pdf
    *
    *
    * Example regression problem. Suppose we are trying to model the following equation: f(x, y) = 2x + y
    * @example
    *
    *  var inputs = //(x, y)
    *  [
    *      [0,1], //2*0+1 = 1
    *      [4,3], //2*4+3 = 11
    *      [8,-8], //2*8-8 = 8
    *      [2,2], //2*2+2 = 6
    *      [6,1], //2*6+1 = 13
    *      [5,4], //2*5+4 = 14
    *      [9,1], //2*9+1 = 19
    *      [1,6] //2*0+1 = 8
    *  ]
    *
    *  var outputs = //f(x, y)
    *  [
    *      1, 11, 8, 6, 13, 14, 19, 8
    *  ]
    *
    *   // Create a Kernel Support Vector Machine for the given inputs
    *   var machine = new KernelSupportVectorMachine(new PolynominalKernel(2), 2);
    *
    *   // Instantiate a new learning algorithm for SVMs
    *   var learn = new SequentialMinimalOptimization(svm, inputs, outputs);
    *
    *   // Run the learning algorithm
    *   var error = learn.run();
    *
    *   // Compute the decision output for one of the input vectors
    *   var decision = machine.compute(inputs[0]); // 1.0003849827673186
    *
    **/
    (function (Learning) {
        var SequentialMinimalOptimization = (function () {
            /**
            * @param machine
            * @param inputs
            * @param outputs
            */
            function SequentialMinimalOptimization(machine, inputs, outputs) {
                if (typeof machine === "undefined") { machine = null; }
                if (typeof inputs === "undefined") { inputs = null; }
                if (typeof outputs === "undefined") { outputs = null; }
                // Learning algorithm parameters
                this.cost = 1.0;
                this.tolerance = 1e-3;
                this.epsilon = 1e-3;
                this.roundingEpsilon = 1e-12;
                if (machine === null) {
                    throw new Error('Machine is null');
                }

                if (inputs === null) {
                    throw new Error('Inputs is null');
                }

                if (outputs === null) {
                    throw new Error('Outputs is null');
                }

                if (inputs.length !== outputs.length) {
                    throw new Error('The number of inputs and outputs does not match. ' + inputs.length + ' != ' + outputs.length);
                }

                if (machine.getInputCount() > 0) {
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].length !== machine.getInputCount()) {
                            throw new Error('The size of the input vectors does not match the expected number of inputs of the machine');
                        }
                    }
                }

                this.machine = machine;

                this.kernel = machine.getKernel();

                this.inputs = inputs;

                this.outputs = outputs;
            }
            /**
            * Complexity (cost) parameter. Increasing the value of cost forces the creation
            * of a more accurate model that may not generalize well. Default value is the
            * number of examples divided by the trace of the kernel matrix.
            *
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.getComplexity = function () {
                return this.cost;
            };

            /**
            * The cost parameter controls the trade off between allowing training
            * errors and forcing rigid margins. It creates a soft margin that permits
            * some miss-classifications. Increasing the value of cost increases the cost of
            * miss-classifying points and forces the creation of a more accurate model
            * that may not generalize well.
            *
            * @param value
            */
            SequentialMinimalOptimization.prototype.setComplexity = function (value) {
                if (value <= 0) {
                    throw new Error('Out of range');
                }

                this.cost = value;
            };

            /**
            * Epsilon for round-off errors. Default value is 1e-12.
            * @param value
            */
            SequentialMinimalOptimization.prototype.setEpsilon = function (value) {
                if (value <= 0) {
                    throw new Error('Out of range');
                }

                this.epsilon = value;
            };

            /**
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.getEpsilon = function () {
                return this.epsilon;
            };

            /**
            *  Convergence tolerance. Default value is 1e-2 (0.01)
            *  The criterion for completing the model training process.
            * @param value
            */
            SequentialMinimalOptimization.prototype.setTolerance = function (value) {
                if (value <= 0) {
                    throw new Error('Out of range');
                }

                this.tolerance = value;
            };

            /**
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.getTolerance = function () {
                return this.tolerance;
            };

            /**
            * The SMO algorithm chooses to solve the smallest possible optimization problem
            * at every step. At every step, SMO chooses two Lagrange multipliers to jointly
            * optimize, finds the optimal values for these multipliers, and updates the SVM
            * to reflect the new optimal values.
            *
            * Reference: http://research.microsoft.com/en-us/um/people/jplatt/smoTR.pdf
            * The algorithm has been updated to implement the improvements suggested
            * by Keerthi et al. The code has been based on the pseudo-code available
            * on the author's technical report.
            *
            * Reference: http://www.cs.iastate.edu/~honavar/keerthi-svm.pdf
            */
            SequentialMinimalOptimization.prototype.run = function (computeError) {
                if (typeof computeError === "undefined") { computeError = false; }
                var N = this.inputs.length;

                this.alphaA = new Float64Array(N);
                this.alphaB = new Float64Array(N);
                this.errors = new Float64Array(N);

                this.I0 = new SVM.Generic.HashSet();
                this.I1 = new SVM.Generic.HashSet();
                this.I2 = new SVM.Generic.HashSet();
                this.I3 = new SVM.Generic.HashSet();

                for (var i = 0; i < N; i++) {
                    this.I1.add(i);
                }

                this.biasUpperIndex = 0;
                this.biasLowerIndex = 0;
                this.biasUpper = this.outputs[0] + this.getEpsilon();
                this.biasLower = this.outputs[0] - this.getEpsilon();

                var numChanged = 0, examineAll = true;

                while (numChanged > 0 || examineAll) {
                    numChanged = 0;
                    if (examineAll) {
                        for (var i = 0; i < N; i++) {
                            numChanged += this.examineExample(i);
                        }
                    } else {
                        for (var i = 0; i < N; i++) {
                            if ((0 < this.alphaA[i] && this.alphaA[i] < this.cost) || (0 < this.alphaB[i] && this.alphaB[i] < this.cost)) {
                                numChanged += this.examineExample(i);

                                if (this.biasUpper > this.biasLower - 2.0 * this.getTolerance()) {
                                    numChanged = 0;
                                    break;
                                }
                            }
                        }
                    }

                    if (examineAll) {
                        examineAll = false;
                    } else if (numChanged === 0) {
                        examineAll = true;
                    }
                }

                // Store Support Vectors in the SV Machine. Only vectors which have lagrange multipliers
                // greater than zero will be stored as only those are actually required during evaluation.
                var list = [];
                for (var i = 0; i < N; i++) {
                    if (this.alphaA[i] > 0 || this.alphaB[i] > 0) {
                        list.push(i);
                    }
                }

                this.machine.setSupportVectors(new Array(list.length));
                this.machine.setWeights(new Array(list.length));

                for (var i = 0; i < list.length; i++) {
                    var j = list[i];
                    this.machine.setSupportVector(i, this.inputs[j]);
                    this.machine.setWeight(i, (this.alphaA[j] - this.alphaB[j]));
                }

                this.machine.setThreshold((this.biasLower + this.biasUpper) / 2.0);

                return (computeError) ? this.computeError(this.inputs, this.outputs) : 0.0;
            };

            /**
            * Chooses which multipliers to optimize using heuristics.
            * @param i2
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.examineExample = function (i2) {
                var alpha2A = this.alphaA[i2], alpha2B = this.alphaB[i2], e2 = 0.0, epsilon = this.getEpsilon(), tolerance = this.getTolerance();

                if (this.I0.contains(i2)) {
                    // Value is cached
                    e2 = this.errors[i2];
                } else {
                    // Value is not cached and should be computed
                    this.errors[i2] = e2 = this.outputs[i2] - this.compute(this.inputs[i2]);

                    if (this.I1.contains(i2)) {
                        if (e2 + epsilon < this.biasUpper) {
                            this.biasUpper = e2 + epsilon;
                            this.biasUpperIndex = i2;
                        } else if (e2 - epsilon > this.biasLower) {
                            this.biasLower = e2 - epsilon;
                            this.biasLowerIndex = i2;
                        }
                    } else if (this.I2.contains(i2) && (e2 + epsilon > this.biasLower)) {
                        this.biasLower = e2 + epsilon;
                        this.biasLowerIndex = i2;
                    } else if (this.I3.contains(i2) && (e2 - epsilon < this.biasUpper)) {
                        this.biasUpper = e2 - epsilon;
                        this.biasUpperIndex = i2;
                    }
                }

                //end region
                //region
                //Check optimality using current thresholds
                //Check optimality using current thresholds then select
                //the best i1 to joint optimize when appropriate.
                var i1 = -1, optimal = true;

                if (this.I0.contains(i2)) {
                    if (0 < alpha2A && alpha2A < this.cost) {
                        if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance) {
                            optimal = false;
                            i1 = this.biasLowerIndex;

                            if ((e2 - epsilon) - this.biasUpper > this.biasLower - (e2 - epsilon)) {
                                i1 = this.biasUpperIndex;
                            }
                        } else if ((e2 - epsilon) - this.biasUpper > 2.0 * tolerance) {
                            optimal = false;

                            i1 = this.biasUpperIndex;
                            if (this.biasLower - (e2 - epsilon) > (e2 - epsilon) - this.biasUpper) {
                                i1 = this.biasLowerIndex;
                            }
                        }
                    } else if (0 < alpha2B && alpha2B < this.cost) {
                        if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance) {
                            optimal = false;
                            i1 = this.biasLowerIndex;
                            if ((e2 + epsilon) - this.biasUpper > this.biasLower - (e2 + epsilon)) {
                                i1 = this.biasUpperIndex;
                            }
                        } else if ((e2 + epsilon) - this.biasUpper > 2.0 * tolerance) {
                            optimal = false;
                            i1 = this.biasUpperIndex;
                            if (this.biasLower - (e2 + epsilon) > (e2 + epsilon) - this.biasUpper) {
                                i1 = this.biasLowerIndex;
                            }
                        }
                    }
                } else if (this.I1.contains(i2)) {
                    if (this.biasLower - (e2 + epsilon) > 2.0 * tolerance) {
                        optimal = false;

                        i1 = this.biasLowerIndex;
                        if ((e2 + epsilon) - this.biasUpper > this.biasLower - (e2 + epsilon)) {
                            i1 = this.biasUpperIndex;
                        }
                    } else if ((e2 - epsilon) - this.biasUpper > 2.0 * tolerance) {
                        optimal = false;

                        i1 = this.biasUpperIndex;
                        if (this.biasLower - (e2 - epsilon) > (e2 - epsilon) - this.biasUpper) {
                            i1 = this.biasLowerIndex;
                        }
                    }
                } else if (this.I2.contains(i2)) {
                    if ((e2 + epsilon) - this.biasUpper > 2.0 * tolerance) {
                        optimal = false;
                        i1 = this.biasUpperIndex;
                    }
                } else if (this.I3.contains(i2)) {
                    if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance) {
                        optimal = false;
                        i1 = this.biasLowerIndex;
                    }
                } else {
                    throw new Error('BOM! I missed');
                }

                if (optimal) {
                    // The examples are already optimal.
                    return 0;
                } else {
                    if (this.takeStep(i1, i2)) {
                        return 1;
                    }
                }

                return 0;
            };

            /**
            * Computes the error ratio for a given set of input and outputs.
            * @param inputs
            * @param expectedOutputs
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.computeError = function (inputs, expectedOutputs) {
                // Compute errors
                var sum = 0;
                for (var i = 0; i < inputs.length; i++) {
                    var s = this.machine.compute(inputs[i]) - expectedOutputs[i];
                    sum += s * s;
                }

                return s;
            };

            /**
            * Computes the SVM output for a given point.
            * @param point
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.compute = function (point) {
                var sum = 0;
                for (var j = 0; j < this.alphaA.length; j++) {
                    sum += (this.alphaA[j] - this.alphaB[j]) * this.kernel.run(point, this.inputs[j]);
                }
                return sum;
            };

            /**
            * Analytically solves the optimization problem for two Lagrange multipliers.
            * @param i1 {number}
            * @param i2 {number}
            * @returns {boolean}
            */
            SequentialMinimalOptimization.prototype.takeStep = function (i1, i2) {
                var _this = this;
                if (i1 == i2) {
                    return false;
                }

                // Lagrange multipliers
                var alpha1a = this.alphaA[i1], alpha1b = this.alphaB[i1], alpha2a = this.alphaA[i2], alpha2b = this.alphaB[i2];

                // Errors
                var e1 = this.errors[i1], e2 = this.errors[i2], delta = e1 - e2, epsilon = this.getEpsilon();

                // Kernel evaluation
                var k11 = this.kernel.run(this.inputs[i1], this.inputs[i1]), k12 = this.kernel.run(this.inputs[i1], this.inputs[i2]), k22 = this.kernel.run(this.inputs[i2], this.inputs[i2]), eta = k11 + k22 - 2.0 * k12, gamma = alpha1a - alpha1b + alpha2a - alpha2b;

                if (eta < 0) {
                    eta = 0;
                }

                //region Optimize
                var case1 = false, case2 = false, case3 = false, case4 = false, changed = false, finished = false, L, H, a1, a2;

                while (!finished) {
                    if (!case1 && (alpha1a > 0 || (alpha1b == 0 && delta > 0)) && (alpha2a > 0 || (alpha2b == 0 && delta < 0))) {
                        // Compute L and H (wrt alpha1, alpha2)
                        L = Math.max(0, gamma - this.cost);
                        H = Math.min(this.cost, gamma);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2a - (delta / eta);

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = -L * delta;
                                var Hobj = -H * delta;

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }

                            a1 = alpha1a - (a2 - alpha2a);

                            if (Math.abs(a1 - alpha1a) > this.roundingEpsilon || Math.abs(a2 - alpha2a) > this.roundingEpsilon) {
                                alpha1a = a1;
                                alpha2a = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case1 = true;
                    } else if (!case2 && (alpha1a > 0 || (alpha1b == 0 && delta > 2 * epsilon)) && (alpha2b > 0 || (alpha2a == 0 && delta > 2 * epsilon))) {
                        // Compute L and H  (wrt alpha1, alpha2*)
                        L = Math.max(0, -gamma);
                        H = Math.min(this.cost, -gamma + this.cost);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2b + ((delta - 2 * epsilon) / eta);

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = L * (-2 * epsilon + delta);
                                var Hobj = H * (-2 * epsilon + delta);

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }
                            a1 = alpha1a + (a2 - alpha2b);

                            if (Math.abs(a1 - alpha1a) > this.roundingEpsilon || Math.abs(a2 - alpha2b) > this.roundingEpsilon) {
                                alpha1a = a1;
                                alpha2b = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case2 = true;
                    } else if (!case3 && (alpha1b > 0 || (alpha1a == 0 && delta < -2 * epsilon)) && (alpha2a > 0 || (alpha2b == 0 && delta < -2 * epsilon))) {
                        // Compute L and H (wrt alpha1*, alpha2)
                        L = Math.max(0, gamma);
                        H = Math.min(this.cost, this.cost + gamma);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2a - ((delta + 2 * epsilon) / eta);

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = -L * (2 * epsilon + delta);
                                var Hobj = -H * (2 * epsilon + delta);

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }
                            a1 = alpha1b + (a2 - alpha2a);

                            if (Math.abs(a1 - alpha1b) > this.roundingEpsilon || Math.abs(a2 - alpha2a) > this.roundingEpsilon) {
                                alpha1b = a1;
                                alpha2a = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case3 = true;
                    } else if (!case4 && (alpha1b > 0 || (alpha1a == 0 && delta < 0)) && (alpha2b > 0 || (alpha2a == 0 && delta > 0))) {
                        // Compute L and H (wrt alpha1*, alpha2*)
                        L = Math.max(0, -gamma - this.cost);
                        H = Math.min(this.cost, -gamma);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2b + delta / eta;

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = L * delta;
                                var Hobj = H * delta;

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }

                            a1 = alpha1b - (a2 - alpha2b);

                            if (Math.abs(a1 - alpha1b) > this.roundingEpsilon || Math.abs(a2 - alpha2b) > this.roundingEpsilon) {
                                alpha1b = a1;
                                alpha2b = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case4 = true;
                    } else {
                        finished = true;
                    }

                    // Update the delta
                    delta += eta * ((alpha2a - alpha2b) - (this.alphaA[i2] - this.alphaB[i2]));
                }

                if (!changed) {
                    return false;
                }

                // #endregion
                //  #region Update error cache
                // Update error cache using new Lagrange multipliers
                this.I0.values().forEach(function (i) {
                    if (Number(i) !== Number(i1) && Number(i) !== Number(i2)) {
                        // Update all in set i0 except i1 and i2 (because we have the kernel function cached for them)
                        _this.errors[i] += ((_this.alphaA[i1] - _this.alphaB[i1]) - (alpha1a - alpha1b)) * _this.kernel.run(_this.inputs[i1], _this.inputs[i]) + ((_this.alphaA[i2] - _this.alphaB[i2]) - (alpha2a - alpha2b)) * _this.kernel.run(_this.inputs[i2], _this.inputs[i]);
                    }
                });

                // Update error cache using new Lagrange multipliers for i1 and i2
                this.errors[i1] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k11 + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k12;
                this.errors[i2] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k12 + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k22;

                //#endregion
                // to prevent precision problems
                var m_Del = 1e-10;
                if (alpha1a > this.cost - m_Del * this.cost) {
                    alpha1a = this.cost;
                } else if (alpha1a <= m_Del * this.cost) {
                    alpha1a = 0;
                }
                if (alpha1b > this.cost - m_Del * this.cost) {
                    alpha1b = this.cost;
                } else if (alpha1b <= m_Del * this.cost) {
                    alpha1b = 0;
                }
                if (alpha2a > this.cost - m_Del * this.cost) {
                    alpha2a = this.cost;
                } else if (alpha2a <= m_Del * this.cost) {
                    alpha2a = 0;
                }
                if (alpha2b > this.cost - m_Del * this.cost) {
                    alpha2b = this.cost;
                } else if (alpha2b <= m_Del * this.cost) {
                    alpha2b = 0;
                }

                // #region Store the new Lagrange multipliers
                // Store the changes in the _alpha, _alpha* arrays
                this.alphaA[i1] = alpha1a;
                this.alphaB[i1] = alpha1b;
                this.alphaA[i2] = alpha2a;
                this.alphaB[i2] = alpha2b;

                if ((0 < alpha1a && alpha1a < this.cost) || (0 < alpha1b && alpha1b < this.cost)) {
                    this.I0.add(i1);
                } else {
                    this.I0.remove(i1);
                }

                if (alpha1a == 0 && alpha1b == 0) {
                    this.I1.add(i1);
                } else {
                    this.I1.remove(i1);
                }

                if (alpha1a == 0 && alpha1b == this.cost) {
                    this.I2.add(i1);
                } else {
                    this.I2.remove(i1);
                }

                if (alpha1a == this.cost && alpha1b == 0) {
                    this.I3.add(i1);
                } else {
                    this.I3.remove(i1);
                }

                if ((0 < alpha2a && alpha2a < this.cost) || (0 < alpha2b && alpha2b < this.cost)) {
                    this.I0.add(i2);
                } else {
                    this.I0.remove(i2);
                }

                if (alpha2a == 0 && alpha2b == 0) {
                    this.I1.add(i2);
                } else {
                    this.I1.remove(i2);
                }

                if (alpha2a == 0 && alpha2b == this.cost) {
                    this.I2.add(i2);
                } else {
                    this.I2.remove(i2);
                }

                if (alpha2a == this.cost && alpha2b == 0) {
                    this.I3.add(i2);
                } else {
                    this.I3.remove(i2);
                }

                // #endregion
                // #region Compute the new thresholds
                this.biasLower = -Math.pow(2, 32);
                this.biasUpper = Math.pow(2, 32);
                this.biasLowerIndex = -1;
                this.biasUpperIndex = -1;

                this.I0.values().forEach(function (i) {
                    if (0 < _this.alphaB[i] && _this.alphaB[i] < _this.cost && _this.errors[i] + epsilon > _this.biasLower) {
                        _this.biasLower = _this.errors[i] + epsilon;
                        _this.biasLowerIndex = i;
                    } else if (0 < _this.alphaA[i] && _this.alphaA[i] < _this.cost && _this.errors[i] - epsilon > _this.biasLower) {
                        _this.biasLower = _this.errors[i] - epsilon;
                        _this.biasLowerIndex = i;
                    }
                    if (0 < _this.alphaA[i] && _this.alphaA[i] < _this.cost && _this.errors[i] - epsilon < _this.biasUpper) {
                        _this.biasUpper = _this.errors[i] - epsilon;
                        _this.biasUpperIndex = i;
                    } else if (0 < _this.alphaB[i] && _this.alphaB[i] < _this.cost && _this.errors[i] + epsilon < _this.biasUpper) {
                        _this.biasUpper = _this.errors[i] + epsilon;
                        _this.biasUpperIndex = i;
                    }
                });

                if (!this.I0.contains(i1)) {
                    if (this.I2.contains(i1) && this.errors[i1] + epsilon > this.biasLower) {
                        this.biasLower = this.errors[i1] + epsilon;
                        this.biasLowerIndex = i1;
                    } else if (this.I1.contains(i1) && this.errors[i1] - epsilon > this.biasLower) {
                        this.biasLower = this.errors[i1] - epsilon;
                        this.biasLowerIndex = i1;
                    }

                    if (this.I3.contains(i1) && this.errors[i1] - epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i1] - epsilon;
                        this.biasUpperIndex = i1;
                    } else if (this.I1.contains(i1) && this.errors[i1] + epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i1] + epsilon;
                        this.biasUpperIndex = i1;
                    }
                }

                if (!this.I0.contains(i2)) {
                    if (this.I2.contains(i2) && this.errors[i2] + epsilon > this.biasLower) {
                        this.biasLower = this.errors[i2] + epsilon;
                        this.biasLowerIndex = i2;
                    } else if (this.I1.contains(i2) && this.errors[i2] - epsilon > this.biasLower) {
                        this.biasLower = this.errors[i2] - epsilon;
                        this.biasLowerIndex = i2;
                    }

                    if (this.I3.contains(i2) && this.errors[i2] - epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i2] - epsilon;
                        this.biasUpperIndex = i2;
                    } else if (this.I1.contains(i2) && this.errors[i2] + epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i2] + epsilon;
                        this.biasUpperIndex = i2;
                    }
                }

                if (this.biasLowerIndex == -1 || this.biasUpperIndex == -1) {
                    throw new Error('cry cry');
                }

                //#endregion
                // Success.
                return true;
            };
            return SequentialMinimalOptimization;
        })();
        Learning.SequentialMinimalOptimization = SequentialMinimalOptimization;
    })(SVM.Learning || (SVM.Learning = {}));
    var Learning = SVM.Learning;
})(SVM || (SVM = {}));
//# sourceMappingURL=SequentialMinimalOptimization.js.map
;var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 09.09.13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='../interfaces/ICanvasRenderer.ts' />
    ///<reference path='../interfaces/ISupportVectorMachineLearning.ts' />
    ///<reference path='../base/Generic.ts' />
    ///<reference path='../../definitions/underscore.d.ts' />
    ///<reference path='../SupportVectorMachine.ts' />
    ///<reference path='../learning/SequentialMinimalOptimization.ts' />
    (function (Renderer) {
        var Canvas = (function () {
            /**
            * @param teacher
            */
            function Canvas(teacher) {
                this.canvas = document.createElement('canvas');
                this.canvas.height = SVM.getHeight();
                this.canvas.width = SVM.getWidth();

                document.body.appendChild(this.canvas);

                this.context = this.canvas.getContext('2d');

                this.teacher = teacher;
                //new CanvasLoader(this.context);
            }
            /**
            * @interface ICanvasRenderer
            * @param matrix
            * @param color
            * @returns {SVM.Renderer.Canvas}
            *
            * Paints the decision background
            */
            Canvas.prototype.drawBackground = function (matrix, color) {
                var _this = this;
                matrix.forEach(function (V, i) {
                    _this.context.fillStyle = color;

                    _this.drawRect(V[0] * SVM.getScale() + (SVM.getWidth() / 2), V[1] * SVM.getScale() + (SVM.getHeight() / 2), 2 + SVM.getDensity(), 2 + SVM.getDensity());
                });

                return this;
            };

            /**
            * @interface ICanvasRenderer
            * @returns {SVM.Renderer.Canvas}
            * Draw the axis
            */
            Canvas.prototype.drawAxis = function () {
                this.context.beginPath();
                this.context.strokeStyle = 'rgb(50,50,50)';
                this.context.lineWidth = 1;
                this.context.moveTo(0, SVM.getHeight() / 2);
                this.context.lineTo(SVM.getWidth(), SVM.getHeight() / 2);
                this.context.moveTo(SVM.getWidth() / 2, 0);
                this.context.lineTo(SVM.getWidth() / 2, SVM.getHeight());
                this.context.stroke();

                return this;
            };

            /**
            * @interface ICanvasRenderer
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.drawMargin = function () {
                var xs = [-5, 5], ys = [0, 0];

                ys[0] = (-this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                ys[1] = (-this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);

                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.lineWidth = 1;
                this.context.beginPath();

                // wx+b=0 line
                this.context.moveTo(xs[0], ys[0]);
                this.context.lineTo(xs[1], ys[1]);

                // wx+b=1 line
                this.context.moveTo(xs[0], (ys[0] - 1.0 / this.teacher.machine.getWeight(1)));
                this.context.lineTo(xs[1], (ys[1] - 1.0 / this.teacher.machine.getWeight(1)));

                // wx+b=-1 line
                this.context.moveTo(xs[0], (ys[0] + 1.0 / this.teacher.machine.getWeight(1)));
                this.context.lineTo(xs[1], (ys[1] + 1.0 / this.teacher.machine.getWeight(1)));
                this.context.stroke();

                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.alphaA[i] < 1e-2 || this.teacher.alphaB[i] < 1e-2) {
                        continue;
                    }

                    if (this.teacher.outputs[i] == 1) {
                        ys[0] = (1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                        ys[1] = (1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);
                    } else {
                        ys[0] = (-1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                        ys[1] = (-1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);
                    }

                    var u = (this.teacher.inputs[i][0] - xs[0]) * (xs[1] - xs[0]) + (this.teacher.inputs[i][1] - ys[0]) * (ys[1] - ys[0]) / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1])), xi = xs[0] + u * (xs[1] - xs[0]), yi = ys[0] + u * (ys[1] - ys[0]), mX = this.teacher.inputs[i][0], mY = this.teacher.inputs[i][1];

                    this.context.moveTo(mX, mY);
                    this.context.lineTo(xi, yi);
                }

                this.context.stroke();

                return this;
            };

            /**
            * @interface ICanvasRenderer
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.clearCanvas = function () {
                this.context.clearRect(0, 0, SVM.getWidth(), SVM.getHeight());

                return this;
            };

            /**
            * Renders the result to a canvas
            * @interface IRenderer
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.render = function () {
                this.clearCanvas();

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

                this.drawBackground(resultsA, 'rgb(150,250,150)').drawBackground(resultsB, 'rgb(250,150,150)').drawDataPoints().drawAxis().drawStatus();

                return this;
            };

            /**
            * @interface IRenderer
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.drawDataPoints = function () {
                this.context.strokeStyle = 'rgb(0,0,0)';

                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.outputs[i] == 1) {
                        this.context.fillStyle = 'rgb(100,200,100)';
                    } else {
                        this.context.fillStyle = 'rgb(200,100,100)';
                    }

                    if (this.teacher.alphaA[i] > 1e-2 || this.teacher.alphaB[i] > 1e-2) {
                        this.context.lineWidth = 3;
                    } else {
                        this.context.lineWidth = 1;
                    }

                    var posX = this.teacher.inputs[i][0] * SVM.getScale() + (SVM.getWidth() / 2), posY = this.teacher.inputs[i][1] * SVM.getScale() + (SVM.getHeight() / 2), radius = Math.floor(3 + (this.teacher.alphaA[i] + this.teacher.alphaB[i]) * 5.0 / this.teacher.getComplexity());

                    this.drawCircle(posX, posY, radius);
                }

                return this;
            };

            /**
            * @interface IRenderer
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.drawStatus = function () {
                var _this = this;
                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.font = '12pt open sans';

                var numsupp = 0;
                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.alphaA[i] > 1e-5 || this.teacher.alphaB[i] > 1e-5) {
                        numsupp++;
                    }
                }
                this.context.fillText("Using " + this.teacher.kernel.constructor.name, 10, SVM.getHeight() - 80);

                var propertiesString = '';
                this.teacher.kernel.getProperties().forEach(function (propertyName) {
                    if (propertiesString.length > 0) {
                        propertiesString += ', ';
                    }

                    var property = _this.teacher.kernel.getProperty(propertyName);
                    if (property.type === PropertyType.NUMBER) {
                        propertiesString += propertyName + ' = ' + property.value.toPrecision(2);
                    } else {
                        propertiesString += propertyName + ' = ' + property.value.toString();
                    }
                });

                this.context.fillText('Kernel properties: ' + propertiesString, 10, SVM.getHeight() - 60);

                this.context.fillText('Support Vectors: ' + numsupp + " / " + this.teacher.inputs.length, 10, SVM.getHeight() - 40);

                this.context.fillText('Complexity: ' + this.teacher.getComplexity().toPrecision(2), 10, SVM.getHeight() - 20);

                return this;
            };

            /**
            * @interface IRenderer
            * @param x
            * @param y
            * @param w
            * @param h
            * @param radius
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.drawBubble = function (x, y, w, h, radius) {
                var r = x + w, b = y + h;

                this.context.beginPath();
                this.context.strokeStyle = "black";
                this.context.lineWidth = 2;
                this.context.moveTo(x + radius, y);
                this.context.lineTo(x + radius / 2, y - 10);
                this.context.lineTo(x + radius * 2, y);
                this.context.lineTo(r - radius, y);
                this.context.quadraticCurveTo(r, y, r, y + radius);
                this.context.lineTo(r, y + h - radius);
                this.context.quadraticCurveTo(r, b, r - radius, b);
                this.context.lineTo(x + radius, b);
                this.context.quadraticCurveTo(x, b, x, b - radius);
                this.context.lineTo(x, y + radius);
                this.context.quadraticCurveTo(x, y, x + radius, y);
                this.context.stroke();

                return this;
            };

            /**
            * @interface IRenderer
            * @param x
            * @param y
            * @param w
            * @param h
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.drawRect = function (x, y, w, h, stroke) {
                if (typeof stroke === "undefined") { stroke = false; }
                this.context.beginPath();
                this.context.rect(x, y, w, h);
                this.context.closePath();
                this.context.fill();

                if (stroke) {
                    this.context.stroke();
                }

                return this;
            };

            /**
            * @interface IRenderer
            * @param x
            * @param y
            * @param r
            * @returns {SVM.Renderer.Canvas}
            */
            Canvas.prototype.drawCircle = function (x, y, r) {
                this.context.beginPath();
                this.context.arc(x, y, r, 0, Math.PI * 2, true);
                this.context.closePath();
                this.context.stroke();
                this.context.fill();

                return this;
            };
            return Canvas;
        })();
        Renderer.Canvas = Canvas;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=Canvas.js.map
;var SVM;
(function (SVM) {
    (function (Renderer) {
        var D3 = (function () {
            function D3(options) {
                this.smo = options.smo;
                this.width = 720;
                this.height = 720;
            }
            D3.prototype.render = function () {
                var margin = { top: 20, right: 20, bottom: 30, left: 40 }, width = this.width - margin.left - margin.right, height = this.height - margin.top - margin.bottom;

                this.x = d3.scale.linear().range([0, width]);

                this.y = d3.scale.linear().range([height, 0]);

                this.color = d3.scale.category10();

                this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");

                this.yAxis = d3.svg.axis().scale(this.y).orient("left");

                this.svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(this.xAxis);

                this.svg.append("g").attr("class", "y axis").call(this.yAxis);

                this.x.domain(d3.extent(this.smo.inputs, function (d) {
                    return d[0];
                })).nice();
                this.y.domain(d3.extent(this.smo.inputs, function (d) {
                    return d[1];
                })).nice();

                this.paintDataPoints();

                return this;
            };

            D3.prototype.paintDataPoints = function () {
                var _this = this;
                this.svg.selectAll(".dot").data(this.smo.inputs).enter().append("circle").attr("class", "dot").attr("r", function (d) {
                    return 3.5;
                }).attr("cx", function (d) {
                    return _this.x(d[0]);
                }).attr("cy", function (d) {
                    return _this.y(d[1]);
                }).style("fill", function (d, i) {
                    return _this.smo.outputs[i] === -1 ? 'red' : 'green';
                });

                var legend = this.svg.selectAll(".legend").data(this.color.domain()).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

                legend.append("rect").attr("x", this.width - 18).attr("width", 18).attr("height", 18).style("fill", this.color);

                legend.append("text").attr("x", this.width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
                    return d;
                });
            };

            D3.prototype.paintDecisionBackground = function () {
                var _this = this;
                var vertices = d3.range(5).map(function (d) {
                    return [Math.random() * _this.width, Math.random() * _this.height];
                }), voronoi = d3.geom.voronoi().clipExtent([
                    [0, 0],
                    [this.width, this.height]
                ]), path = this.svg.append("g").selectAll("path");

                path = path.data(voronoi(vertices).map(function (d) {
                    return "M" + d.join("L") + "Z";
                }), String);
                path.exit().remove();
                path.enter().append("path").attr("class", function (d, i) {
                    return "q" + (i % 9) + "-9";
                }).attr("d", String);
                path.order();
            };
            return D3;
        })();
        Renderer.D3 = D3;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=D3.js.map
;var SVM;
(function (SVM) {
    (function (Renderer) {
        var Video = (function () {
            function Video(teacher) {
                this.video = document.createElement('video');
                this.video.height = SVM.getHeight();
                this.video.width = SVM.getWidth();

                document.body.appendChild(this.video);

                this.context = this.video.getContext('2d');

                this.teacher = teacher;
            }
            Video.prototype.render = function () {
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

                this.drawBackground(resultsA, 'rgb(150,250,150)').drawBackground(resultsB, 'rgb(250,150,150)').drawDataPoints().drawAxis().drawStatus();

                return this;
            };

            Video.prototype.drawDataPoints = function () {
                this.context.strokeStyle = 'rgb(0,0,0)';

                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.outputs[i] == 1) {
                        this.context.fillStyle = 'rgb(100,200,100)';
                    } else {
                        this.context.fillStyle = 'rgb(200,100,100)';
                    }

                    if (this.teacher.alphaA[i] > 1e-2 || this.teacher.alphaB[i] > 1e-2) {
                        this.context.lineWidth = 3;
                    } else {
                        this.context.lineWidth = 1;
                    }

                    var posX = this.teacher.inputs[i][0] * SVM.getScale() + (SVM.getWidth() / 2), posY = this.teacher.inputs[i][1] * SVM.getScale() + (SVM.getHeight() / 2), radius = Math.floor(3 + (this.teacher.alphaA[i] + this.teacher.alphaB[i]) * 5.0 / this.teacher.getComplexity());

                    this.drawCircle(posX, posY, radius);
                }

                return this;
            };

            Video.prototype.drawStatus = function () {
                var _this = this;
                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.font = '12pt open sans';

                var numsupp = 0;
                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.alphaA[i] > 1e-5 || this.teacher.alphaB[i] > 1e-5) {
                        numsupp++;
                    }
                }
                this.context.fillText("Using " + this.teacher.kernel.constructor.name, 10, SVM.getHeight() - 80);

                var propertiesString = '';
                this.teacher.kernel.getProperties().forEach(function (propertyName) {
                    if (propertiesString.length > 0) {
                        propertiesString += ', ';
                    }

                    var property = _this.teacher.kernel.getProperty(propertyName);
                    propertiesString += propertyName + ' = ' + property.value.toPrecision(2);
                });

                this.context.fillText('Kernel properties: ' + propertiesString, 10, SVM.getHeight() - 60);

                this.context.fillText('Support Vectors: ' + numsupp + " / " + this.teacher.inputs.length, 10, SVM.getHeight() - 40);

                this.context.fillText('Complexity: ' + this.teacher.getComplexity().toPrecision(2), 10, SVM.getHeight() - 20);

                return this;
            };

            Video.prototype.drawBubble = function (x, y, w, h, radius) {
                var r = x + w, b = y + h;

                this.context.beginPath();
                this.context.strokeStyle = "black";
                this.context.lineWidth = 2;
                this.context.moveTo(x + radius, y);
                this.context.lineTo(x + radius / 2, y - 10);
                this.context.lineTo(x + radius * 2, y);
                this.context.lineTo(r - radius, y);
                this.context.quadraticCurveTo(r, y, r, y + radius);
                this.context.lineTo(r, y + h - radius);
                this.context.quadraticCurveTo(r, b, r - radius, b);
                this.context.lineTo(x + radius, b);
                this.context.quadraticCurveTo(x, b, x, b - radius);
                this.context.lineTo(x, y + radius);
                this.context.quadraticCurveTo(x, y, x + radius, y);
                this.context.stroke();

                return this;
            };

            Video.prototype.drawRect = function (x, y, w, h, stroke) {
                if (typeof stroke === "undefined") { stroke = false; }
                this.context.beginPath();
                this.context.rect(x, y, w, h);
                this.context.closePath();
                this.context.fill();

                if (stroke) {
                    this.context.stroke();
                }

                return this;
            };

            Video.prototype.drawCircle = function (x, y, r) {
                this.context.beginPath();
                this.context.arc(x, y, r, 0, Math.PI * 2, true);
                this.context.closePath();
                this.context.stroke();
                this.context.fill();

                return this;
            };

            Video.prototype.snapShot = function () {
                return new Blob();
            };

            Video.prototype.trace = function () {
            };
            return Video;
        })();
        Renderer.Video = Video;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=Video.js.map
;var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 21.09.13.
    */
    ///<reference path='../../definitions/underscore.d.ts' />
    (function (Util) {
        function arrayPopulate(delta, value) {
            var result;
            if (_.isString(value) || _.isNumber(value)) {
                result = value;
            } else if (_.isFunction(value)) {
                result = value.call(this, arguments);
            } else {
                throw new Error('Passed value is not supported.');
            }

            return Array.apply(null, new Array(delta)).map(function () {
                return result;
            }, value);
        }
        Util.arrayPopulate = arrayPopulate;
    })(SVM.Util || (SVM.Util = {}));
    var Util = SVM.Util;
})(SVM || (SVM = {}));
//# sourceMappingURL=helpers.js.map
