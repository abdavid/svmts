///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />


module SVM.Kernels {

    export class LinearKernel extends BaseKernel implements IKernel, IDistance
    {
        public properties = {
            constant : {
                type: 'number',
                value: 0
            }
        }

        /**
         * @param constant
         */
        constructor(constant:number = 1)
        {
            super();

            this.properties.constant.value = constant;
        }

        /**
         * Linear kernel function.
         *
         * @param x Vector X in input space
         * @param y Vector Y in input space
         * @returns {number} Dot product in feature (kernel) space
         */
        public run(x:number[], y:number[]):number
        {
            var sum = this.properties.constant.value;

            for (var i = 0; i < x.length; i++)
            {
                sum += x[i] * y[i];
            }

            return sum;
        }

        /**
         * Computes the distance in input space
         * between two points given in feature space.
         *
         * @param x Vector X in input space
         * @param y Vector Y in input space
         * @returns {number} Distance between x and y in input space.
         */
        public distance(x:number[], y:number[]):number
        {
            return this.run(x, x) + this.run(y ,y) - 2.0 * this.run(x ,y);
        }
    }
}
