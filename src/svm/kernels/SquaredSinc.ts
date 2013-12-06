///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />


import Kernel = require('./Base');

/**
 * Squared Sinc Kernel.
 */
export class SquaredSinc extends Kernel.Base implements IKernel
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
    constructor(gamma:number = 1)
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

        var num = this.gamma * Math.sqrt(norm);
        var den = this.gamma * this.gamma * norm;

        return Math.sin(num) / den;
    }
}
