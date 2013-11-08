///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />


module SVM.Kernels
{
    export class PolynominalKernel extends BaseKernel implements IKernel, IDistance
    {
        public properties = {
            degree : {
                type: 'number',
                value: 0
            },
            constant : {
                type: 'number',
                value: 0
            }
        }

        /**
         * @param degree
         * @param constant
         */
        constructor(degree:number = 1.0, constant:number = 1.0)
        {
            super();

            this.setProperty('degree', degree);
            this.setProperty('constant', constant);
        }

        /**
         * Polynomial kernel function.
         *
         * @param x Vector X in input space
         * @param y Vector Y in input space
         * @returns {number} Dot product in feature (kernel) space
         */
        public run(x:number[], y:number[]):number
        {
            var sum = this.properties.constant.value;
            for(var i = 0; i < x.length; i++)
            {
                sum += x[i] * y[i];
            }
            return Math.pow(sum, this.properties.degree.value);
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
            var q = 1.0 / this.properties.degree.value;

            return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
        }
    }
}
