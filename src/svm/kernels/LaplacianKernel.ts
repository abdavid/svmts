/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {

    /**
     * Laplacian Kernel.
     */
    export class LaplacianKernel extends BaseKernel implements IKernel, IDistance
    {
        constructor()
        {
            super();
            super.initialize({
                gamma : {
                    type: PropertyType.NUMBER,
                    value: 1,
                    writable: true
                },
                sigma : {
                    type: PropertyType.NUMBER,
                    value: 1,
                    writable: true
                }
            });
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

            return Math.exp(-this.gamma * norm);
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

            return (1.0 / -this.gamma) * Math.log(1.0 - 0.5 * norm);
        }
    }
}
