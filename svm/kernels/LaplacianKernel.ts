/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {

    /**
     * Laplacian Kernel.
     */
    export class LaplacianKernel implements IKernel {

        public _sigma:number;
        public _gamma:number;

        /**
         * @param gamma
         * @param sigma
         */
        constructor(gamma:number = 1, sigma:number = 1)
        {
            this._sigma = sigma;
            this._gamma = gamma;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            if(x == y)
            {
                return 1.0;
            }

            var norm = 0.0, d;
            for(var i = 0; i < x.length; i++)
            {
                d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

            return Math.exp(-this._gamma * norm);
        }
    }
}
