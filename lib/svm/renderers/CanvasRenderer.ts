/**
 * Created by davidatborresen on 09.09.13.
 */

///<reference path='../../sge/sge.ts' />
///<reference path='../KernelSupportVectorMachine.ts' />
///<reference path='../SequentialMinimalOptimization.ts' />


class CanvasRenderer extends SGE {

    private svm:KernelSupportVectorMachine;
    private smo:SequentialMinimalOptimization;

    private density:number = 4.0;
    private ss:number = 45;

    constructor(smo:SequentialMinimalOptimization, svm:KernelSupportVectorMachine, options:SGEOptions)
    {
        super(options);

        this.svm = svm;
        this.smo = smo;
    }

    /**
     * Paints the canvas with the desicion background
     */
    public drawDesicionBackground():void
    {
        for(var x = 0.0; x <= this.width; x += this.density)
        {
            for(var y = 0.0; y <= this.height; y += this.density)
            {
                var dec = this.svm.compute([(x - this.width / 2) / this.ss, (y - this.height / 2) / this.ss]);
                if(dec > 0)
                {
                    this.ctx.fillStyle = 'rgb(150,250,150)';
                }
                else
                {
                    this.ctx.fillStyle = 'rgb(250,150,150)';
                }
                this.ctx.fillRect(x - this.density / 2 - 1, y - this.density - 1, this.density + 2, this.density + 2);
            }
        }
    }

    /**
     * Draw the axis on the canvas
     */
    public drawAxis():void
    {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgb(50,50,50)';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
    }

    public drawDataPoints():void
    {
        this.ctx.strokeStyle = 'rgb(0,0,0)';

        for(var i = 0; i < this.smo.inputs.length; i++)
        {
            console.log(this.smo.outputs);

            if(this.smo.outputs[i] == 1)
            {
                this.ctx.fillStyle = 'rgb(100,200,100)';
            }
            else
            {
                this.ctx.fillStyle = 'rgb(200,100,100)';
            }

            // distinguish support vectors
            if(this.smo.alphaA[i] > 1e-2 || this.smo.alphaB[i] > 1e-2)
            {
                this.ctx.lineWidth = 3;
            }
            else
            {
                this.ctx.lineWidth = 1;
            }

            this.drawCircle(this.smo.inputs[i][0] * this.ss + this.width / 2, this.smo.inputs[i][1] * this.ss + this.height / 2, Math.floor(3 + this.smo.alphaA[i] * 5.0 / this.smo.getComplexity()));
        }

        // if linear kernel, draw decision boundary and margin lines
        if(this.svm.getKernel() instanceof LinearKernel)
        {
            var xs = [-5, 5];
            var ys = [0, 0];
            ys[0] = (-this.smo.biasLower - this.svm.weights[0] * xs[0]) / this.svm.weights[1];
            ys[1] = (-this.smo.biasLower - this.svm.weights[0] * xs[1]) / this.svm.weights[1];

            this.ctx.fillStyle = 'rgb(0,0,0)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            // wx+b=0 line
            this.ctx.moveTo(xs[0] * this.ss + this.width / 2, ys[0] * this.ss + this.height / 2);
            this.ctx.lineTo(xs[1] * this.ss + this.width / 2, ys[1] * this.ss + this.height / 2);

            // wx+b=1 line
            this.ctx.moveTo(xs[0] * this.ss + this.width / 2, (ys[0] - 1.0 / this.svm.weights[1]) * this.ss + this.height / 2);
            this.ctx.lineTo(xs[1] * this.ss + this.width / 2, (ys[1] - 1.0 / this.svm.weights[1]) * this.ss + this.height / 2);

            // wx+b=-1 line
            this.ctx.moveTo(xs[0] * this.ss + this.width / 2, (ys[0] + 1.0 / this.svm.weights[1]) * this.ss + this.height / 2);
            this.ctx.lineTo(xs[1] * this.ss + this.width / 2, (ys[1] + 1.0 / this.svm.weights[1]) * this.ss + this.height / 2);
            this.ctx.stroke();

            // draw margin lines for support vectors. The sum of the lengths of these
            // lines, scaled by C is essentially the total hinge loss.
            for(var i = 0; i < this.smo.inputs.length; i++)
            {
                if(this.smo.alphaA[i] < 1e-2 || this.smo.alphaB[i] < 1e-2)
                {
                    continue;
                }
                if(this.smo.outputs[i] == 1)
                {
                    ys[0] = (1 - this.smo.biasLower - this.svm.weights[0] * xs[0]) / this.svm.weights[1];
                    ys[1] = (1 - this.smo.biasLower - this.svm.weights[0] * xs[1]) / this.svm.weights[1];
                }
                else
                {
                    ys[0] = (-1 - this.smo.biasLower - this.svm.weights[0] * xs[0]) / this.svm.weights[1];
                    ys[1] = (-1 - this.smo.biasLower - this.svm.weights[0] * xs[1]) / this.svm.weights[1];
                }
                var u = (this.smo.inputs[i][0] - xs[0]) * (xs[1] - xs[0]) + (this.smo.inputs[i][1] - ys[0]) * (ys[1] - ys[0]);
                u = u / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1]));
                var xi = xs[0] + u * (xs[1] - xs[0]);
                var yi = ys[0] + u * (ys[1] - ys[0]);
                this.ctx.moveTo(this.smo.inputs[i][0] * this.ss + this.width / 2, this.smo.inputs[i][1] * this.ss + this.height / 2);
                this.ctx.lineTo(xi * this.ss + this.width / 2, yi * this.ss + this.height / 2);
            }

            this.ctx.stroke();
        }

    }

    public drawStatus():void
    {
        var numsupp = 0;
        for (var i = 0; i < this.smo.inputs.length; i++)
        {
            if (this.smo.alphaA[i] > 1e-5)
            {
                numsupp++;
            }
        }

        this.ctx.fillText("Number of support vectors: " + numsupp + " / " + this.smo.inputs.length, 10, this.height - 50);

        if (this.svm.getKernel() instanceof GaussianKernel)
        {
            this.ctx.fillText("Using Rbf kernel with sigma = " + this.svm.getKernel().sigma().toPrecision(2), 10, this.height - 70);
        }
        else
        {
            this.ctx.fillText("Using " + this.svm.getKernel().constructor.name, 10, this.height - 70);
        }

        this.ctx.fillText("C = " + this.smo.getComplexity().toPrecision(2), 10, this.height - 90);
    }


}