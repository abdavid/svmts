///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />


import Kernel = require('./Base');

/**
 * Infinite Spline Kernel function.
 */
export class Spline extends Kernel.Base implements IKernel
{
        constructor()
        {
            super();
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var k = 1;
            for(var i = 0; i < x.length; i++)
            {
                var min = Math.min(x[i], y[i]);
                var xy = x[i] * y[i];

                k *= 1.0 + xy + xy * min - ((x[i] + y[i]) / 2.0) * min * min + (min * min * min) / 3.0;
            }

            return k;
        }
    }

