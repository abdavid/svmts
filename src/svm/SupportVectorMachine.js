/**
* Created by davidatborresen on 9/3/13.
*/
define(["require", "exports", './kernels/Base', './learning/SequentialMinimalOptimization', './renderers/Canvas', './engine/KernelSupportVectorMachine', './SupportVectorMachine'], function(require, exports, Kernel, Learning, Renderer, Engine, SELF) {
    var _kernel = null;
    var _machine = null;
    var _teacher = null;
    var _renderer = null;
    var _width = null;
    var _height = null;
    var _scale = 50.0;
    var _density = 2.5;

    /**
    * @param width
    * @returns {SVM}
    */
    function setWidth(width) {
        _width = width;

        return SELF;
    }
    exports.setWidth = setWidth;

    /**
    * @returns {number}
    */
    function getWidth() {
        return _width;
    }
    exports.getWidth = getWidth;

    /**
    * @param height
    * @returns {ISVM}
    */
    function setHeight(height) {
        _height = height;

        return SELF;
    }
    exports.setHeight = setHeight;

    /**
    * @returns {number}
    */
    function getHeight() {
        return _height;
    }
    exports.getHeight = getHeight;

    /**
    * @param c
    * @returns {ISVM}
    */
    function setComplexity(c) {
        _teacher.setComplexity(c);

        return SELF;
    }
    exports.setComplexity = setComplexity;

    /**
    * @param scale
    * @returns {ISVM}
    */
    function setScale(scale) {
        _scale = scale;

        return SELF;
    }
    exports.setScale = setScale;

    /**
    * @returns {number}
    */
    function getScale() {
        return _scale;
    }
    exports.getScale = getScale;

    /**
    * @param delta
    * @returns {ISVM}
    */
    function setDensity(delta) {
        _density = delta;

        return SELF;
    }
    exports.setDensity = setDensity;

    /**
    * @returns {number}
    */
    function getDensity() {
        return _density;
    }
    exports.getDensity = getDensity;

    /**
    * @param teacher
    * @returns {ISVM}
    */
    function setTeacher(teacher) {
        _teacher = teacher;

        return SELF;
    }
    exports.setTeacher = setTeacher;

    /**
    * @param kernel
    * @returns {ISVM}
    */
    function setKernel(kernel) {
        if (kernel instanceof Kernel.Base) {
            console.log(kernel.getAttributes());
        }

        _kernel = kernel;

        return SELF;
    }
    exports.setKernel = setKernel;

    /**
    * @returns {IKernel}
    */
    function getKernel() {
        return _kernel;
    }
    exports.getKernel = getKernel;

    /**
    * @param properties
    * @returns {ISVM}
    */
    function setKernelProperties(properties) {
        properties.forEach(function (kernelProperty) {
            _kernel[kernelProperty.name] = kernelProperty.value;
        });

        return SELF;
    }
    exports.setKernelProperties = setKernelProperties;

    /**
    * @param name
    * @param value
    * @returns {ISVM}
    */
    function setKernelProperty(name, value) {
        _kernel[name] = value;

        return SELF;
    }
    exports.setKernelProperty = setKernelProperty;

    /**
    * @param inputs
    * @param labels
    * @returns {ISVM}
    */
    function train(inputs, labels) {
        if (!_kernel) {
            throw "Please specify a kernel";
        }

        if (!_machine) {
            _machine = new Engine.KernelSupportVectorMachine(_kernel, inputs[0].length);
        }

        if (!_teacher) {
            _teacher = new Learning.SequentialMinimalOptimization(_machine, inputs, labels);
        }

        _teacher.run();

        /*var resultsA = [], resultsB = [];
        for (var x = 0.0; x <= getWidth(); x += getDensity()) {
        for (var y = 0.0; y <= getHeight(); y += getDensity()) {
        var vector = [
        (x - getWidth() / 2) / getScale(),
        (y - getHeight() / 2) / getScale()
        ],
        decision = _teacher.machine.compute(vector);
        
        if (decision > 0) {
        resultsA.push(vector);
        }
        else {
        resultsB.push(vector);
        }
        }
        }
        return [
        resultsA,
        resultsB
        ];*/
        return SELF;
    }
    exports.train = train;

    /**
    * @returns {IRenderer}
    */
    function retrain() {
        _teacher.run();

        return exports.render();
    }
    exports.retrain = retrain;

    /**
    * @param renderer
    * @returns {ISVM}
    */
    function setRenderer(renderer) {
        _renderer = renderer;

        return SELF;
    }
    exports.setRenderer = setRenderer;

    /**
    * @returns {IRenderer}
    */
    function render() {
        if (!_renderer) {
            _renderer = new Renderer.Canvas(_teacher);
        }

        return _renderer.render();
    }
    exports.render = render;
});
//# sourceMappingURL=SupportVectorMachine.js.map
