/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {

    /**
     * Laplacian Kernel.
     */
    export class LaplacianKernel extends BaseKernel implements IKernel, IDistance {

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
         * @param gamma
         * @param sigma
         */
        constructor(gamma:number = 1, sigma:number = 1)
        {
            super();

            this.setProperty('sigma',sigma);
            this.setProperty('gamma',gamma);
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

            return Math.exp(-this.properties.gamma.value * norm);
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
            if(x == y)
            {
                return 0.0;
            }

            var norm = 0.0, d;
            for(var i = 0; i < x.length; i++)
            {
                d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

            return (1.0 / -this.properties.gamma.value) * Math.log(1.0 - 0.5 * norm);
        }
    }
}
