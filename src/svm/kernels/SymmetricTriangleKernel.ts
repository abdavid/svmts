///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {

    /**
     * Symmetric Triangle Kernel.
     */
    export class SymmetricTriangleKernel extends BaseKernel implements IKernel
    {
        public properties = {
            gamma : {
                type:'number',
                value:0
            }
        };

        /**
         * @param gamma
         */
        constructor(gamma:number = 1.0)
        {
            super();

            this.properties.gamma.value = gamma;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var norm = 0.0, d;
            for(var i = 0; i < x.length; i++)
            {
                d = x[i] - y[i];
                norm += d * d;
            }

            var z = 1.0 - this.properties.gamma.value * Math.sqrt(norm);

            return (z > 0) ? z : 0;
        }

    }
}