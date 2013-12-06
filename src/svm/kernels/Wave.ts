/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

export class Wave extends Kernel.Base implements IKernel
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
    constructor(sigma:number = 1)
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

        if(this.sigma == 0 || norm == 0)
        {
            return 0;
        }
        else
        {
            return (this.sigma / norm) * Math.sin(norm / this.sigma);
        }
    }
}
