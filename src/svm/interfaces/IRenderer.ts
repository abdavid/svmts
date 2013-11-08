/**
 * Created by davidatborresen on 12.10.13.
 */

///<reference path='./ISupportVectorMachineLearning.ts' />

interface IRenderer
{
    teacher:ISupportVectorMachineLearning;

    render():IRenderer;
    drawStatus():IRenderer;
    drawCircle(x:number, y:number, r:number):IRenderer
    drawRect(x:number, y:number, w:number, h:number):IRenderer
    drawBubble(x:number, y:number, w:number, h:number, radius:number):IRenderer
    drawDataPoints():IRenderer;
}