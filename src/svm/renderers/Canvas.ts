/**
 * Created by davidatborresen on 09.09.13.
 */
///<reference path='../interfaces/ICanvasRenderer.ts' />
///<reference path='../interfaces/ISupportVectorMachineLearning.ts' />


///<reference path='../base/Generic.ts' />
///<reference path='.././underscore.d.ts' />

///<reference path='../SupportVectorMachine.ts' />
///<reference path='../learning/SequentialMinimalOptimization.ts' />


module SVM.Renderer {

    export class Canvas implements ICanvasRenderer {

        teacher:ISupportVectorMachineLearning;
        canvas:HTMLCanvasElement;
        context:CanvasRenderingContext2D;

        /**
         * @param teacher
         */
        constructor(teacher:ISupportVectorMachineLearning)
        {
            this.canvas = document.createElement('canvas');
            this.canvas.height = SVM.getHeight();
            this.canvas.width = SVM.getWidth();

            document.body.appendChild(this.canvas);

            this.context = this.canvas.getContext('2d');

            this.teacher = teacher;

            //new CanvasLoader(this.context);
        }

        /**
         * @interface ICanvasRenderer
         * @param matrix
         * @param color
         * @returns {SVM.Renderer.Canvas}
         *
         * Paints the decision background
         */
        public drawBackground(matrix:number[][], color:string):Canvas
        {
            matrix.forEach((V:number[], i)=>
            {
                this.context.fillStyle = color;

                this.drawRect(
                    V[0] * SVM.getScale() + (SVM.getWidth() / 2),
                    V[1] * SVM.getScale() + (SVM.getHeight() / 2),
                    2 + SVM.getDensity(),
                    2 + SVM.getDensity()
                );
            });

            return this;
        }

        /**
         * @interface ICanvasRenderer
         * @returns {SVM.Renderer.Canvas}
         * Draw the axis
         */
        public drawAxis():Canvas
        {
            this.context.beginPath();
            this.context.strokeStyle = 'rgb(50,50,50)';
            this.context.lineWidth = 1;
            this.context.moveTo(0, SVM.getHeight() / 2);
            this.context.lineTo(SVM.getWidth(), SVM.getHeight() / 2);
            this.context.moveTo(SVM.getWidth() / 2, 0);
            this.context.lineTo(SVM.getWidth() / 2, SVM.getHeight());
            this.context.stroke();

            return this;
        }

        /**
         * @interface ICanvasRenderer
         * @returns {SVM.Renderer.Canvas}
         */
        public drawMargin():Canvas
        {
            var xs = [-5, 5], ys = [0, 0];

            ys[0] = (-this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
            ys[1] = (-this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);

            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.lineWidth = 1;
            this.context.beginPath();

            // wx+b=0 line
            this.context.moveTo(xs[0], ys[0]);
            this.context.lineTo(xs[1], ys[1]);

            // wx+b=1 line
            this.context.moveTo(xs[0], (ys[0] - 1.0 / this.teacher.machine.getWeight(1)));
            this.context.lineTo(xs[1], (ys[1] - 1.0 / this.teacher.machine.getWeight(1)));

            // wx+b=-1 line
            this.context.moveTo(xs[0], (ys[0] + 1.0 / this.teacher.machine.getWeight(1)));
            this.context.lineTo(xs[1], (ys[1] + 1.0 / this.teacher.machine.getWeight(1)));
            this.context.stroke();

            // draw margin lines for support vectors. The sum of the lengths of these
            // lines, scaled by C is essentially the total hinge loss.
            for(var i = 0; i < this.teacher.inputs.length; i++)
            {
                if(this.teacher.alphaA[i] < 1e-2 || this.teacher.alphaB[i] < 1e-2)
                {
                    continue;
                }

                if(this.teacher.outputs[i] == 1)
                {
                    ys[0] = (1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                    ys[1] = (1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);
                }
                else
                {
                    ys[0] = (-1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                    ys[1] = (-1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);
                }

                var u = (this.teacher.inputs[i][0] - xs[0]) * (xs[1] - xs[0]) + (this.teacher.inputs[i][1] - ys[0]) * (ys[1] - ys[0]) / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1])),
                    xi = xs[0] + u * (xs[1] - xs[0]),
                    yi = ys[0] + u * (ys[1] - ys[0]),
                    mX = this.teacher.inputs[i][0],
                    mY = this.teacher.inputs[i][1];

                this.context.moveTo(mX, mY);
                this.context.lineTo(xi, yi);
            }

            this.context.stroke();

            return this;
        }

        /**
         * @interface ICanvasRenderer
         * @returns {SVM.Renderer.Canvas}
         */
        public clearCanvas():Canvas
        {
            this.context.clearRect(
                0,
                0,
                SVM.getWidth(),
                SVM.getHeight()
            );

            return this;
        }

