/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='./SupportVectorMachine.ts' />
///<reference path='./interfaces/IKernel.ts' />

class KernelSupportVectorMachine extends SupportVectorMachine
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

        var weights = this.getWeights();
        if(this.isCompact())
        {
            for(var i = 0; i < weights.length; i++)
            {
                output += weights[i] * inputs[i];
            }
        }
        else
        {
            var supportVectors = this.getSupportVectors();
            for(var i = 0; i < supportVectors.length; i++)
            {
                output += weights[i] * this.kernel.run(supportVectors[i], inputs);
            }
        }

        /*if(this.isProbabilistic())
        {
            output = this.link().inverse(output);
            return output >= 0.5 ? 1 : -1;
        }*/

        return output;// >= 0 ? 1 : -1;
    }
}
