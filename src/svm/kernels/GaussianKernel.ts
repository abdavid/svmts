///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {

    /**
     * @class GaussianKernel
     *
     * @summary
     * The Gaussian kernel requires tuning for the proper value of σ. Different approaches
     * to this problem includes the use of brute force (i.e. using a grid-search algorithm)
     * or a gradient ascent optimization.
     *
     * P. F. Evangelista, M. J. Embrechts, and B. K. Szymanski. Some Properties of the
     * Gaussian Kernel for One Class Learning.
     * Available on: http://www.cs.rpi.edu/~szymansk/papers/icann07.pdf
     */
    export class GaussianKernel extends BaseKernel implements IKernel, IDistance
    {
        public properties = {
            gamma : {
                type: 'number',
                value: 0
            },
            sigma : {
                type: 'number',
                value: 0
            }
        }

        /**
         * @param sigma
         */
        constructor(sigma:number = 1)
        {
            super();

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

            for(var i = 0; i < x.length; i++)
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
            for(var i = 0; i < x.length; i++)
            {
                d = x[i] - y[i];
                norm += d * d;
            }

            return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * norm);
        }

        /**
         * Gets or sets the _sigma value for the kernel.
         * When setting _sigma, _gamma gets updated accordingly (_gamma = 0.5/_sigma^2).
         *
         * @param sigma
         */
        public sigma(sigma:any = null):any
        {
            if(!sigma)
            {
                return this.properties.sigma.value;
            }

            this.properties.sigma.value = Math.sqrt(sigma);
            this.properties.gamma.value = 1.0 / (2.0 * sigma * sigma);
        }

        /**
         * Gets or sets the _sigma² value for the kernel.
         * When setting _sigma², _gamma gets updated accordingly (_gamma = 0.5/_sigma²).
         *
         * @param sigma
         * @returns {number}
         */
        public sigmaSquared(sigma:any = null):any
        {
            if(!sigma)
            {
                return this.properties.sigma.value * this.properties.sigma.value;
            }

            this.properties.sigma.value = Math.sqrt(sigma);
            this.properties.gamma.value = 1.0 / (2.0 * sigma)
        }

        /**
         * Gets or sets the _gamma value for the kernel.
         * When setting _gamma, _sigma gets updated accordingly (_gamma = 0.5/_sigma^2).
         *
         * @param gamma
         * @returns {number}
         */
        public gamma(gamma:number = null):any
        {
            if(!gamma)
            {
                return this.properties.gamma.value;
            }

            this.properties.gamma.value = gamma;
            this.properties.sigma.value = Math.sqrt(1.0 / (gamma * 2.0));
        }
    }
}
