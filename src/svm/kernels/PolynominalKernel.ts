///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />


module SVM.Kernels
{
    export class PolynominalKernel extends BaseKernel implements IKernel, IDistance
    {
        constructor()
        {
            super();
            super.initialize({
                degree: {
                    type: PropertyType.NUMBER,
                    value: 1.0,
                    writable: true
                },
                constant: {
                    type: PropertyType.NUMBER,
                    value: 1.0,
                    writable: true
                }
            });
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
            var sum = this.constant;
            for(var i = 0; i < x.length; i++)
            {
                sum += x[i] * y[i];
            }
            return Math.pow(sum, this.degree);
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
            var q = 1.0 / this.degree;

            return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
        }
    }
}
