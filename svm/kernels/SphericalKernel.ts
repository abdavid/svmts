///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {
    /**
     * The spherical kernel comes from a statistics perspective. It is an example
     * of an isotropic stationary kernel and is positive definite in R^3.
     */
    export class SphericalKernel implements IKernel {

        public sigma:number;

        /**
         * @param sigma
         */
        constructor(sigma:number = 1.0)
        {
            this.sigma = sigma;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var norm = 0.0;
            for(var i = 0; i < x.length; i++)
            {
                var d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

            if(norm >= this.sigma)
            {
                return 0;
            }
            else
            {
                norm = norm / this.sigma;
                return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
            }

        }
    }
}
