///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {

    /**
     * Tensor Product combination of Kernels.
     */
    export class TensorKernel implements IKernel
    {

        private _kernels:IKernel[];

        /**
         * @param kernels
         */
        constructor(kernels:IKernel[])
        {
            this._kernels = kernels;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var product = 1.0;
            for(var i = 0; i < this._kernels.length; i++)
            {
                product *= this._kernels[i].run(x, y);
            }

            return product;
        }
    }
}
