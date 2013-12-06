///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

export class Polynominal extends Kernel.Base implements IKernel, IDistance {

    private _degree:number;
    private _constant:number;

    public attributes = [
        {
            name: 'degree',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        },
        {
            name: 'constant',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param degree
     * @param constant
     */
    constructor(degree:number = 1.0, constant:number = 1.0)
    {
        super();

        this.degree = degree;
        this.constant = constant;
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
     * @returns {number}
     */
    get constant():number
    {
        return this._constant;
    }

    /**
     * @param value
     */
    set constant(value:number)
    {
        this._constant = value;
    }

    /**
     * Polynomial kernel function.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Dot product in feature (kernel) space
     */
    public run(x:number[], y:number[]):number
    {
        var sum = this.constant;
        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return Math.pow(sum, this.degree);
    }

    /**
     * Computes the distance in input space
     * between two points given in feature space.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Distance between x and y in input space.
     */
    public distance(x:number[], y:number[]):number
    {
        var q = 1.0 / this.degree;

        return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
    }
}

