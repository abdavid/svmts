/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='./../definitions/require.d.ts' />

///<reference path='./interfaces/ICollection.ts' />
///<reference path='./interfaces/IRenderer.ts' />
///<reference path='./interfaces/ISupportVectorMachine.ts' />
///<reference path='./engine/KernelSupportVectorMachine.ts' />

///<reference path='./kernels/Linear.ts' />
///<reference path='./learning/SequentialMinimalOptimization.ts' />
///<reference path='./utils/helpers.ts' />

import Kernel = require('./kernels/Base');
import Learning = require('./learning/SequentialMinimalOptimization');
import Renderer = require('./renderers/Canvas');
import Engine = require('./engine/KernelSupportVectorMachine');
import SELF = require('./SupportVectorMachine');


var _kernel:IKernel = null;
var _machine:KernelSupportVectorMachine = null;
var _teacher:ISupportVectorMachineLearning = null;
var _renderer:IRenderer = null;
var _width:number = null;
var _height:number = null;
var _scale:number = 50.0;
var _density:number = 2.5;

/**
 * @param width
 * @returns {SVM}
 */
export function setWidth(width:number):ISVM
{
    _width = width;

    return <ISVM>SELF;
}

/**
 * @returns {number}
 */
export function getWidth():number
{
    return _width;
}

/**
 * @param height
 * @returns {ISVM}
 */
export function setHeight(height:number):ISVM
{
    _height = height;

    return <ISVM>SELF;
}

/**
 * @returns {number}
 */
export function getHeight():number
{
    return _height;
}

/**
 * @param c
 * @returns {ISVM}
 */
export function setComplexity(c:number):ISVM
{
    _teacher.setComplexity(c);

    return <ISVM>SELF;
}

/**
 * @param scale
 * @returns {ISVM}
 */
export function setScale(scale:number):ISVM
{
    _scale = scale;

    return <ISVM>SELF;
}

/**
 * @returns {number}
 */
export function getScale():number
{
    return _scale;
}

/**
 * @param delta
 * @returns {ISVM}
 */
export function setDensity(delta:number):ISVM
{
    _density = delta;

    return <ISVM>SELF;
}

/**
 * @returns {number}
 */
export function getDensity():number
{
    return _density;
}

/**
 * @param teacher
 * @returns {ISVM}
 */
export function setTeacher(teacher:ISupportVectorMachineLearning):ISVM
{
    _teacher = teacher;

    return <ISVM>SELF;
}

/**
 * @param kernel
 * @returns {ISVM}
 */
export function setKernel(kernel:IKernel):ISVM
{
    if (kernel instanceof Kernel.Base)
    {
        console.log(kernel.getAttributes());
    }

    _kernel = kernel;

    return <ISVM>SELF;
}

/**
 * @returns {IKernel}
 */
export function getKernel():IKernel
{
    return _kernel;
}

/**
 * @param properties
 * @returns {ISVM}
 */
export function setKernelProperties(properties:IKernelProperty[]):ISVM
{
    properties.forEach((kernelProperty:IKernelProperty)=> {
        _kernel[kernelProperty.name] = kernelProperty.value;
    });

    return <ISVM>SELF;
}

/**
 * @param name
 * @param value
 * @returns {ISVM}
 */
export function setKernelProperty(name:string, value:any):ISVM
{
    _kernel[name] = value;

    return <ISVM>SELF;
}

/**
 * @param inputs
 * @param labels
 * @returns {ISVM}
 */
export function train(inputs:number[][], labels:number[]):ISVM
{
    if (!_kernel) {
        throw "Please specify a kernel";
    }

    if (!_machine)
    {
        _machine = new Engine.KernelSupportVectorMachine(_kernel, inputs[0].length);
    }

    if (!_teacher)
    {
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

    return <ISVM>SELF;
}

/**
 * @returns {IRenderer}
 */
export function retrain():IRenderer
{
    _teacher.run();

    return render();
}

/**
 * @param renderer
 * @returns {ISVM}
 */
export function setRenderer(renderer:IRenderer):ISVM
{
    _renderer = renderer;

    return <ISVM>SELF;
}

/**
 * @returns {IRenderer}
 */
export function render():IRenderer
{
    if (!_renderer) {
        _renderer = new Renderer.Canvas(_teacher);
    }

    return _renderer.render();
}