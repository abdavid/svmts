/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />

/**
 * Laplacian Kernel.
 */
class LaplacianKernel implements IKernel {

    public sigma:number;
    public gamma:number;

    constructor(gamma:number = 1, sigma:number = 1)
    {
        this.sigma = sigma;
        this.gamma = gamma;
    }


    public run(x:number[], y:number[]):number
    {
        if(x == y) return 1.0;

        var norm = 0.0, d;
        for(var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        norm = Math.sqrt(norm);

       return Math.exp(-this.gamma * norm);
    }
}