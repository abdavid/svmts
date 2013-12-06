///<reference path='../interfaces/IKernel.ts' />

import Kernel = require('./Base');

/**
 * Tensor Product combination of Kernels.
 */
export class Tensor extends Kernel.Base implements IKernel
{

    private _kernels:IKernel[];

    /**
     * @param kernels
     */
    constructor(kernels:IKernel[])
    {
        super();

        this._kernels = kernels;
    }

    /**
     * @param x
     * @param y
     * @returns {number}
     */
    public run(x:number[], y:number[]):number
    {
        var product = 1.0;
        for(var i = 0; i < this._kernels.length; i++)
        {
            product *= this._kernels[i].run(x, y);
        }

        return product;
    }
}
