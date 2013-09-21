///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {
    /**
     * Tensor Product combination of Kernels.
     */
    export class TensorKernel implements IKernel {

        public kernels:IKernel[];

        /**
         * @param kernels
         */
        constructor(kernels:IKernel[])
        {
            this.kernels = kernels;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var product = 1.0;
            for(var i = 0; i < this.kernels.length; i++)
            {
                product *= this.kernels[i].run(x, y);
            }

            return product;
        }
    }
}
