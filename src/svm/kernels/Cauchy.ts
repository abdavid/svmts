/**
 * Created by davidatborresen on 9/3/13.
 */
///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

/**
 * @class Cauchy
 *
 * @summary
 * The Cauchy kernel comes from the Cauchy distribution (Basak, 2008). It is a
 * long-tailed kernel and can be used to give long-range influence and sensitivity
 * over the high dimension space.
 */
export class Cauchy extends Kernel.Base implements IKernel
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

    get sigma():number
    {
        return this._sigma;
    }

    set sigma(value:number)
    {
        this._sigma = value;
    }

    public run(x:number[], y:number[]):number
    {
        // Optimization in case x and y are
        // exactly the same object reference.
        if(x == y)
        {
            return 1.0;
        }

        var norm = 0.0;
        for(var i = 0; i < x.length; i++)
        {
            var d = x[i] - y[i];
            norm += d * d;
        }

        return (1.0 / (1.0 + norm / this.sigma));

    }
}

