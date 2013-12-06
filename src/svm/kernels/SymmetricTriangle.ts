///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

/**
 * Symmetric Triangle Kernel.
 */
export class SymmetricTriangle extends Kernel.Base implements IKernel
{
    private _gamma:number;

    public attributes = [
        {
            name: 'gamma',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param gamma
     */
    constructor(gamma:number = 1.0)
    {
        super();

        this.gamma = gamma;
    }

    /**
     * @returns {number}
     */
    get gamma():number
    {
        return this._gamma;
    }

    /**
     * @param value
     */
    set gamma(value:number)
    {
        this._gamma = value;
    }

    /**
     * @param x
     * @param y
     * @returns {number}
     */
    public run(x:number[], y:number[]):number
    {
        var norm = 0.0, d;
        for(var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        var z = 1.0 - this.gamma * Math.sqrt(norm);

        return (z > 0) ? z : 0;
    }

}
