/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

/**
 * Laplacian Kernel.
 */
export class Laplacian extends Kernel.Base implements IKernel, IDistance
{
    private _gamma:number;
    private _sigma:number;

    public attributes = [
        {
            name: 'gamma',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        },
        {
            name: 'sigma',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param gamma
     * @param sigma
     */
    constructor(gamma:number = 1, sigma:number = 1)
    {
        super();

        this.gamma = gamma;
        this.sigma = sigma;
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
        if(x == y)
        {
            return 1.0;
        }

        var norm = 0.0, d;
        for(var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        norm = Math.sqrt(norm);

        return Math.exp(-this.gamma * norm);
    }

    /**
     * Computes the distance in input space
     * between two points given in feature space.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Distance between x and y in input space.
     */
    public distance(x:any, y:number[]):number
    {
        if(x == y)
        {
            return 0.0;
        }

        var norm = 0.0, d;
        for(var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        norm = Math.sqrt(norm);

        return (1.0 / -this.gamma) * Math.log(1.0 - 0.5 * norm);
    }
}

