///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base')

export class Linear extends Kernel.Base implements IKernel, IDistance {

    private _constant;

    public attributes = [
        {
            name: 'constant',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param constant
     */
    constructor(constant:number = 1)
    {
        super();

        this.constant = constant;
    }

    /**
     * @returns {*}
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
     * Linear kernel function.
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

        return sum;
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
        return this.run(x, x) + this.run(y, y) - 2.0 * this.run(x, y);
    }
}
