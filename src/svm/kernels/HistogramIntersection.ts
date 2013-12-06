/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

/**
 * Generalized Histogram Intersection Kernel.
 *
 * The Generalized Histogram Intersection kernel is built based on the
 * Histogram Intersection Kernel for image classification but applies
 * in a much larger variety of contexts (Boughorbel, 2005).
 */
export class HistogramIntersection extends Kernel.Base implements IKernel
{
    private _beta:number;
    private _alpha:number;

    public attributes = [
        {
            name: 'alpha',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        },
        {
            name: 'beta',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param alpha
     * @param beta
     */
    constructor(alpha:number = 1, beta:number = 1)
    {
        super();

        this.alpha = alpha;
        this.beta = beta;
    }

    /**
     * @returns {number}
     */
    get alpha():number
    {
        return this._alpha;
    }

    /**
     * @param value
     */
    set alpha(value:number)
    {
        this._alpha = value;
    }

    /**
     * @returns {number}
     */
    get beta():number
    {
        return this._beta;
    }

    /**
     * @param value
     */
    set beta(value:number)
    {
        this._beta = value;
    }

    /**
     * @param x
     * @param y
     * @returns {number}
     */
    public run(x:number[], y:number[]):number
    {
        var sum = 0.0;
        for(var i = 0; i < x.length; i++)
        {
            sum += Math.min(
                Math.pow(Math.abs(x[i]), this.alpha),
                Math.pow(Math.abs(y[i]), this.beta)
            );
        }

        return sum;
    }
}

