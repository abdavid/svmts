/**
 * Created by davidatborresen on 9/1/13.
 */

///<reference path='../interfaces/Interfaces.ts' />

module SVM.Renderer {

    var _width = window.innerWidth;
    var _height = window.innerHeight;
    var _scale = 50.0;
    var _density = 4.0;

    /**
     * @param width
     */
    export function setWidth(width:number):void
    {
        _width = width;
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
     */
    export function setHeight(height:number):void
    {
        _height = height;
    }

    /**
     * @returns {number}
     */
    export function getHeight():number
    {
        return _height;
    }

    /**
     * @param scale
     */
    export function setScale(scale:number):void
    {
        _scale = scale;
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
     */
    export function setDensity(delta:number):void
    {
        _density = delta;
    }

    /**
     * @returns {number}
     */
    export function getDensity():number
    {
        return _density;
    }


    export class Engine {
        teacher:ISupportVectorMachineLearning;
    }


}


