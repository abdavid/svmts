/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />

import Kernel = require('./Base');

/**
 * @class Sigmoid
 * Sigmoid kernel of the form k(x,z) = tanh(a * x'z + c).
 * Sigmoid _kernels are only conditionally positive definite for some values of a and c,
 * and therefore may not induce a reproducing kernel Hilbert space. However, they have been successfully
 * used in practice (Scholkopf and Smola, 2002).
 *
 * @TODO add estimation function for initialization of kernel correctly.
 */
export class Sigmoid extends Kernel.Base implements IKernel
{
    private _constant:number;
    private _alpha:number;

    public attributes = [
        {
            name: 'constant',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        },
        {
            name: 'alpha',
            type: Kernel.PropertyType.NUMBER,
            writable: true
        }
    ];

    /**
     * @param alpha
     * @param constant
     */
    constructor(alpha:number = 0.01, constant:number = -Math.E)
    {
        super();

        this.alpha = alpha;
        this.constant = constant;
    }

    /**
     * @returns {number}
     */
    get alpha():number
    {
        return this._alpha;
    }

    /**
     * @param value
     */
    set alpha(value:number)
    {
        this._alpha = value;
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
     * Sigmoid kernel function.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Dot product in feature (kernel) space
     */
    public run(x:number[], y:number[]):number
    {
        var sum = 0.0;

        for(var i = 0; i < x.length; i++)
        {
            sum += x[i] * y[i];
        }

        return this.tanh(this.alpha * sum + this.constant);
    }

    /**
     * TanH function.
     *
     * @todo review this. FF14 apparently handles this poorly,
     * while chrome handles it just fine.
     *
     * @param arg
     * @returns {number}
     */
    private tanh(arg)
    {
        var pos = Math.exp(arg),
            neg = Math.exp(-arg);

        return (pos - neg) / (pos + neg);
    }
}

