
///<reference path='../interfaces/IKernel.ts' />

/**
 * Tensor Product combination of Kernels.
 */
class TensorKernel implements IKernel {

    public kernels:IKernel[];

    constructor(kernels:IKernel[])
    {
        this.kernels = kernels;
    }

    public run(x:number[], y:number[]):number
    {
        var product = 1.0;
        for(var i = 0; i < this.kernels.length; i++)
        {
            product *= this.kernels[i].run(x, y);
        }

        return product;
    }
}