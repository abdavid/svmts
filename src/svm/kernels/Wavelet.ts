///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

export class Wavelet extends Kernel.Base implements IKernel
{
    private _dialation:number;
    private _translation:number;
    private _invariant:boolean;

    public attributes = [
        {
            name: 'dialation',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        },
        {
            name: 'translation',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        },
        {
            name: 'invariant',
            type: Kernel.PropertyType.BOOLEAN,
            writable: true
        }
    ];

    /**
     * @param dialation
     * @param translation
     * @param invariant
     */
    constructor(dialation:number = 1.0, translation:number = 1.0, invariant:boolean = false)
    {
        super();

        this.dialation = dialation;
        this.translation = translation;
        this.invariant = invariant;
    }

    /**
     * @returns {number}
     */
    get dialation():number
    {
        return this._dialation;
    }

    /**
     * @param value
     */
    set dialation(value:number)
    {
        this._dialation = value;
    }

    /**
     * @returns {number}
     */
    get translation():number
    {
        return this._translation;
    }

    /**
     * @param value
     */
    set translation(value:number)
    {
        this._translation = value;
    }

    /**
     * @returns {boolean}
     */
    get invariant():boolean
    {
        return this._invariant;
    }

    /**
     * @param value
     */
    set invariant(value:boolean)
    {
        this._invariant = value;
    }

    /**
     * @param x
     * @param y
     * @returns {number}
     */
    public run(x:number[], y:number[]):number
    {
        var prod = 1.0;

        if(this.invariant)
        {
            for(var i = 0; i < x.length; i++)
            {
                prod *= (this.mother((x[i] - this.translation) / this.dialation)) *
                    (this.mother((y[i] - this.translation) / this.dialation));
            }
        }
        else
        {
            for(var i = 0; i < x.length; i++)
            {
                prod *= this.mother((x[i] - y[i] / this.dialation));
            }
        }

        return prod;
    }

    /**
     * @param x
     * @returns {number}
     */
    private mother(x:number):number
    {
        return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
    }
}

