///<reference path='../interfaces/Interfaces.ts' />


module SVM.Kernels
{
    export class PolynominalKernel implements IKernel, IDistance
    {
        private _degree:number;
        private _constant:number;

        /**
         * @param degree
         * @param constant
         */
        constructor(degree:number = 1.0, constant:number = 1.0)
        {
            this._degree = degree;
            this._constant = constant;
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
            var sum = this._constant;
            for(var i = 0; i < x.length; i++)
            {
                sum += x[i] * y[i];
            }
            return Math.pow(sum, this._degree);
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
            var q = 1.0 / this._degree;

            return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
        }
    }
}
