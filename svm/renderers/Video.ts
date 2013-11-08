/**
 * Created by davidatborresen on 09.09.13.
 */
///<reference path='../interfaces/IVideoRenderer.ts' />
///<reference path='../interfaces/ISupportVectorMachineLearning.ts' />

///<reference path='../base/Generic.ts' />
///<reference path='../../definitions/underscore.d.ts' />

///<reference path='../SupportVectorMachine.ts' />
///<reference path='../learning/SequentialMinimalOptimization.ts' />

module SVM.Renderer {

    export class Video implements IVideoRenderer {

        teacher:ISupportVectorMachineLearning;
        video:HTMLVideoElement;
        context:CanvasRenderingContext2D;

        /**
         * @param teacher
         */
        constructor(teacher:ISupportVectorMachineLearning)
        {
            this.video = document.createElement('video');
            this.video.height = SVM.getHeight();
            this.video.width = SVM.getWidth();

            document.body.appendChild(this.video);

            this.context = this.video.getContext('2d');

            this.teacher = teacher;
        }

        /**
         * @interface IRenderer
         * @returns {SVM.Renderer.Video}
         * Renders the result to a canvas
         */
        public render():Video
        {
            //this.clearVideo();

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
         * @returns {SVM.Renderer.Video}
         */
        public drawDataPoints():Video
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
         * @returns {SVM.Renderer.Video}
         */
        public drawStatus():Video
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
         * @returns {SVM.Renderer.Video}
         */
        public drawBubble(x:number, y:number, w:number, h:number, radius:number):Video
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
         * @returns {SVM.Renderer.Video}
         */
        public drawRect(x:number, y:number, w:number, h:number, stroke:boolean = false):Video
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
         * @returns {SVM.Renderer.Video}
         */
        public drawCircle(x:number, y:number, r:number):Video
        {
            this.context.beginPath();
            this.context.arc(x, y, r, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.stroke();
            this.context.fill();

            return this;
        }

        /**
         * @interface IVideoRenderer
         * @returns {Blob}
         */
        public snapShot():Blob
        {
            return new Blob();
        }

        public trace():void
        {

        }
    }
}
