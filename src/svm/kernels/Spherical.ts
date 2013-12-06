///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

/**
 * The spherical kernel comes from a statistics perspective. It is an example
 * of an isotropic stationary kernel and is positive definite in R^3.
 */
export class Spherical extends Kernel.Base implements IKernel
{
    private _sigma:number;

    public attributes = [
        {
            name: 'sigma',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param sigma
     */
    constructor(sigma:number = 1.0)
    {
        super();

        this.sigma = sigma;
    }

    /**
     * @returns {number}
     */
    get sigma():number
    {
        return this._sigma;
    }

    /**
     * @param value
     */
    set sigma(value:number)
    {
        this._sigma = value;
    }

    /**
     * @param x
     * @param y
     * @returns {number}
     */
    public run(x:number[], y:number[]):number
    {
        var norm = 0.0;
        for(var i = 0; i < x.length; i++)
        {
            var d = x[i] - y[i];
            norm += d * d;
        }

        norm = Math.sqrt(norm);

        if(norm >= this.sigma)
        {
            return 0;
        }
        else
        {
            norm = norm / this.sigma;
            return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
        }

    }
}