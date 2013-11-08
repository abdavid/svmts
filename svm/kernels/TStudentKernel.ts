/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels
{

    export class TStudentKernel extends BaseKernel implements IKernel
    {
        public properties = {
            degree : {
                type: 'number',
                value: 0
            }
        }

        /**
         * @param degree
         */
        constructor(degree:number = 1)
        {
            super();

            this.properties.degree.value = degree;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var norm = 0.0;
            for(var i = 0; i < x.length; i++)
            {
                var d = x[i] - y[i];
                norm += d * d;
            }
            norm = Math.sqrt(norm);

            return 1.0 / (1.0 + Math.pow(norm, this.properties.degree.value));
        }
    }
}
