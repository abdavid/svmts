/**
 * Created by davidatborresen on 09.09.13.
 */


///<reference path='Engine.ts' />
///<reference path='../base/Generic.ts' />
///<reference path='../interfaces/Interfaces.ts' />
///<reference path='../../definitions/underscore.d.ts' />

///<reference path='../SupportVectorMachine.ts' />
///<reference path='../learning/SequentialMinimalOptimization.ts' />


module SVM.Renderer {

    export function Canvas(teacher:ISupportVectorMachineLearning)
    {
        return new SVM.Renderer.canvas(teacher);
    }


    export class canvas implements IRenderer<Engine> {

        teacher:ISupportVectorMachineLearning;
        canvas:HTMLCanvasElement;
        context:CanvasRenderingContext2D;

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
         * @returns {SVM.Renderer.canvas}
         */
        public render():canvas
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
         * Paints the decision background
         * @param matrix
         * @param color
         * @returns {SVM.Renderer.canvas}
         */
        public drawBackground(matrix:number[][], color:string):canvas
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
         * Draw the axis
         * @returns {SVM.Renderer.canvas}
         */
        public drawAxis():canvas
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
         * @returns {SVM.Renderer.canvas}
         */
        public drawDataPoints():canvas
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
         * @returns {SVM.Renderer.canvas}
         */
        public drawMargin():canvas
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
         * @returns {SVM.Renderer.canvas}
         */
        public drawStatus():canvas
        {
            this.context.fillStyle = 'rgb(0,0,0)';

            var numsupp = 0;
            for(var i = 0; i < this.teacher.inputs.length; i++)
            {
                if(this.teacher.alphaA[i] > 1e-5 || this.teacher.alphaB[i] > 1e-5)
                {
                    numsupp++;
                }
            }

            this.context.fillText("Number of support vectors: " + numsupp + " / " + this.teacher.inputs.length, 10, SVM.getHeight() - 50);

            if(this.teacher.kernel instanceof SVM.Kernels.GaussianKernel)
            {
                this.context.fillText("Using Rbf kernel with _sigma = " + this.teacher.kernel.sigma().toPrecision(2), 10, SVM.getHeight() - 70);
            }
            else
            {
                this.context.fillText("Using " + this.teacher.kernel.constructor.name, 10, SVM.getHeight() - 70);
            }

            this.context.fillText("C = " + this.teacher.getComplexity().toPrecision(2), 10, SVM.getHeight() - 90);

            return this;
        }

        /**
         * @param x
         * @param y
         * @param w
         * @param h
         * @param radius
         * @returns {SVM.Renderer.canvas}
         */
        public drawBubble(x:number, y:number, w:number, h:number, radius:number):canvas
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
         * @param x
         * @param y
         * @param w
         * @param h
         * @returns {SVM.Renderer.canvas}
         */
        public drawRect(x:number, y:number, w:number, h:number, stroke:boolean = false):canvas
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
         * @param x
         * @param y
         * @param r
         * @returns {SVM.Renderer.canvas}
         */
        public drawCircle(x:number, y:number, r:number):canvas
        {
            this.context.beginPath();
            this.context.arc(x, y, r, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.stroke();
            this.context.fill();

            return this;
        }

        /**
         * @returns {SVM.Renderer.canvas}
         */
        public clearCanvas():canvas
        {
            this.context.clearRect(
                0,
                0,
                SVM.getWidth(),
                SVM.getHeight()
            );

            return this;
        }
    }

    export class CanvasLoader {

        ctx:CanvasRenderingContext2D;
        circle:Object;
        particles:number[];
        particleMax:number;
        gradient1:any;
        gradient2:any;
        gradient3:any;
        gradient4:any;

        constructor(ctx:CanvasRenderingContext2D)
        {
            this.ctx = ctx;

            this.circle = {
                x: (ctx.canvas.width / 2) + 5,
                y: (ctx.canvas.height / 2) + 22,
                radius: 90,
                speed: 2,
                rotation: 0,
                angleStart: 270,
                angleEnd: 90,
                hue: 220,
                thickness: 18,
                blur: 25
            };

            this.particles = [];
            this.particleMax = 100;

            /* Append Canvas */
            //document.body.appendChild(c);

            /* Set Constant Properties */
            this.ctx.shadowBlur = this.circle.blur;
            this.ctx.shadowColor = 'hsla(' + this.circle.hue + ', 80%, 60%, 1)';
            this.ctx.lineCap = 'round';

            this.gradient1 = this.ctx.createLinearGradient(0, -this.circle.radius, 0, this.circle.radius);
            this.gradient1.addColorStop(0, 'hsla(' + this.circle.hue + ', 60%, 50%, .25)');
            this.gradient1.addColorStop(1, 'hsla(' + this.circle.hue + ', 60%, 50%, 0)');

            this.gradient2 = this.ctx.createLinearGradient(0, -this.circle.radius, 0, this.circle.radius);
            this.gradient2.addColorStop(0, 'hsla(' + this.circle.hue + ', 100%, 50%, 0)');
            this.gradient2.addColorStop(.1, 'hsla(' + this.circle.hue + ', 100%, 100%, .7)');
            this.gradient2.addColorStop(1, 'hsla(' + this.circle.hue + ', 100%, 50%, 0)');

            /* Loop It, Loop It Good */
            this.loop();
        }

