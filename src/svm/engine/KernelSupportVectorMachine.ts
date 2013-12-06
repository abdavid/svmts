/**
 * Created by davidatborresen on 03.12.13.
 */

///<reference path='../interfaces/IKernel.ts' />

import Engine = require('./SupportVectorMachine')

export class KernelSupportVectorMachine extends Engine.SupportVectorMachine
{
    private kernel:IKernel;

    /**
     * Creates a new Kernel Support Vector Machine.
     * @param kernel The chosen kernel for the machine.
     * @param inputs The number of inputs for the machine
     *
     * @remark If the number of inputs is zero, this means the machine
     * accepts a indefinite number of inputs. This is often the
     * case for kernel vector machines using a sequence kernel.
     */
        constructor(kernel:IKernel = null,inputs:number = 0)
    {
        super(inputs);

        if(kernel === null)
        {
            throw new Error('No kernel specified. Please select a kernel to use.');
        }

        this.setKernel(kernel);
    }

    /**
     *  Sets the kernel used by this machine.
     * @param kernel
     */
    public setKernel(kernel:IKernel)
    {
        this.kernel = kernel;
    }

    /**
     *  Gets the kernel used by this machine.
     * @returns {IKernel}
     */
    public getKernel():IKernel
    {
        return this.kernel;
    }

    /**
     * @param inputs
     * @returns {number}
     */
    public compute(inputs:number[]):number
    {
        var output = this.getThreshold();

        if(this.isCompact())
        {
            for(var i = 0; i < this.weights.length; i++)
            {
                output += this.getWeight(i) * inputs[i];
            }
        }
        else
        {
            for(var i = 0; i < this.supportVectors.length; i++)
            {
                output += this.getWeight(i) * this.kernel.run(this.getSupportVector(i), inputs);
            }
        }

        return !isNaN(output) && output >= 0 ? 1 : -1;
    }
}