
///<reference path='../interfaces/IKernel.ts' />

/**
 * Squared Sinc Kernel.
 */
class SquaredSincKernel implements IKernel {

    public gamma:number;

    constructor(gamma:number = 1.0)
    {
        this.gamma = gamma;
    }

    public run(x:number[], y:number[]):number
    {
        var norm = 0.0, d;
        for(var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        var num = this.gamma * Math.sqrt(norm);
        var den = this.gamma * this.gamma * norm;

        return Math.sin(num) / den;
    }
}