        private rand(a, b)
        {
            return ~~((Math.random() * (b - a + 1)) + a);
        }

        private dToR(degrees)
        {
            return degrees * (Math.PI / 180);
        }

        public updateCircle()
        {
            if(this.circle.rotation < 360)
            {
                this.circle.rotation += this.circle.speed;
            }
            else
            {
                this.circle.rotation = 0;
            }
        }

        public renderCircle()
        {
            this.ctx.save();
            this.ctx.translate(this.circle.x, this.circle.y);
            this.ctx.rotate(this.dToR(this.circle.rotation));
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.circle.radius, this.dToR(this.circle.angleStart), this.dToR(this.circle.angleEnd), true);
            this.ctx.lineWidth = this.circle.thickness;
            this.ctx.strokeStyle = this.gradient1;
            this.ctx.stroke();
            this.ctx.restore();
        }

        public renderCircleBorder()
        {
            this.ctx.save();
            this.ctx.translate(this.circle.x, this.circle.y);
            this.ctx.rotate(this.dToR(this.circle.rotation));
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.circle.radius + (this.circle.thickness / 2), this.dToR(this.circle.angleStart), this.dToR(this.circle.angleEnd), true);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.gradient2;
            this.ctx.stroke();
            this.ctx.restore();
        }

        public renderCircleFlare()
        {
            this.ctx.save();
            this.ctx.translate(this.circle.x, this.circle.y);
            this.ctx.rotate(this.dToR(this.circle.rotation + 185));
            this.ctx.scale(1, 1);
            this.ctx.beginPath();
            this.ctx.arc(0, this.circle.radius, 30, 0, Math.PI * 2, false);
            this.ctx.closePath();
            this.gradient3 = this.ctx.createRadialGradient(0, this.circle.radius, 0, 0, this.circle.radius, 30);
            this.gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
            this.gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
            this.ctx.fillStyle = this.gradient3;
            this.ctx.fill();
            this.ctx.restore();
        }

        public renderCircleFlare2()
        {
            this.ctx.save();
            this.ctx.translate(this.circle.x, this.circle.y);
            this.ctx.rotate(this.dToR(this.circle.rotation + 165));
            this.ctx.scale(1.5, 1);
            this.ctx.beginPath();
            this.ctx.arc(0, this.circle.radius, 25, 0, Math.PI * 2, false);
            this.ctx.closePath();
            this.gradient4 = this.ctx.createRadialGradient(0, this.circle.radius, 0, 0, this.circle.radius, 25);
            this.gradient4.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
            this.gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
            this.ctx.fillStyle = this.gradient4;
            this.ctx.fill();
            this.ctx.restore();
        }

        public createParticles()
        {
            if(this.particles.length < this.particleMax)
            {
                this.particles.push({
                    x: (this.circle.x + this.circle.radius * Math.cos(this.dToR(this.circle.rotation - 85))) + (this.rand(0, this.circle.thickness * 2) - this.circle.thickness),
                    y: (this.circle.y + this.circle.radius * Math.sin(this.dToR(this.circle.rotation - 85))) + (this.rand(0, this.circle.thickness * 2) - this.circle.thickness),
                    vx: (this.rand(0, 100) - 50) / 1000,
                    vy: (this.rand(0, 100) - 50) / 1000,
                    radius: this.rand(1, 6) / 2,
                    alpha: this.rand(10, 20) / 100
                });
            }
        }

        public updateParticles()
        {
            var i = this.particles.length;
            while(i--)
            {
                var p = this.particles[i];
                p.vx += (this.rand(0, 100) - 50) / 750;
                p.vy += (this.rand(0, 100) - 50) / 750;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= .01;

                if(p.alpha < .02)
                {
                    this.particles.splice(i, 1)
                }
            }
        }

        public renderParticles()
        {
            var i = this.particles.length;
            while(i--)
            {
                var p = this.particles[i];
                this.ctx.beginPath();
                this.ctx.fillRect(p.x, p.y, p.radius, p.radius);
                this.ctx.closePath();
                this.ctx.fillStyle = 'hsla(0, 0%, 100%, ' + p.alpha + ')';
            }
        }

        public clear()
        {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.fillStyle = 'rgba(0, 0, 0, .1)';
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.globalCompositeOperation = 'lighter';
        }

        public loop()
        {
            this.clear();
            this.updateCircle();
            this.renderCircle();
            this.renderCircleBorder();
            this.renderCircleFlare();
            this.renderCircleFlare2();
            this.createParticles();
            this.updateParticles();
            this.renderParticles();

            window.requestAnimationFrame(()=>this.loop());
        }
    }
}
