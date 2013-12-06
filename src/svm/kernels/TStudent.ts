/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

export class TStudent extends Kernel.Base implements IKernel
{
    private _degree:number;

    public attributes = [
        {
            name: 'degree',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];
    /**
     * @param degree
     */
    constructor(degree:number = 1)
    {
        super();

        this.degree = degree;
    }

    /**
     * @returns {number}
     */
    get degree():number
    {
        return this._degree;
    }

    /**
     * @param value
     */
    set degree(value:number)
    {
        this._degree = value;
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

        return 1.0 / (1.0 + Math.pow(norm, this.degree));
    }
}