        /**
         * Renders the result to a canvas
         * @interface IRenderer
         * @returns {SVM.Renderer.Canvas}
         */
        public render():Canvas
        {
            this.clearCanvas();

            var resultsA = [], resultsB = [];
            for(var x = 0.0; x <= SVM.getWidth(); x += SVM.getDensity())
            {
                for(var y = 0.0; y <= SVM.getHeight(); y += SVM.getDensity())
                {
                    var vector = [
                            (x - SVM.getWidth() / 2) / SVM.getScale(),
                            (y - SVM.getHeight() / 2) / SVM.getScale()
                        ],
                        decision = this.teacher.machine.compute(vector);

                    if(decision > 0)
                    {
                        resultsA.push(vector);
                    }
                    else
                    {
                        resultsB.push(vector);
                    }

                }
            }

            this
                .drawBackground(resultsA, 'rgb(150,250,150)')
                .drawBackground(resultsB, 'rgb(250,150,150)')
                .drawDataPoints()
                .drawAxis()
                .drawStatus();

            return this;
        }

        /**
         * @interface IRenderer
         * @returns {SVM.Renderer.Canvas}
         */
        public drawDataPoints():Canvas
        {
            this.context.strokeStyle = 'rgb(0,0,0)';

            for(var i = 0; i < this.teacher.inputs.length; i++)
            {
                if(this.teacher.outputs[i] == 1)
                {
                    this.context.fillStyle = 'rgb(100,200,100)';
                }
                else
                {
                    this.context.fillStyle = 'rgb(200,100,100)';
                }

                // distinguish support vectors
                if(this.teacher.alphaA[i] > 1e-2 || this.teacher.alphaB[i] > 1e-2)
                {
                    this.context.lineWidth = 3;
                }
                else
                {
                    this.context.lineWidth = 1;
                }

                var posX = this.teacher.inputs[i][0] * SVM.getScale() + (SVM.getWidth() / 2),
                    posY = this.teacher.inputs[i][1] * SVM.getScale() + (SVM.getHeight() / 2) ,
                //-- todo adjust usage of _alpha values here
                    radius = Math.floor(3 + (this.teacher.alphaA[i] + this.teacher.alphaB[i]) * 5.0 / this.teacher.getComplexity());

                this.drawCircle(posX, posY, radius);
            }

            return this;
        }

        /**
         * @interface IRenderer
         * @returns {SVM.Renderer.Canvas}
         */
        public drawStatus():Canvas
        {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.font = '12pt open sans';

            var numsupp = 0;
            for(var i = 0; i < this.teacher.inputs.length; i++)
            {
                if(this.teacher.alphaA[i] > 1e-5 || this.teacher.alphaB[i] > 1e-5)
                {
                    numsupp++;
                }
            }
            this.context.fillText("Using " + this.teacher.kernel.constructor.name, 10, SVM.getHeight() - 80);

            var propertiesString = '';
            this.teacher.kernel.getProperties().forEach((propertyName)=>
            {
                if(propertiesString.length > 0)
                {
                    propertiesString += ', ';
                }

                var property = this.teacher.kernel.getProperty(propertyName);
                propertiesString += propertyName + ' = ' + property.value.toPrecision(2);
            });

            this.context.fillText('Kernel properties: ' + propertiesString,10, SVM.getHeight() - 60);

            this.context.fillText('Support Vectors: ' + numsupp + " / " + this.teacher.inputs.length, 10, SVM.getHeight() - 40);

            this.context.fillText('Complexity: ' + this.teacher.getComplexity().toPrecision(2), 10, SVM.getHeight() - 20);

            return this;
        }

        /**
         * @interface IRenderer
         * @param x
         * @param y
         * @param w
         * @param h
         * @param radius
         * @returns {SVM.Renderer.Canvas}
         */
        public drawBubble(x:number, y:number, w:number, h:number, radius:number):Canvas
        {
            var r = x + w,
                b = y + h;

            this.context.beginPath();
            this.context.strokeStyle = "black";
            this.context.lineWidth = 2;
            this.context.moveTo(x + radius, y);
            this.context.lineTo(x + radius / 2, y - 10);
            this.context.lineTo(x + radius * 2, y);
            this.context.lineTo(r - radius, y);
            this.context.quadraticCurveTo(r, y, r, y + radius);
            this.context.lineTo(r, y + h - radius);
            this.context.quadraticCurveTo(r, b, r - radius, b);
            this.context.lineTo(x + radius, b);
            this.context.quadraticCurveTo(x, b, x, b - radius);
            this.context.lineTo(x, y + radius);
            this.context.quadraticCurveTo(x, y, x + radius, y);
            this.context.stroke();

            return this;
        }

        /**
         * @interface IRenderer
         * @param x
         * @param y
         * @param w
         * @param h
         * @returns {SVM.Renderer.Canvas}
         */
        public drawRect(x:number, y:number, w:number, h:number, stroke:boolean = false):Canvas
        {
            this.context.beginPath();
            this.context.rect(x, y, w, h);
            this.context.closePath();
            this.context.fill();

            if(stroke)
            {
                this.context.stroke();
            }

            return this;
        }

        /**
         * @interface IRenderer
         * @param x
         * @param y
         * @param r
         * @returns {SVM.Renderer.Canvas}
         */
        public drawCircle(x:number, y:number, r:number):Canvas
        {
            this.context.beginPath();
            this.context.arc(x, y, r, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.stroke();
            this.context.fill();

            return this;
        }
    }
}
