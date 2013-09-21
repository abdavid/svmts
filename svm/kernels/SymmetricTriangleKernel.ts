///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {
    /**
     * Symmetric Triangle Kernel.
     */
    export class SymmetricTriangleKernel implements IKernel {

        public gamma:number;

        /**
         * @param gamma
         */
        constructor(gamma:number = 1.0)
        {
            this.gamma = gamma;
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

            var z = 1.0 - this.gamma * Math.sqrt(norm);

            return (z > 0) ? z : 0;
        }

    }
}