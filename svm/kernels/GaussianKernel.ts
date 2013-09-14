///<reference path='../interfaces/IKernel.ts' />
///<reference path='../interfaces/IDistance.ts' />

/**
 * The Gaussian kernel requires tuning for the proper value of σ. Different approaches
 * to this problem includes the use of brute force (i.e. using a grid-search algorithm)
 * or a gradient ascent optimization.
 *
 * P. F. Evangelista, M. J. Embrechts, and B. K. Szymanski. Some Properties of the
 * Gaussian Kernel for One Class Learning.
 * Available on: http://www.cs.rpi.edu/~szymansk/papers/icann07.pdf
 */

class GaussianKernel implements IKernel, IDistance
{
    private _sigma:number;
    private _gamma:number;

    /**
     * @param sigma
     */
    constructor(sigma:number = 1)
    {
        this.sigma(sigma);
    }

    /**
     * Gaussian Kernel function.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Dot product in feature (kernel) space
     */
    public run(x:number[], y:number[]):number
    {
        // Optimization in case x and y are
        // exactly the same object reference.
        if(x === y)
        {
            return 1.0;
        }

        var norm = 0.0, d;

        if(typeof x == 'undefined')
        {
            var foo = true;
        }

        for (var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        return Math.exp(-this.gamma() * norm);
    }

    /**
     * Computes the distance in input space
     * between two points given in feature space.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Distance between x and y in input space.
     */
    public distance(x:any, y:number[]):number
    {
        if(typeof x === 'number')
        {
            return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * x);
        }
        else if(x === y)
        {
            return 0.0;
        }

        var norm = 0.0, d;
        for (var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * norm);
    }

    /**
     * Gets or sets the sigma value for the kernel.
     * When setting sigma, gamma gets updated accordingly (gamma = 0.5/sigma^2).
     *
     * @param sigma
     */
    public sigma(sigma:any = null):any
    {
        if(!sigma)
        {
            return this._sigma;
        }

        this._sigma = Math.sqrt(sigma);
        this._gamma =  1.0 / (2.0 * sigma * sigma);
    }

    /**
     * Gets or sets the sigma² value for the kernel.
     * When setting sigma², gamma gets updated accordingly (gamma = 0.5/sigma²).
     *
     * @param sigma
     * @returns {number}
     */
    public sigmaSquared(sigma:any = null):any
    {
        if(!sigma)
        {
            return this._sigma * this._sigma;
        }

        this._sigma = Math.sqrt(sigma);
        this._gamma = 1.0 / (2.0 * sigma)
    }

    /**
     * Gets or sets the gamma value for the kernel.
     * When setting gamma, sigma gets updated accordingly (gamma = 0.5/sigma^2).
     *
     * @param gamma
     * @returns {number}
     */
    public gamma(gamma:number = null):any
    {
        if(!gamma)
        {
            return this._gamma;
        }

        this._gamma = gamma;
        this._sigma = Math.sqrt(1.0 / (gamma * 2.0));
    }
}